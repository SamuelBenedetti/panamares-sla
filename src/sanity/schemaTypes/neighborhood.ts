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
      title: "Descripción del barrio",
      type: "text",
      rows: 5,
      description:
        "Escribe un párrafo corto sobre el barrio: cómo es vivir ahí, qué lo hace especial, tipo de propiedades y ambiente. Este texto aparece en la página del barrio.",
    }),
    defineField({
      name: "about",
      title: "Descripción extendida (Rich Text)",
      type: "array",
      of: [{ type: "block" }],
      description: "Versión extendida con formato enriquecido. Si está presente, se usa en lugar de la descripción simple.",
    }),
  ],
  preview: {
    select: { title: "name", media: "photo" },
  },
});
