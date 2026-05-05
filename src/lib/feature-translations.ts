/**
 * Read-time ES → EN translation map for legacy free-form feature strings on
 * `property` docs (`featuresInterior`, `featuresBuilding`, `featuresLocation`).
 *
 * Why this exists
 * ───────────────
 * Properties have two parallel feature systems:
 *
 *   1. Legacy (what 123 production properties use today): three free-form
 *      `string[]` fields populated by the Wasi sync.
 *   2. Catalog (PR-C): `featuresInternal[]` / `featuresExternal[]` references
 *      to a `feature` doc type with `labelI18n`. Infrastructure exists but is
 *      not yet populated — the migration is a content lift Igor will own
 *      post-launch.
 *
 * To unblock Igor's pre-launch EN content review without forcing the catalog
 * migration first, we translate the legacy strings at render time on EN routes.
 * The map below covers every unique string surfaced by
 * `scripts/audit-property-features.mjs` (snapshot in
 * `tasks/feature-audit-output.json`).
 *
 * How to extend
 * ─────────────
 * 1. Re-run `node scripts/audit-property-features.mjs`. The audit output is
 *    committed; diff against the previous snapshot to see new strings.
 * 2. Add the new ES → EN pair below. Keep keys grouped by category for
 *    readability, but order does not affect lookup.
 * 3. If a string cannot be translated safely, omit it — `localizeFeature` falls
 *    back to the original ES string. Better to ship ES on EN than empty.
 *
 * Lookup is case- and whitespace-sensitive. Wasi normalizes the strings server
 * side, so we don't lower-case here either.
 */

export const FEATURE_TRANSLATIONS_ES_TO_EN: Record<string, string> = {
  // ── Interior ─────────────────────────────────────────────────────────────
  "Aire acondicionado": "Air conditioning",
  "Closets empotrados": "Built-in closets",
  "Área de lavandería": "Laundry area",
  "Baño en suite": "En-suite bathroom",
  "Cocina equipada": "Equipped kitchen",
  "Baño auxiliar": "Half bathroom",
  "Pisos de cerámica / mármol": "Ceramic / marble floors",
  "Vista panorámica": "Panoramic view",
  "Balcón": "Balcony",
  "Calentador de agua": "Water heater",
  "Línea de gas": "Gas line",
  "Cuarto de servicio": "Maid's room",
  "Trastero": "Storage room",
  "Hall de alcobas": "Bedroom hallway",
  "Amueblado": "Furnished",
  "Internet": "Internet",
  "Sala de usos múltiples": "Multi-purpose room",
  "Comedor auxiliar": "Breakfast nook",
  "Mascotas permitidas": "Pets allowed",
  "Intercomunicador": "Intercom",
  "Jacuzzi": "Jacuzzi",
  "Depósito": "Storage",
  "Despensa": "Pantry",
  "Sauna": "Sauna",
  "Alarma": "Alarm",
  "Estudio / biblioteca": "Study / library",
  "Cocina integral": "Built-in kitchen",
  "Reformado / Renovado": "Remodeled / renovated",
  "Barra americana": "Breakfast bar",
  "Luz en la mañana": "Morning light",
  "Luz en la tarde": "Afternoon light",
  "Puerta de seguridad": "Security door",
  "Cocina tipo americano": "Open kitchen",
  "Horno": "Oven",
  "Doble ventana": "Double-glazed windows",
  "Baño turco": "Steam room",
  "Cuarto de conductores": "Driver's room",
  "Pisos laminados": "Laminate floors",
  "Extractor de cocina": "Range hood",
  "Lavaplatos": "Dishwasher",
  "Pisos de madera": "Hardwood floors",
  "TV por cable": "Cable TV",
  "Altillo / Mezzanine": "Loft / mezzanine",
  "Chimenea": "Fireplace",
  "Control de ruido": "Soundproofing",
  "Detector de humo": "Smoke detector",
  "Puerta eléctrica": "Electric door",
  "Vestidor": "Walk-in closet",
  "Control térmico": "Climate control",

  // ── Building amenities ───────────────────────────────────────────────────
  "Estacionamiento de visitas": "Visitor parking",
  "Ascensor": "Elevator",
  "Área social": "Social area",
  "Piscina": "Pool",
  "Garita de seguridad": "Security booth",
  "Generador eléctrico": "Backup generator",
  "Gimnasio": "Gym",
  "Vigilancia 24h": "24h security",
  "Concierge / Portería 24h": "24h concierge",
  "Área de juegos infantiles": "Children's play area",
  "Áreas deportivas": "Sports facilities",
  "Acceso para discapacitados": "Accessible / wheelchair access",
  "Áreas verdes": "Green areas",
  "Bodega / Storage": "Storage unit",
  "Cancha de squash": "Squash court",
  "BBQ / Área de asados": "BBQ area",
  "Cancha de fútbol": "Soccer field",
  "Sala de internet": "Internet room",
  "Cancha de basketball": "Basketball court",
  "Salón comunal": "Community room",
  "Jardín": "Garden",
  "Terraza comunal": "Communal terrace",
  "Business center": "Business center",
  "Cancha de tenis": "Tennis court",
  "Patio": "Patio",
  "Club social": "Social club",
  "Club house": "Club house",
  "Acceso con tarjetas": "Keycard access",
  "Circuito cerrado de TV": "CCTV",
  "Edificio inteligente": "Smart building",
  "Jardín de techo": "Rooftop garden",
  "Jaula de golf": "Golf cage",
  "Parqueadero inteligente": "Smart parking",
  "Pista de pádel": "Padel court",
  "Energía solar": "Solar power",

  // ── Area & location ──────────────────────────────────────────────────────
  "Acceso pavimentado": "Paved access",
  "Zona residencial tranquila": "Quiet residential area",
  "Cerca de parques": "Near parks",
  "Cerca de zona urbana": "Near urban area",
  "Transporte público cercano": "Public transit nearby",
  "Zona comercial": "Commercial area",
  "Cerca de centros comerciales": "Near shopping malls",
  "Comunidad cerrada / Gated": "Gated community",
  "Zona turística": "Tourist area",
  "Centro médico cercano": "Medical center nearby",
  "Sobre vía principal": "On main road",
  "Cerca de colegios": "Near schools",
  "Cerca de playa": "Near the beach",
  "Cerca de restaurantes": "Near restaurants",
  "Lago cercano": "Lake nearby",
  "Laguna cercana": "Lagoon nearby",
  "Río / quebrada cercano": "River / creek nearby",
  "Zona de montaña": "Mountain area",
};
