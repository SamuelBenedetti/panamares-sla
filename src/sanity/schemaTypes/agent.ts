import { defineField, defineType } from "sanity";

export default defineType({
  name: "agent",
  title: "Agente",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nombre",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
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
      title: "Cargo",
      type: "string",
    }),
    defineField({
      name: "phone",
      title: "Teléfono",
      type: "string",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
    }),
    defineField({
      name: "whatsapp",
      title: "WhatsApp (número con código de país)",
      type: "string",
      description: "Ejemplo: +50766123456",
    }),
    defineField({
      name: "bio",
      title: "Biografía",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "wasiUserId",
      title: "WASI User ID",
      type: "number",
      description: "ID numérico del usuario en WASI (id_user). Necesario para vincular las propiedades del agente.",
    }),
  ],
  preview: {
    select: { title: "name", media: "photo" },
  },
});
