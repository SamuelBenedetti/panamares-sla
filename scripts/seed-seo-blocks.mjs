/**
 * Patch seoBlock + avgPricePerM2 for neighborhoods that don't have them.
 * Run:      node scripts/seed-seo-blocks.mjs
 * Dry run:  node scripts/seed-seo-blocks.mjs --dry-run
 * Force:    node scripts/seed-seo-blocks.mjs --force   (overwrite existing)
 */

import { createClient } from "@sanity/client";
import { config } from "dotenv";

config({ path: ".env.local" });

const DRY_RUN = process.argv.includes("--dry-run");
const FORCE   = process.argv.includes("--force");

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

// avgPricePerM2 in USD — estimados basados en listings reales 2024-2025
// Referencia: punta-pacifica $3,200 · santa-maria $2,500 · coronado $1,400
const DATA = {
  "alto-del-chase": {
    avgPricePerM2: 1300,
    seoBlock:
      "Alto del Chase es una urbanización residencial en el norte de Panama City, con casas amplias, calles arboladas y un ambiente familiar alejado del ruido urbano. Ideal para quienes buscan espacio y privacidad dentro del área metropolitana, con acceso rápido a los principales corredores viales de la ciudad.",
  },
  "amador": {
    avgPricePerM2: 2000,
    seoBlock:
      "Amador es la calzada que conecta tres islas históricas con el centro de Panama City, con marinas, restaurantes y vistas panorámicas al Puente de las Américas y la entrada del canal de Panamá. Un entorno único donde la vida frente al mar convive con la energía de la ciudad a apenas minutos del centro financiero.",
  },
  "carrasquilla": {
    avgPricePerM2: 1400,
    seoBlock:
      "Carrasquilla es un barrio residencial y comercial consolidado de Panama City, conocido por su ambiente tranquilo, sus calles con servicios de todo tipo y su excelente conectividad con el resto de la ciudad. Una zona accesible y bien ubicada, muy buscada para primera vivienda o inversión en alquiler a largo plazo.",
  },
  "condado-del-rey": {
    avgPricePerM2: 1400,
    seoBlock:
      "Condado del Rey es una de las urbanizaciones más activas del norte de Panama City, con universidades, centros comerciales y una infraestructura consolidada que la convierten en una zona muy atractiva para familias jóvenes y estudiantes. Propiedades espaciosas a precios competitivos en un entorno de crecimiento sostenido.",
  },
  "loma-alegre": {
    avgPricePerM2: 1300,
    seoBlock:
      "Loma Alegre es un barrio residencial tranquilo en el norte de Panama City, con casas y edificios de apartamentos rodeados de zonas verdes y buena conectividad hacia el centro. Un entorno apacible donde la vida familiar fluye lejos del tráfico intenso, con precios accesibles para quienes buscan amplitud sin salir de la ciudad.",
  },
  "los-andes": {
    avgPricePerM2: 1200,
    seoBlock:
      "Los Andes es un barrio residencial popular de Panama City con una comunidad establecida, comercio de cercanía y fácil acceso a los principales corredores viales de la ciudad. Una zona práctica y accesible para primera vivienda, con una oferta amplia de apartamentos y casas a precios de los más competitivos del mercado.",
  },
  "rio-mar": {
    avgPricePerM2: 1800,
    seoBlock:
      "Río Mar es el complejo residencial de playa más exclusivo del Pacífico central panameño, a unos 100 km de Panama City, con torres frente al Océano Pacífico, acceso directo a la playa y un entorno de resort de alto nivel. La opción preferida para segunda vivienda o alquiler vacacional en la costa pacífica de Panamá.",
  },
  "versalles": {
    avgPricePerM2: 1300,
    seoBlock:
      "Versalles es una urbanización residencial familiar en el norte de Panama City, con casas amplias, parques y un ambiente seguro y tranquilo que la hace muy popular entre familias con hijos. Una zona de crecimiento sostenido con buena oferta de casas a precios más accesibles que las zonas costeras y el centro financiero.",
  },
  "via-porras": {
    avgPricePerM2: 1500,
    seoBlock:
      "Vía Porras es uno de los corredores más transitados del este de Panama City, con apartamentos, locales comerciales y restaurantes a lo largo de una avenida de alta conectividad. Su cercanía con el Corredor Sur, el aeropuerto Tocumen y el parque Omar la convierten en una zona muy demandada para vivir y para alquiler de locales.",
  },
};

async function main() {
  console.log(DRY_RUN ? "🔍 DRY RUN\n" : `🚀 Seeding content${FORCE ? " (--force)" : ""}...\n`);

  const docs = await sanity.fetch(
    `*[_type == "neighborhood" && slug.current in $slugs] { _id, name, "slug": slug.current, seoBlock, avgPricePerM2 }`,
    { slugs: Object.keys(DATA) }
  );
  const docBySlug = Object.fromEntries(docs.map((d) => [d.slug, d]));

  for (const [slug, { avgPricePerM2, seoBlock }] of Object.entries(DATA)) {
    const doc = docBySlug[slug];
    if (!doc) {
      console.warn(`⚠️  No doc for "${slug}" — skipping`);
      continue;
    }

    const patch = {};
    if (!doc.seoBlock || FORCE)   patch.seoBlock = seoBlock;
    if (!doc.avgPricePerM2 || FORCE) patch.avgPricePerM2 = avgPricePerM2;

    if (Object.keys(patch).length === 0) {
      console.log(`⏭️  ${doc.name} — ya tiene todo, saltando`);
      continue;
    }

    const fields = Object.keys(patch).join(" + ");
    console.log(`✏️  ${doc.name}  [${fields}]`);
    if (!DRY_RUN) {
      await sanity.patch(doc._id).set(patch).commit();
      console.log(`   ✅ OK`);
    }
  }

  console.log("\nListo.");
}

main().catch((err) => {
  console.error("❌ Fatal:", err);
  process.exit(1);
});
