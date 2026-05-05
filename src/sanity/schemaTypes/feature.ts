import { defineField, defineType } from "sanity";

/**
 * `feature` — catálogo de características que pueden adjuntarse a una propiedad.
 * Cada característica tiene una etiqueta visible traducible (ES + EN) y se
 * relaciona con un ID de Wasi cuando corresponda. Las propiedades referencian
 * estas características vía `featuresInternal` / `featuresExternal`.
 *
 * Esta es solo la infraestructura del esquema — popular el catálogo con datos
 * de Wasi se hace por separado (script de seed o admin manual).
 */
export default defineType({
  name: "feature",
  title: "Característica",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Característica",
      type: "string",
      description:
        "Nombre interno para identificar esta característica en el listado. No se muestra al público.",
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
      name: "wasiId",
      title: "ID de Wasi",
      type: "number",
      description:
        "Identificador del catálogo de Wasi cuando esta característica viene sincronizada. Dejar vacío si es manual.",
      validation: (r) => r.positive().integer(),
    }),
    defineField({
      name: "category",
      title: "Tipo",
      type: "string",
      description:
        "Si la característica es interna del inmueble (piscina, cocina equipada) o externa del entorno (vista al mar, estacionamiento de visitas).",
      options: {
        list: [
          { title: "Interna", value: "interna" },
          { title: "Externa", value: "externa" },
        ],
        layout: "radio",
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "labelI18n",
      title: "Etiqueta visible",
      type: "internationalizedArrayString",
      description:
        'Cómo se muestra esta característica en el sitio en cada idioma. Ejemplo: ES "Piscina" / EN "Pool".',
    }),
  ],
  preview: {
    select: {
      name: "name",
      category: "category",
      labelEs: "labelI18n.0.value",
    },
    prepare({ name, category, labelEs }) {
      const subtitleParts: string[] = [];
      if (category === "interna") subtitleParts.push("Interna");
      else if (category === "externa") subtitleParts.push("Externa");
      return {
        title: labelEs || name,
        subtitle: subtitleParts.join(" · ") || undefined,
      };
    },
  },
});
