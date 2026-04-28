/**
 * WASI API → Sanity sync script
 *
 * Run:           node scripts/sync-wasi.mjs
 * Dry run:       node scripts/sync-wasi.mjs --dry-run
 * Limit:         node scripts/sync-wasi.mjs --limit=10
 * Single prop:   node scripts/sync-wasi.mjs --id=9836183
 *
 * Required env vars (.env.local):
 *   WASI_ID_COMPANY   numeric ID from wasi.co → Configuración → Ajustes generales → Wasi API
 *   WASI_TOKEN        token from same screen
 *   SANITY_WRITE_TOKEN  already in .env.local
 *
 * WASI is READ-ONLY here. This script only calls GET endpoints.
 * It writes exclusively to Sanity (createIfNotExists + patch).
 * featured is synced from WASI id_status_on_page === 3 ("Outstanding") on every run.
 * Manual fields in Sanity (recommended, fairPrice, rented) are never overwritten.
 * Agent is sourced from WASI id_user and updated automatically on every sync.
 */

import { createClient } from "@sanity/client";
import { config } from "dotenv";

config({ path: ".env.local" });

const DRY_RUN   = process.argv.includes("--dry-run");
const SINGLE_ID = process.argv.find(a => a.startsWith("--id="))?.split("=")[1];
const LIMIT_ARG = process.argv.find(a => a.startsWith("--limit="))?.split("=")[1];
const LIMIT     = LIMIT_ARG ? parseInt(LIMIT_ARG, 10) : Infinity;
const BATCH     = 5; // parallel detail fetches

// ── Validate env ──────────────────────────────────────────────────────────────

const missing = ["WASI_ID_COMPANY", "WASI_TOKEN", "SANITY_WRITE_TOKEN"].filter(k => !process.env[k]);
if (missing.length) {
  console.error(`\n❌ Missing env vars: ${missing.join(", ")}`);
  console.error("   Add them to .env.local and retry.\n");
  process.exit(1);
}

// ── Clients ───────────────────────────────────────────────────────────────────

const WASI_BASE = "https://api.wasi.co/v1";
const wCreds    = () => `id_company=${process.env.WASI_ID_COMPANY}&wasi_token=${process.env.WASI_TOKEN}`;

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "2hojajwk",
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET   ?? "production",
  token:     process.env.SANITY_WRITE_TOKEN,
  apiVersion: "2023-01-01",
  useCdn: false,
});

// ── Maps (same as import-wasi.mjs, kept in sync) ─────────────────────────────

const TYPE_SLUG_PLURAL = {
  "apartamento":    "apartamentos",
  "apartaestudio":  "apartaestudios",
  "casa":           "casas",
  "casa de playa":  "casas-de-playa",
  "penthouse":      "penthouses",
  "oficina":        "oficinas",
  "local":          "locales-comerciales",
  "terreno":        "terrenos",
  "lote comercial": "lotes-comerciales",
  "edificio":       "edificios",
  "finca":          "fincas",
};

// Maps WASI id_property_type → Sanity propertyType.
// Full catalog from GET /v1/property-type/all (fetched 2026-04-21).
const WASI_TYPE_ID = {
  1:  "casa",
  2:  "apartamento",
  3:  "local",
  4:  "oficina",
  5:  "terreno",
  6:  "lote comercial",
  7:  "finca",
  8:  "local",          // Bodega
  10: "casa",           // Chalet
  11: "casa",           // Casa de campo
  12: "edificio",       // Hoteles
  13: "finca",          // Finca - Hoteles
  14: "apartaestudio",
  15: "oficina",        // Consultorio
  16: "edificio",
  17: "terreno",        // Lote de Playa
  18: "edificio",       // Hostal
  19: "apartamento",    // Condominio
  20: "casa",           // Dúplex
  21: "penthouse",
  22: "casa",           // Bungalow
  23: "local",          // Galpon Industrial
  24: "casa de playa",
  25: "apartamento",    // Piso
  26: "local",          // Garaje
  27: "finca",          // Cortijo
  28: "casa",           // Cabaña
  29: "terreno",        // Isla
  30: "local",          // Nave Industrial
  31: "finca",          // Campos, Chacras y Quintas
  32: "terreno",        // Terreno ← el que faltaba
  33: "penthouse",      // Ph
};

// Maps WASI type label strings (lowercase) → Sanity propertyType
const WASI_TYPE_LABEL = {
  "apartamento":              "apartamento",
  "apartaestudio":            "apartaestudio",
  "studio":                   "apartaestudio",
  "piso":                     "apartamento",
  "condominio":               "apartamento",
  "casa":                     "casa",
  "duplex":                   "casa",
  "dúplex":                   "casa",
  "chalet":                   "casa",
  "bungalow":                 "casa",
  "cabaña":                   "casa",
  "cabana":                   "casa",
  "casa de campo":            "casa",
  "casa de playa":            "casa de playa",
  "beach house":              "casa de playa",
  "lote de playa":            "terreno",
  "penthouse":                "penthouse",
  "ph":                       "penthouse",
  "oficina":                  "oficina",
  "office":                   "oficina",
  "consultorio":              "oficina",
  "local":                    "local",
  "local comercial":          "local",
  "bodega":                   "local",
  "galpon industrial":        "local",
  "galpón industrial":        "local",
  "nave industrial":          "local",
  "garaje":                   "local",
  "terreno":                  "terreno",
  "lote":                     "terreno",
  "lote / terreno":           "terreno",
  "lote comercial":           "lote comercial",
  "isla":                     "terreno",
  "campos, chacras y quintas":"finca",
  "edificio":                 "edificio",
  "hoteles":                  "edificio",
  "hostal":                   "edificio",
  "finca":                    "finca",
  "finca - hoteles":          "finca",
  "cortijo":                  "finca",
};

const ZONE_MAP = {
  "Punta Pacífica":   "Punta Pacífica",
  "Punta Pacifica":   "Punta Pacífica",
  "Punta Paitilla":   "Punta Paitilla",
  "Avenida Balboa":   "Avenida Balboa",
  "Obarrio":          "Obarrio",
  "Calle 50":         "Calle 50",
  "Coco Del Mar":     "Coco del Mar",
  "Coco del Mar":     "Coco del Mar",
  "Costa Del Este":   "Costa del Este",
  "Costa del Este":   "Costa del Este",
  "Albrook":          "Albrook",
  "Santa María":      "Santa María",
  "Santa Maria":      "Santa María",
  "Marbella":         "Marbella",
  "El Cangrejo":      "El Cangrejo",
  "Altos Del Golf":   "Altos del Golf",
  "Altos del Golf":   "Altos del Golf",
  "San Francisco":    "San Francisco",
  "Via Porras":       "Vía Porras",
  "Vía Porras":       "Vía Porras",
  "Bella Vista":      "Bella Vista",
  "Condado Del Rey":  "Condado del Rey",
  "Condado del Rey":  "Condado del Rey",
  "Amador":           "Amador",
  "Los Andes":        "Los Andes",
  "Carrasquilla":     "Carrasquilla",
  "Loma Alegre":      "Loma Alegre",
  "Alto del Chase":   "Alto del Chase",
  "Alto Del Chase":   "Alto del Chase",
  "Coronado":         "Coronado",
  "Versalles":        "Versalles",
  "Rio Mar":          "Río Mar",
  "Río Mar":          "Río Mar",
};

const ZONE_TO_SLUG = {
  "Punta Pacífica":  "punta-pacifica",
  "Punta Paitilla":  "punta-paitilla",
  "Avenida Balboa":  "avenida-balboa",
  "Obarrio":         "obarrio",
  "Calle 50":        "calle-50",
  "Costa del Este":  "costa-del-este",
  "Albrook":         "albrook",
  "Coco del Mar":    "coco-del-mar",
  "Santa María":     "santa-maria",
  "Marbella":        "marbella",
  "El Cangrejo":     "el-cangrejo",
  "Altos del Golf":  "altos-del-golf",
  "San Francisco":   "san-francisco",
  "Vía Porras":      "via-porras",
  "Bella Vista":     "bella-vista",
  "Condado del Rey": "condado-del-rey",
  "Amador":          "amador",
  "Los Andes":       "los-andes",
  "Carrasquilla":    "carrasquilla",
  "Loma Alegre":     "loma-alegre",
  "Alto del Chase":  "alto-del-chase",
  "Coronado":        "coronado",
  "Versalles":       "versalles",
  "Río Mar":         "rio-mar",
};

// ── Field helpers ─────────────────────────────────────────────────────────────

function parseNum(v) {
  if (v === null || v === undefined || v === "") return null;
  const n = parseFloat(String(v).replace(/[$,\s]/g, ""));
  return isNaN(n) ? null : n;
}

function slugify(str) {
  return String(str)
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function mapPropertyType(prop) {
  // Base type from WASI label or numeric ID
  const labelRaw = prop.property_type_label ?? prop.tipo_inmueble ?? prop.property_type ?? "";
  const label = String(labelRaw).toLowerCase().trim();
  let base = (label && WASI_TYPE_LABEL[label])
    ? WASI_TYPE_LABEL[label]
    : (prop.id_property_type && WASI_TYPE_ID[prop.id_property_type])
      ? WASI_TYPE_ID[prop.id_property_type]
      : "apartamento";

  const title = String(prop.title ?? "").toLowerCase();
  const obs   = String(prop.observations ?? prop.descripcion ?? "").toLowerCase();
  const beds  = parseNum(prop.bedrooms) ?? 0;

  // ── Auto-corrections ──────────────────────────────────────────────────────

  // Terreno con recámaras → es una casa, WASI lo clasificó mal
  if (base === "terreno" && beds >= 1) {
    base = "casa";
  }

  // Apartamento/casa con 0 recámaras → apartaestudio
  if ((base === "apartamento" || base === "casa") && beds === 0) {
    base = "apartaestudio";
  }

  // Título contiene PH o Penthouse → penthouse
  if (/\bph\b|penthouse/i.test(prop.title ?? "")) {
    base = "penthouse";
  }

  // Casa con "playa" en título o descripción → casa de playa
  if (base === "casa" && /playa|beach/i.test(title + " " + obs)) {
    base = "casa de playa";
  }

  return base;
}

function mapBusinessType(prop) {
  // WASI returns booleans as strings "true"/"false"
  const forRent = prop.for_rent === true || prop.for_rent === "true" || prop.for_rent === 1;
  if (forRent) return "alquiler";
  return "venta";
}

function mapListingStatus(prop) {
  // WASI returns id_availability as a string e.g. "1"
  // avail=3 means "Rented" — keep visible with rented badge, not hidden
  const avail = Number(prop.id_availability ?? 0);
  if (avail === 1) return "activa";
  if (avail === 2) return "vendida";
  if (avail === 3) return "activa";
  return avail ? "retirada" : "activa";
}

function mapRented(prop) {
  return Number(prop.id_availability ?? 0) === 3;
}

function mapCondition(prop) {
  const raw = String(prop.condition ?? prop.id_condition ?? "").toLowerCase();
  if (raw.includes("nuevo")   || raw === "1") return "nuevo";
  if (raw.includes("plano")   || raw === "3") return "en_planos";
  if (raw.includes("construc")|| raw === "4") return "en_construccion";
  if (raw.includes("usado")   || raw === "2") return "usado";
  return undefined;
}

function normalizeZone(raw) {
  if (!raw) return undefined;
  const s = String(raw).trim();
  return ZONE_MAP[s] ?? s;
}

function buildSlug(wasiId, propertyType, businessType, zone) {
  const typeSlug = TYPE_SLUG_PLURAL[propertyType] ?? slugify(propertyType || "propiedad");
  const intent   = businessType === "alquiler" ? "alquiler" : "venta";
  const zoneSlug = ZONE_TO_SLUG[zone] ?? slugify(zone || "panama");
  return `${typeSlug}-en-${intent}-${zoneSlug}-${wasiId}`;
}

function extractBuildingFromWasiTitle(raw) {
  if (!raw) return null;
  let s = String(raw).trim()
    .toLowerCase()
    .replace(/\b\w/g, c => c.toUpperCase());

  const PREFIXES = [
    /^Se Alquila\s+/i, /^Se Vende\s+/i, /^En Venta\s+/i,
    /^En Alquiler\s+/i, /^Alquiler En\s+/i, /^Alquiler\s+/i,
    /^Venta En\s+/i, /^Venta\s+/i,
  ];
  // Two passes: prefix → type → prefix again (handles "Apartamento en Venta en X")
  for (const p of PREFIXES) s = s.replace(p, "");
  s = s.replace(/^(Apartamento|Penthouse|Casa De Playa|Casa|Oficina|Local|Terreno|Studio|Apartaestudio|Edificio|Finca)\s+/i, "");
  for (const p of PREFIXES) s = s.replace(p, "");
  s = s.replace(/^En\s+/i, "");

  // Restore common all-caps acronyms lowered by title-case
  s = s.replace(/\bPh\b/g, "PH").replace(/\bOk\b/g, "OK");

  return s.trim() || null;
}

function buildTitle(prop, propertyType, businessType, zone) {
  const typeLabel = {
    "apartamento":   "Apartamento", "apartaestudio": "Apartaestudio",
    "casa":          "Casa",        "casa de playa": "Casa de Playa",
    "penthouse":     "Penthouse",   "oficina":       "Oficina",
    "local":         "Local",       "terreno":       "Terreno",
    "lote comercial":"Lote Comercial","edificio":    "Edificio",
    "finca":         "Finca",
  }[propertyType] ?? "Propiedad";
  const intent   = businessType === "alquiler" ? "en Alquiler" : "en Venta";
  const building = String(prop.building_name ?? prop.edificio ?? "").trim()
                   || extractBuildingFromWasiTitle(prop.title);
  if (building) return `${building} — ${typeLabel} ${intent}`;
  if (zone)     return `${typeLabel} ${intent} en ${zone}`;
  return `${typeLabel} ${intent}`;
}

function decodeHtmlEntities(s) {
  return s
    .replace(/&ntilde;/gi, "ñ").replace(/&Ntilde;/gi, "Ñ")
    .replace(/&aacute;/gi, "á").replace(/&eacute;/gi, "é")
    .replace(/&iacute;/gi, "í").replace(/&oacute;/gi, "ó")
    .replace(/&uacute;/gi, "ú").replace(/&uuml;/gi,   "ü")
    .replace(/&Aacute;/gi, "Á").replace(/&Eacute;/gi, "É")
    .replace(/&Iacute;/gi, "Í").replace(/&Oacute;/gi, "Ó")
    .replace(/&Uacute;/gi, "Ú")
    .replace(/&amp;/gi, "&").replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">").replace(/&quot;/gi, '"')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&nbsp;/gi, " ");
}

function textToPortableText(text) {
  if (!text) return undefined;
  const raw = String(text).trim();
  if (!raw) return undefined;

  const isHtml = /<[a-z][\s\S]*?>/i.test(raw);
  const blocks = [];

  if (isHtml) {
    // Extract each <p>…</p> block
    const pTags = [...raw.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)];
    const chunks = pTags.length ? pTags.map(m => m[1]) : [raw];

    for (let i = 0; i < chunks.length; i++) {
      const inner = chunks[i];
      const isBold = /<strong>/i.test(inner);
      const plain  = decodeHtmlEntities(inner.replace(/<[^>]+>/g, "")).trim();
      if (!plain) continue;
      blocks.push({
        _type: "block", _key: `p${i}`, style: "normal", markDefs: [],
        children: [{ _type: "span", _key: `s${i}`, text: plain, marks: isBold ? ["strong"] : [] }],
      });
    }
  } else {
    raw.split(/\n{2,}/).filter(p => p.trim()).forEach((para, i) => {
      blocks.push({
        _type: "block", _key: `p${i}`, style: "normal", markDefs: [],
        children: [{ _type: "span", _key: `s${i}`, text: para.replace(/\n/g, " ").trim(), marks: [] }],
      });
    });
  }

  return blocks.length ? blocks : undefined;
}

// Complete WASI feature catalog mapped by ID → { cat, label }.
// cat: "interior" | "building" | "location" | null (null = skip).
// Source: GET /v1/feature/all (fetched 2026-04-21).
const WASI_FEATURE_MAP = {
  // ── Internal features ───────────────────────────────────────────────────────
  1:   { cat: "interior", label: "Aire acondicionado" },
  2:   { cat: "interior", label: "Alarma" },
  4:   { cat: "interior", label: "Amueblado" },
  5:   { cat: "interior", label: "Balcón" },
  6:   { cat: "interior", label: "Baño auxiliar" },
  7:   { cat: "interior", label: "Estudio / biblioteca" },
  8:   { cat: "interior", label: "Cuarto de servicio" },
  9:   { cat: "interior", label: "Hall de alcobas" },
  10:  { cat: "interior", label: "Sauna" },
  11:  { cat: "interior", label: "Vista panorámica" },
  12:  { cat: "interior", label: "Calentador de agua" },
  13:  { cat: "interior", label: "Chimenea" },
  14:  { cat: "interior", label: "Intercomunicador" },
  15:  { cat: "interior", label: "Barra americana" },
  16:  { cat: "interior", label: "Cocina integral" },
  17:  { cat: "interior", label: "Cocina tipo americano" },
  18:  { cat: "interior", label: "Comedor auxiliar" },
  19:  { cat: "interior", label: "Línea de gas" },
  20:  { cat: "interior", label: "Área de lavandería" },
  21:  { cat: "interior", label: "Depósito" },
  22:  { cat: "interior", label: "Despensa" },
  23:  { cat: "interior", label: "Cuarto de conductores" },
  24:  { cat: "interior", label: "Pisos de cerámica / mármol" },
  74:  null,                                              // Hospedaje turismo (metadata)
  82:  { cat: "interior", label: "Baño en suite" },
  84:  { cat: "interior", label: "Closets empotrados" },
  85:  { cat: "interior", label: "Cocina equipada" },
  86:  { cat: "interior", label: "Doble ventana" },
  93:  null,                                              // Bifamiliar (clasificación colombiana)
  94:  null,                                              // Unifamiliar
  95:  null,                                              // Trifamiliar
  96:  null,                                              // Adosado
  97:  { cat: "interior", label: "Reformado / Renovado" },
  98:  { cat: "interior", label: "Closets empotrados" }, // alias de 84, se deduplica
  99:  { cat: "interior", label: "Baño turco" },
  100: { cat: "interior", label: "Jacuzzi" },
  103: { cat: "interior", label: "Trastero" },
  104: { cat: "interior", label: "Mascotas permitidas" },
  107: { cat: "interior", label: "Pisos laminados" },
  108: { cat: "interior", label: "Pisos de madera" },
  109: null,                                              // Inmueble de lujo (metadata)
  112: { cat: "interior", label: "TV por cable" },
  113: { cat: "interior", label: "Internet" },
  115: { cat: "interior", label: "Sala de usos múltiples" },
  116: null,                                              // Agua (implícito)
  117: { cat: "interior", label: "Puerta de seguridad" },
  118: null,                                              // Electricidad (implícito)
  126: { cat: "interior", label: "Extractor de cocina" },
  127: { cat: "interior", label: "Horno" },
  128: { cat: "interior", label: "Lavaplatos" },
  129: { cat: "interior", label: "Vestidor" },
  130: { cat: "interior", label: "Control de ruido" },
  131: { cat: "interior", label: "Control térmico" },
  132: { cat: "interior", label: "Detector de humo" },
  133: { cat: "interior", label: "Puerta eléctrica" },
  140: { cat: "interior", label: "Altillo / Mezzanine" },

  // ── External features ───────────────────────────────────────────────────────
  25:  { cat: "building",  label: "Cancha de squash" },
  26:  { cat: "building",  label: "Cancha de tenis" },
  27:  { cat: "building",  label: "Áreas deportivas" },
  28:  { cat: "building",  label: "Gimnasio" },
  29:  { cat: "building",  label: "Jardín" },
  30:  { cat: "building",  label: "Patio" },
  31:  { cat: "building",  label: "Jaula de golf" },
  32:  { cat: "building",  label: "Piscina" },
  33:  { cat: "building",  label: "Área de juegos infantiles" },
  34:  { cat: "building",  label: "Áreas verdes" },
  35:  null,                                              // Garaje (campo de estacionamiento)
  36:  { cat: "building",  label: "Business center" },
  37:  { cat: "building",  label: "Estacionamiento de visitas" },
  38:  { cat: "building",  label: "Sala de internet" },
  39:  { cat: "building",  label: "Salón comunal" },
  40:  { cat: "building",  label: "Terraza comunal" },
  41:  null,                                              // Vivienda bifamiliar
  42:  null,                                              // Vivienda multifamiliar
  43:  { cat: "building",  label: "Concierge / Portería 24h" },
  44:  { cat: "building",  label: "Ascensor" },
  45:  { cat: "building",  label: "Circuito cerrado de TV" },
  46:  { cat: "location",  label: "Comunidad cerrada / Gated" },
  47:  { cat: "building",  label: "Generador eléctrico" },
  48:  { cat: "building",  label: "Vigilancia 24h" },
  49:  { cat: "location",  label: "Acceso pavimentado" },
  50:  { cat: "location",  label: "Cerca de zona urbana" },
  51:  null,                                              // Kiosko
  52:  { cat: "location",  label: "Río / quebrada cercano" },
  53:  null,                                              // Árboles frutales (rural)
  54:  null,                                              // Bosque nativos (rural)
  55:  null,                                              // Cochera / garaje (campo de estacionamiento)
  56:  null,                                              // Establo (rural)
  57:  null,                                              // Galpón (rural)
  58:  null,                                              // Invernadero (rural)
  59:  null,                                              // Pesebrera (rural)
  60:  null,                                              // Pozo de agua natural (rural)
  61:  null,                                              // Sistema de riego (rural)
  62:  { cat: "building",  label: "Cancha de basketball" },
  63:  { cat: "building",  label: "Cancha de fútbol" },
  64:  null,                                              // Zona camping
  65:  { cat: "location",  label: "Sobre vía principal" },
  66:  null,                                              // Zona campestre
  67:  { cat: "location",  label: "Zona comercial" },
  68:  null,                                              // Zona industrial
  69:  { cat: "location",  label: "Zona residencial tranquila" },
  70:  { cat: "location",  label: "Cerca de colegios" },
  71:  { cat: "location",  label: "Transporte público cercano" },
  72:  { cat: "location",  label: "Cerca de parques" },
  73:  { cat: "location",  label: "Cerca de centros comerciales" },
  75:  { cat: "location",  label: "Cerca de playa" },
  76:  { cat: "location",  label: "Zona turística" },
  77:  null,                                              // Calles de tosca (rural)
  78:  { cat: "building",  label: "Área social" },
  79:  { cat: "location",  label: "Lago cercano" },
  80:  { cat: "building",  label: "Garita de seguridad" },
  81:  null,                                              // Vivienda unifamiliar
  87:  { cat: "location",  label: "Zona de montaña" },
  88:  { cat: "building",  label: "Club social" },
  89:  null,                                              // Bungalow / pareado
  90:  { cat: "building",  label: "Bodega / Storage" },
  91:  { cat: "building",  label: "Pista de pádel" },
  92:  { cat: "building",  label: "BBQ / Área de asados" },
  101: { cat: "location",  label: "Laguna cercana" },
  102: { cat: "building",  label: "Club house" },
  105: null,                                              // Ubicación interior (metadata)
  106: null,                                              // Ubicación exterior (metadata)
  110: { cat: "building",  label: "Edificio inteligente" },
  111: { cat: "building",  label: "Jardín de techo" },
  114: { cat: "building",  label: "Acceso para discapacitados" },
  119: { cat: "location",  label: "Centro médico cercano" },
  120: { cat: "location",  label: "Cerca de colegios" },  // alias de 70, se deduplica
  121: null,                                              // Cerca a parque industrial
  122: { cat: "location",  label: "Cerca de restaurantes" },
  123: null,                                              // Cerca a tiendas de barrio
  124: { cat: "interior",  label: "Luz en la mañana" },
  125: { cat: "interior",  label: "Luz en la tarde" },
  134: null,                                              // Shut de basura (infraestructura)
  135: { cat: "building",  label: "Energía solar" },
  136: null,                                              // Tanques de agua
  137: { cat: "building",  label: "Acceso con tarjetas" },
  138: null,                                              // Bahias de parqueo (campo de estacionamiento)
  139: { cat: "building",  label: "Parqueadero inteligente" },
};

// Maps WASI features to Sanity feature arrays using the ID-based catalog above.
function mapFeaturesFromTags(features) {
  const interior = [], building = [], location = [];

  let tags = [];
  if (features && typeof features === "object" && !Array.isArray(features)) {
    tags = [
      ...(Array.isArray(features.internal) ? features.internal : []),
      ...(Array.isArray(features.external) ? features.external : []),
    ];
  } else if (Array.isArray(features)) {
    tags = features;
  }
  if (tags.length === 0) return { interior, building, location };

  for (const tag of tags) {
    const mapping = WASI_FEATURE_MAP[tag.id];
    if (!mapping) continue; // null = skip, undefined = unknown ID
    if (mapping.cat === "interior") interior.push(mapping.label);
    else if (mapping.cat === "building") building.push(mapping.label);
    else if (mapping.cat === "location") location.push(mapping.label);
  }

  return { interior, building, location };
}

// ── Image upload ──────────────────────────────────────────────────────────────

// filename → asset _id, populated once in main() before the sync loop
const assetCache = new Map();

async function preloadAssetCache() {
  const assets = await sanity.fetch(
    `*[_type == "sanity.imageAsset" && string::startsWith(originalFilename, "wasi-")]{ _id, originalFilename }`
  );
  for (const a of assets) assetCache.set(a.originalFilename, a._id);
}

async function uploadImage(url, filename) {
  const cached = assetCache.get(filename);
  if (cached) return { _type: "image", asset: { _type: "reference", _ref: cached } };

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = await res.arrayBuffer();
    const asset  = await sanity.assets.upload("image", Buffer.from(buffer), {
      filename,
      contentType: res.headers.get("content-type") || "image/jpeg",
    });
    assetCache.set(filename, asset._id);
    return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
  } catch (err) {
    console.warn(`    ⚠ Image failed (${filename}): ${err.message}`);
    return null;
  }
}

// ── WASI API calls (GET only — never modifies WASI data) ──────────────────────

async function wasiGet(path, params = "") {
  const url = `${WASI_BASE}${path}?${wCreds()}${params ? "&" + params : ""}`;
  const res  = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!res.ok) throw new Error(`WASI ${path} → HTTP ${res.status}`);
  const data = await res.json();
  if (data.status !== "success") {
    throw new Error(`WASI error: ${data.message ?? JSON.stringify(data).slice(0, 120)}`);
  }
  return data;
}

async function fetchAllWasiIds() {
  const ids  = [];
  let skip   = 0;
  let total  = Infinity;

  while (ids.length < total) {
    const data  = await wasiGet(`/property/search`, `scope=1&take=100&skip=${skip}&short=true`);
    const props = Object.entries(data)
      .filter(([k, v]) => /^\d+$/.test(k) && v?.id_property)
      .map(([, v]) => v);

    if (props.length === 0) break;
    ids.push(...props.map(p => p.id_property));
    total = Number(data.total ?? data.Total ?? ids.length);
    skip += 100;
  }
  return ids;
}

async function fetchWasiDetail(id) {
  return wasiGet(`/property/get/${id}`, "");
}

// ── Sanity helpers ────────────────────────────────────────────────────────────

async function fetchSanityWasiMap() {
  const rows = await sanity.fetch(
    `*[_type == "property" && string::startsWith(_id, "wasi-")]{ _id, listingStatus }`
  );
  return new Map(rows.map(r => [r._id, r.listingStatus]));
}

// ── Build Sanity doc from WASI property ───────────────────────────────────────

async function buildWasiFields(prop) {
  const wasiId       = typeof prop.id_property === "number"
    ? prop.id_property
    : parseInt(String(prop.id_property), 10);

  const propertyType  = mapPropertyType(prop);
  const businessType  = mapBusinessType(prop);
  const listingStatus = mapListingStatus(prop);

  const rawZone = String(prop.zone_label ?? prop.neighborhood ?? prop.barrio ?? "").trim();
  const zone    = normalizeZone(rawZone) ?? rawZone;

  const price = parseNum(
    businessType === "alquiler"
      ? (prop.rent_price  ?? prop.price)
      : (prop.sale_price  ?? prop.price)
  );
  if (!price) return null;

  const fields = {
    title:  buildTitle(prop, propertyType, businessType, zone),
    slug:   { _type: "slug", current: buildSlug(wasiId, propertyType, businessType, zone) },
    wasiId,
    businessType,
    propertyType,
    listingStatus,
    featured: Number(prop.id_status_on_page) === 3,
    rented: mapRented(prop),
    price,
    zone:     zone || "Panamá",
    province: String(prop.province ?? prop.provincia ?? "Panamá").trim(),

    ...(prop.building_name                                ? { buildingName:  String(prop.building_name).trim() } : {}),
    ...(prop.tower                                        ? { tower:         String(prop.tower).trim() }         : {}),
    ...(prop.model                                        ? { model:         String(prop.model).trim() }         : {}),
    ...(parseNum(prop.floor) !== null                     ? { floor:         parseNum(prop.floor) }              : {}),
    ...(parseNum(prop.building_date) !== null             ? { yearBuilt:     parseNum(prop.building_date) }      : {}),
    ...(mapCondition(prop)                                ? { condition:     mapCondition(prop) }                 : {}),
    ...(prop.location_label                               ? { corregimiento: String(prop.location_label).trim() }: {}),
    ...(parseNum(prop.bedrooms) !== null                  ? { bedrooms:      parseNum(prop.bedrooms) }           : {}),
    ...(parseNum(prop.bathrooms) !== null                 ? { bathrooms:     parseNum(prop.bathrooms) }          : {}),
    ...(parseNum(prop.half_bathrooms) !== null            ? { halfBathrooms: parseNum(prop.half_bathrooms) }     : {}),
    ...(parseNum(prop.garages) !== null                   ? { parking:       parseNum(prop.garages) }            : {}),
    ...(parseNum(prop.built_area ?? prop.area) !== null   ? { area:          parseNum(prop.built_area ?? prop.area) } : {}),
    ...(parseNum(prop.maintenance_fee) !== null           ? { adminFee:      parseNum(prop.maintenance_fee) }    : {}),
    ...(prop.latitude && prop.longitude                   ? { location: {
          _type: "geopoint",
          lat:   parseFloat(prop.latitude),
          lng:   parseFloat(prop.longitude),
        }} : {}),
  };

  // Agent — link to wasi-agent-{id_user} if WASI provides one
  if (prop.id_user) {
    fields.agent = { _type: "reference", _ref: `wasi-agent-${prop.id_user}` };
  }

  // Description → Portable Text
  const pt = textToPortableText(prop.observations ?? prop.descripcion ?? "");
  if (pt) fields.description = pt;

  // Features — WASI returns {internal:[{nombre}], external:[{nombre}]}
  const { interior, building, location: locFeats } = mapFeaturesFromTags(
    prop.features ?? prop.tags ?? prop.characteristics ?? {}
  );
  if (interior.length)  fields.featuresInterior  = [...new Set(interior)];
  if (building.length)  fields.featuresBuilding  = [...new Set(building)];
  if (locFeats.length)  fields.featuresLocation  = [...new Set(locFeats)];

  // Images — only if not dry run
  if (!DRY_RUN) {
    // main_image can be a string URL or an object {url, url_big, url_original}
    const mainRaw = prop.main_image ?? prop.imagen_principal ?? prop.thumbnail;
    const mainUrl = typeof mainRaw === "string"
      ? mainRaw
      : (mainRaw?.url_big ?? mainRaw?.url ?? mainRaw?.url_original ?? null);
    if (mainUrl) {
      const img = await uploadImage(mainUrl, `wasi-${wasiId}-main.jpg`);
      if (img) fields.mainImage = img;
    }

    // galleries is [{0:{url,url_big,...}, 1:{...}, id:xxx}] — extract numeric keys
    const galleriesRaw = prop.galleries ?? prop.photos ?? prop.gallery ?? prop.images ?? [];
    const photos = [];
    for (const galleryGroup of (Array.isArray(galleriesRaw) ? galleriesRaw : [])) {
      for (const [k, v] of Object.entries(galleryGroup)) {
        if (/^\d+$/.test(k) && v?.url) photos.push(v);
      }
    }
    if (photos.length > 0) {
      const gallery = [];
      for (let i = 0; i < Math.min(photos.length, 20); i++) {
        const url = photos[i].url_big ?? photos[i].url ?? photos[i].url_original;
        if (!url) continue;
        const img = await uploadImage(url, `wasi-${wasiId}-${i + 1}.jpg`);
        if (img) gallery.push(img);
      }
      if (gallery.length > 0) fields.gallery = gallery;
    }
  }

  return { _id: `wasi-${wasiId}`, fields };
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n${"═".repeat(60)}`);
  console.log(`  WASI → Sanity Sync  ${DRY_RUN ? "· DRY RUN (no writes)" : ""}${isFinite(LIMIT) ? `  · LIMIT=${LIMIT}` : ""}`);
  console.log(`${"═".repeat(60)}\n`);

  // 1. Fetch WASI property IDs
  process.stdout.write("📡 Fetching WASI listings...");
  let wasiIds;
  if (SINGLE_ID) {
    wasiIds = [parseInt(SINGLE_ID, 10)];
    console.log(` testing single ID ${SINGLE_ID}`);
  } else {
    wasiIds = await fetchAllWasiIds();
    if (isFinite(LIMIT)) wasiIds = wasiIds.slice(0, LIMIT);
    console.log(` ${wasiIds.length} found${isFinite(LIMIT) ? ` (limited to ${LIMIT})` : ""}`);
  }

  // 2. Fetch existing Sanity state
  process.stdout.write("🗂  Fetching Sanity state...");
  const sanityMap  = await fetchSanityWasiMap();
  const wasiIdSet  = new Set(wasiIds.map(id => `wasi-${id}`));
  console.log(` ${sanityMap.size} existing docs`);

  if (!DRY_RUN) {
    process.stdout.write("🖼️  Loading asset cache...");
    await preloadAssetCache();
    console.log(` ${assetCache.size} images already in Sanity\n`);
  } else {
    console.log("");
  }

  let created = 0, updated = 0, skipped = 0, failed = 0, deactivated = 0;
  const unmappedTypes = new Set();
  const zonesFound = new Map(); // raw zone → normalized (or null if not in ZONE_MAP)

  // 3. Sync each property (sequential to keep logs readable)
  for (let i = 0; i < wasiIds.length; i++) {
    const id    = wasiIds[i];
    const docId = `wasi-${id}`;
    const isNew = !sanityMap.has(docId);
    const label = `[${String(i + 1).padStart(3)}/${wasiIds.length}] ${docId}`;

    process.stdout.write(`${label.padEnd(35)} `);

    try {
      const detail = await fetchWasiDetail(id);

      // Log raw response on --id single-test so we can see field names
      if (SINGLE_ID) {
        console.log("\n\n── Raw WASI response ──────────────────────────────");
        console.log(JSON.stringify(detail, null, 2));
        console.log("───────────────────────────────────────────────────\n");
      }

      // Track zones for dry-run report
      const rawZone = String(detail.zone_label ?? detail.neighborhood ?? detail.barrio ?? "").trim();
      if (rawZone) zonesFound.set(rawZone, ZONE_MAP[rawZone] ?? null);

      const result = await buildWasiFields(detail);
      if (!result) {
        console.log("⏭  skip (no price)");
        skipped++;
        continue;
      }

      const { _id, fields } = result;

      if (!DRY_RUN) {
        // Create with manual-field defaults if new
        await sanity.createIfNotExists({
          _id,
          _type:       "property",
          recommended: false,
          fairPrice:   false,
          rented:      false,
        });
        // Patch WASI-sourced fields (includes featured from id_status_on_page, rented from id_availability)
        // Never touches recommended/fairPrice
        await sanity.patch(_id).set(fields).commit();
      }

      console.log(isNew ? "✨ created" : "✓  updated");
      isNew ? created++ : updated++;
    } catch (err) {
      console.log(`✗  ${err.message.slice(0, 55)}`);
      failed++;
    }
  }

  // 4. Mark removed properties as retirada
  if (!SINGLE_ID) {
    console.log("\n🔍 Checking for removed properties...");
    for (const [sanityId, status] of sanityMap.entries()) {
      if (!wasiIdSet.has(sanityId) && status === "activa") {
        process.stdout.write(`   Deactivating ${sanityId}... `);
        if (!DRY_RUN) {
          await sanity.patch(sanityId).set({ listingStatus: "retirada" }).commit();
        }
        console.log("✓");
        deactivated++;
      }
    }
  }

  // 5. Summary
  console.log(`\n${"─".repeat(60)}`);
  if (DRY_RUN) console.log("  (DRY RUN — nothing was written)");
  console.log(`  ✨ Created:     ${created}`);
  console.log(`  ✓  Updated:     ${updated}`);
  console.log(`  ⏭  Skipped:     ${skipped}`);
  console.log(`  🔴 Deactivated: ${deactivated}`);
  console.log(`  ❌ Failed:      ${failed}`);
  console.log(`${"─".repeat(60)}\n`);

  // 6. Zone report (always shown, critical when dry-run)
  if (zonesFound.size > 0) {
    console.log(`${"─".repeat(60)}`);
    console.log("  Zonas encontradas en WASI\n");
    const mapped   = [...zonesFound.entries()].filter(([, v]) => v !== null).sort(([a], [b]) => a.localeCompare(b));
    const unmapped = [...zonesFound.entries()].filter(([, v]) => v === null).sort(([a], [b]) => a.localeCompare(b));
    for (const [raw, normalized] of mapped)   console.log(`  ✓ ${raw.padEnd(30)} → ${normalized}`);
    for (const [raw] of unmapped)              console.log(`  ⚠ ${raw.padEnd(30)} → SIN MAPEAR (llegará tal cual)`);
    console.log(`${"─".repeat(60)}\n`);
  }
}

main().catch(err => {
  console.error("\n💥 Fatal:", err.message);
  process.exit(1);
});
