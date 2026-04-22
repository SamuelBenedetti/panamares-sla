import { defineField, defineType } from "sanity";

// SEO doc Appendix A — plural type slug used in Tier 4 URL pattern.
// Brief example: /propiedades/apartamentos-en-venta-punta-pacifica-9833923/
const TYPE_SLUG_PLURAL: Record<string, string> = {
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

// SEO doc Appendix B — neighborhood slug (accent-stripped).
const ZONE_TO_SLUG: Record<string, string> = {
  "Punta Pacífica": "punta-pacifica",
  "Punta Paitilla": "punta-paitilla",
  "Avenida Balboa": "avenida-balboa",
  "Costa del Este": "costa-del-este",
  "Obarrio":        "obarrio",
  "Calle 50":       "calle-50",
  "Albrook":        "albrook",
  "Coco del Mar":   "coco-del-mar",
  "Santa María":    "santa-maria",
  "Marbella":       "marbella",
  "El Cangrejo":    "el-cangrejo",
};

function slugifyFallback(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Builds the Tier 4 slug per SEO doc: {type-plural}-en-{intent}-{zone-slug}-{listing_id}
function buildListingSlug(doc: Record<string, unknown>): string {
  const propertyType = String(doc.propertyType ?? "apartamento");
  const businessType = doc.businessType === "alquiler" ? "alquiler" : "venta";
  const zone = String(doc.zone ?? "");
  const wasiId = doc.wasiId;

  const typeSlug = TYPE_SLUG_PLURAL[propertyType] ?? slugifyFallback(propertyType);
  const zoneSlug = ZONE_TO_SLUG[zone] ?? slugifyFallback(zone) ?? "panama";
  // Fallback id for manually-created docs: 7 random digits, stable per click.
  const id = wasiId ?? Math.floor(1_000_000 + Math.random() * 9_000_000);
  return `${typeSlug}-en-${businessType}-${zoneSlug}-${id}`;
}

const NEIGHBORHOODS = [
  "Punta Pacífica",
  "Punta Paitilla",
  "Avenida Balboa",
  "Costa del Este",
  "Obarrio",
  "Calle 50",
  "Albrook",
  "Coco del Mar",
  "Santa María",
  "Marbella",
  "El Cangrejo",
];

export default defineType({
  name: "property",
  title: "Propiedad",
  type: "document",
  groups: [
    { name: "basic", title: "Información básica", default: true },
    { name: "details", title: "Detalles" },
    { name: "features", title: "Características" },
    { name: "media", title: "Fotos y ubicación" },
    { name: "management", title: "Gestión" },
  ],
  fields: [
    // ─── Información básica ───────────────────────────────────────────────────
    defineField({
      name: "title",
      title: "Título",
      type: "string",
      group: "basic",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "wasiId",
      title: "ID de Wasi",
      type: "number",
      group: "basic",
      description:
        "ID numérico de la propiedad en Wasi. Se usa para generar la URL (Tier 4 SEO). Si se crea manualmente sin ID, se genera uno automático al generar el slug.",
      validation: (r) => r.positive().integer(),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      group: "basic",
      description:
        "Formato obligatorio (SEO doc §3.2 Tier 4): {tipo-plural}-en-{venta|alquiler}-{barrio}-{wasiId}. Ej: apartamentos-en-venta-punta-pacifica-9833923. Usa el botón Generar.",
      options: {
        source: (doc) => buildListingSlug(doc as Record<string, unknown>),
        maxLength: 120,
        slugify: (input) => input.toLowerCase().trim(),
      },
      validation: (r) =>
        r.required().custom((slug) => {
          const current = typeof slug === "object" && slug && "current" in slug
            ? (slug as { current?: string }).current
            : undefined;
          if (!current) return "Slug requerido";
          // Must match Tier 4 pattern: {type}-en-{venta|alquiler}-{zone}-{digits}
          const PATTERN = /^[a-z0-9-]+-en-(venta|alquiler)-[a-z0-9-]+-\d+$/;
          if (!PATTERN.test(current)) {
            return "El slug debe seguir el patrón SEO: {tipo}-en-{venta|alquiler}-{barrio}-{id}. Haz click en Generar.";
          }
          return true;
        }),
    }),
    defineField({
      name: "businessType",
      title: "Tipo de negocio",
      type: "string",
      group: "basic",
      options: {
        list: [
          { title: "Venta", value: "venta" },
          { title: "Alquiler", value: "alquiler" },
        ],
        layout: "radio",
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "propertyType",
      title: "Tipo de propiedad",
      type: "string",
      group: "basic",
      options: {
        list: [
          { title: "Apartamento", value: "apartamento" },
          { title: "Apartaestudio", value: "apartaestudio" },
          { title: "Casa", value: "casa" },
          { title: "Casa de Playa", value: "casa de playa" },
          { title: "Penthouse", value: "penthouse" },
          { title: "Oficina", value: "oficina" },
          { title: "Local Comercial", value: "local" },
          { title: "Terreno", value: "terreno" },
          { title: "Lote Comercial", value: "lote comercial" },
          { title: "Edificio", value: "edificio" },
          { title: "Finca", value: "finca" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "listingStatus",
      title: "Estado del listing",
      type: "string",
      group: "basic",
      options: {
        list: [
          { title: "Activa", value: "activa" },
          { title: "Vendida / Alquilada", value: "vendida" },
          { title: "Retirada", value: "retirada" },
        ],
        layout: "radio",
      },
      initialValue: "activa",
      validation: (r) => r.required(),
      description:
        "Al marcar como Vendida o Retirada, la propiedad dejará de aparecer en el sitio.",
    }),
    defineField({
      name: "price",
      title: "Precio (USD)",
      type: "number",
      group: "basic",
      validation: (r) => r.required().positive(),
    }),
    defineField({
      name: "zone",
      title: "Barrio / Zona",
      type: "string",
      group: "basic",
      options: {
        list: NEIGHBORHOODS,
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "province",
      title: "Provincia",
      type: "string",
      group: "basic",
      options: {
        list: [
          "Panamá",
          "Panamá Oeste",
          "Colón",
          "Chiriquí",
          "Coclé",
          "Herrera",
          "Los Santos",
          "Veraguas",
          "Bocas del Toro",
          "Darién",
        ],
      },
      initialValue: "Panamá",
    }),

    // ─── Detalles ─────────────────────────────────────────────────────────────
    defineField({
      name: "buildingName",
      title: "Nombre del edificio / torre",
      type: "string",
      group: "details",
    }),
    defineField({
      name: "tower",
      title: "Torre",
      type: "string",
      group: "details",
    }),
    defineField({
      name: "model",
      title: "Modelo / Unidad",
      type: "string",
      group: "details",
    }),
    defineField({
      name: "floor",
      title: "Piso",
      type: "number",
      group: "details",
      validation: (r) => r.min(0),
    }),
    defineField({
      name: "yearBuilt",
      title: "Año de construcción",
      type: "number",
      group: "details",
    }),
    defineField({
      name: "condition",
      title: "Estado",
      type: "string",
      group: "details",
      options: {
        list: [
          { title: "Usado", value: "usado" },
          { title: "Nuevo", value: "nuevo" },
          { title: "En planos", value: "en_planos" },
          { title: "En construcción", value: "en_construccion" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "corregimiento",
      title: "Corregimiento",
      type: "string",
      group: "details",
    }),
    defineField({
      name: "bedrooms",
      title: "Habitaciones",
      type: "number",
      group: "details",
      validation: (r) => r.min(0),
    }),
    defineField({
      name: "bathrooms",
      title: "Baños completos",
      type: "number",
      group: "details",
      validation: (r) => r.min(0),
    }),
    defineField({
      name: "halfBathrooms",
      title: "Medios baños",
      type: "number",
      group: "details",
      validation: (r) => r.min(0),
    }),
    defineField({
      name: "area",
      title: "Área (m²)",
      type: "number",
      group: "details",
      validation: (r) => r.positive(),
    }),
    defineField({
      name: "parking",
      title: "Espacios de estacionamiento",
      type: "number",
      group: "details",
      validation: (r) => r.min(0),
    }),
    defineField({
      name: "adminFee",
      title: "Cuota de mantenimiento mensual (USD)",
      type: "number",
      group: "details",
      description: "Dejar vacío si no aplica.",
      validation: (r) => r.min(0),
    }),
    defineField({
      name: "description",
      title: "Descripción",
      type: "array",
      group: "details",
      of: [{ type: "block" }],
    }),

    // ─── Características ──────────────────────────────────────────────────────
    defineField({
      name: "featuresInterior",
      title: "Características — Interior",
      type: "array",
      group: "features",
      of: [{ type: "string" }],
      options: {
        list: [
          // Clima y confort
          "Aire acondicionado",
          "Calentador de agua",
          "Línea de gas",
          "Control de ruido",
          "Control térmico",
          // Amoblado
          "Amueblado",
          "Semi-amueblado",
          // Cocina
          "Cocina equipada",
          "Cocina integral",
          "Cocina tipo americano",
          "Barra americana",
          "Extractor de cocina",
          "Horno",
          "Lavaplatos",
          "Despensa",
          // Espacios
          "Balcón",
          "Terraza",
          "Vestidor",
          "Estudio / biblioteca",
          "Sala de usos múltiples",
          "Comedor auxiliar",
          "Hall de alcobas",
          "Altillo / Mezzanine",
          // Pisos
          "Pisos de cerámica / mármol",
          "Pisos de madera",
          "Pisos laminados",
          // Servicio
          "Cuarto de servicio",
          "Cuarto de conductores",
          "Área de lavandería",
          "Depósito",
          "Trastero",
          // Seguridad
          "Alarma",
          "Intercomunicador",
          "Puerta de seguridad",
          "Puerta eléctrica",
          "Detector de humo",
          "Circuito cerrado de TV",
          // Tecnología
          "Internet",
          "TV por cable",
          "Doble ventana",
          // Vistas
          "Vista panorámica",
          "Vista al mar",
          "Vista a la ciudad",
          "Luz en la mañana",
          "Luz en la tarde",
          // Otros
          "Closets empotrados",
          "Mascotas permitidas",
          "Baño auxiliar",
          "Baño en suite",
          "Reformado / Renovado",
          "Chimenea",
        ],
      },
    }),
    defineField({
      name: "featuresBuilding",
      title: "Características — Amenidades del edificio",
      type: "array",
      group: "features",
      of: [{ type: "string" }],
      options: {
        list: [
          // Agua y piscinas
          "Piscina",
          "Jacuzzi",
          "Sauna",
          "Baño turco",
          // Deporte y recreación
          "Gimnasio",
          "Cancha de tenis",
          "Cancha de squash",
          "Cancha de basketball",
          "Cancha de fútbol",
          "Pista de pádel",
          "Jaula de golf",
          "Áreas deportivas",
          // Sociales
          "Área social",
          "Salón comunal",
          "Club house",
          "Club social",
          "BBQ / Área de asados",
          "Terraza comunal",
          "Jardín",
          "Patio",
          "Áreas verdes",
          "Área de juegos infantiles",
          // Servicios del edificio
          "Concierge / Portería 24h",
          "Ascensor",
          "Generador eléctrico",
          "Energía solar",
          "Estacionamiento de visitas",
          "Parqueadero inteligente",
          "Bodega / Storage",
          "Sala de internet",
          "Business center",
          "Oficina de negocios",
          "Jardín de techo",
          // Seguridad
          "Garita de seguridad",
          "Vigilancia 24h",
          "Circuito cerrado de TV",
          "Acceso con tarjetas",
          "Acceso para discapacitados",
          "Edificio inteligente",
        ],
      },
    }),
    defineField({
      name: "featuresLocation",
      title: "Características — Ubicación",
      type: "array",
      group: "features",
      of: [{ type: "string" }],
      options: {
        list: [
          // Tipo de comunidad
          "Comunidad cerrada / Gated",
          "Zona residencial tranquila",
          "Zona comercial",
          "Zona turística",
          "Zona de montaña",
          "Sobre vía principal",
          "Acceso pavimentado",
          "Cerca de zona urbana",
          // Naturaleza
          "Frente al mar",
          "Cerca de playa",
          "Lago cercano",
          "Laguna cercana",
          "Río / quebrada cercano",
          // Servicios cercanos
          "Cerca de colegios",
          "Cerca de hospitales",
          "Centro médico cercano",
          "Cerca de centros comerciales",
          "Cerca de restaurantes",
          "Cerca de parques",
          "Transporte público cercano",
          "Acceso a autopista",
          "Zona financiera",
        ],
      },
    }),

    // ─── Fotos y ubicación ────────────────────────────────────────────────────
    defineField({
      name: "mainImage",
      title: "Imagen principal",
      type: "image",
      group: "media",
      options: { hotspot: true },
      fields: [{ name: "alt", title: "Alt text", type: "string" }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "gallery",
      title: "Galería de fotos",
      type: "array",
      group: "media",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [{ name: "alt", title: "Alt text", type: "string" }],
        },
      ],
    }),
    defineField({
      name: "location",
      title: "Coordenadas GPS",
      type: "geopoint",
      group: "media",
      description:
        "Solo se muestra el pin en el mapa, nunca la dirección exacta.",
    }),

    // ─── Gestión ──────────────────────────────────────────────────────────────
    defineField({
      name: "agent",
      title: "Agente responsable",
      type: "reference",
      group: "management",
      to: [{ type: "agent" }],
    }),
    defineField({
      name: "featured",
      title: "Destacada en homepage",
      type: "boolean",
      group: "management",
      initialValue: false,
    }),
    defineField({
      name: "recommended",
      title: "Mostrar tag 'Recomendado'",
      type: "boolean",
      group: "management",
      initialValue: false,
      description: "Muestra el badge azul 'RECOMENDADO' sobre la foto de la propiedad.",
    }),
    defineField({
      name: "fairPrice",
      title: "Mostrar tag 'Precio Justo'",
      type: "boolean",
      group: "management",
      initialValue: false,
      description: "Muestra el badge verde 'PRECIO JUSTO' sobre la foto de la propiedad.",
    }),
    defineField({
      name: "rented",
      title: "Mostrar tag 'Alquilado'",
      type: "boolean",
      group: "management",
      initialValue: false,
      description: "Muestra el badge rojo 'ALQUILADO' sobre la foto de la propiedad.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "mainImage",
      subtitle: "zone",
      status: "listingStatus",
    },
    prepare({ title, media, subtitle, status }) {
      const statusLabel =
        status === "vendida"
          ? "● Vendida"
          : status === "retirada"
            ? "● Retirada"
            : "";
      return {
        title: statusLabel ? `${title} ${statusLabel}` : title,
        media,
        subtitle,
      };
    },
  },
});
