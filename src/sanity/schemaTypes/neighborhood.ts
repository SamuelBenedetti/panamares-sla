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
      name: "avgPricePerM2",
      title: "Precio promedio por m² (USD)",
      type: "number",
      validation: (r) => r.positive(),
    }),
    defineField({
      name: "seoBlock",
      title: "Descripción del barrio (80–120 palabras)",
      type: "text",
      rows: 5,
      description:
        "Texto visible en la página y usado como meta description. Describe el estilo de vida, ubicación y mercado inmobiliario del barrio.",
    }),
  ],
  preview: {
    select: { title: "name", media: "photo" },
  },
});
