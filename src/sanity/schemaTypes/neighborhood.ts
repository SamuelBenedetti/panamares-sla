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
      name: "seoBlockI18n",
      title: "Descripción del barrio",
      type: "internationalizedArrayText",
      description:
        "Escribe un párrafo corto del barrio en cada idioma: cómo es vivir ahí, qué lo hace especial, tipos de propiedades y ambiente. Aparece en la página del barrio.",
    }),
    defineField({
      name: "seoBlock",
      title: "Descripción anterior (oculto)",
      type: "text",
      rows: 5,
      hidden: true,
    }),
    defineField({
      name: "humanReviewed",
      title: "Traducción al inglés revisada",
      type: "boolean",
      initialValue: false,
      description:
        "Activa esta casilla cuando hayas revisado y aprobado la traducción al inglés. Hasta que esté activa, la versión en inglés del barrio no se muestra en buscadores.",
    }),
  ],
  preview: {
    select: { title: "name", media: "photo" },
  },
});
