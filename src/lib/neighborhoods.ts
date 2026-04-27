export interface NeighborhoodConfig {
  slug: string;
  name: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
}

export const NEIGHBORHOODS: NeighborhoodConfig[] = [
  { slug: "punta-pacifica",  name: "Punta Pacífica",  priority: "HIGH" },
  { slug: "punta-paitilla",  name: "Punta Paitilla",  priority: "HIGH" },
  { slug: "avenida-balboa",  name: "Avenida Balboa",  priority: "MEDIUM" },
  { slug: "obarrio",         name: "Obarrio",         priority: "MEDIUM" },
  { slug: "calle-50",        name: "Calle 50",        priority: "MEDIUM" },
  { slug: "costa-del-este",  name: "Costa del Este",  priority: "MEDIUM" },
  { slug: "san-francisco",   name: "San Francisco",   priority: "MEDIUM" },
  { slug: "bella-vista",     name: "Bella Vista",     priority: "MEDIUM" },
  { slug: "albrook",         name: "Albrook",         priority: "LOW" },
  { slug: "coco-del-mar",    name: "Coco del Mar",    priority: "LOW" },
  { slug: "santa-maria",     name: "Santa María",     priority: "LOW" },
  { slug: "marbella",        name: "Marbella",        priority: "LOW" },
  { slug: "el-cangrejo",     name: "El Cangrejo",     priority: "LOW" },
  { slug: "altos-del-golf",  name: "Altos del Golf",  priority: "LOW" },
  { slug: "via-porras",      name: "Via Porras",      priority: "LOW" },
  { slug: "condado-del-rey", name: "Condado del Rey", priority: "LOW" },
  { slug: "amador",          name: "Amador",          priority: "LOW" },
  { slug: "los-andes",       name: "Los Andes",       priority: "LOW" },
  { slug: "carrasquilla",    name: "Carrasquilla",    priority: "LOW" },
  { slug: "loma-alegre",     name: "Loma Alegre",     priority: "LOW" },
  { slug: "alto-del-chase",  name: "Alto del Chase",  priority: "LOW" },
  { slug: "coronado",        name: "Coronado",        priority: "LOW" },
  { slug: "versalles",       name: "Versalles",       priority: "LOW" },
  { slug: "rio-mar",         name: "Río Mar",         priority: "LOW" },
  { slug: "panama",          name: "Panamá",          priority: "LOW" },
];

export function getNeighborhoodBySlug(
  slug: string
): NeighborhoodConfig | undefined {
  return NEIGHBORHOODS.find((n) => n.slug === slug);
}

export const VALID_NEIGHBORHOOD_SLUGS = new Set(
  NEIGHBORHOODS.map((n) => n.slug)
);

export function getSlugByName(name: string): string | undefined {
  return NEIGHBORHOODS.find((n) => n.name === name)?.slug;
}
