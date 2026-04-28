/**
 * Auto-populate alt text for gallery images that don't have one.
 *
 * Run:       node scripts/set-gallery-alt.mjs
 * Dry run:   node scripts/set-gallery-alt.mjs --dry-run
 *
 * Required env vars (.env.local):
 *   SANITY_WRITE_TOKEN
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
  useCdn: false,
});

const props = await sanity.fetch(`
  *[_type == "property" && defined(gallery)] {
    _id, title, zone, propertyType,
    "galleryCount": count(gallery),
    gallery[] { _key, alt }
  }
`);

let patched = 0;

for (const prop of props) {
  if (!prop.gallery?.length) continue;

  const missing = prop.gallery.filter(img => !img.alt);
  if (!missing.length) continue;

  const base = [prop.title, prop.zone].filter(Boolean).join(" — ");

  const patch = sanity.patch(prop._id);
  for (const img of missing) {
    const idx = prop.gallery.indexOf(img) + 1;
    const alt = `${base} — foto ${idx}`;
    patch.set({ [`gallery[_key=="${img._key}"].alt`]: alt });
  }

  console.log(`${prop._id}: ${missing.length} imágenes sin alt → "${base} — foto N"`);

  if (!DRY_RUN) {
    await patch.commit();
    patched++;
  }
}

// Also handle mainImage without alt
const mainMissing = await sanity.fetch(`
  *[_type == "property" && defined(mainImage) && !defined(mainImage.alt)] {
    _id, title, zone
  }
`);

for (const prop of mainMissing) {
  const alt = [prop.title, prop.zone].filter(Boolean).join(" — ");
  console.log(`${prop._id}: mainImage sin alt → "${alt}"`);
  if (!DRY_RUN) {
    await sanity.patch(prop._id).set({ "mainImage.alt": alt }).commit();
    patched++;
  }
}

console.log(`\n${DRY_RUN ? "[DRY RUN] " : ""}${patched} documentos actualizados.`);
