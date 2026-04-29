/**
 * Upload neighborhood card images from /public to Sanity and patch photo field.
 *
 * Run:       node scripts/upload-neighborhood-images.mjs
 * Dry run:   node scripts/upload-neighborhood-images.mjs --dry-run
 *
 * Required env (.env.local):
 *   SANITY_WRITE_TOKEN
 */

import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

config({ path: ".env.local" });

const DRY_RUN = process.argv.includes("--dry-run");

if (!process.env.SANITY_WRITE_TOKEN) {
  console.error("❌ Missing SANITY_WRITE_TOKEN in .env.local");
  process.exit(1);
}

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "2hojajwk",
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET   ?? "production",
  token:     process.env.SANITY_WRITE_TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = resolve(__dirname, "../public");

const SLUG_TO_NAME = {
  "punta-pacifica":  "Punta Pacífica",
  "punta-paitilla":  "Punta Paitilla",
  "avenida-balboa":  "Avenida Balboa",
  "costa-del-este":  "Costa del Este",
  "obarrio":         "Obarrio",
  "calle-50":        "Calle 50",
  "san-francisco":   "San Francisco",
  "bella-vista":     "Bella Vista",
  "albrook":         "Albrook",
  "coco-del-mar":    "Coco del Mar",
  "santa-maria":     "Santa María",
  "marbella":        "Marbella",
  "el-cangrejo":     "El Cangrejo",
  "altos-del-golf":  "Altos del Golf",
  "via-porras":      "Via Porras",
  "condado-del-rey": "Condado del Rey",
  "amador":          "Amador",
  "los-andes":       "Los Andes",
  "carrasquilla":    "Carrasquilla",
  "loma-alegre":     "Loma Alegre",
  "alto-del-chase":  "Alto del Chase",
  "coronado":        "Coronado",
  "versalles":       "Versalles",
  "rio-mar":         "Río Mar",
};

const SLUG_TO_FILE = {
  "punta-pacifica":  "card-punta-pacifica.png",
  "punta-paitilla":  "card-punta-paitilla.png",
  "avenida-balboa":  "card-avenida-balboa.png",
  "costa-del-este":  "card-costa-del-este.png",
  "obarrio":         "card-obarrio.png",
  "calle-50":        "card-calle-50.png",
  "san-francisco":   "card-san-francisco.png",
  "bella-vista":     "card-bella-vista.png",
  "albrook":         "card-albrook.png",
  "coco-del-mar":    "card-coco-del-mar.png",
  "santa-maria":     "card-santa-maria.png",
  "marbella":        "card-marbella.png",
  "el-cangrejo":     "card-el-cangrejo.png",
  "altos-del-golf":  "card-altos-del-golf.png",
  "via-porras":      "card-via-porras.png",
  "condado-del-rey": "card-condado-del-rey.png",
  "amador":          "card-amador.png",
  "los-andes":       "card-los-andes.png",
  "carrasquilla":    "card-carrasquilla.png",
  "loma-alegre":     "card-loma-alegre.png",
  "alto-del-chase":  "card-alto-del-chase.png",
  "coronado":        "card-coronado.png",
  "versalles":       "card-versalles.png",
  "rio-mar":         "card-rio-mar.png",
};

async function main() {
  console.log(DRY_RUN ? "🔍 DRY RUN — no changes will be made\n" : "🚀 Starting upload...\n");

  // Fetch all neighborhood docs from Sanity
  const docs = await sanity.fetch(
    `*[_type == "neighborhood"]{ _id, "slug": slug.current, name }`
  );
  const docBySlug = Object.fromEntries(docs.map((d) => [d.slug, d]));

  let uploaded = 0, skipped = 0, missing = 0;

  for (const [slug, filename] of Object.entries(SLUG_TO_FILE)) {
    const filePath = resolve(PUBLIC_DIR, filename);

    if (!existsSync(filePath)) {
      console.warn(`⚠️  File not found: public/${filename}`);
      missing++;
      continue;
    }

    let doc = docBySlug[slug];
    const docName = doc?.name ?? SLUG_TO_NAME[slug] ?? slug;
    const docId   = doc?._id ?? `neighborhood-${slug}`;

    console.log(`📤 ${slug} → ${filename}${!doc ? " (creating doc)" : ""}`);

    if (DRY_RUN) {
      uploaded++;
      continue;
    }

    const buffer = readFileSync(filePath);
    const asset = await sanity.assets.upload("image", buffer, {
      filename,
      contentType: "image/png",
    });

    const photo = {
      _type: "image",
      asset: { _type: "reference", _ref: asset._id },
      alt: docName,
    };

    if (!doc) {
      await sanity.createIfNotExists({
        _id:   docId,
        _type: "neighborhood",
        name:  docName,
        slug:  { _type: "slug", current: slug },
        photo,
      });
      console.log(`   ✅ Created + photo: ${docName} (${docId})`);
    } else {
      await sanity.patch(docId).set({ photo }).commit();
      console.log(`   ✅ Patched ${docName} (${docId})`);
    }
    uploaded++;
  }

  console.log(`\nDone: ${uploaded} uploaded, ${skipped} skipped, ${missing} missing`);
}

main().catch((err) => {
  console.error("❌ Fatal:", err);
  process.exit(1);
});
