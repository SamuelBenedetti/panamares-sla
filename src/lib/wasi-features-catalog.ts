// Wasi feature catalog — STARTER SET (top 10 features).
//
// This is a placeholder seed for the `feature` Sanity document type. It pairs
// a stable slug with ES + EN labels and a category (interna / externa). The
// `seed-features-catalog.mjs` script reads this file and creates / updates one
// `feature` doc per entry, using `_id: features-{slug}` for idempotency.
//
// TODO(panamares): replace this starter set with the full Wasi feature catalog.
// Sam / Igor will pull the canonical list from the Wasi API and extend this
// file. The seed script is idempotent — re-running with a longer catalog
// only patches existing docs and creates new ones.
//
// Editing rules:
//   - `slug` is the stable identifier and must match `_id` after `features-`
//     prefix. Don't change a slug once a property references the feature doc.
//   - Add new entries by appending; don't reorder.
//   - `category: "interna"` for features inside the unit (pool, finishes,
//     equipped kitchen). `category: "externa"` for the building / surroundings
//     (sea view, visitor parking, security).

export type FeatureCategory = "interna" | "externa";

export interface WasiFeatureEntry {
  /** Stable identifier — used to derive `_id: features-{slug}`. */
  slug: string;
  /** Optional Wasi numeric id when this feature is mirrored from Wasi. */
  wasiId?: number;
  category: FeatureCategory;
  labels: { es: string; en: string };
}

export const WASI_FEATURES_CATALOG: WasiFeatureEntry[] = [
  // ── Internal (inside the unit) ────────────────────────────────────────────
  { slug: "piscina-privada",      category: "interna", labels: { es: "Piscina privada",       en: "Private pool" } },
  { slug: "cocina-equipada",      category: "interna", labels: { es: "Cocina equipada",       en: "Equipped kitchen" } },
  { slug: "aire-acondicionado",   category: "interna", labels: { es: "Aire acondicionado",    en: "Air conditioning" } },
  { slug: "balcon-privado",       category: "interna", labels: { es: "Balcón privado",        en: "Private balcony" } },
  { slug: "cuarto-de-empleados",  category: "interna", labels: { es: "Cuarto de empleados",   en: "Maid's room" } },

  // ── External (building / surroundings) ───────────────────────────────────
  { slug: "vista-al-mar",         category: "externa", labels: { es: "Vista al mar",          en: "Sea view" } },
  { slug: "estacionamiento-visitas", category: "externa", labels: { es: "Estacionamiento de visitas", en: "Visitor parking" } },
  { slug: "seguridad-24-7",       category: "externa", labels: { es: "Seguridad 24/7",        en: "24/7 security" } },
  { slug: "gimnasio",             category: "externa", labels: { es: "Gimnasio",              en: "Gym" } },
  { slug: "areas-sociales",       category: "externa", labels: { es: "Áreas sociales",        en: "Social areas" } },
];
