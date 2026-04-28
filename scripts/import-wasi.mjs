/**
 * XLSX → Sanity import script
 * Run: node scripts/import-wasi.mjs
 * Optional: node scripts/import-wasi.mjs --dry-run   (preview without writing)
 */

import { createClient } from "@sanity/client";
import { createRequire } from "module";
import { config } from "dotenv";

config({ path: ".env.local" });

const require = createRequire(import.meta.url);
const XLSX = require("xlsx");

const DRY_RUN = process.argv.includes("--dry-run");
const XLSX_PATH = process.argv.find(a => a.startsWith("--file="))?.split("=")[1] ?? "data.xlsx";
const SHEET_NAME = "PANAMARES";

const missing = ["NEXT_PUBLIC_SANITY_PROJECT_ID", "SANITY_WRITE_TOKEN"].filter(k => !process.env[k]);
if (missing.length) {
  console.error(`\n❌ Missing env vars: ${missing.join(", ")}`);
  console.error("   Add them to .env.local and retry.\n");
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  token: process.env.SANITY_WRITE_TOKEN,
  apiVersion: "2023-01-01",
  useCdn: false,
});

// ─── SEO slug maps (from SEO Information Architecture doc) ───────────────────

// Appendix A — type slug PLURAL for Tier 4 URL
// Brief example: /propiedades/apartamentos-en-venta-punta-pacifica-9833923/
const TYPE_SLUG_MAP = {
  Apartamento: "apartamentos",
  Apartaestudio: "apartaestudios",
  Casa: "casas",
  "Casa de Playa": "casas-de-playa",
  Penthouse: "penthouses",
  Oficina: "oficinas",
  Local: "locales-comerciales",
  Terreno: "terrenos",
  "Lote Comercial": "lotes-comerciales",
  "Lote / Terreno": "lotes-comerciales",
  Edificio: "edificios",
  Finca: "fincas",
};

// Appendix B — neighborhood slug
const NEIGHBORHOOD_SLUG_MAP = {
  "Punta Pacífica": "punta-pacifica",
  "Punta Pacifica": "punta-pacifica",
  "Punta Paitilla": "punta-paitilla",
  "Avenida Balboa": "avenida-balboa",
  Obarrio: "obarrio",
  "Calle 50": "calle-50",
  "Coco Del Mar": "coco-del-mar",
  "Coco del Mar": "coco-del-mar",
  "Costa Del Este": "costa-del-este",
  "Costa del Este": "costa-del-este",
  Albrook: "albrook",
  "Santa María": "santa-maria",
  Marbella: "marbella",
  "El Cangrejo": "el-cangrejo",
  "Altos Del Golf": "altos-del-golf",
  "Altos del Golf": "altos-del-golf",
  "San Francisco": "san-francisco",
  "Via Porras": "via-porras",
  "Vía Porras": "via-porras",
  "Bella Vista": "bella-vista",
  "Condado Del Rey": "condado-del-rey",
  "Condado del Rey": "condado-del-rey",
  Amador: "amador",
  "Los Andes": "los-andes",
  Carrasquilla: "carrasquilla",
  "Loma Alegre": "loma-alegre",
  "Alto del Chase": "alto-del-chase",
  "Alto Del Chase": "alto-del-chase",
  Coronado: "coronado",
  Versalles: "versalles",
  "Rio Mar": "rio-mar",
  "Río Mar": "rio-mar",
  // Outside Panama City — fallback slugify
};

// ─── Zone normalization ───────────────────────────────────────────────────────
// Maps Wasi corregimiento/neighborhood values to the Sanity zone options

const ZONE_MAP = {
  "San Francisco": "San Francisco",
  "Punta Pacífica": "Punta Pacífica",
  "Punta Pacifica": "Punta Pacífica",
  Marbella: "Marbella",
  "Avenida Balboa": "Avenida Balboa",
  Albrook: "Albrook",
  "Punta Paitilla": "Punta Paitilla",
  "Altos Del Golf": "Altos del Golf",
  "Altos del Golf": "Altos del Golf",
  "El Cangrejo": "El Cangrejo",
  "Coco Del Mar": "Coco del Mar",
  "Coco del Mar": "Coco del Mar",
  "Condado Del Rey": "Condado del Rey",
  "Condado del Rey": "Condado del Rey",
  Obarrio: "Obarrio",
  "Calle 50": "Calle 50",
  "Los Andes": "Los Andes",
  Carrasquilla: "Carrasquilla",
  "Rio Mar": "Río Mar",
  "Río Mar": "Río Mar",
  "Via Porras": "Vía Porras",
  "Vía Porras": "Vía Porras",
  "Santa María": "Santa María",
  Amador: "Amador",
  "Loma Alegre": "Loma Alegre",
  "Costa Del Este": "Costa del Este",
  "Costa del Este": "Costa del Este",
  "Alto del Chase": "Alto del Chase",
  Coronado: "Coronado",
  "Bella Vista": "Bella Vista",
  Versalles: "Versalles",
};

// ─── Field helpers ────────────────────────────────────────────────────────────

function parseNum(val) {
  if (val === null || val === undefined || val === "") return null;
  const n = parseFloat(String(val).replace(/[$,\s]/g, ""));
  return isNaN(n) ? null : n;
}

function mapBusinessType(type) {
  return String(type).toLowerCase() === "alquiler" ? "alquiler" : "venta";
}

function mapPropertyType(type) {
  const map = {
    Apartamento: "apartamento",
    Apartaestudio: "apartaestudio",
    Casa: "casa",
    "Casa de Playa": "casa de playa",
    Penthouse: "penthouse",
    Oficina: "oficina",
    Local: "local",
    Terreno: "terreno",
    "Lote / Terreno": "terreno",
    Edificio: "edificio",
    Finca: "finca",
    "Lote Comercial": "lote comercial",
  };
  return map[type] ?? "apartamento";
}

function mapCondition(val) {
  if (!val) return undefined;
  const v = String(val).toLowerCase();
  if (v === "nuevo") return "nuevo";
  if (v === "usado") return "usado";
  if (v.includes("plano")) return "en_planos";
  if (v.includes("construc")) return "en_construccion";
  return "usado";
}

function slugify(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function buildSlug(row) {
  // Pattern from SEO doc: {type-slug}-en-{intent}-{neighborhood-slug}-{listing_id}
  // e.g. apartamento-en-venta-punta-pacifica-9833923
  const typeSlug = TYPE_SLUG_MAP[row.property_type] || slugify(row.property_type || "propiedad");
  const intent = String(row.listing_type).toLowerCase() === "alquiler" ? "alquiler" : "venta";
  const zone = String(row.neighborhood || row.corregimiento || "").trim();
  const neighborhoodSlug = NEIGHBORHOOD_SLUG_MAP[zone] || slugify(zone) || "panama";
  const id = row.listing_id;
  return `${typeSlug}-en-${intent}-${neighborhoodSlug}-${id}`;
}

function buildTitle(row) {
  const type = row.property_type || "Propiedad";
  const intent = String(row.listing_type).toLowerCase() === "alquiler" ? "en Alquiler" : "en Venta";
  const building = String(row.building_name || "").trim();
  const zone = String(row.neighborhood || row.corregimiento || "").trim();

  if (building) return `${building} — ${type} ${intent}`;
  if (zone) return `${type} ${intent} en ${zone}`;
  return `${type} ${intent}`;
}

function mapFeatures(row) {
  const check = (col) => row[col] === "✓";
  const interior = [];
  const building = [];
  const location = [];

  // Interior
  if (check("feat_air_conditioning")) interior.push("Aire acondicionado");
  if (check("feat_furnished")) interior.push("Amueblado");
  if (check("feat_equipped_kitchen")) interior.push("Cocina equipada");
  if (check("feat_built_in_closets")) interior.push("Closets empotrados");
  if (check("feat_balcony")) interior.push("Balcón");
  if (check("feat_terrace")) interior.push("Terraza");
  if (check("feat_service_room")) interior.push("Cuarto de servicio");
  if (check("feat_panoramic_view")) interior.push("Vista panorámica");
  if (check("feat_water_heater")) interior.push("Calentador de agua");
  if (check("feat_gas_line")) interior.push("Línea de gas");
  if (check("feat_internet")) interior.push("Internet");
  if (check("feat_intercom")) interior.push("Intercomunicador");
  if (check("feat_laundry_area")) interior.push("Área de lavandería");
  if (check("feat_garden")) interior.push("Jardín");
  if (check("feat_pets_allowed")) interior.push("Mascotas permitidas");
  if (check("feat_ceramic_marble_floors")) interior.push("Pisos de mármol");

  // Building
  if (check("feat_pool")) building.push("Piscina");
  if (check("feat_gym")) building.push("Gimnasio");
  if (check("feat_security")) building.push("Concierge / Portería 24h");
  if (check("feat_bbq_grill")) building.push("BBQ / Área de asados");
  if (check("feat_business_center")) building.push("Business center");
  if (check("feat_backup_generator")) building.push("Generador eléctrico");
  if (check("feat_elevator")) building.push("Ascensor");
  if (check("feat_visitor_parking")) building.push("Estacionamiento de visitas");
  if (check("feat_storage_unit") || check("feat_storage_room")) building.push("Bodega / Storage");
  if (check("feat_jacuzzi")) building.push("Spa / Sauna");
  if (check("feat_kids_area")) building.push("Área de juegos infantiles");
  if (check("feat_guard_gate")) building.push("Garita de seguridad");
  if (check("feat_lobby_reception")) building.push("Lobby / Recepción");
  if (check("feat_sports_areas")) building.push("Áreas deportivas");
  if (check("feat_green_areas")) building.push("Áreas verdes");
  if (check("feat_social_area")) building.push("Área social");
  if (check("feat_basketball_court")) building.push("Cancha de basketball");
  if (check("feat_soccer_field")) building.push("Cancha de fútbol");
  if (check("feat_multipurpose_room")) building.push("Salón multiusos");
  if (check("feat_community_hall")) building.push("Salón comunal");

  // Location
  if (check("feat_gated_community")) location.push("Comunidad cerrada / Gated");
  if (check("feat_near_shopping_malls")) location.push("Cerca de centros comerciales");
  if (check("feat_near_parks")) location.push("Cerca de parques");
  if (check("feat_near_urban_area")) location.push("Cerca de zona urbana");
  if (check("feat_commercial_zone")) location.push("Zona comercial");
  if (check("feat_tourist_area")) location.push("Zona turística");
  if (check("feat_near_public_transit")) location.push("Cerca del metro");
  if (check("feat_residential_zone")) location.push("Zona residencial tranquila");

  return { interior, building, location };
}

// ─── Image upload ─────────────────────────────────────────────────────────────

async function uploadImage(imageUrl, filename) {
  try {
    const res = await fetch(imageUrl, { signal: AbortSignal.timeout(15000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = await res.arrayBuffer();
    const asset = await client.assets.upload("image", Buffer.from(buffer), {
      filename,
      contentType: res.headers.get("content-type") || "image/jpeg",
    });
    return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
  } catch (err) {
    console.warn(`    ⚠ Image upload failed: ${err.message}`);
    return null;
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n📂 Reading ${XLSX_PATH}...`);
  const wb = XLSX.readFile(XLSX_PATH);
  const ws = wb.Sheets[SHEET_NAME];
  const rows = XLSX.utils.sheet_to_json(ws);

  // Normalize column names (trim spaces)
  const records = rows.map((row) => {
    const clean = {};
    for (const [k, v] of Object.entries(row)) clean[k.trim()] = v;
    return clean;
  });

  console.log(`📋 ${records.length} properties found`);
  if (DRY_RUN) console.log("🔍 DRY RUN — nothing will be written to Sanity\n");
  else console.log("🚀 Importing to Sanity...\n");

  let success = 0;
  let skipped = 0;
  let failed = 0;
  const unmappedZones = new Set();

  for (let i = 0; i < records.length; i++) {
    const row = records[i];
    const id = row.listing_id;
    const title = buildTitle(row);

    process.stdout.write(`[${String(i + 1).padStart(3)}/${records.length}] ${title.substring(0, 60).padEnd(60)} `);

    const price = parseNum(row.price_usd);
    if (!price) {
      console.log("⏭ skip (no price)");
      skipped++;
      continue;
    }

    const rawZone = String(row.neighborhood || row.corregimiento || "").trim();
    const zone = ZONE_MAP[rawZone] || rawZone;
    if (!ZONE_MAP[rawZone] && rawZone) unmappedZones.add(rawZone);

    const { interior, building, location } = mapFeatures(row);
    const slug = buildSlug(row);

    const doc = {
      _id: `wasi-${id}`,
      _type: "property",
      title,
      slug: { _type: "slug", current: slug },
      wasiId: typeof id === "number" ? id : parseInt(String(id), 10) || undefined,
      businessType: mapBusinessType(row.listing_type),
      propertyType: mapPropertyType(row.property_type),
      listingStatus: "activa",
      price,
      zone,
      province: row.province || "Panamá",
      ...(row.building_name ? { buildingName: String(row.building_name).trim() } : {}),
      ...(row.tower ? { tower: String(row.tower).trim() } : {}),
      ...(row.model ? { model: String(row.model).trim() } : {}),
      ...(parseNum(row.floor) !== null ? { floor: parseNum(row.floor) } : {}),
      ...(parseNum(row.year_built) !== null ? { yearBuilt: parseNum(row.year_built) } : {}),
      ...(mapCondition(row.condition) ? { condition: mapCondition(row.condition) } : {}),
      ...(row.corregimiento ? { corregimiento: String(row.corregimiento).trim() } : {}),
      ...(parseNum(row.bedrooms) !== null ? { bedrooms: parseNum(row.bedrooms) } : {}),
      ...(parseNum(row.bathrooms) !== null ? { bathrooms: parseNum(row.bathrooms) } : {}),
      ...(row.half_bath === "Si" ? { halfBathrooms: 1 } : {}),
      ...(parseNum(row.area_built_m2) !== null ? { area: parseNum(row.area_built_m2) } : {}),
      ...(parseNum(row.parking) !== null ? { parking: parseNum(row.parking) } : {}),
      ...(parseNum(row.admin_fee) !== null ? { adminFee: parseNum(row.admin_fee) } : {}),
      ...(interior.length ? { featuresInterior: interior } : {}),
      ...(building.length ? { featuresBuilding: building } : {}),
      ...(location.length ? { featuresLocation: location } : {}),
      featured: false,
      recommended: false,
      fairPrice: false,
    };

    if (DRY_RUN) {
      console.log("✓ (dry)");
      success++;
      continue;
    }

    try {
      // Upload main image
      if (row.image_url) {
        const img = await uploadImage(String(row.image_url), `wasi-${id}.jpg`);
        if (img) doc.mainImage = img;
      }

      await client.createOrReplace(doc);
      console.log("✓");
      success++;
    } catch (err) {
      console.log(`✗ ${err.message}`);
      failed++;
    }
  }

  console.log(`\n${"─".repeat(60)}`);
  console.log(`✅ Imported:  ${success}`);
  console.log(`⏭  Skipped:  ${skipped}`);
  console.log(`❌ Failed:   ${failed}`);

  if (unmappedZones.size > 0) {
    console.log(`\n⚠ Zones not in Sanity schema (stored as-is):`);
    for (const z of unmappedZones) console.log(`   - ${z}`);
  }
}

main().catch((err) => {
  console.error("\n💥 Fatal error:", err.message);
  process.exit(1);
});
