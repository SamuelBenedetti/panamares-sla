import { defineField, defineType } from "sanity";

export default defineType({
  name: "neighborhood",
  title: "Barrio / Zona",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nombre del barrio",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "photo",
      title: "Foto del barrio",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", title: "Alt text", type: "string" }],
    }),
    defineField({
      name: "about",
      title: "Descripción editorial (aprox. 200 palabras)",
      type: "array",
      of: [{ type: "block" }],
      description:
        "Texto sobre el barrio: estilo de vida, proximidad a puntos de interés, contexto de precios. Este texto es el contenido principal para posicionamiento SEO.",
    }),
    defineField({
      name: "avgPricePerM2",
      title: "Precio promedio por m² (USD)",
      type: "number",
      validation: (r) => r.positive(),
    }),
    defineField({
      name: "seoBlock",
      title: "Bloque SEO (80–120 palabras)",
      type: "text",
      rows: 4,
      description:
        "Texto visible en la página de barrio entre el encabezado y el listado. Optimizado para búsquedas de 'propiedades en [barrio]'.",
    }),
  ],
  preview: {
    select: { title: "name", media: "photo" },
  },
});
