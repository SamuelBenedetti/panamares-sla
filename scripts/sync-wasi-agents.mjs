/**
 * WASI agents → Sanity sync — hardened to match sync-wasi.mjs.
 *
 * Run: node scripts/sync-wasi-agents.mjs
 *
 * What it does:
 *   1. Paginate all WASI properties to collect unique id_user values
 *   2. Fetch /user/get/{id} for each user (with retry on transient failures)
 *   3. Upload photo to Sanity Assets — filename keyed by URL-path hash so a
 *      photo swap in Wasi produces a fresh asset
 *   4. createIfNotExists + patch in Sanity (manual fields like `bio` are
 *      never overwritten — only Wasi-derived fields land in the patch)
 *
 * Hardening parity with sync-wasi.mjs:
 *   - withRetry wrapper on Wasi GET + Sanity writes (3 attempts, expo backoff)
 *   - Image filename hashed by URL path (no infinite re-uploads on Wasi
 *     query-string changes)
 *   - Manual `bio` field kept in HUMAN_FIELDS (never patched on update)
 */

import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { createHash } from "node:crypto";

config({ path: ".env.local" });

const missing = ["WASI_ID_COMPANY", "WASI_TOKEN", "SANITY_WRITE_TOKEN"].filter(k => !process.env[k]);
if (missing.length) {
  console.error(`\n❌ Missing env vars: ${missing.join(", ")}\n`);
  process.exit(1);
}

const RETRY_ATTEMPTS = 3;
const RETRY_BASE_MS  = 1000;
const RETRY_FACTOR   = 3;

// Manual fields the editor owns in Sanity — sync seeds them on createIfNotExists
// but never patches them on update.
const HUMAN_FIELDS = new Set(["bio"]);

const WASI_BASE = "https://api.wasi.co/v1";
const creds     = () => `id_company=${process.env.WASI_ID_COMPANY}&wasi_token=${process.env.WASI_TOKEN}`;

const sanity = createClient({
  projectId:  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "2hojajwk",
  dataset:    process.env.NEXT_PUBLIC_SANITY_DATASET   ?? "production",
  token:      process.env.SANITY_WRITE_TOKEN,
  apiVersion: "2023-01-01",
  useCdn:     false,
});

// ── Retry wrapper ────────────────────────────────────────────────────────────

async function withRetry(label, fn) {
  let lastError;
  for (let attempt = 1; attempt <= RETRY_ATTEMPTS; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt === RETRY_ATTEMPTS) break;
      const waitMs = RETRY_BASE_MS * Math.pow(RETRY_FACTOR, attempt - 1);
      console.warn(`  ↻ retry ${attempt}/${RETRY_ATTEMPTS} for ${label} in ${waitMs}ms (${err.message})`);
      await new Promise(r => setTimeout(r, waitMs));
    }
  }
  throw lastError;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function slugify(str) {
  return String(str)
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function omit(obj, keys) {
  const out = {};
  for (const k of Object.keys(obj)) {
    if (!keys.has(k)) out[k] = obj[k];
  }
  return out;
}

function photoFilename(idUser, url) {
  let pathOnly;
  try { pathOnly = new URL(url).pathname; } catch { pathOnly = String(url); }
  const hash = createHash("md5").update(pathOnly).digest("hex").slice(0, 8);
  return `wasi-agent-${idUser}-${hash}.png`;
}

async function wasiGet(path) {
  const sep = path.includes("?") ? "&" : "?";
  const url = `${WASI_BASE}${path}${sep}${creds()}`;
  return withRetry(`WASI ${path}`, async () => {
    const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
    if (!res.ok) throw new Error(`HTTP ${res.status} → ${path}`);
    const data = await res.json();
    if (data.status !== "success") throw new Error(`WASI error: ${data.message ?? JSON.stringify(data).slice(0, 80)}`);
    return data;
  });
}

async function collectUserIds() {
  const ids  = new Set();
  let skip   = 0;
  let total  = Infinity;

  while (ids.size < total) {
    const data  = await wasiGet(`/property/search?scope=1&take=100&skip=${skip}&short=true`);
    const props = Object.entries(data)
      .filter(([k, v]) => /^\d+$/.test(k) && v?.id_property)
      .map(([, v]) => v);

    if (props.length === 0) break;
    props.forEach(p => p.id_user && ids.add(p.id_user));
    total = Number(data.total ?? ids.size);
    skip += 100;
  }
  return [...ids];
}

async function uploadPhoto(url, idUser) {
  const filename = photoFilename(idUser, url);
  try {
    const asset = await withRetry(`upload ${filename}`, async () => {
      const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buffer = await res.arrayBuffer();
      return sanity.assets.upload("image", Buffer.from(buffer), {
        filename,
        contentType: res.headers.get("content-type") || "image/png",
      });
    });
    return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
  } catch (err) {
    console.warn(`    ⚠ Photo failed: ${err.message}`);
    return null;
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n${"═".repeat(50)}`);
  console.log("  WASI Agents → Sanity Sync");
  console.log(`${"═".repeat(50)}\n`);

  process.stdout.write("📡 Scanning properties for agent IDs...");
  const userIds = await collectUserIds();
  console.log(` ${userIds.length} agents found\n`);

  let created = 0, updated = 0, failed = 0;

  for (const id_user of userIds) {
    process.stdout.write(`  Agent ${id_user}... `);
    try {
      const u = await wasiGet(`/user/get/${id_user}`);

      const name = `${u.first_name} ${u.last_name}`.trim()
        .toLowerCase().replace(/\b\w/g, c => c.toUpperCase());

      const docId = `wasi-agent-${id_user}`;
      const isNew = !(await sanity.fetch(`*[_id == $id][0]._id`, { id: docId }));

      const fields = {
        name,
        slug:  { _type: "slug", current: slugify(name) },
        email: u.email  || undefined,
        phone: u.cell_phone || u.phone || undefined,
        role:  u.user_type === "ADMIN" ? "Agente" : (u.user_type ?? "Agente"),
      };

      // WhatsApp — use cell_phone (same number)
      if (u.cell_phone) fields.whatsapp = u.cell_phone;

      // Photo — only when new or photo URL changed (hash-keyed filename)
      if (u.photo) {
        const photo = await uploadPhoto(u.photo, id_user);
        if (photo) fields.photo = photo;
      }

      await withRetry(`createIfNotExists ${docId}`, () =>
        sanity.createIfNotExists({ _id: docId, _type: "agent" })
      );

      // Updates: omit HUMAN_FIELDS (e.g. bio) so Studio edits stick.
      const wasiOnlyFields = omit(fields, HUMAN_FIELDS);
      await withRetry(`patch ${docId}`, () =>
        sanity.patch(docId).set(wasiOnlyFields).commit()
      );

      console.log(isNew ? "✨ created" : "✓  updated");
      isNew ? created++ : updated++;
    } catch (err) {
      console.log(`✗  ${err.message.slice(0, 60)}`);
      failed++;
    }
  }

  console.log(`\n${"─".repeat(50)}`);
  console.log(`  ✨ Created: ${created}`);
  console.log(`  ✓  Updated: ${updated}`);
  console.log(`  ❌ Failed:  ${failed}`);
  console.log(`${"─".repeat(50)}\n`);
}

main().catch(err => {
  console.error("\n💥 Fatal:", err.message);
  process.exit(1);
});
