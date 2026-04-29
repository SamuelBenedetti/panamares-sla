/**
 * Seed neighborhood content in Sanity for the 4 main barrios.
 *
 * Run: node scripts/seed-neighborhoods.mjs
 *
 * Required env vars (.env.local):
 *   SANITY_WRITE_TOKEN
 *   NEXT_PUBLIC_SANITY_PROJECT_ID
 *   NEXT_PUBLIC_SANITY_DATASET
 */

import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../.env.local") });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  token:     process.env.SANITY_WRITE_TOKEN,
  apiVersion: "2024-01-01",
  useCdn:    false,
});

const NEIGHBORHOODS = [
  {
    slug: "punta-pacifica",
    name: "Punta Pacífica",
    avgPricePerM2: 3200,
    seoBlock:
      "Punta Pacífica es la zona más exclusiva de Panama City. Sus rascacielos frente al Océano Pacífico albergan apartamentos de lujo, penthouses y residencias de alto standing con vistas panorámicas inigualables. El barrio es conocido por el icónico JW Marriott y por la Trump Ocean Club, y está a pocos minutos del Hospital Punta Pacífica —afiliado a Johns Hopkins—, el mejor centro médico de la región. Vivir aquí significa acceder a una comunidad internacional, amenidades de primer nivel y una de las ubicaciones más codiciadas del istmo.",
  },
  {
    slug: "punta-paitilla",
    name: "Punta Paitilla",
    avgPricePerM2: 2900,
    seoBlock:
      "Punta Paitilla es una de las zonas residenciales más consolidadas y valoradas de Panama City. Ubicada en una pequeña península con vistas al mar y al skyline de la ciudad, ofrece una mezcla singular de apartamentos de lujo y oficinas corporativas en un entorno tranquilo y bien conectado. A minutos de Calle 50, el corazón financiero de Panamá, es la elección predilecta de ejecutivos, diplomáticos e inversores que buscan combinar ubicación estratégica con calidad de vida. Su mercado inmobiliario es estable y con alta demanda histórica.",
  },
  {
    slug: "avenida-balboa",
    name: "Avenida Balboa",
    avgPricePerM2: 2600,
    seoBlock:
      "Avenida Balboa es el boulevard costero más icónico de Panama City. Sus torres residenciales bordean la Cinta Costera y ofrecen vistas directas a la Bahía de Panamá, con el skyline de la ciudad de fondo. Es una de las ubicaciones más demandadas tanto para vivir como para invertir, gracias a su conexión inmediata con el Casco Antiguo, el centro financiero y los principales restaurantes y parques de la ciudad. Los apartamentos aquí combinan diseño contemporáneo, servicios completos y una vida urbana vibrante a pasos del mar.",
  },
  {
    slug: "costa-del-este",
    name: "Costa del Este",
    avgPricePerM2: 2400,
    seoBlock:
      "Costa del Este es el barrio planificado más moderno del este de Panama City. Sus amplias avenidas, urbanizaciones cerradas y parques bien mantenidos lo convierten en la opción favorita de familias, ejecutivos y expatriados que buscan un entorno seguro y de alta calidad. Cuenta con colegios internacionales, centros comerciales, restaurantes y clínicas de primer nivel. La oferta inmobiliaria es variada: desde apartamentos contemporáneos hasta casas y oficinas corporativas, todo en un ambiente que equilibra la tranquilidad residencial con la proximidad al centro de negocios de la ciudad.",
  },
];

async function run() {
  console.log("🏙️  Seeding neighborhood content in Sanity...\n");

  for (const nbh of NEIGHBORHOODS) {
    const docId = `neighborhood-${nbh.slug}`;

    // Check if document already exists
    const existing = await client.fetch(
      `*[_type == "neighborhood" && slug.current == $slug][0]._id`,
      { slug: nbh.slug }
    );

    if (existing) {
      // Patch existing document
      await client
        .patch(existing)
        .set({
          avgPricePerM2: nbh.avgPricePerM2,
          seoBlock:      nbh.seoBlock,
        })
        .commit();
      console.log(`✅ Updated: ${nbh.name} (${existing})`);
    } else {
      // Create new document
      await client.createOrReplace({
        _id:   docId,
        _type: "neighborhood",
        name:  nbh.name,
        slug:  { _type: "slug", current: nbh.slug },
        avgPricePerM2: nbh.avgPricePerM2,
        seoBlock:      nbh.seoBlock,
      });
      console.log(`🆕 Created: ${nbh.name} (${docId})`);
    }
  }

  console.log("\n✨ Done.");
}

run().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
