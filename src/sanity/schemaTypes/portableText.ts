import { defineType } from "sanity";

/**
 * "portableText" alias type required by sanity-plugin-internationalized-array
 * when registering `portableText` as one of its fieldTypes. The plugin
 * generates `internationalizedArrayPortableTextValue` whose value field is
 * declared as `type: "portableText"`, so this schema must exist in the
 * project for the Studio to resolve the reference.
 *
 * The shape mirrors what we used historically for `agent.bio` (an array of
 * blocks). Keep it minimal — adding marks/styles here would let editors use
 * them across every i18n PortableText field site-wide.
 */
export default defineType({
  name: "portableText",
  title: "Texto enriquecido",
  type: "array",
  of: [{ type: "block" }],
});
