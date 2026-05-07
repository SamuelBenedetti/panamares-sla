/**
 * WASI API → Sanity sync script — bulletproof edition.
 *
 * Run:               node scripts/sync-wasi.mjs
 * Dry run:           node scripts/sync-wasi.mjs --dry-run
 * Limit:             node scripts/sync-wasi.mjs --limit=10
 * Single prop:       node scripts/sync-wasi.mjs --id=9836183
 * Bypass safety:     node scripts/sync-wasi.mjs --force   (also bypass thresholds)
 *
 * Required env vars (.env.local):
 *   WASI_ID_COMPANY     numeric ID from wasi.co → Configuración → Ajustes generales → Wasi API
 *   WASI_TOKEN          token from same screen
 *   SANITY_WRITE_TOKEN  already in .env.local
 *
 * ── Safety guarantees ────────────────────────────────────────────────────────
 *   • WASI is READ-ONLY here. This script only calls GET endpoints.
 *   • HUMAN_FIELDS (title/description/slug + i18n + flags) are written only on
 *     createIfNotExists. Subsequent syncs never touch them — Carlos and Igor's
 *     edits in Studio are permanent. Empty-string reset is honored.
 *   • Catalog-size guard: if Wasi returns <90% of last successful run's count,
 *     the entire sync aborts with no writes.
 *   • Deactivation threshold: aborts if deactivations would exceed
 *     max(10, 5% of catalog). --force bypasses (logs loud).
 *   • mapPropertyType hard-fails (returns null → skip + warn) on unknown types
 *     instead of silently defaulting to "apartamento" which would lock in a
 *     wrong slug forever.
 *   • Image asset cache keys by content URL hash, so a photo swap in Wasi
 *     produces a fresh upload (old asset becomes orphan; sweep separately).
 *   • Optional fields are explicitly unset when absent in Wasi — no stale
 *     values linger from previous syncs.
 *   • publishedAt is validated and added to HUMAN_FIELDS (defense in depth).
 *   • Zone resolution chain (PR-K4): zone_label → city_label → title-scan
 *     against Sanity neighborhood catalog. Word-boundary matching with
 *     longest-match-first sort prevents false positives.
 *
 * ── Field ownership matrix ───────────────────────────────────────────────────
 *   Sanity-owned (HUMAN_FIELDS) — seeded once on createIfNotExists, then owned
 *   by Carlos / Igor in Studio. The cron never patches these:
 *     title, description, slug, titleI18n, descriptionI18n,
 *     humanReviewed, recommended, fairPrice, rented, featured,
 *     noindex, publishedAt
 *   Wasi-owned (synced every run):
 *     wasiId, businessType, propertyType, listingStatus, price, zone, province,
 *     all dimensional facts (bedrooms/bathrooms/area/etc), agent, mainImage,
 *     gallery, features
 *
 *   Note: `featured` and `rented` are seeded from Wasi (id_status_on_page === 3
 *   and id_availability === 3 respectively) on the first sync, then become
 *   editor-controlled. Homepage curation is human — Wasi is operational.
 */

import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, appendFileSync, existsSync, mkdirSync, unlinkSync } from "node:fs";
import { dirname } from "node:path";

config({ path: ".env.local" });

const DRY_RUN   = process.argv.includes("--dry-run");
const FORCE     = process.argv.includes("--force");
// Support both --id=NNNN and --id NNNN (space-separated) for ergonomics
const SINGLE_ID = (() => {
  const eqForm = process.argv.find(a => a.startsWith("--id="))?.split("=")[1];
  if (eqForm) return eqForm;
  const idx = process.argv.indexOf("--id");
  return idx !== -1 ? process.argv[idx + 1] : undefined;
})();
const LIMIT_ARG = process.argv.find(a => a.startsWith("--limit="))?.split("=")[1];
const LIMIT     = LIMIT_ARG ? parseInt(LIMIT_ARG, 10) : Infinity;
const BATCH     = 5; // parallel detail fetches

// ── Module-level zone catalog (PR-K4) ─────────────────────────────────────────
// Populated once per sync from Sanity neighborhood docs. Used as the fallback
// table for resolveZoneFromTitle() when Wasi returns neither zone_label nor a
// recognizable city_label. See buildWasiFields() for the resolution chain.
let zoneCatalog = [];

// ── Safety constants ─────────────────────────────────────────────────────────
// Fields written only on createIfNotExists; never patched on update. Carlos
// and Igor own these in Sanity Studio. Wasi is the source of truth for
// everything else (see file-header field ownership matrix).
const HUMAN_FIELDS = new Set([
  "title", "description", "slug",
  "titleI18n", "descriptionI18n",
  "humanReviewed", "recommended", "fairPrice", "rented", "featured",
  "noindex", "publishedAt",
]);

// Optional fields whose absence in Wasi must be propagated as an explicit
// `unset` so Sanity does not retain stale values from previous syncs.
const OPTIONAL_WASI_FIELDS = [
  "floor", "yearBuilt", "condition", "corregimiento",
  "bedrooms", "bathrooms", "halfBathrooms", "parking",
  "area", "adminFee", "location",
];

// Deactivation safety threshold: max(10, 5% of catalog). --force bypasses.
const DEACTIVATION_FLOOR_ABS = 10;
const DEACTIVATION_FLOOR_PCT = 0.05;

// Catalog-size assertion: abort the whole sync if the current Wasi catalog
// is smaller than this fraction of the last successful run.
const CATALOG_SHRINK_LIMIT = 0.90;

// Persisted between runs to support catalog-size assertion.
const RUN_STATE_PATH = "logs/wasi-sync-state.json";

// Append-only run log. One JSON line per sync invocation. Cron / monitoring
// reads this to alert on failure spikes; humans read it as an audit trail.
const SYNC_LOG_PATH = "logs/wasi-sync.jsonl";

// Concurrency lock — prevents two syncs (cron + manual) from racing on the
// same Sanity writes. PID + ISO timestamp; stale locks older than this TTL
// are taken over without a manual reset.
const LOCK_PATH = "logs/.wasi-sync.lock";
const LOCK_STALE_AFTER_MS = 30 * 60 * 1000; // 30 minutes

// Retry policy for transient Wasi/Sanity API failures (5xx, timeouts).
// Exponential backoff: baseMs * factor^attempt. Total ≤ ~13 s for 3 attempts.
const RETRY_ATTEMPTS = 3;
const RETRY_BASE_MS  = 1000;
const RETRY_FACTOR   = 3;

// Title-tag length cap. Google truncates titles around 60 chars; longer titles
// hurt CTR and SEO. Warn loudly so the catalog doesn't silently drift past it.
const TITLE_CHAR_LIMIT = 60;

// ── WASI enum constants ──────────────────────────────────────────────────────
// Documents the magic-number contracts Wasi exposes. Hard-fails on values
// outside the known set so a Wasi-side schema change doesn't silently mis-map.

const WASI_AVAILABILITY = {
  ACTIVE: 1, // disponible
  SOLD:   2, // vendida
  RENTED: 3, // alquilada — keep visible with rented badge per business rules
};

const WASI_STATUS_ON_PAGE = {
  NORMAL:      1,
  HIDDEN:      2,
  OUTSTANDING: 3, // featured/destacada — surface on homepage
};

// ── Run state I/O ────────────────────────────────────────────────────────────

function readRunState() {
  try {
    return JSON.parse(readFileSync(RUN_STATE_PATH, "utf8"));
  } catch {
    return null;
  }
}

function writeRunState(state) {
  if (!existsSync(dirname(RUN_STATE_PATH))) {
    mkdirSync(dirname(RUN_STATE_PATH), { recursive: true });
  }
  writeFileSync(RUN_STATE_PATH, JSON.stringify(state, null, 2));
}

// ── Field utilities ──────────────────────────────────────────────────────────

function omit(obj, keys) {
  const out = {};
  for (const k of Object.keys(obj)) {
    if (!keys.has(k)) out[k] = obj[k];
  }
  return out;
}

// Hash the URL path (not the full URL with query string) — Wasi sometimes
// appends auth/version params that change per request without indicating a
// content change, which would otherwise cause infinite re-uploads.
function imageFilename(wasiId, slot, url) {
  let pathOnly;
  try {
    pathOnly = new URL(url).pathname;
  } catch {
    pathOnly = String(url);
  }
  const hash = createHash("md5").update(pathOnly).digest("hex").slice(0, 8);
  return `wasi-${wasiId}-${slot}-${hash}.jpg`;
}

function isValidWasiDate(value) {
  if (!value) return false;
  const ts = Date.parse(value);
  if (isNaN(ts)) return false;
  // Reject impossible dates (>1 day in the future, or before 2000).
  const now = Date.now();
  return ts <= now + 86_400_000 && ts >= Date.parse("2000-01-01");
}

// ── Retry wrapper ────────────────────────────────────────────────────────────
// Exponential backoff on transient API failures (5xx, timeouts, ECONNRESET).
// Re-throws after RETRY_ATTEMPTS so the caller treats it as a real error.

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

// ── Lockfile (concurrent-run prevention) ─────────────────────────────────────
// Cron + manual invocation racing on the same Sanity dataset is the worst
// failure mode (duplicate creates, conflicting patches, asset cache thrash).
// Atomic file lock with a 30-min stale TTL so a crashed run doesn't lock us
// out forever.

function acquireLock() {
  if (!existsSync(dirname(LOCK_PATH))) {
    mkdirSync(dirname(LOCK_PATH), { recursive: true });
  }
  if (existsSync(LOCK_PATH)) {
    try {
      const meta = JSON.parse(readFileSync(LOCK_PATH, "utf8"));
      const ageMs = Date.now() - new Date(meta.ts).getTime();
      if (ageMs < LOCK_STALE_AFTER_MS) {
        throw new Error(`Another sync is running (PID ${meta.pid}, started ${meta.ts}, ${Math.round(ageMs / 1000)}s ago). Refusing to start. Delete ${LOCK_PATH} if you're sure no other process is active.`);
      }
      console.warn(`⚠ Stale lock from PID ${meta.pid} (${Math.round(ageMs / 60000)} min old) — taking over.`);
    } catch (err) {
      // Unparseable lock — also stale.
      if (err.message.startsWith("Another sync")) throw err;
      console.warn(`⚠ Unreadable lock file — taking over.`);
    }
  }
  writeFileSync(LOCK_PATH, JSON.stringify({ pid: process.pid, ts: new Date().toISOString() }));
  // Best-effort cleanup on any normal exit path.
  process.on("exit",  releaseLock);
  process.on("SIGINT",  () => { releaseLock(); process.exit(130); });
  process.on("SIGTERM", () => { releaseLock(); process.exit(143); });
}

function releaseLock() {
  try { unlinkSync(LOCK_PATH); } catch {} // ignore if already removed
}

// ── Sync log (append-only jsonl) ─────────────────────────────────────────────

function appendSyncLog(entry) {
  if (!existsSync(dirname(SYNC_LOG_PATH))) {
    mkdirSync(dirname(SYNC_LOG_PATH), { recursive: true });
  }
  appendFileSync(SYNC_LOG_PATH, JSON.stringify(entry) + "\n");
}

// ── Pre-flight checks ────────────────────────────────────────────────────────
// Fail fast before any write. Catches stale credentials, wrong dataset, or
// expired tokens without leaving the catalog half-synced.

async function preflightChecks() {
  process.stdout.write("🛫 Pre-flight: Wasi credentials...");
  await withRetry("preflight wasiGet", () =>
    wasiGet("/property/search", "scope=1&take=1&short=true")
  );
  console.log(" ✓");

  process.stdout.write("🛫 Pre-flight: Sanity dataset...");
  const datasetName = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
  if (datasetName !== "production" && datasetName !== "staging") {
    throw new Error(`Unexpected Sanity dataset: "${datasetName}". Refusing to write — set NEXT_PUBLIC_SANITY_DATASET explicitly.`);
  }
  console.log(` ✓ (${datasetName})`);

  // Probe write permission with a tiny canary doc + immediate delete.
  if (!DRY_RUN) {
    process.stdout.write("🛫 Pre-flight: Sanity write...");
    const canaryId = `__sync_canary_${Date.now()}`;
    await withRetry("preflight createIfNotExists", () =>
      sanity.createIfNotExists({ _id: canaryId, _type: "property", title: "canary", price: 0, businessType: "venta", propertyType: "apartamento", listingStatus: "retirada", zone: "Panamá" })
    );
    await withRetry("preflight delete", () => sanity.delete(canaryId));
    console.log(" ✓");
  }
}

// ── Validate env ──────────────────────────────────────────────────────────────

const missing = ["WASI_ID_COMPANY", "WASI_TOKEN", "SANITY_WRITE_TOKEN"].filter(k => !process.env[k]);
if (missing.length) {
  console.error(`\n❌ Missing env vars: ${missing.join(", ")}`);
  console.error("   Add them to .env.local and retry.\n");
  process.exit(1);
}

// ── Clients ───────────────────────────────────────────────────────────────────

const WASI_BASE = "https://api.wasi.co/v1";
const wCreds    = () => `id_company=${process.env.WASI_ID_COMPANY}&wasi_token=${process.env.WASI_TOKEN}`;

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "2hojajwk",
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET   ?? "production",
  token:     process.env.SANITY_WRITE_TOKEN,
  apiVersion: "2023-01-01",
  useCdn: false,
});

// ── Agent overrides ───────────────────────────────────────────────────────────
// WASI returns these id_user values but the user records are inaccessible.
// All 4 affected properties are assigned to Carlos Bustamante (173217).
const AGENT_OVERRIDES = {
  234976: 173217,
  218300: 173217,
};

// ── Maps (same as import-wasi.mjs, kept in sync) ─────────────────────────────

const TYPE_SLUG_PLURAL = {
  "apartamento":    "apartamentos",
  "apartaestudio":  "apartaestudios",
  "casa":           "casas",
  "casa de playa":  "casas-de-playa",
  "penthouse":      "penthouses",
  "oficina":        "oficinas",
  "local":          "locales-comerciales",
  "terreno":        "terrenos",
  "lote comercial": "lotes-comerciales",
  "edificio":       "edificios",
  "finca":          "fincas",
};

// Maps WASI id_property_type → Sanity propertyType.
// Full catalog from GET /v1/property-type/all (fetched 2026-04-21).
const WASI_TYPE_ID = {
  1:  "casa",
  2:  "apartamento",
  3:  "local",
  4:  "oficina",
  5:  "terreno",
  6:  "lote comercial",
  7:  "finca",
  8:  "local",          // Bodega
  10: "casa",           // Chalet
  11: "casa",           // Casa de campo
  12: "edificio",       // Hoteles
  13: "finca",          // Finca - Hoteles
  14: "apartaestudio",
  15: "oficina",        // Consultorio
  16: "edificio",
  17: "terreno",        // Lote de Playa
  18: "edificio",       // Hostal
  19: "apartamento",    // Condominio
  20: "casa",           // Dúplex
  21: "penthouse",
  22: "casa",           // Bungalow
  23: "local",          // Galpon Industrial
  24: "casa de playa",
  25: "apartamento",    // Piso
  26: "local",          // Garaje
  27: "finca",          // Cortijo
  28: "casa",           // Cabaña
  29: "terreno",        // Isla
  30: "local",          // Nave Industrial
  31: "finca",          // Campos, Chacras y Quintas
  32: "terreno",        // Terreno ← el que faltaba
  33: "penthouse",      // Ph
};

// Maps WASI type label strings (lowercase) → Sanity propertyType
const WASI_TYPE_LABEL = {
  "apartamento":              "apartamento",
  "apartaestudio":            "apartaestudio",
  "studio":                   "apartaestudio",
  "piso":                     "apartamento",
  "condominio":               "apartamento",
  "casa":                     "casa",
  "duplex":                   "casa",
  "dúplex":                   "casa",
  "chalet":                   "casa",
  "bungalow":                 "casa",
  "cabaña":                   "casa",
  "cabana":                   "casa",
  "casa de campo":            "casa",
  "casa de playa":            "casa de playa",
  "beach house":              "casa de playa",
  "lote de playa":            "terreno",
  "penthouse":                "penthouse",
  "ph":                       "penthouse",
  "oficina":                  "oficina",
  "office":                   "oficina",
  "consultorio":              "oficina",
  "local":                    "local",
  "local comercial":          "local",
  "bodega":                   "local",
  "galpon industrial":        "local",
  "galpón industrial":        "local",
  "nave industrial":          "local",
  "garaje":                   "local",
  "terreno":                  "terreno",
  "lote":                     "terreno",
  "lote / terreno":           "terreno",
  "lote comercial":           "lote comercial",
  "isla":                     "terreno",
  "campos, chacras y quintas":"finca",
  "edificio":                 "edificio",
  "hoteles":                  "edificio",
  "hostal":                   "edificio",
  "finca":                    "finca",
  "finca - hoteles":          "finca",
  "cortijo":                  "finca",
};

const ZONE_MAP = {
  "Punta Pacífica":   "Punta Pacífica",
  "Punta Pacifica":   "Punta Pacífica",
  "Punta Paitilla":   "Punta Paitilla",
  "Avenida Balboa":   "Avenida Balboa",
  "Obarrio":          "Obarrio",
  "Calle 50":         "Calle 50",
  "Coco Del Mar":     "Coco del Mar",
  "Coco del Mar":     "Coco del Mar",
  "Costa Del Este":   "Costa del Este",
  "Costa del Este":   "Costa del Este",
  "Albrook":          "Albrook",
  "Santa María":      "Santa María",
  "Santa Maria":      "Santa María",
  "Marbella":         "Marbella",
  "El Cangrejo":      "El Cangrejo",
  "Altos Del Golf":   "Altos del Golf",
  "Altos del Golf":   "Altos del Golf",
  "San Francisco":    "San Francisco",
  "Via Porras":       "Vía Porras",
  "Vía Porras":       "Vía Porras",
  "Bella Vista":      "Bella Vista",
  "Condado Del Rey":  "Condado del Rey",
  "Condado del Rey":  "Condado del Rey",
  "Amador":           "Amador",
  "Los Andes":        "Los Andes",
  "Carrasquilla":     "Carrasquilla",
  "Loma Alegre":      "Loma Alegre",
  "Alto del Chase":   "Alto del Chase",
  "Alto Del Chase":   "Alto del Chase",
  "Coronado":         "Coronado",
  "Versalles":        "Versalles",
  "Rio Mar":          "Río Mar",
  "Río Mar":          "Río Mar",
  "Panamá Pacifico":  "Panamá Pacífico",
  "Panama Pacifico":  "Panamá Pacífico",
  "Farallón":         "Farallón",
  "Farallon":         "Farallón",
  "Río Hato":         "Farallón",
  "Rio Hato":         "Farallón",
  "David":            "David",
  "Antón":            "Antón",
  "Anton":            "Antón",
  "Arraiján":         "Arraiján",
  "Arraijan":         "Arraiján",
};

const ZONE_TO_SLUG = {
  "Punta Pacífica":  "punta-pacifica",
  "Punta Paitilla":  "punta-paitilla",
  "Avenida Balboa":  "avenida-balboa",
  "Obarrio":         "obarrio",
  "Calle 50":        "calle-50",
  "Costa del Este":  "costa-del-este",
  "Albrook":         "albrook",
  "Coco del Mar":    "coco-del-mar",
  "Santa María":     "santa-maria",
  "Marbella":        "marbella",
  "El Cangrejo":     "el-cangrejo",
  "Altos del Golf":  "altos-del-golf",
  "San Francisco":   "san-francisco",
  "Vía Porras":      "via-porras",
  "Bella Vista":     "bella-vista",
  "Condado del Rey": "condado-del-rey",
  "Amador":          "amador",
  "Los Andes":       "los-andes",
  "Carrasquilla":    "carrasquilla",
  "Loma Alegre":     "loma-alegre",
  "Alto del Chase":  "alto-del-chase",
  "Coronado":        "coronado",
  "Versalles":       "versalles",
  "Río Mar":         "rio-mar",
  "Panamá Pacífico": "panama-pacifico",
  "Farallón":        "farallon",
  "David":           "david",
  "Antón":           "anton",
  "Arraiján":        "arraijan",
};

// ── Field helpers ─────────────────────────────────────────────────────────────

function parseNum(v) {
  if (v === null || v === undefined || v === "") return null;
  const n = parseFloat(String(v).replace(/[$,\s]/g, ""));
  return isNaN(n) ? null : n;
}

function slugify(str) {
  return String(str)
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function mapPropertyType(prop) {
  // Base type from WASI label or numeric ID. Returns null on unknown types
  // so the caller can skip + warn loud rather than silently misclassifying.
  // Misclassification is especially dangerous because slug is HUMAN_FIELDS-
  // protected after creation: a "casa de playa" mis-typed as "apartamento"
  // on first sync would be locked into /apartamentos-en-venta/* forever.
  const labelRaw = prop.property_type_label ?? prop.tipo_inmueble ?? prop.property_type ?? "";
  const label = String(labelRaw).toLowerCase().trim();
  const fromLabel = label ? WASI_TYPE_LABEL[label] : null;
  const fromId    = prop.id_property_type ? WASI_TYPE_ID[prop.id_property_type] : null;
  let base = fromLabel ?? fromId ?? null;

  if (!base) {
    console.warn(`  ⚠ Unknown WASI propertyType — label="${labelRaw}" id_property_type=${prop.id_property_type ?? "?"}`);
    return null;
  }

  const title = String(prop.title ?? "").toLowerCase();
  const obs   = String(prop.observations ?? prop.descripcion ?? "").toLowerCase();
  const beds  = parseNum(prop.bedrooms) ?? 0;

  // ── Auto-corrections ──────────────────────────────────────────────────────

  // Terreno con recámaras → es una casa, WASI lo clasificó mal
  if (base === "terreno" && beds >= 1) {
    base = "casa";
  }

  // Apartamento/casa con 0 recámaras → apartaestudio
  if ((base === "apartamento" || base === "casa") && beds === 0) {
    base = "apartaestudio";
  }

  // Título contiene PH o Penthouse → penthouse
  if (/\bph\b|penthouse/i.test(prop.title ?? "")) {
    base = "penthouse";
  }

  // Casa con "playa" en título o descripción → casa de playa
  if (base === "casa" && /playa|beach/i.test(title + " " + obs)) {
    base = "casa de playa";
  }

  return base;
}

function mapBusinessType(prop) {
  // WASI returns booleans as strings "true"/"false"
  const forRent = prop.for_rent === true || prop.for_rent === "true" || prop.for_rent === 1;
  if (forRent) return "alquiler";
  return "venta";
}

function mapListingStatus(prop) {
  // WASI returns id_availability as a string e.g. "1". See WASI_AVAILABILITY
  // for the canonical mapping. RENTED stays visible (not hidden) with a
  // dedicated badge per business rules.
  const avail = Number(prop.id_availability ?? 0);
  if (avail === WASI_AVAILABILITY.ACTIVE) return "activa";
  if (avail === WASI_AVAILABILITY.SOLD)   return "vendida";
  if (avail === WASI_AVAILABILITY.RENTED) return "activa";
  if (avail === 0) return "activa"; // Wasi omitted the field — assume active
  console.warn(`  ⚠ Unknown id_availability=${avail} for wasi-${prop.id_property} — treating as retirada`);
  return "retirada";
}

function mapRented(prop) {
  return Number(prop.id_availability ?? 0) === WASI_AVAILABILITY.RENTED;
}

function mapCondition(prop) {
  // WASI returns id_property_condition (numeric) + property_condition_label (English string)
  const id  = Number(prop.id_property_condition ?? prop.id_condition ?? 0);
  const raw = String(prop.property_condition_label ?? prop.condition ?? "").toLowerCase();
  if (id === 1 || raw.includes("new")    || raw.includes("nuevo"))   return "nuevo";
  if (id === 3 || raw.includes("plan")   || raw.includes("plano"))   return "en_planos";
  if (id === 4 || raw.includes("construc"))                           return "en_construccion";
  // id=2 "Used" is WASI's default — agents rarely fill it consciously, skip it
  return undefined;
}

function normalizeZone(raw) {
  if (!raw) return undefined;
  const s = String(raw).trim();
  return ZONE_MAP[s] ?? s;
}

// PR-K4: resolve zone by scanning the property title for a known neighborhood
// name. Used as a third fallback when Wasi returns neither zone_label nor a
// recognizable city_label. Word-boundary matching guards against false
// positives ("Costa del Este" must beat "Este"); diacritic-insensitive so
// "Anton" in a sloppy Wasi title still matches "Antón".
//
// Returns the canonical zone name string (e.g. "Antón") that slots directly
// into the property.zone string field, or null if no match.
function resolveZoneFromTitle(title, catalog) {
  if (!title || !Array.isArray(catalog) || catalog.length === 0) return null;
  const stripDiacritics = (s) => String(s).normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
  const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const normalizedTitle = stripDiacritics(title);

  // Sort by name length desc so multi-word zones win over substrings of them
  // (e.g. "Costa del Este" before "Este"). This is the primary anti-collision
  // guard, paired with \b word boundaries.
  const sorted = [...catalog].sort((a, b) =>
    (b.name?.length ?? 0) - (a.name?.length ?? 0)
  );

  for (const entry of sorted) {
    if (!entry?.name) continue;
    const needle = stripDiacritics(entry.name);
    if (!needle) continue;
    const re = new RegExp(`\\b${escapeRegex(needle)}\\b`, "u");
    if (re.test(normalizedTitle)) {
      return entry.name; // canonical, accented form
    }
  }
  return null;
}

function buildSlug(wasiId, propertyType, businessType, zone) {
  const typeSlug = TYPE_SLUG_PLURAL[propertyType] ?? slugify(propertyType || "propiedad");
  const intent   = businessType === "alquiler" ? "alquiler" : "venta";
  const zoneSlug = ZONE_TO_SLUG[zone] ?? slugify(zone || "panama");
  return `${typeSlug}-en-${intent}-${zoneSlug}-${wasiId}`;
}

function extractBuildingFromWasiTitle(raw) {
  if (!raw) return null;
  let s = String(raw).trim()
  .normalize("NFC")      // ← primero componer los caracteres (á, é, í, ó, ú como un solo code point)
  .toLowerCase()         // ← luego lowercase
  .replace(/(^|\s)(\S)/g, (_, space, char) => space + char.toUpperCase());


  const PREFIXES = [
    /^Se Alquila\s+/i, /^Se Vende\s+/i, /^En Venta\s+/i,
    /^En Alquiler\s+/i, /^Alquiler En\s+/i, /^Alquiler\s+/i,
    /^Venta En\s+/i, /^Venta\s+/i,
  ];
  // Two passes: prefix → type → prefix again (handles "Apartamento en Venta en X")
  for (const p of PREFIXES) s = s.replace(p, "");
  s = s.replace(/^(Apartamento|Penthouse|Casa De Playa|Casa|Oficina|Local|Terreno|Studio|Apartaestudio|Edificio|Finca)\s+/i, "");
  for (const p of PREFIXES) s = s.replace(p, "");
  s = s.replace(/^En\s+/i, "");

  // Restore common all-caps acronyms lowered by title-case
  s = s.replace(/\bPh\b/g, "PH").replace(/\bOk\b/g, "OK");

  return s.trim() || null;
}

function buildTitle(prop, propertyType, businessType, zone) {
  const typeLabel = {
    "apartamento":   "Apartamento", "apartaestudio": "Apartaestudio",
    "casa":          "Casa",        "casa de playa": "Casa de Playa",
    "penthouse":     "Penthouse",   "oficina":       "Oficina",
    "local":         "Local",       "terreno":       "Terreno",
    "lote comercial":"Lote Comercial","edificio":    "Edificio",
    "finca":         "Finca",
  }[propertyType] ?? "Propiedad";
  const intent   = businessType === "alquiler" ? "en Alquiler" : "en Venta";
  // Decode Wasi-editor free text before composing the title so we don't bake
  // `&ndash;` / `&nbsp;` / etc into a permanent HUMAN_FIELD on first sync.
  const building = decodeHtmlEntities(
    String(prop.building_name ?? prop.edificio ?? "").trim()
    || extractBuildingFromWasiTitle(prop.title)
    || ""
  );
  let title;
  if (building)    title = `${building} — ${typeLabel} ${intent}`;
  else if (zone)   title = `${typeLabel} ${intent} en ${zone}`;
  else             title = `${typeLabel} ${intent}`;

  // Google truncates titles around 60 chars in SERPs. Long ones don't break
  // anything but they hurt CTR. Surface so editors can pull a shorter custom
  // title in Studio (HUMAN_FIELDS-protected, so the override sticks).
  if (title.length > TITLE_CHAR_LIMIT) {
    console.warn(`  ⚠ wasi-${prop.id_property}: title is ${title.length} chars (cap ${TITLE_CHAR_LIMIT}) — "${title}"`);
  }
  return title;
}

// Defensive decoder for HTML entities that leak in from Carlos's copy-paste
// out of Word/web into the WASI editor. Covers Spanish accents (the original
// motivation), the most common Word-paste artifacts (en/em dash, ellipsis,
// smart quotes), structural entities, and numeric refs (decimal + hex).
//
// Idempotent: decoded text contains no `&xxx;` sequences, so a second pass
// is a no-op. Safe to run on already-clean input.
//
// Named-entity lookup (case-insensitive). Order doesn't matter — we replace
// via a single global regex that captures the name and looks it up here.
const HTML_ENTITIES = {
  // Spanish accents (original list)
  ntilde: "ñ", aacute: "á", eacute: "é", iacute: "í", oacute: "ó",
  uacute: "ú", uuml:   "ü",
  // Structural
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
  // Word-paste artifacts
  ndash: "–", mdash: "—", hellip: "…",
  laquo: "«", raquo: "»",
  lsquo: "‘", rsquo: "’", ldquo: "“", rdquo: "”",
  // Symbols
  copy: "©", reg: "®", trade: "™",
  // Math / typographic — common in real-estate listings (m², m³, ½, ¼, ¾)
  sup2: "²", sup3: "³",
  frac12: "½", frac14: "¼", frac34: "¾",
  deg: "°", times: "×", divide: "÷", plusmn: "±",
  micro: "µ", middot: "·", bull: "•",
};

function decodeHtmlEntities(s) {
  if (!s) return s;
  return String(s)
    // Named entities (case-insensitive on the name; entity names may contain
    // digits, e.g. &sup2;, &frac12;).
    .replace(/&([a-zA-Z][a-zA-Z0-9]*);/g, (m, name) => {
      const lower = name.toLowerCase();
      if (HTML_ENTITIES[lower] != null) {
        const v = HTML_ENTITIES[lower];
        // Preserve case for letter entities (Ntilde → Ñ, Aacute → Á, …)
        if (name[0] === name[0].toUpperCase() && lower !== name) {
          return v.toUpperCase();
        }
        return v;
      }
      return m; // unknown entity — leave intact rather than mangling text
    })
    // Hex numeric: &#xHHHH; or &#XHHHH;
    .replace(/&#[xX]([0-9a-fA-F]+);/g, (_, h) => {
      const n = parseInt(h, 16);
      return Number.isFinite(n) ? String.fromCodePoint(n) : "";
    })
    // Decimal numeric: &#NNNN;
    .replace(/&#(\d+);/g, (_, d) => {
      const n = Number(d);
      return Number.isFinite(n) ? String.fromCodePoint(n) : "";
    });
}

function textToPortableText(text) {
  if (!text) return undefined;
  const raw = String(text).trim();
  if (!raw) return undefined;

  const isHtml = /<[a-z][\s\S]*?>/i.test(raw);
  const blocks = [];

  if (isHtml) {
    // Extract each <p>…</p> block
    const pTags = [...raw.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)];
    const chunks = pTags.length ? pTags.map(m => m[1]) : [raw];

    for (let i = 0; i < chunks.length; i++) {
      const inner = chunks[i];
      const isBold = /<strong>/i.test(inner);
      const plain  = decodeHtmlEntities(inner.replace(/<[^>]+>/g, "")).trim();
      if (!plain) continue;
      blocks.push({
        _type: "block", _key: `p${i}`, style: "normal", markDefs: [],
        children: [{ _type: "span", _key: `s${i}`, text: plain, marks: isBold ? ["strong"] : [] }],
      });
    }
  } else {
    // Plain-text branch: WASI sometimes returns text with literal HTML entities
    // (`&ndash;`, `&nbsp;`, etc) pasted from Word/web — decode here too, not
    // only on the HTML branch above. Decoder is per-span (Portable Text
    // structure preserved — we never decode JSON-stringified blocks).
    raw.split(/\n{2,}/).filter(p => p.trim()).forEach((para, i) => {
      blocks.push({
        _type: "block", _key: `p${i}`, style: "normal", markDefs: [],
        children: [{
          _type: "span", _key: `s${i}`,
          text: decodeHtmlEntities(para.replace(/\n/g, " ").trim()),
          marks: [],
        }],
      });
    });
  }

  return blocks.length ? blocks : undefined;
}

// Complete WASI feature catalog mapped by ID → { cat, label }.
// cat: "interior" | "building" | "location" | null (null = skip).
// Source: GET /v1/feature/all (fetched 2026-04-21).
const WASI_FEATURE_MAP = {
  // ── Internal features ───────────────────────────────────────────────────────
  1:   { cat: "interior", label: "Aire acondicionado" },
  2:   { cat: "interior", label: "Alarma" },
  4:   { cat: "interior", label: "Amueblado" },
  5:   { cat: "interior", label: "Balcón" },
  6:   { cat: "interior", label: "Baño auxiliar" },
  7:   { cat: "interior", label: "Estudio / biblioteca" },
  8:   { cat: "interior", label: "Cuarto de servicio" },
  9:   { cat: "interior", label: "Hall de alcobas" },
  10:  { cat: "interior", label: "Sauna" },
  11:  { cat: "interior", label: "Vista panorámica" },
  12:  { cat: "interior", label: "Calentador de agua" },
  13:  { cat: "interior", label: "Chimenea" },
  14:  { cat: "interior", label: "Intercomunicador" },
  15:  { cat: "interior", label: "Barra americana" },
  16:  { cat: "interior", label: "Cocina integral" },
  17:  { cat: "interior", label: "Cocina tipo americano" },
  18:  { cat: "interior", label: "Comedor auxiliar" },
  19:  { cat: "interior", label: "Línea de gas" },
  20:  { cat: "interior", label: "Área de lavandería" },
  21:  { cat: "interior", label: "Depósito" },
  22:  { cat: "interior", label: "Despensa" },
  23:  { cat: "interior", label: "Cuarto de conductores" },
  24:  { cat: "interior", label: "Pisos de cerámica / mármol" },
  74:  null,                                              // Hospedaje turismo (metadata)
  82:  { cat: "interior", label: "Baño en suite" },
  84:  { cat: "interior", label: "Closets empotrados" },
  85:  { cat: "interior", label: "Cocina equipada" },
  86:  { cat: "interior", label: "Doble ventana" },
  93:  null,                                              // Bifamiliar (clasificación colombiana)
  94:  null,                                              // Unifamiliar
  95:  null,                                              // Trifamiliar
  96:  null,                                              // Adosado
  97:  { cat: "interior", label: "Reformado / Renovado" },
  98:  { cat: "interior", label: "Closets empotrados" }, // alias de 84, se deduplica
  99:  { cat: "interior", label: "Baño turco" },
  100: { cat: "interior", label: "Jacuzzi" },
  103: { cat: "interior", label: "Trastero" },
  104: { cat: "interior", label: "Mascotas permitidas" },
  107: { cat: "interior", label: "Pisos laminados" },
  108: { cat: "interior", label: "Pisos de madera" },
  109: null,                                              // Inmueble de lujo (metadata)
  112: { cat: "interior", label: "TV por cable" },
  113: { cat: "interior", label: "Internet" },
  115: { cat: "interior", label: "Sala de usos múltiples" },
  116: null,                                              // Agua (implícito)
  117: { cat: "interior", label: "Puerta de seguridad" },
  118: null,                                              // Electricidad (implícito)
  126: { cat: "interior", label: "Extractor de cocina" },
  127: { cat: "interior", label: "Horno" },
  128: { cat: "interior", label: "Lavaplatos" },
  129: { cat: "interior", label: "Vestidor" },
  130: { cat: "interior", label: "Control de ruido" },
  131: { cat: "interior", label: "Control térmico" },
  132: { cat: "interior", label: "Detector de humo" },
  133: { cat: "interior", label: "Puerta eléctrica" },
  140: { cat: "interior", label: "Altillo / Mezzanine" },

  // ── External features ───────────────────────────────────────────────────────
  25:  { cat: "building",  label: "Cancha de squash" },
  26:  { cat: "building",  label: "Cancha de tenis" },
  27:  { cat: "building",  label: "Áreas deportivas" },
  28:  { cat: "building",  label: "Gimnasio" },
  29:  { cat: "building",  label: "Jardín" },
  30:  { cat: "building",  label: "Patio" },
  31:  { cat: "building",  label: "Jaula de golf" },
  32:  { cat: "building",  label: "Piscina" },
  33:  { cat: "building",  label: "Área de juegos infantiles" },
  34:  { cat: "building",  label: "Áreas verdes" },
  35:  null,                                              // Garaje (campo de estacionamiento)
  36:  { cat: "building",  label: "Business center" },
  37:  { cat: "building",  label: "Estacionamiento de visitas" },
  38:  { cat: "building",  label: "Sala de internet" },
  39:  { cat: "building",  label: "Salón comunal" },
  40:  { cat: "building",  label: "Terraza comunal" },
  41:  null,                                              // Vivienda bifamiliar
  42:  null,                                              // Vivienda multifamiliar
  43:  { cat: "building",  label: "Concierge / Portería 24h" },
  44:  { cat: "building",  label: "Ascensor" },
  45:  { cat: "building",  label: "Circuito cerrado de TV" },
  46:  { cat: "location",  label: "Comunidad cerrada / Gated" },
  47:  { cat: "building",  label: "Generador eléctrico" },
  48:  { cat: "building",  label: "Vigilancia 24h" },
  49:  { cat: "location",  label: "Acceso pavimentado" },
  50:  { cat: "location",  label: "Cerca de zona urbana" },
  51:  null,                                              // Kiosko
  52:  { cat: "location",  label: "Río / quebrada cercano" },
  53:  null,                                              // Árboles frutales (rural)
  54:  null,                                              // Bosque nativos (rural)
  55:  null,                                              // Cochera / garaje (campo de estacionamiento)
  56:  null,                                              // Establo (rural)
  57:  null,                                              // Galpón (rural)
  58:  null,                                              // Invernadero (rural)
  59:  null,                                              // Pesebrera (rural)
  60:  null,                                              // Pozo de agua natural (rural)
  61:  null,                                              // Sistema de riego (rural)
  62:  { cat: "building",  label: "Cancha de basketball" },
  63:  { cat: "building",  label: "Cancha de fútbol" },
  64:  null,                                              // Zona camping
  65:  { cat: "location",  label: "Sobre vía principal" },
  66:  null,                                              // Zona campestre
  67:  { cat: "location",  label: "Zona comercial" },
  68:  null,                                              // Zona industrial
  69:  { cat: "location",  label: "Zona residencial tranquila" },
  70:  { cat: "location",  label: "Cerca de colegios" },
  71:  { cat: "location",  label: "Transporte público cercano" },
  72:  { cat: "location",  label: "Cerca de parques" },
  73:  { cat: "location",  label: "Cerca de centros comerciales" },
  75:  { cat: "location",  label: "Cerca de playa" },
  76:  { cat: "location",  label: "Zona turística" },
  77:  null,                                              // Calles de tosca (rural)
  78:  { cat: "building",  label: "Área social" },
  79:  { cat: "location",  label: "Lago cercano" },
  80:  { cat: "building",  label: "Garita de seguridad" },
  81:  null,                                              // Vivienda unifamiliar
  87:  { cat: "location",  label: "Zona de montaña" },
  88:  { cat: "building",  label: "Club social" },
  89:  null,                                              // Bungalow / pareado
  90:  { cat: "building",  label: "Bodega / Storage" },
  91:  { cat: "building",  label: "Pista de pádel" },
  92:  { cat: "building",  label: "BBQ / Área de asados" },
  101: { cat: "location",  label: "Laguna cercana" },
  102: { cat: "building",  label: "Club house" },
  105: null,                                              // Ubicación interior (metadata)
  106: null,                                              // Ubicación exterior (metadata)
  110: { cat: "building",  label: "Edificio inteligente" },
  111: { cat: "building",  label: "Jardín de techo" },
  114: { cat: "building",  label: "Acceso para discapacitados" },
  119: { cat: "location",  label: "Centro médico cercano" },
  120: { cat: "location",  label: "Cerca de colegios" },  // alias de 70, se deduplica
  121: null,                                              // Cerca a parque industrial
  122: { cat: "location",  label: "Cerca de restaurantes" },
  123: null,                                              // Cerca a tiendas de barrio
  124: { cat: "interior",  label: "Luz en la mañana" },
  125: { cat: "interior",  label: "Luz en la tarde" },
  134: null,                                              // Shut de basura (infraestructura)
  135: { cat: "building",  label: "Energía solar" },
  136: null,                                              // Tanques de agua
  137: { cat: "building",  label: "Acceso con tarjetas" },
  138: null,                                              // Bahias de parqueo (campo de estacionamiento)
  139: { cat: "building",  label: "Parqueadero inteligente" },
};

// Maps WASI features to Sanity feature arrays using the ID-based catalog above.
function mapFeaturesFromTags(features) {
  const interior = [], building = [], location = [];

  let tags = [];
  if (features && typeof features === "object" && !Array.isArray(features)) {
    tags = [
      ...(Array.isArray(features.internal) ? features.internal : []),
      ...(Array.isArray(features.external) ? features.external : []),
    ];
  } else if (Array.isArray(features)) {
    tags = features;
  }
  if (tags.length === 0) return { interior, building, location };

  for (const tag of tags) {
    const mapping = WASI_FEATURE_MAP[tag.id];
    if (!mapping) continue; // null = skip, undefined = unknown ID
    if (mapping.cat === "interior") interior.push(mapping.label);
    else if (mapping.cat === "building") building.push(mapping.label);
    else if (mapping.cat === "location") location.push(mapping.label);
  }

  return { interior, building, location };
}

// ── Image upload ──────────────────────────────────────────────────────────────

// filename → asset _id, populated once in main() before the sync loop
const assetCache = new Map();

async function preloadAssetCache() {
  const assets = await sanity.fetch(
    `*[_type == "sanity.imageAsset" && string::startsWith(originalFilename, "wasi-")]{ _id, originalFilename }`
  );
  for (const a of assets) assetCache.set(a.originalFilename, a._id);
}

async function uploadImage(url, wasiId, slot) {
  // slot examples: "main", "g0", "g1", ...
  // Filename embeds an 8-char hash of the URL path so a photo swap in Wasi
  // produces a fresh asset rather than reusing the stale cached one.
  const filename = imageFilename(wasiId, slot, url);
  const cached = assetCache.get(filename);
  if (cached) return { _type: "image", asset: { _type: "reference", _ref: cached } };

  try {
    const asset = await withRetry(`upload ${filename}`, async () => {
      const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buffer = await res.arrayBuffer();
      return sanity.assets.upload("image", Buffer.from(buffer), {
        filename,
        contentType: res.headers.get("content-type") || "image/jpeg",
      });
    });
    assetCache.set(filename, asset._id);
    return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
  } catch (err) {
    console.warn(`    ⚠ Image failed (${filename}): ${err.message}`);
    return null;
  }
}

// ── WASI API calls (GET only — never modifies WASI data) ──────────────────────

async function wasiGet(path, params = "") {
  const url = `${WASI_BASE}${path}?${wCreds()}${params ? "&" + params : ""}`;
  return withRetry(`WASI ${path}`, async () => {
    const res = await fetch(url, { signal: AbortSignal.timeout(30000) });
    if (!res.ok) throw new Error(`WASI ${path} → HTTP ${res.status}`);
    const data = await res.json();
    if (data.status !== "success") {
      throw new Error(`WASI error: ${data.message ?? JSON.stringify(data).slice(0, 120)}`);
    }
    return data;
  });
}

async function fetchAllWasiIds() {
  const ids  = [];
  let skip   = 0;
  let total  = Infinity;

  while (ids.length < total) {
    const data  = await wasiGet(`/property/search`, `scope=1&take=100&skip=${skip}&short=true`);
    const props = Object.entries(data)
      .filter(([k, v]) => /^\d+$/.test(k) && v?.id_property)
      .map(([, v]) => v);

    if (props.length === 0) break;
    ids.push(...props.map(p => p.id_property));
    total = Number(data.total ?? data.Total ?? ids.length);
    skip += 100;
  }
  return ids;
}

async function fetchWasiDetail(id) {
  return wasiGet(`/property/get/${id}`, "");
}

// ── Sanity helpers ────────────────────────────────────────────────────────────

async function fetchSanityWasiMap() {
  const rows = await sanity.fetch(
    `*[_type == "property" && string::startsWith(_id, "wasi-")]{ _id, listingStatus, wasiSyncHash }`
  );
  return new Map(rows.map(r => [r._id, { listingStatus: r.listingStatus, wasiSyncHash: r.wasiSyncHash }]));
}

// Stable JSON hash — keys ordered deterministically so the same payload
// always produces the same hash. Used for skip-if-unchanged short-circuit.
function stableHash(obj) {
  const sortKeys = (o) => {
    if (Array.isArray(o)) return o.map(sortKeys);
    if (o && typeof o === "object" && o.constructor === Object) {
      return Object.keys(o).sort().reduce((acc, k) => { acc[k] = sortKeys(o[k]); return acc; }, {});
    }
    return o;
  };
  return createHash("sha256").update(JSON.stringify(sortKeys(obj))).digest("hex").slice(0, 16);
}

// ── Build Sanity doc from WASI property ───────────────────────────────────────

async function buildWasiFields(prop) {
  const wasiId       = typeof prop.id_property === "number"
    ? prop.id_property
    : parseInt(String(prop.id_property), 10);

  const propertyType  = mapPropertyType(prop);
  const businessType  = mapBusinessType(prop);
  const listingStatus = mapListingStatus(prop);

  const rawZone = String(prop.zone_label ?? prop.neighborhood ?? prop.barrio ?? "").trim();
  // Fallback to city_label if zone_label is empty and city matches a known zone
  const rawZoneFallback = !rawZone ? String(prop.city_label ?? "").trim() : rawZone;

  // PR-K4: third fallback — scan the Wasi title against the neighborhood
  // catalog when the first two label-based attempts produce nothing the
  // ZONE_MAP recognizes. Real-world trigger: FINCA Antón listings where Wasi
  // returns empty zone_label and a region-only city_label.
  let zone = normalizeZone(rawZoneFallback) ?? rawZoneFallback;
  const labelResolvedToKnownZone = !!normalizeZone(rawZoneFallback);
  if (!labelResolvedToKnownZone) {
    const titleResolved = resolveZoneFromTitle(prop.title ?? prop.titulo ?? "", zoneCatalog);
    if (titleResolved) {
      console.log(`  🔎 zone resolved from title: "${titleResolved}" (wasiId=${wasiId}, title="${(prop.title ?? prop.titulo ?? "").trim()}")`);
      zone = titleResolved;
    }
  }

  // Skip only if all three fallbacks (zone_label, city_label, title) failed
  // to resolve to a known canonical zone.
  if (!normalizeZone(zone)) {
    console.log(`  ⚠️  SKIP wasiId=${wasiId} — no zone_label (${prop.city_label ?? "?"}, ${prop.region_label ?? "?"})`);
    return null;
  }

  const price = parseNum(
    businessType === "alquiler"
      ? (prop.rent_price  ?? prop.price)
      : (prop.sale_price  ?? prop.price)
  );
  if (!price) return null;

  const fields = {
    title:  buildTitle(prop, propertyType, businessType, zone),
    slug:   { _type: "slug", current: buildSlug(wasiId, propertyType, businessType, zone) },
    wasiId,
    businessType,
    propertyType,
    listingStatus,
    featured: Number(prop.id_status_on_page) === WASI_STATUS_ON_PAGE.OUTSTANDING,
    rented: mapRented(prop),
    price,
    zone:     zone || "Panamá",
    province: String(prop.province ?? prop.provincia ?? "Panamá").trim(),

    ...(parseNum(prop.floor) !== null                     ? { floor:         parseNum(prop.floor) }              : {}),
    ...(parseNum(prop.building_date) !== null             ? { yearBuilt:     parseNum(prop.building_date) }      : {}),
    ...(mapCondition(prop)                                ? { condition:     mapCondition(prop) }                 : {}),
    ...(prop.location_label                               ? { corregimiento: String(prop.location_label).trim() }: {}),
    ...(parseNum(prop.bedrooms) !== null                  ? { bedrooms:      parseNum(prop.bedrooms) }           : {}),
    ...(parseNum(prop.bathrooms) !== null                 ? { bathrooms:     parseNum(prop.bathrooms) }          : {}),
    ...(parseNum(prop.half_bathrooms) !== null            ? { halfBathrooms: parseNum(prop.half_bathrooms) }     : {}),
    ...(parseNum(prop.garages) !== null                   ? { parking:       parseNum(prop.garages) }            : {}),
    ...(parseNum(prop.built_area ?? prop.area) !== null   ? { area:          parseNum(prop.built_area ?? prop.area) } : {}),
    ...(parseNum(prop.maintenance_fee) !== null           ? { adminFee:      parseNum(prop.maintenance_fee) }    : {}),
    ...(prop.latitude && prop.longitude                   ? { location: {
          _type: "geopoint",
          lat:   parseFloat(prop.latitude),
          lng:   parseFloat(prop.longitude),
        }} : {}),
  };

  // Agent — link to wasi-agent-{id_user} if WASI provides one
  if (prop.id_user) {
    const resolvedUserId = AGENT_OVERRIDES[prop.id_user] ?? prop.id_user;
    fields.agent = { _type: "reference", _ref: `wasi-agent-${resolvedUserId}` };
  }

  // Description → Portable Text
  const pt = textToPortableText(prop.observations ?? prop.descripcion ?? "");
  if (pt) fields.description = pt;

  // Features — WASI returns {internal:[{nombre}], external:[{nombre}]}
  const { interior, building, location: locFeats } = mapFeaturesFromTags(
    prop.features ?? prop.tags ?? prop.characteristics ?? {}
  );
  if (interior.length)  fields.featuresInterior  = [...new Set(interior)];
  if (building.length)  fields.featuresBuilding  = [...new Set(building)];
  if (locFeats.length)  fields.featuresLocation  = [...new Set(locFeats)];

  // Images — only if not dry run
  if (!DRY_RUN) {
    // main_image can be a string URL or an object {url, url_big, url_original}
    const mainRaw = prop.main_image ?? prop.imagen_principal ?? prop.thumbnail;
    const mainUrl = typeof mainRaw === "string"
      ? mainRaw
      : (mainRaw?.url_big ?? mainRaw?.url ?? mainRaw?.url_original ?? null);
    if (mainUrl) {
      const img = await uploadImage(mainUrl, wasiId, "main");
      if (img) fields.mainImage = img;
    }

    // galleries is [{0:{url,url_big,...}, 1:{...}, id:xxx}] — extract numeric keys
    const galleriesRaw = prop.galleries ?? prop.photos ?? prop.gallery ?? prop.images ?? [];
    const photos = [];
    for (const galleryGroup of (Array.isArray(galleriesRaw) ? galleriesRaw : [])) {
      for (const [k, v] of Object.entries(galleryGroup)) {
        if (/^\d+$/.test(k) && v?.url) photos.push(v);
      }
    }
    if (photos.length > 20) {
      console.warn(`  ⚠ wasiId=${wasiId} has ${photos.length} gallery photos, truncating to 20`);
    }
    if (photos.length > 0) {
      const gallery = [];
      for (let i = 0; i < Math.min(photos.length, 20); i++) {
        const url = photos[i].url_big ?? photos[i].url ?? photos[i].url_original;
        if (!url) continue;
        const img = await uploadImage(url, wasiId, `g${i + 1}`);
        if (img) gallery.push({ ...img, _key: `g${i}` });
      }
      if (gallery.length > 0) fields.gallery = gallery;
    }
  }

  return { _id: `wasi-${wasiId}`, fields };
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const startTime = Date.now();
  console.log(`\n${"═".repeat(60)}`);
  console.log(`  WASI → Sanity Sync  ${DRY_RUN ? "· DRY RUN (no writes)" : ""}${FORCE ? "  · ⚠ FORCE (safety bypassed)" : ""}${isFinite(LIMIT) ? `  · LIMIT=${LIMIT}` : ""}`);
  console.log(`${"═".repeat(60)}\n`);

  if (FORCE) {
    console.warn("⚠ --force enabled: catalog-size assertion and deactivation threshold are bypassed.\n");
  }

  // 0a. Acquire concurrency lock (skip in dry-run / single-id — those are safe).
  if (!DRY_RUN && !SINGLE_ID) {
    acquireLock();
  }

  // 0b. Pre-flight checks — fail fast on stale credentials or wrong dataset.
  await preflightChecks();

  // 0c. Load zone catalog from Sanity (PR-K4). One GROQ per sync, used as the
  // title-fallback table when Wasi returns no usable zone_label / city_label.
  // Filtered to neighborhoods whose canonical name appears in ZONE_MAP values
  // — this prevents a rogue or test neighborhood doc from causing false
  // positives via short-name title matches.
  process.stdout.write("📚 Loading zone catalog...");
  const knownCanonicalNames = new Set(Object.values(ZONE_MAP));
  const allNeighborhoods = await sanity.fetch(`*[_type=='neighborhood' && defined(name)]{ _id, name, "slug": slug.current }`);
  zoneCatalog = allNeighborhoods.filter(n => knownCanonicalNames.has(n.name));
  console.log(` ${zoneCatalog.length} zones (filtered from ${allNeighborhoods.length} neighborhood docs)`);

  // 1. Fetch WASI property IDs
  process.stdout.write("📡 Fetching WASI listings...");
  let wasiIds;
  if (SINGLE_ID) {
    wasiIds = [parseInt(SINGLE_ID, 10)];
    console.log(` testing single ID ${SINGLE_ID}`);
  } else {
    wasiIds = await fetchAllWasiIds();
    if (isFinite(LIMIT)) wasiIds = wasiIds.slice(0, LIMIT);
    console.log(` ${wasiIds.length} found${isFinite(LIMIT) ? ` (limited to ${LIMIT})` : ""}`);
  }

  // 1a. Load Sanity-managed exclusion list (singleton `syncConfig`).
  // IDs Igor agrega aquí no se vuelven a crear en Sanity aunque sigan activos
  // en Wasi — útil después de dedup-cleanups. Default seguro: lista vacía.
  process.stdout.write("🚫 Loading exclusion list...");
  let excludedWasiIds = new Set();
  try {
    const cfg = await sanity.fetch(`*[_id == "syncConfig"][0]{ excludedWasiIds }`);
    const ids = Array.isArray(cfg?.excludedWasiIds) ? cfg.excludedWasiIds : [];
    excludedWasiIds = new Set(ids.map(s => String(s).trim()).filter(Boolean));
    console.log(` ${excludedWasiIds.size} wasi-ID(s) excluded`);
  } catch (err) {
    console.log(` ⚠ failed to load (${err.message}) — proceeding with empty exclusion list`);
  }

  // Filter out excluded IDs before any per-property work runs. Single-ID mode
  // also honors the list — if you're explicitly testing an excluded ID, that's
  // a footgun we want to surface clearly.
  const beforeExclusion = wasiIds.length;
  wasiIds = wasiIds.filter(id => !excludedWasiIds.has(String(id)));
  const excluded = beforeExclusion - wasiIds.length;
  if (excluded > 0) {
    console.log(`🚫 Skipped ${excluded} listing(s) via exclusion list`);
  }

  // 1b. Catalog-size assertion — abort if Wasi returned suspiciously few
  // properties compared to the last successful run. Defends against partial
  // API responses (auth hiccup, pagination bug, regional outage) that would
  // otherwise propagate as mass deactivations.
  if (!SINGLE_ID && !isFinite(LIMIT)) {
    const lastRun = readRunState();
    if (lastRun?.idCount && wasiIds.length < lastRun.idCount * CATALOG_SHRINK_LIMIT) {
      const pct = Math.round((1 - wasiIds.length / lastRun.idCount) * 100);
      const msg = `SAFETY: Wasi catalog shrank ${pct}% vs last run (${wasiIds.length} now, ${lastRun.idCount} last on ${lastRun.ts}). Aborting full sync.`;
      if (!FORCE) {
        throw new Error(msg + " Re-run with --force if intentional.");
      }
      console.warn(`⚠ ${msg} Continuing because --force.`);
    }
  }

  // 2. Fetch existing Sanity state
  process.stdout.write("🗂  Fetching Sanity state...");
  const sanityMap  = await fetchSanityWasiMap();
  // Excluded IDs are also marked as "present" so any leftover Sanity doc with
  // that ID isn't picked up by the deactivation sweep. Exclusion = "leave alone
  // entirely", not "deactivate".
  const wasiIdSet  = new Set([
    ...wasiIds.map(id => `wasi-${id}`),
    ...[...excludedWasiIds].map(id => `wasi-${id}`),
  ]);
  console.log(` ${sanityMap.size} existing docs`);

  if (!DRY_RUN) {
    process.stdout.write("🖼️  Loading asset cache...");
    await preloadAssetCache();
    console.log(` ${assetCache.size} images already in Sanity\n`);
  } else {
    console.log("");
  }

  let created = 0, updated = 0, skipped = 0, unchanged = 0, failed = 0, deactivated = 0;
  const unmappedTypes = new Set();
  const zonesFound = new Map(); // raw zone → normalized (or null if not in ZONE_MAP)

  // 3. Sync each property (sequential to keep logs readable)
  for (let i = 0; i < wasiIds.length; i++) {
    const id    = wasiIds[i];
    const docId = `wasi-${id}`;
    const existing = sanityMap.get(docId);
    const isNew = !existing;
    const label = `[${String(i + 1).padStart(3)}/${wasiIds.length}] ${docId}`;

    process.stdout.write(`${label.padEnd(35)} `);

    try {
      const detail = await fetchWasiDetail(id);

      // Log raw response on --id single-test so we can see field names
      if (SINGLE_ID) {
        console.log("\n\n── Raw WASI response ──────────────────────────────");
        console.log(JSON.stringify(detail, null, 2));
        console.log("───────────────────────────────────────────────────\n");
      }

      // Track zones for dry-run report
      const rawZone = String(detail.zone_label ?? detail.neighborhood ?? detail.barrio ?? "").trim();
      if (rawZone) zonesFound.set(rawZone, ZONE_MAP[rawZone] ?? null);

      const result = await buildWasiFields(detail);
      if (!result) {
        console.log("⏭  skip");
        skipped++;
        continue;
      }

      const { _id, fields } = result;

      // Dry-run + single-id: surface the built title and description plain
      // text so we can eyeball that the entity decoder ran (e.g. `&ndash;`
      // → `–`). Cheap, no writes, scoped to the single-id path.
      if (DRY_RUN && SINGLE_ID) {
        console.log("\n── Built fields preview ───────────────────────────");
        console.log(`title: ${fields.title ?? "(none)"}`);
        const blocks = Array.isArray(fields.description) ? fields.description : [];
        if (blocks.length === 0) {
          console.log("description: (none)");
        } else {
          blocks.forEach((b, i) => {
            const text = (b.children ?? []).map(c => c.text).join("");
            console.log(`description[${i}]: ${text}`);
          });
        }
        // Detect any leftover entities — should be zero after decoder.
        const anyText = `${fields.title ?? ""}\n` + blocks
          .flatMap(b => (b.children ?? []).map(c => c.text))
          .join("\n");
        const leftover = anyText.match(/&[a-zA-Z][a-zA-Z0-9]*;|&#\d+;|&#[xX][0-9a-fA-F]+;/g) ?? [];
        console.log(`leftover HTML entities: ${leftover.length === 0 ? "none ✓" : leftover.join(", ")}`);
        console.log("───────────────────────────────────────────────────\n");
      }

      if (!DRY_RUN) {
        // publishedAt: only used on createIfNotExists. Validated to avoid
        // poisoning the sitemap <lastmod> with "now" or unparseable values.
        const wasiDate = detail.created_at ?? detail.creation_date ?? detail.date_created ?? detail.publication_date ?? null;
        const publishedAt = isValidWasiDate(wasiDate) ? new Date(wasiDate).toISOString() : null;

        if (isNew) {
          // Seed with HUMAN_FIELDS (Wasi-derived initial values) + flags.
          // After this, those fields are owned by Carlos/Igor in Studio.
          // titleI18n[en] / descriptionI18n[en] are intentionally NOT seeded —
          // those wait for Igor's translation review pass (humanReviewed gate).
          const seed = {
            _id,
            _type:       "property",
            recommended: false,
            fairPrice:   false,
            rented:      Boolean(fields.rented),
            // featured initial seed from Wasi id_status_on_page === 3 ("Outstanding").
            // After this seed, Carlos owns it in Studio — homepage curation is
            // human, not driven by Wasi.
            featured:    Boolean(fields.featured),
            humanReviewed: false,
            noindex:     false,
            // Wasi-derived initial values — handed off to Studio after this
            ...(fields.title       != null ? { title: fields.title } : {}),
            ...(fields.slug        != null ? { slug:  fields.slug  } : {}),
            ...(fields.description != null
              ? {
                  description: fields.description,
                  descriptionI18n: [{ _key: "es", value: fields.description }],
                }
              : {}),
            ...(fields.title != null
              ? { titleI18n: [{ _key: "es", value: fields.title }] }
              : {}),
            ...(publishedAt != null ? { publishedAt } : {}),
          };
          await withRetry(`createIfNotExists ${_id}`, () => sanity.createIfNotExists(seed));
        }

        // Updates: omit HUMAN_FIELDS so Studio edits stick.
        const wasiOnlyFields = omit(fields, HUMAN_FIELDS);

        // Explicit unset for optional Wasi fields that are absent from this
        // payload (e.g. Wasi removed `bedrooms`). Without this, stale values
        // would silently linger in Sanity.
        const missingFields = OPTIONAL_WASI_FIELDS.filter(f => !(f in fields));

        // Skip-if-unchanged: hash the Wasi-only payload + the unset list and
        // compare against the doc's stored wasiSyncHash. Identical → no patch
        // needed, ~95% reduction in writes on stable runs. The hash skip is
        // bypassed for the create path (we always commit a patch right after
        // createIfNotExists to seed all fields).
        const newHash = stableHash({ fields: wasiOnlyFields, unset: missingFields });
        const isUnchanged = !isNew && existing?.wasiSyncHash === newHash;

        if (isUnchanged) {
          // Don't bump wasiSyncedAt either — the doc is already in sync, the
          // last successful run is the truth. Keeps Sanity history clean.
          console.log("≡  unchanged");
          unchanged++;
          continue;
        }

        const patch = sanity.patch(_id).set({
          ...wasiOnlyFields,
          wasiSyncHash: newHash,
          wasiSyncedAt: new Date().toISOString(),
        });
        if (missingFields.length > 0) patch.unset(missingFields);
        await withRetry(`patch ${_id}`, () => patch.commit());
      }

      console.log(isNew ? "✨ created" : "✓  updated");
      isNew ? created++ : updated++;
    } catch (err) {
      console.log(`✗  ${err.message.slice(0, 55)}`);
      failed++;
    }
  }

  // 4. Mark removed properties as retirada — gated by safety threshold so a
  // partial Wasi response never deactivates a large portion of the catalog.
  // Skipped on --id and --limit (those represent a slice, not a full catalog).
  if (!SINGLE_ID && !isFinite(LIMIT)) {
    const candidates = [];
    for (const [sanityId, info] of sanityMap.entries()) {
      if (!wasiIdSet.has(sanityId) && info.listingStatus === "activa") candidates.push(sanityId);
    }

    const limit = Math.max(DEACTIVATION_FLOOR_ABS, Math.floor(sanityMap.size * DEACTIVATION_FLOOR_PCT));
    if (candidates.length > limit && !FORCE) {
      throw new Error(`SAFETY: ${candidates.length} deactivations would exceed threshold (${limit} = max(${DEACTIVATION_FLOOR_ABS}, ${Math.round(DEACTIVATION_FLOOR_PCT * 100)}% of ${sanityMap.size})). Re-run with --force if intentional.`);
    }
    if (candidates.length > limit && FORCE) {
      console.warn(`⚠ Deactivating ${candidates.length} properties (threshold=${limit}). --force enabled.`);
    }

    if (candidates.length > 0) {
      console.log(`\n🔍 Deactivating ${candidates.length} removed propert${candidates.length === 1 ? "y" : "ies"}...`);
      for (const sanityId of candidates) {
        process.stdout.write(`   ${sanityId}... `);
        if (!DRY_RUN) {
          await withRetry(`deactivate ${sanityId}`, () =>
            sanity.patch(sanityId).set({ listingStatus: "retirada" }).commit()
          );
        }
        console.log("✓");
        deactivated++;
      }
    }
  }

  // 5b. Persist run state for next run's catalog-size assertion. Skip when
  // SINGLE_ID/LIMIT/DRY_RUN since those don't represent a full successful run.
  if (!SINGLE_ID && !isFinite(LIMIT) && !DRY_RUN && failed === 0) {
    writeRunState({
      idCount: wasiIds.length,
      ts: new Date().toISOString(),
      created, updated, unchanged, skipped, excluded, deactivated,
    });
  }

  // 5. Summary
  console.log(`\n${"─".repeat(60)}`);
  if (DRY_RUN) console.log("  (DRY RUN — nothing was written)");
  console.log(`  ✨ Created:     ${created}`);
  console.log(`  ✓  Updated:     ${updated}`);
  console.log(`  ≡  Unchanged:   ${unchanged}`);
  console.log(`  ⏭  Skipped:     ${skipped}`);
  console.log(`  🚫 Excluded:    ${excluded}`);
  console.log(`  🔴 Deactivated: ${deactivated}`);
  console.log(`  ❌ Failed:      ${failed}`);
  console.log(`${"─".repeat(60)}\n`);

  // 6. Zone report (always shown, critical when dry-run)
  if (zonesFound.size > 0) {
    console.log(`${"─".repeat(60)}`);
    console.log("  Zonas encontradas en WASI\n");
    const mapped   = [...zonesFound.entries()].filter(([, v]) => v !== null).sort(([a], [b]) => a.localeCompare(b));
    const unmapped = [...zonesFound.entries()].filter(([, v]) => v === null).sort(([a], [b]) => a.localeCompare(b));
    for (const [raw, normalized] of mapped)   console.log(`  ✓ ${raw.padEnd(30)} → ${normalized}`);
    for (const [raw] of unmapped)              console.log(`  ⚠ ${raw.padEnd(30)} → SIN MAPEAR (llegará tal cual)`);
    console.log(`${"─".repeat(60)}\n`);
  }

  // 7. Append run summary to wasi-sync.jsonl (skipped on dry-run/single-id —
  // those don't represent real catalog runs).
  if (!DRY_RUN && !SINGLE_ID) {
    appendSyncLog({
      ts:        new Date().toISOString(),
      duration_s: Math.round((Date.now() - startTime) / 1000),
      catalog:   wasiIds.length,
      created, updated, unchanged, skipped, excluded, deactivated, failed,
      force:     FORCE || undefined,
    });
  }
}

main().catch(err => {
  // Capture aborts in the run log too, so monitoring sees them.
  if (!DRY_RUN && !SINGLE_ID) {
    try {
      appendSyncLog({
        ts:      new Date().toISOString(),
        aborted: err.message.split("\n")[0].slice(0, 200),
        force:   FORCE || undefined,
      });
    } catch {}
  }
  releaseLock();
  console.error("\n💥 Fatal:", err.message);
  process.exit(1);
});
