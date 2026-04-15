/**
 * Migración one-shot: re-genera slugs existentes al patrón Tier 4 del brief SEO.
 *
 * Patrón: {tipo-plural}-en-{venta|alquiler}-{barrio}-{wasiId}
 * Ej:     apartamentos-en-venta-punta-pacifica-9833923
 *
 * - Si el doc tiene _id = "wasi-XXXXXXX", deriva wasiId = XXXXXXX.
 * - Si no tiene wasiId, genera uno aleatorio de 7 dígitos (estable — solo se
 *   asigna una vez).
 * - Si el slug actual ya matchea el patrón, lo deja y solo rellena wasiId.
 *
 * Uso:
 *   node scripts/migrate-slugs.mjs --dry-run    (preview, no escribe)
 *   node scripts/migrate-slugs.mjs              (aplica cambios)
 */

import { createClient } from "@sanity/client";

const DRY_RUN = process.argv.includes("--dry-run");

const client = createClient({
  projectId: "2hojajwk",
  dataset: "production",
  token:
    "skY1C2gN11YJqcPWii0DlkWhjdHgmNHIvMpeKuf0ui99uSwlztfjYDCapFilYtAfAKfqeE9hGoCQI9Ju9xW1dZ3tclkrpcnEsOkckKxN6LSShpy5cD2xyXPGjBhLUkgiJwWA6DGDJqAXbCAY2BStgevDXDuS3bOlCUeeFB0IuptPGuhPUxdu",
  apiVersion: "2023-01-01",
  useCdn: false,
});

const ZONE_TO_SLUG = {
  "Punta Pacífica": "punta-pacifica",
  "Punta Paitilla": "punta-paitilla",
  "Avenida Balboa": "avenida-balboa",
  Obarrio: "obarrio",
  "Calle 50": "calle-50",
  "Costa del Este": "costa-del-este",
  Albrook: "albrook",
  "Coco del Mar": "coco-del-mar",
  "Santa María": "santa-maria",
  Marbella: "marbella",
  "El Cangrejo": "el-cangrejo",
  "Altos del Golf": "altos-del-golf",
  "San Francisco": "san-francisco",
  "Vía Porras": "via-porras",
  "Bella Vista": "bella-vista",
  "Condado del Rey": "condado-del-rey",
  Amador: "amador",
  "Los Andes": "los-andes",
  Carrasquilla: "carrasquilla",
  "Loma Alegre": "loma-alegre",
  "Alto del Chase": "alto-del-chase",
  Coronado: "coronado",
  Versalles: "versalles",
  "Río Mar": "rio-mar",
};

function slugify(str) {
  return String(str)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const TIER4_PATTERN = /^[a-z0-9-]+-en-(venta|alquiler)-[a-z0-9-]+-\d+$/;

function extractWasiIdFromDocId(docId) {
  const match = /^wasi-(\d+)$/.exec(docId);
  return match ? parseInt(match[1], 10) : null;
}

const TYPE_SLUG_PLURAL = {
  apartamento: "apartamentos",
  apartaestudio: "apartaestudios",
  casa: "casas",
  "casa de playa": "casas-de-playa",
  penthouse: "penthouses",
  oficina: "oficinas",
  local: "locales-comerciales",
  terreno: "terrenos",
  edificio: "edificios",
  finca: "fincas",
  "lote comercial": "lotes-comerciales",
};

// Detecta el propertyType real desde el slug viejo cuando el schema lo colapsó.
// Ej: "casa-de-playa-en-venta-..." → "casa de playa" aunque en Sanity diga "casa".
function correctPropertyTypeFromOldSlug(oldSlug, currentPropertyType) {
  if (!oldSlug) return currentPropertyType;
  if (oldSlug.startsWith("casa-de-playa-en-")) return "casa de playa";
  if (oldSlug.startsWith("lote-comercial-en-")) return "lote comercial";
  return currentPropertyType;
}

function buildSlug(doc) {
  const typeSlug = TYPE_SLUG_PLURAL[doc.propertyType] ?? slugify(doc.propertyType);
  const intent = doc.businessType === "alquiler" ? "alquiler" : "venta";
  const zoneSlug = ZONE_TO_SLUG[doc.zone] ?? slugify(doc.zone) ?? "panama";
  return `${typeSlug}-en-${intent}-${zoneSlug}-${doc.wasiId}`;
}

async function main() {
  console.log(`\n🔎 Leyendo propiedades de Sanity...`);
  const docs = await client.fetch(`*[_type == "property"] {
    _id, _rev, slug, wasiId, propertyType, businessType, zone
  }`);

  console.log(`📋 ${docs.length} propiedades encontradas\n`);
  if (DRY_RUN) console.log("🔍 DRY RUN — no se escribe en Sanity\n");

  let updated = 0;
  let alreadyOk = 0;
  let failed = 0;

  for (const doc of docs) {
    const currentSlug = doc.slug?.current ?? "(vacío)";
    const label = `${doc._id.padEnd(20)} ${currentSlug.substring(0, 50).padEnd(50)}`;

    // Asegurar wasiId
    let wasiId = doc.wasiId;
    if (!wasiId) {
      const fromDocId = extractWasiIdFromDocId(doc._id);
      wasiId = fromDocId ?? Math.floor(1_000_000 + Math.random() * 9_000_000);
    }

    // Corrige propertyType colapsado por bug del schema (casa de playa, lote comercial)
    const correctedType = correctPropertyTypeFromOldSlug(
      doc.slug?.current,
      doc.propertyType
    );
    const typeChanged = correctedType !== doc.propertyType;

    const newSlug = buildSlug({ ...doc, propertyType: correctedType, wasiId });

    if (currentSlug === newSlug && doc.wasiId === wasiId && !typeChanged) {
      console.log(`${label} → sin cambios`);
      alreadyOk++;
      continue;
    }

    const patch = {
      slug: { _type: "slug", current: newSlug },
      wasiId,
      ...(typeChanged ? { propertyType: correctedType } : {}),
    };

    if (DRY_RUN) {
      console.log(`${label} → ${newSlug}  (dry)`);
      updated++;
      continue;
    }

    try {
      await client.patch(doc._id).set(patch).commit();
      console.log(`${label} → ${newSlug}  ✓`);
      updated++;
    } catch (err) {
      console.log(`${label} ✗ ${err.message}`);
      failed++;
    }
  }

  console.log(`\n${"─".repeat(60)}`);
  console.log(`✅ Actualizados:  ${updated}`);
  console.log(`✓  Ya correctos:  ${alreadyOk}`);
  console.log(`❌ Fallaron:      ${failed}`);
}

main().catch((err) => {
  console.error("\n💥 Error fatal:", err.message);
  process.exit(1);
});
