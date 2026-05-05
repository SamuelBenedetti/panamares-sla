import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { internationalizedArray } from "sanity-plugin-internationalized-array";
import { schemaTypes } from "./schemaTypes";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export default defineConfig({
  name: "panamarealtor",
  title: "Panama Realtor CMS",
  projectId,
  dataset,
  plugins: [
    structureTool(),
    visionTool(),
    // Phase 2 PR-A: per-field translations via sanity-plugin-internationalized-array.
    // Registers types: internationalizedArrayString, internationalizedArrayText,
    // internationalizedArrayPortableText. Fields opt in by setting
    // type: "internationalizedArrayString" | etc. on individual schema fields.
    internationalizedArray({
      languages: [
        { id: "es", title: "Español" },
        { id: "en", title: "English" },
      ],
      defaultLanguages: ["es"],
      fieldTypes: ["string", "text", "portableText"],
    }),
  ],
  schema: { types: schemaTypes },
  basePath: "/studio",
});
