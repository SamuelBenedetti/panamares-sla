/**
 * WASI → Sanity import script
 * Run: node scripts/import-wasi.mjs
 */

import { readFileSync } from "fs";
import { createClient } from "@sanity/client";

const PROJECT_ID = "2hojajwk";
const DATASET = "production";
const TOKEN =
  "skY1C2gN11YJqcPWii0DlkWhjdHgmNHIvMpeKuf0ui99uSwlztfjYDCapFilYtAfAKfqeE9hGoCQI9Ju9xW1dZ3tclkrpcnEsOkckKxN6LSShpy5cD2xyXPGjBhLUkgiJwWA6DGDJqAXbCAY2BStgevDXDuS3bOlCUeeFB0IuptPGuhPUxdu";

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  token: TOKEN,
  apiVersion: "2023-01-01",
  useCdn: false,
});

// ─── CSV parser (no external deps) ──────────────────────────────────────────

function parseCSV(content) {
  const lines = content.split("\n");
  const headers = parseCSVLine(lines[0]);
  const records = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const values = parseCSVLine(line);
    const record = {};
    headers.forEach((h, idx) => {
      record[h.trim()] = (values[idx] ?? "").trim();
    });
    records.push(record);
  }
  return records;
}

function parseCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

// ─── Field helpers ───────────────────────────────────────────────────────────

function parsePrice(str) {
  if (!str) return null;
  const n = parseFloat(str.replace(/[$,\s]/g, ""));
  return isNaN(n) ? null : n;
}

function parseNum(str) {
  if (!str) return null;
  const n = parseFloat(str.trim());
  return isNaN(n) ? null : n;
}

function mapBusinessType(type) {
  return type?.toLowerCase() === "alquiler" ? "alquiler" : "venta";
}

function mapPropertyType(type) {
  const map = {
    Apartamento: "apartamento",
    Apartaestudio: "apartaestudio",
    Casa: "casa",
    "Casa de Playa": "casa",
    Penthouse: "penthouse",
    Oficina: "oficina",
    Local: "local",
    Terreno: "terreno",
    Edificio: "edificio",
    Finca: "finca",
    "Lote Comercial": "lote comercial",
  };
  return map[type] ?? "apartamento";
}

function slugify(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function extractSlugFromUrl(url, id) {
  try {
    const path = new URL(url).pathname.replace(/\//g, "");
    // URL is like /apartamento-alquiler-san-francisco/9836183
    // Take the first segment
    const parts = new URL(url).pathname.split("/").filter(Boolean);
    const base = parts[0] ?? slugify(`wasi-${id}`);
    return `${base}-${id}`;
  } catch {
    return `wasi-${id}`;
  }
}

function buildTitle(row) {
  const type = row.property_type || "Propiedad";
  const intent = row.listing_type === "Alquiler" ? "en Alquiler" : "en Venta";
  const building = row.building_name?.trim();
  const neighborhood = row.neighborhood?.trim() || row.corregimiento?.trim();

  if (building) return `${building} — ${type} ${intent}`;
  if (neighborhood) return `${type} ${intent} en ${neighborhood}`;
  return `${type} ${intent}`;
}

// feat_* → Sanity feature arrays
function mapFeatures(row) {
  const interior = [];
  const building = [];
  const location = [];

  const check = (col) => row[col] === "✓";

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

  return { interior, building, location };
}

// ─── Image upload ─────────────────────────────────────────────────────────────

async function uploadImageFromUrl(imageUrl, filename) {
  try {
    const res = await fetch(imageUrl);
    if (!res.ok) return null;
    const buffer = await res.arrayBuffer();
    const asset = await client.assets.upload("image", Buffer.from(buffer), {
      filename,
      contentType: res.headers.get("content-type") || "image/jpeg",
    });
    return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
  } catch (err) {
    console.warn(`  ⚠ Could not upload image: ${imageUrl} — ${err.message}`);
    return null;
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const csvPath = "C:/Users/sbene/Downloads/PH GT - PANAMARES.csv";
  const content = readFileSync(csvPath, "utf-8");
  const records = parseCSV(content);

  const LIMIT = 20;
  const batch = records.slice(0, LIMIT);
  console.log(`📋 Importing ${batch.length} of ${records.length} properties\n`);

  let success = 0;
  let failed = 0;

  for (let i = 0; i < batch.length; i++) {
    const row = batch[i];
    const id = row.listing_id;
    const title = buildTitle(row);

    process.stdout.write(`[${i + 1}/${records.length}] ${title}... `);

    try {
      const price = parsePrice(row.price_usd);
      if (!price) {
        console.log("⏭ skipped (no price)");
        continue;
      }

      const slug = extractSlugFromUrl(row.url, id);
      const { interior, building, location } = mapFeatures(row);

      // Upload main image
      let mainImage = null;
      if (row.image_url) {
        mainImage = await uploadImageFromUrl(row.image_url, `wasi-${id}.jpg`);
      }

      const doc = {
        _id: `wasi-${id}`,
        _type: "property",
        title,
        slug: { _type: "slug", current: slug },
        businessType: mapBusinessType(row.listing_type),
        propertyType: mapPropertyType(row.property_type),
        listingStatus: "activa",
        price,
        zone: row.neighborhood || row.corregimiento || "",
        province: row.province || "Panamá",
        buildingName: row.building_name || undefined,
        tower: row.tower || undefined,
        model: row.model || undefined,
        floor: parseNum(row.floor) ?? undefined,
        yearBuilt: parseNum(row.year_built) ?? undefined,
        condition: row.condition?.toLowerCase() === "nuevo" ? "nuevo" : row.condition?.trim() ? "usado" : undefined,
        corregimiento: row.corregimiento || undefined,
        bedrooms: parseNum(row.bedrooms) ?? undefined,
        bathrooms: parseNum(row.bathrooms) ?? undefined,
        halfBathrooms: row.half_bath === "Si" ? 1 : undefined,
        area: parseNum(row.area_built_m2) ?? undefined,
        parking: parseNum(row.parking) ?? undefined,
        adminFee: parsePrice(row.admin_fee) ?? undefined,
        featuresInterior: interior.length ? interior : undefined,
        featuresBuilding: building.length ? building : undefined,
        featuresLocation: location.length ? location : undefined,
        featured: false,
        recommended: false,
        fairPrice: false,
        ...(mainImage ? { mainImage } : {}),
      };

      // Remove undefined fields
      Object.keys(doc).forEach((k) => doc[k] === undefined && delete doc[k]);

      await client.createOrReplace(doc);
      console.log("✓");
      success++;
    } catch (err) {
      console.log(`✗ ${err.message}`);
      failed++;
    }
  }

  console.log(`\n✅ Done — ${success} imported, ${failed} failed`);
}

main();
