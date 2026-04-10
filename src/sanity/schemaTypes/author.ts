import { defineField, defineType } from "sanity";

export default defineType({
  name: "author",
  title: "Autor",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nombre completo",
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
      title: "Foto",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "role",
      title: "Cargo / Especialidad",
      type: "string",
      placeholder: "Abogado de Bienes Raíces · Panamá",
    }),
    defineField({
      name: "credentials",
      title: "Credenciales",
      type: "string",
      placeholder: "Idoneidad #1234 · Miembro ACOBIR",
      description: "Licencias, membresías profesionales, certificaciones",
    }),
    defineField({
      name: "bio",
      title: "Biografía",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "linkedin",
      title: "LinkedIn URL",
      type: "url",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "photo" },
  },
});
