export interface CategoryConfig {
  slug: string;
  propertyType: string;
  businessType: "venta" | "alquiler";
  h1: string;
  metaTitle: string;
  metaDescription: string;
  primaryKeyword: string;
  seoBlock?: string;
}

export const CATEGORIES: CategoryConfig[] = [
  {
    slug: "apartamentos-en-venta",
    propertyType: "apartamento",
    businessType: "venta",
    h1: "Apartamentos en Venta en Panama",
    metaTitle: "Apartamentos en Venta en Panama City | Panamares",
    metaDescription:
      "Encuentra apartamentos en venta en Panama City. Las mejores opciones en Punta Pacífica, Punta Paitilla, Obarrio y más zonas exclusivas.",
    primaryKeyword: "apartamentos en venta Panama City",
    seoBlock:
      "Panamares ofrece la mayor selección de apartamentos en venta en Panama City. Desde estudios hasta penthouses, encontrarás opciones en las zonas más exclusivas: Punta Pacífica, Punta Paitilla, Avenida Balboa y Obarrio. Todos los inmuebles son verificados y cuentan con información completa de precio, área, habitaciones y amenidades del edificio. Nuestros agentes especializados te acompañan en cada paso del proceso de compra.",
  },
  {
    slug: "apartamentos-en-alquiler",
    propertyType: "apartamento",
    businessType: "alquiler",
    h1: "Apartamentos en Alquiler en Panama",
    metaTitle: "Apartamentos en Alquiler en Panama City | Panamares",
    metaDescription:
      "Alquila un apartamento en Panama City. Amplia selección en Punta Pacífica, Punta Paitilla, Avenida Balboa y más.",
    primaryKeyword: "apartamentos en alquiler Panama",
    seoBlock:
      "Encuentra el apartamento en alquiler ideal en Panama City. Panamares tiene opciones en Punta Pacífica, Punta Paitilla, Avenida Balboa y más zonas residenciales. Apartamentos amueblados y sin amueblar, con una o varias habitaciones, en edificios con amenidades completas. Precios en dólares, contratos en español y atención personalizada de nuestros agentes.",
  },
  {
    slug: "casas-en-venta",
    propertyType: "casa",
    businessType: "venta",
    h1: "Casas en Venta en Panama",
    metaTitle: "Casas en Venta en Panama City | Panamares",
    metaDescription:
      "Compra una casa en Panama City. Selección de casas residenciales en las mejores urbanizaciones.",
    primaryKeyword: "casas en venta Panama",
  },
  {
    slug: "casas-en-alquiler",
    propertyType: "casa",
    businessType: "alquiler",
    h1: "Casas en Alquiler en Panama",
    metaTitle: "Casas en Alquiler en Panama City | Panamares",
    metaDescription:
      "Alquila una casa en Panama City. Encuentra la opción ideal para tu familia.",
    primaryKeyword: "casas en alquiler Panama",
  },
  {
    slug: "penthouses-en-venta",
    propertyType: "penthouse",
    businessType: "venta",
    h1: "Penthouses en Venta en Panama",
    metaTitle: "Penthouses en Venta en Panama City | Panamares",
    metaDescription:
      "Penthouses de lujo en venta en Panama City. Vistas panorámicas, acabados premium en Punta Pacífica y Punta Paitilla.",
    primaryKeyword: "penthouse Panama City",
  },
  {
    slug: "apartaestudios-en-venta",
    propertyType: "apartaestudio",
    businessType: "venta",
    h1: "Apartaestudios en Venta en Panama",
    metaTitle: "Apartaestudios en Venta en Panama City | Panamares",
    metaDescription:
      "Apartaestudios en venta en Panama City. Ideales para inversión o primera vivienda.",
    primaryKeyword: "apartaestudios en venta Panama",
  },
  {
    slug: "oficinas-en-venta",
    propertyType: "oficina",
    businessType: "venta",
    h1: "Oficinas en Venta en Panama",
    metaTitle: "Oficinas en Venta en Panama City | Panamares",
    metaDescription:
      "Oficinas en venta en Panama City. Espacios corporativos en Calle 50, Punta Pacífica y zonas empresariales.",
    primaryKeyword: "oficinas en venta Panama",
  },
  {
    slug: "oficinas-en-alquiler",
    propertyType: "oficina",
    businessType: "alquiler",
    h1: "Oficinas en Alquiler en Panama",
    metaTitle: "Oficinas en Alquiler en Panama City | Panamares",
    metaDescription:
      "Alquila una oficina en Panama City. Espacios en las principales zonas comerciales y financieras.",
    primaryKeyword: "oficinas en alquiler Panama",
  },
  {
    slug: "locales-comerciales-en-venta",
    propertyType: "local",
    businessType: "venta",
    h1: "Locales Comerciales en Venta en Panama",
    metaTitle: "Locales Comerciales en Venta en Panama | Panamares",
    metaDescription:
      "Locales comerciales en venta en Panama City. Invierte en el sector comercial panameño.",
    primaryKeyword: "locales comerciales Panama",
  },
  {
    slug: "locales-comerciales-en-alquiler",
    propertyType: "local",
    businessType: "alquiler",
    h1: "Locales Comerciales en Alquiler en Panama",
    metaTitle: "Locales Comerciales en Alquiler en Panama | Panamares",
    metaDescription:
      "Alquila un local comercial en Panama City. Opciones en Obarrio, San Francisco y más zonas.",
    primaryKeyword: "locales en alquiler Panama",
  },
  {
    slug: "terrenos-en-venta",
    propertyType: "terreno",
    businessType: "venta",
    h1: "Terrenos en Venta en Panama",
    metaTitle: "Terrenos en Venta en Panama | Panamares",
    metaDescription:
      "Terrenos en venta en Panama City y provincia. Para construcción residencial o comercial.",
    primaryKeyword: "terrenos en venta Panama",
  },
  {
    slug: "casas-de-playa-en-venta",
    propertyType: "casa",
    businessType: "venta",
    h1: "Casas de Playa en Venta en Panama",
    metaTitle: "Casas de Playa en Venta en Panama | Panamares",
    metaDescription:
      "Casas de playa en venta en Panama. Propiedades en Coclé, Farallón y las mejores costas panameñas.",
    primaryKeyword: "casas de playa Panama",
  },
  {
    slug: "edificios-en-venta",
    propertyType: "edificio",
    businessType: "venta",
    h1: "Edificios en Venta en Panama",
    metaTitle: "Edificios en Venta en Panama City | Panamares",
    metaDescription:
      "Edificios en venta en Panama City. Inversión inmobiliaria de gran escala.",
    primaryKeyword: "edificios en venta Panama",
  },
  {
    slug: "fincas-en-venta",
    propertyType: "finca",
    businessType: "venta",
    h1: "Fincas en Venta en Panama",
    metaTitle: "Fincas en Venta en Panama | Panamares",
    metaDescription:
      "Fincas en venta en Panama. Propiedades rurales y agropecuarias en Coclé y provincias.",
    primaryKeyword: "fincas en venta Panama",
  },
  {
    slug: "lotes-comerciales-en-venta",
    propertyType: "lote comercial",
    businessType: "venta",
    h1: "Lotes Comerciales en Venta en Panama",
    metaTitle: "Lotes Comerciales en Venta en Panama | Panamares",
    metaDescription:
      "Lotes comerciales y terrenos en venta en Panama City. Oportunidades para desarrollo.",
    primaryKeyword: "lotes comerciales Panama",
  },
];

export function getCategoryBySlug(slug: string): CategoryConfig | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export const VALID_CATEGORY_SLUGS = new Set(CATEGORIES.map((c) => c.slug));
