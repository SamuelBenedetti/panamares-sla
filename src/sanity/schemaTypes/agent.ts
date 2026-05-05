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
      name: "roleI18n",
      title: "Cargo",
      type: "internationalizedArrayString",
      description:
        'Cargo del agente en cada idioma. Ejemplo: en español "Asesor Inmobiliario", en inglés "Real Estate Agent".',
    }),
    defineField({
      name: "role",
      title: "Cargo anterior (oculto)",
      type: "string",
      hidden: true,
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
      name: "bioI18n",
      title: "Biografía",
      type: "internationalizedArrayPortableText",
      description: "Biografía del agente en cada idioma. Aparece en su perfil público.",
    }),
    defineField({
      name: "bio",
      title: "Biografía anterior (oculto)",
      type: "array",
      of: [{ type: "block" }],
      hidden: true,
    }),
    defineField({
      name: "humanReviewed",
      title: "Traducción al inglés revisada",
      type: "boolean",
      initialValue: false,
      description:
        "Activa esta casilla cuando hayas revisado y aprobado la traducción al inglés. Hasta que esté activa, la versión en inglés del agente no se muestra en buscadores.",
    }),
  ],
  preview: {
    select: { title: "name", media: "photo" },
  },
});
