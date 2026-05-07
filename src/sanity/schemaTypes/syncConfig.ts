import { defineField, defineType } from "sanity";

/**
 * `syncConfig` — singleton de configuración del sync de Wasi.
 *
 * Igor / Carlos editan este documento desde Studio para mantener una lista de
 * IDs de Wasi (sin el prefijo `wasi-`) que NO deben recrearse desde Wasi en la
 * próxima corrida del sync. Caso típico: tras deduplicar el catálogo en
 * Sanity (borrar listings duplicados manualmente), la siguiente sincronización
 * volvería a crear esos listings porque el ID sigue activo en Wasi. Agregando
 * el ID a este array, el sync lo salta de forma permanente.
 *
 * El script `scripts/sync-wasi.mjs` lee este documento al arrancar y filtra
 * los IDs antes de procesarlos. Un canónico `_id == "syncConfig"` lo convierte
 * en singleton (estructura desk personalizada en `src/sanity/structure.ts`).
 */
export default defineType({
  name: "syncConfig",
  title: "Configuración de Sync (Wasi)",
  type: "document",
  fields: [
    defineField({
      name: "excludedWasiIds",
      title: "Wasi IDs excluidos del sync",
      type: "array",
      of: [{ type: "string" }],
      description:
        'IDs de Wasi (sin el prefijo "wasi-") que NO deben sincronizarse desde Wasi. Útil para listings duplicados que se borraron de Sanity y se quieren mantener fuera. Ejemplo: "7041742".',
      options: {
        layout: "tags",
      },
    }),
  ],
  preview: {
    select: { ids: "excludedWasiIds" },
    prepare: ({ ids }) => {
      const count = Array.isArray(ids) ? ids.length : 0;
      return {
        title: "Configuración de Sync",
        subtitle: count ? `${count} ID(s) excluido(s)` : "Sin exclusiones",
      };
    },
  },
});
