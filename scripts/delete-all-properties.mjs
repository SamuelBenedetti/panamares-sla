/**
 * Borra TODAS las propiedades de Sanity.
 * Solo toca Sanity — WASI no se modifica.
 *
 * Dry run (ver qué borraría, sin borrar nada):
 *   node scripts/delete-all-properties.mjs --dry-run
 *
 * Borrar de verdad:
 *   node scripts/delete-all-properties.mjs --confirm
 */

import { createClient } from "@sanity/client";
import { config } from "dotenv";

config({ path: ".env.local" });

const DRY_RUN = process.argv.includes("--dry-run");
const CONFIRM = process.argv.includes("--confirm");

if (!DRY_RUN && !CONFIRM) {
  console.error("\n⚠️  Debes pasar --dry-run o --confirm\n");
  console.error("  Ver qué borraría:   node scripts/delete-all-properties.mjs --dry-run");
  console.error("  Borrar de verdad:   node scripts/delete-all-properties.mjs --confirm\n");
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "2hojajwk",
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET   ?? "production",
  token:     process.env.SANITY_WRITE_TOKEN,
  apiVersion: "2023-01-01",
  useCdn: false,
});

async function main() {
  console.log(`\n${"═".repeat(60)}`);
  console.log(`  Borrar propiedades de Sanity  ${DRY_RUN ? "· DRY RUN" : "· REAL"}`);
  console.log(`${"═".repeat(60)}\n`);

  const properties = await client.fetch(`*[_type == "property"]{ _id, title }`);
  console.log(`🗂  ${properties.length} propiedades encontradas\n`);

  if (properties.length === 0) {
    console.log("Nada que borrar.");
    return;
  }

  for (let i = 0; i < properties.length; i++) {
    const p = properties[i];
    process.stdout.write(`[${String(i + 1).padStart(3)}/${properties.length}] ${p._id.padEnd(30)} ${p.title?.slice(0, 40) ?? ""} `);
    if (DRY_RUN) {
      console.log("(dry)");
    } else {
      await client.delete(p._id);
      console.log("✓ borrado");
    }
  }

  console.log(`\n${"─".repeat(60)}`);
  if (DRY_RUN) {
    console.log(`  DRY RUN — nada fue borrado.`);
    console.log(`  Para borrar de verdad corre: node scripts/delete-all-properties.mjs --confirm`);
  } else {
    console.log(`  ✅ ${properties.length} propiedades borradas de Sanity.`);
  }
  console.log(`${"─".repeat(60)}\n`);
}

main().catch(err => {
  console.error("\n💥 Error:", err.message);
  process.exit(1);
});
