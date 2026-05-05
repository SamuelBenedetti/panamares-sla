/**
 * Audit unique legacy feature strings used across all `property` docs.
 *
 * Run: node scripts/audit-property-features.mjs
 *
 * Reads `featuresInterior`, `featuresBuilding`, `featuresLocation` from every
 * published property in Sanity and aggregates the unique Spanish strings per
 * category along with their frequency. Output is written to:
 *
 *   tasks/feature-audit-output.json
 *
 * The output drives the `FEATURE_TRANSLATIONS_ES_TO_EN` map in
 * `src/lib/feature-translations.ts`. Re-run any time properties are added or
 * Wasi pushes a new feature label so the translation map can be extended
 * without guesswork.
 */

import { createClient } from "@sanity/client";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");

function loadEnv() {
  const envPath = join(REPO_ROOT, ".env.local");
  if (!existsSync(envPath)) {
    console.error(`\nMissing ${envPath}\n`);
    process.exit(1);
  }
  const text = readFileSync(envPath, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"]*)"?\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}
loadEnv();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
if (!projectId) {
  console.error("\nMissing NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local\n");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: true,
});

const QUERY = `*[_type == "property" && !(_id in path("drafts.**"))]{
  _id,
  featuresInterior,
  featuresBuilding,
  featuresLocation
}`;

function aggregate(docs, field) {
  const counts = new Map();
  for (const d of docs) {
    const arr = Array.isArray(d[field]) ? d[field] : [];
    for (const raw of arr) {
      if (typeof raw !== "string") continue;
      const v = raw.trim();
      if (!v) continue;
      counts.set(v, (counts.get(v) ?? 0) + 1);
    }
  }
  // Sort by frequency desc, then alphabetically.
  const sorted = [...counts.entries()].sort(
    (a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "es"),
  );
  return {
    count: sorted.length,
    totalUsages: sorted.reduce((s, [, n]) => s + n, 0),
    unique: sorted.map(([s]) => s),
    frequency: Object.fromEntries(sorted),
  };
}

(async () => {
  console.log(`Querying Sanity (project=${projectId}, dataset=${dataset})…`);
  const docs = await client.fetch(QUERY);
  console.log(`  ${docs.length} property docs fetched.`);

  const output = {
    generatedAt: new Date().toISOString(),
    propertyCount: docs.length,
    interior: aggregate(docs, "featuresInterior"),
    building: aggregate(docs, "featuresBuilding"),
    location: aggregate(docs, "featuresLocation"),
  };

  const tasksDir = join(REPO_ROOT, "tasks");
  if (!existsSync(tasksDir)) mkdirSync(tasksDir, { recursive: true });
  const outPath = join(tasksDir, "feature-audit-output.json");
  writeFileSync(outPath, JSON.stringify(output, null, 2) + "\n", "utf8");

  console.log(
    `\n  interior: ${output.interior.count} unique (${output.interior.totalUsages} usages)`,
  );
  console.log(
    `  building: ${output.building.count} unique (${output.building.totalUsages} usages)`,
  );
  console.log(
    `  location: ${output.location.count} unique (${output.location.totalUsages} usages)`,
  );
  console.log(`\nWrote ${outPath}`);
})().catch((err) => {
  console.error("\nAudit failed:");
  console.error(err);
  process.exit(1);
});
