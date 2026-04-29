/**
 * Seed the 9 neighborhoods missing from Sanity.
 * Run: node scripts/seed-missing-neighborhoods.mjs
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

const NEIGHBORHOODS = [
  {
    slug: "via-porras",
    name: "Vía Porras",
    avgPricePerM2: 1500,
    seoBlock: "Vía Porras es una zona residencial tranquila al este de Panama City, valorada por su acceso rápido al aeropuerto Tocumen y a los principales centros comerciales del este. Ofrece una mezcla de casas y apartamentos a precios más accesibles que el centro, convirtiéndola en una opción atractiva para familias y profesionales que buscan calidad de vida sin alejarse de los servicios esenciales.",
  },
  {
    slug: "condado-del-rey",
    name: "Condado del Rey",
    avgPricePerM2: 1400,
    seoBlock: "Condado del Rey es una urbanización residencial en el norte de Panama City, conocida por sus comunidades cerradas y amplias áreas verdes. Es una zona preferida por familias que buscan tranquilidad, seguridad y espacio, con buena conectividad hacia el centro de la ciudad a través de la Autopista Arraiján-La Chorrera y las vías principales del norte.",
  },
  {
    slug: "amador",
    name: "Amador",
    avgPricePerM2: 2100,
    seoBlock: "Amador es una de las zonas más singulares de Panama City, ubicada en la antigua área de la Zona del Canal. Con vistas panorámicas al Pacífico, al Puente de las Américas y a la entrada del Canal, ofrece un ambiente exclusivo entre marinas, restaurantes y la naturaleza del Parque Natural Metropolitano. Ideal para quienes buscan una residencia diferente con historia y entorno privilegiado.",
  },
  {
    slug: "los-andes",
    name: "Los Andes",
    avgPricePerM2: 1200,
    seoBlock: "Los Andes es un barrio residencial en la periferia norte de Panama City, con buena conectividad hacia el centro y precios accesibles. Es una zona en desarrollo con oferta variada de casas y apartamentos, ideal para compradores que priorizan el presupuesto sin renunciar a la cercanía con los servicios de la ciudad.",
  },
  {
    slug: "carrasquilla",
    name: "Carrasquilla",
    avgPricePerM2: 1600,
    seoBlock: "Carrasquilla es un barrio establecido en el norte de Panama City, reconocido por su ambiente residencial y su ubicación estratégica cerca de universidades, colegios y centros comerciales. Con una buena oferta de apartamentos y casas a precios competitivos, es una de las zonas más buscadas por jóvenes profesionales y familias que valoran la conectividad y los servicios cercanos.",
  },
  {
    slug: "loma-alegre",
    name: "Loma Alegre",
    avgPricePerM2: 1300,
    seoBlock: "Loma Alegre es una zona residencial tranquila en el norte de Panama City, con un entorno familiar y precios asequibles. Su ubicación permite acceder fácilmente a las principales arterias de la ciudad, siendo una alternativa valorada por quienes buscan vivir en un ambiente calmado con buena relación calidad-precio.",
  },
  {
    slug: "alto-del-chase",
    name: "Alto del Chase",
    avgPricePerM2: 1500,
    seoBlock: "Alto del Chase es una comunidad residencial en las alturas del norte de Panama City, con vistas despejadas y un ambiente tranquilo alejado del ruido urbano. Es valorada por su seguridad, sus amplias residencias y su conexión con la naturaleza, siendo una opción preferida por familias que buscan calidad de vida en un entorno más privado.",
  },
  {
    slug: "versalles",
    name: "Versalles",
    avgPricePerM2: 1400,
    seoBlock: "Versalles es una zona residencial en el norte de Panama City con un perfil familiar y tranquilo. Ofrece casas y apartamentos a precios accesibles con buena conexión hacia el centro financiero de la ciudad. Es una opción valorada por quienes buscan vivir fuera del bullicio del centro manteniendo la comodidad urbana.",
  },
  {
    slug: "rio-mar",
    name: "Río Mar",
    avgPricePerM2: 1800,
    seoBlock: "Río Mar es una zona costera ubicada en el Pacífico panameño, a menos de dos horas de Panama City. Reconocida por sus playas y su ambiente relajado, ofrece casas y apartamentos de playa ideales para residencia vacacional o inversión turística. Es una de las zonas playeras más accesibles para panameños y extranjeros que buscan una segunda residencia frente al mar.",
  },
];

async function run() {
  console.log("🏙️  Seeding missing neighborhoods in Sanity...\n");

  for (const nbh of NEIGHBORHOODS) {
    const docId = `neighborhood-${nbh.slug}`;

    const existing = await client.fetch(
      `*[_type == "neighborhood" && slug.current == $slug][0]._id`,
      { slug: nbh.slug }
    );

    if (existing) {
      await client.patch(existing).set({
        avgPricePerM2: nbh.avgPricePerM2,
        seoBlock: nbh.seoBlock,
      }).commit();
      console.log(`✅ Updated: ${nbh.name}`);
    } else {
      await client.createOrReplace({
        _id:   docId,
        _type: "neighborhood",
        name:  nbh.name,
        slug:  { _type: "slug", current: nbh.slug },
        avgPricePerM2: nbh.avgPricePerM2,
        seoBlock: nbh.seoBlock,
      });
      console.log(`🆕 Created: ${nbh.name}`);
    }
  }

  console.log("\n✨ Done.");
}

run().catch(err => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
