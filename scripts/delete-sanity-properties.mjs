/**
 * Elimina TODAS las propiedades del dataset de Sanity.
 *
 * ⚠️  SOLO toca Sanity — cero llamadas a WASI ni a ninguna API externa.
 * ⚠️  Esta acción es irreversible. Úsala antes del sync completo desde WASI.
 *
 * Dry run (solo muestra cuántas borraría, no borra nada):
 *   node scripts/delete-sanity-properties.mjs --dry-run
 *
 * Ejecución real:
 *   node scripts/delete-sanity-properties.mjs
 */

import { createClient } from "@sanity/client";
import { config } from "dotenv";

config({ path: ".env.local" });

const DRY_RUN = process.argv.includes("--dry-run");

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "2hojajwk",
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET   ?? "production",
  token:     process.env.SANITY_WRITE_TOKEN,
  apiVersion: "2023-01-01",
  useCdn:    false,
});

async function main() {
  console.log(`\n${"═".repeat(60)}`);
  console.log(`  Delete Sanity Properties  ${DRY_RUN ? "· DRY RUN (no deletes)" : "· REAL RUN"}`);
  console.log(`${"═".repeat(60)}\n`);

  // Fetch all property IDs — only _id, nothing else
  console.log("🔍 Fetching all property documents from Sanity...");
  const docs = await sanity.fetch(`*[_type == "property"]{ _id }`);
  console.log(`   Found: ${docs.length} properties\n`);

  if (docs.length === 0) {
    console.log("✅ Nothing to delete.");
    return;
  }

  if (DRY_RUN) {
    console.log("🟡 DRY RUN — these would be deleted:");
    docs.slice(0, 10).forEach(d => console.log(`   ${d._id}`));
    if (docs.length > 10) console.log(`   ... and ${docs.length - 10} more`);
    console.log(`\n   Total: ${docs.length} documents (nothing deleted)`);
    return;
  }

  // Delete in batches of 100
  const BATCH = 100;
  let deleted = 0;

  for (let i = 0; i < docs.length; i += BATCH) {
    const batch = docs.slice(i, i + BATCH);
    const tx = sanity.transaction();
    for (const doc of batch) tx.delete(doc._id);
    await tx.commit();
    deleted += batch.length;
    console.log(`   Deleted ${deleted}/${docs.length}...`);
  }

  console.log(`\n✅ Done — ${deleted} properties deleted from Sanity.`);
}

main().catch(err => {
  console.error("\n💥 Fatal:", err.message);
  process.exit(1);
});
