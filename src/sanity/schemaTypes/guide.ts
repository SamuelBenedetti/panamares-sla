import { defineField, defineType } from "sanity";

export default defineType({
  name: "guide",
  title: "Guía",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Título",
      type: "string",
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
      name: "body",
      title: "Contenido",
      type: "array",
      of: [
        { type: "block" },
        {
          type: "image",
          options: { hotspot: true },
          fields: [{ name: "alt", title: "Alt text", type: "string" }],
        },
      ],
    }),
  ],
  preview: {
    select: { title: "title", media: "coverImage", subtitle: "category" },
  },
});
