import { defineField, defineType } from "sanity";

const NEIGHBORHOODS = [
  "Punta Pacífica",
  "Punta Paitilla",
  "Avenida Balboa",
  "Obarrio",
  "Calle 50",
  "Costa del Este",
  "Albrook",
  "Coco del Mar",
  "Santa María",
  "Marbella",
  "El Cangrejo",
  "Altos del Golf",
  "San Francisco",
  "Vía Porras",
  "Bella Vista",
  "Condado del Rey",
  "Amador",
  "Los Andes",
  "Carrasquilla",
  "Loma Alegre",
  "Alto del Chase",
  "Coronado",
  "Versalles",
  "Río Mar",
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
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      group: "basic",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
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
          { title: "Casa de Playa", value: "casa" },
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
          "Aire acondicionado",
          "Amueblado",
          "Semi-amueblado",
          "Cocina equipada",
          "Closets empotrados",
          "Balcón",
          "Terraza",
          "Pisos de mármol",
          "Pisos de madera",
          "Lavandería interna",
          "Cuarto de servicio",
          "Estudio / oficina",
          "Sala de estar",
          "Comedor formal",
          "Vista al mar",
          "Vista a la ciudad",
          "Piso alto",
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
          "Piscina",
          "Gimnasio",
          "Concierge / Portería 24h",
          "Salón social",
          "BBQ / Área de asados",
          "Cancha de tenis",
          "Área de juegos infantiles",
          "Spa / Sauna",
          "Rooftop",
          "Business center",
          "Generador eléctrico",
          "Ascensor",
          "Estacionamiento de visitas",
          "Bodega / Storage",
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
          "Comunidad cerrada / Gated",
          "Frente al mar",
          "Cerca del metro",
          "Cerca de centros comerciales",
          "Cerca de colegios",
          "Cerca de hospitales",
          "Cerca de parques",
          "Zona financiera",
          "Zona residencial tranquila",
          "Acceso a autopista",
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
