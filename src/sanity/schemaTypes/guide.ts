import { defineField, defineType } from "sanity";

export default defineType({
  name: "guide",
  title: "Guía",
  type: "document",
  fields: [
    defineField({
      name: "titleI18n",
      title: "Título de la guía",
      type: "internationalizedArrayString",
      description:
        "Título de la guía en cada idioma. Aparece como H1 de la página y en los listados.",
    }),
    defineField({
      name: "title",
      title: "Título anterior (oculto)",
      type: "string",
      hidden: true,
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      title: "Categoría",
      type: "string",
      options: {
        list: [
          { title: "Comprar", value: "comprar" },
          { title: "Alquilar", value: "alquilar" },
          { title: "Invertir", value: "invertir" },
          { title: "Vivir en Panama", value: "vivir" },
        ],
        layout: "radio",
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Extracto (2 líneas)",
      type: "text",
      rows: 2,
      validation: (r) => r.required().max(200),
    }),
    defineField({
      name: "readTime",
      title: "Tiempo de lectura (minutos)",
      type: "number",
      validation: (r) => r.required().positive(),
    }),
    defineField({
      name: "coverImage",
      title: "Imagen de portada",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", title: "Alt text", type: "string" }],
    }),
    defineField({
      name: "author",
      title: "Autor",
      type: "reference",
      to: [{ type: "author" }],
      description: "Experto que firma este contenido (mejora E-E-A-T)",
    }),
    defineField({
      name: "faqs",
      title: "Preguntas frecuentes",
      type: "array",
      description: "Aparecen como FAQ schema (rich snippet en Google) y como sección al final del artículo",
      of: [
        {
          type: "object",
          fields: [
            { name: "question", title: "Pregunta", type: "string" },
            { name: "answer", title: "Respuesta", type: "text", rows: 3 },
          ],
          preview: { select: { title: "question" } },
        },
      ],
    }),
    defineField({
      name: "bodyI18n",
      title: "Contenido",
      type: "internationalizedArrayPortableText",
      description:
        "Cuerpo del artículo en cada idioma. Se muestra al lector según el idioma de la página.",
    }),
    defineField({
      name: "body",
      title: "Contenido anterior (oculto)",
      type: "array",
      of: [
        { type: "block" },
        {
          type: "image",
          options: { hotspot: true },
          fields: [{ name: "alt", title: "Alt text", type: "string" }],
        },
      ],
      hidden: true,
    }),
    defineField({
      name: "humanReviewed",
      title: "Traducción al inglés revisada",
      type: "boolean",
      initialValue: false,
      description:
        "Activa esta casilla cuando hayas revisado y aprobado la traducción al inglés. Hasta que esté activa, la versión en inglés de la guía no se muestra al público ni a buscadores.",
    }),
  ],
  preview: {
    select: { title: "title", media: "coverImage", subtitle: "category" },
  },
});
