/**
 * Elimina el campo `about` de todos los documentos neighborhood en Sanity.
 * Run: node scripts/remove-about-field.mjs
 */
import { createClient } from "@sanity/client";
import { config } from "dotenv";

config({ path: ".env.local" });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "2hojajwk",
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET   ?? "production",
  token:     process.env.SANITY_WRITE_TOKEN,
  apiVersion: "2024-01-01",
  useCdn:    false,
});

const docs = await client.fetch(`*[_type == "neighborhood" && defined(about)]{ _id, name }`);
console.log(`Found ${docs.length} neighborhood(s) with 'about' field\n`);

for (const doc of docs) {
  await client.patch(doc._id).unset(["about"]).commit();
  console.log(`✅ Removed 'about' from: ${doc.name}`);
}

console.log("\n✨ Done.");
