/**
 * One-shot initializer for the `syncConfig` singleton.
 *
 * Crea (o deja intacto) el documento `syncConfig` en Sanity con la lista
 * inicial de Wasi-IDs ya borrados manualmente por Igor durante la limpieza
 * de duplicados. Sin esta lista, la próxima corrida del sync recrearía esos
 * listings porque siguen activos en Wasi.
 *
 * Idempotente: usa `createIfNotExists`. Re-correrlo no sobrescribe ediciones
 * que Igor / Carlos hayan hecho luego desde Studio.
 *
 * Uso:
 *   node scripts/init-sync-config.mjs
 *
 * Requiere:
 *   SANITY_WRITE_TOKEN en .env.local
 *   NEXT_PUBLIC_SANITY_PROJECT_ID (default 2hojajwk)
 *   NEXT_PUBLIC_SANITY_DATASET (default production)
 */
import { config } from "dotenv";
import { createClient } from "@sanity/client";

config({ path: ".env.local" });

if (!process.env.SANITY_WRITE_TOKEN) {
  console.error("❌ SANITY_WRITE_TOKEN no está en .env.local");
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "2hojajwk",
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET   ?? "production",
  token:     process.env.SANITY_WRITE_TOKEN,
  apiVersion: "2023-01-01",
  useCdn: false,
});

// Wasi-IDs (sin prefijo) que Igor borró durante la dedup-cleanup. El sync
// los recrearía si no estuvieran en esta lista.
const initialExclusions = [
  "7041742", // FINCA Antón duplicado — se conserva wasi-7190723
  "7194460", // Modelo A duplicado — se conserva wasi-8210502
  "9698896", // Modelo K (alquiler) duplicado — se conserva wasi-9951142
];

const doc = {
  _id: "syncConfig",
  _type: "syncConfig",
  excludedWasiIds: initialExclusions,
};

const result = await client.createIfNotExists(doc);

console.log("✓ syncConfig:", result._id);
console.log("  excludedWasiIds:", result.excludedWasiIds ?? []);
console.log(
  result.excludedWasiIds?.length === initialExclusions.length
    ? "  (recién creado con la lista inicial)"
    : "  (ya existía — no se sobrescribió, edita desde Studio si querés modificar)"
);
