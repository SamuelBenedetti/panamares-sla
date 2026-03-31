import { defineField, defineType } from "sanity";

export default defineType({
  name: "lead",
  title: "Lead",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nombre",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "phone",
      title: "Teléfono",
      type: "string",
    }),
    defineField({
      name: "message",
      title: "Mensaje",
      type: "text",
    }),
    defineField({
      name: "property",
      title: "Propiedad de interés",
      type: "reference",
      to: [{ type: "property" }],
    }),
    defineField({
      name: "createdAt",
      title: "Fecha",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "email" },
  },
});
