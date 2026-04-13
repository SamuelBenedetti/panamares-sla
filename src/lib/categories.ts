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
    metaTitle: "Apartamentos en Venta en Panama City",
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
    metaTitle: "Apartamentos en Alquiler en Panama City",
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
    metaTitle: "Casas en Venta en Panama City",
    metaDescription:
      "Compra una casa en Panama City. Selección de casas residenciales en las mejores urbanizaciones.",
    primaryKeyword: "casas en venta Panama",
    seoBlock:
      "Panamares tiene una amplia selección de casas en venta en Panama City y sus alrededores. Desde residencias familiares en Clayton y Altos del Golf hasta propiedades exclusivas en Costa del Este y Santa María. Cada casa cuenta con información detallada de área, habitaciones, acabados y urbanización. Nuestros agentes te orientan para encontrar la propiedad ideal según tu presupuesto y estilo de vida.",
  },
  {
    slug: "casas-en-alquiler",
    propertyType: "casa",
    businessType: "alquiler",
    h1: "Casas en Alquiler en Panama",
    metaTitle: "Casas en Alquiler en Panama City",
    metaDescription:
      "Alquila una casa en Panama City. Encuentra la opción ideal para tu familia.",
    primaryKeyword: "casas en alquiler Panama",
    seoBlock:
      "Encuentra la casa en alquiler perfecta para tu familia en Panama City. Panamares ofrece casas en Clayton, Altos del Golf, Costa del Este y más urbanizaciones residenciales. Opciones amuebladas y sin amueblar, con jardín, piscina y áreas de juego. Contratos flexibles en dólares y acompañamiento de nuestros agentes durante todo el proceso.",
  },
  {
    slug: "penthouses-en-venta",
    propertyType: "penthouse",
    businessType: "venta",
    h1: "Penthouses en Venta en Panama",
    metaTitle: "Penthouses en Venta en Panama City",
    metaDescription:
      "Penthouses de lujo en venta en Panama City. Vistas panorámicas, acabados premium en Punta Pacífica y Punta Paitilla.",
    primaryKeyword: "penthouse Panama City",
    seoBlock:
      "Los penthouses en venta en Panama City representan lo más exclusivo del mercado inmobiliario panameño. Panamares cuenta con una selección curada en Punta Pacífica, Punta Paitilla y Avenida Balboa, con vistas al océano Pacífico, terrazas privadas y acabados de primera línea. Cada propiedad incluye información completa de precio, metros cuadrados y amenidades del edificio. Habla con nuestros agentes especializados en propiedades de lujo.",
  },
  {
    slug: "apartaestudios-en-venta",
    propertyType: "apartaestudio",
    businessType: "venta",
    h1: "Apartaestudios en Venta en Panama",
    metaTitle: "Apartaestudios en Venta en Panama City",
    metaDescription:
      "Apartaestudios en venta en Panama City. Ideales para inversión o primera vivienda.",
    primaryKeyword: "apartaestudios en venta Panama",
    seoBlock:
      "Los apartaestudios en venta en Panama City son la opción ideal para inversión o primera vivienda. Panamares ofrece estudios en Obarrio, El Cangrejo y zonas céntricas con alta demanda de alquiler. Propiedades compactas y bien diseñadas, en edificios con amenidades completas. Una inversión rentable en uno de los mercados inmobiliarios más dinámicos de Latinoamérica.",
  },
  {
    slug: "oficinas-en-venta",
    propertyType: "oficina",
    businessType: "venta",
    h1: "Oficinas en Venta en Panama",
    metaTitle: "Oficinas en Venta en Panama City",
    metaDescription:
      "Oficinas en venta en Panama City. Espacios corporativos en Calle 50, Punta Pacífica y zonas empresariales.",
    primaryKeyword: "oficinas en venta Panama",
    seoBlock:
      "Panamares ofrece oficinas en venta en las principales zonas corporativas de Panama City. Desde pequeñas unidades en Obarrio y Marbella hasta plantas completas en Calle 50 y Punta Pacífica. Espacios modernos con acabados profesionales, estacionamiento y acceso a servicios. Invierte en el hub financiero de Latinoamérica con el respaldo de nuestros agentes especializados en inmuebles comerciales.",
  },
  {
    slug: "oficinas-en-alquiler",
    propertyType: "oficina",
    businessType: "alquiler",
    h1: "Oficinas en Alquiler en Panama",
    metaTitle: "Oficinas en Alquiler en Panama City",
    metaDescription:
      "Alquila una oficina en Panama City. Espacios en las principales zonas comerciales y financieras.",
    primaryKeyword: "oficinas en alquiler Panama",
    seoBlock:
      "Alquila una oficina en Panama City con Panamares. Tenemos opciones en Calle 50, Obarrio, Marbella y Punta Pacífica para empresas de cualquier tamaño. Espacios listos para operar, con estacionamiento, seguridad y servicios incluidos. Contratos en dólares y asesoría personalizada para encontrar el espacio que mejor se adapta a tu empresa.",
  },
  {
    slug: "locales-comerciales-en-venta",
    propertyType: "local",
    businessType: "venta",
    h1: "Locales Comerciales en Venta en Panama",
    metaTitle: "Locales Comerciales en Venta en Panama",
    metaDescription:
      "Locales comerciales en venta en Panama City. Invierte en el sector comercial panameño.",
    primaryKeyword: "locales comerciales Panama",
    seoBlock:
      "Invierte en locales comerciales en venta en Panama City con Panamares. Encontrarás opciones en zonas de alto tráfico como San Francisco, Obarrio y Via España — ideales para retail, restaurantes, consultorios y servicios. Propiedades con información completa de área, frente y precio por metro cuadrado. Nuestros agentes te ayudan a evaluar el potencial de retorno de cada local.",
  },
  {
    slug: "locales-comerciales-en-alquiler",
    propertyType: "local",
    businessType: "alquiler",
    h1: "Locales Comerciales en Alquiler en Panama",
    metaTitle: "Locales Comerciales en Alquiler en Panama",
    metaDescription:
      "Alquila un local comercial en Panama City. Opciones en Obarrio, San Francisco y más zonas.",
    primaryKeyword: "locales en alquiler Panama",
    seoBlock:
      "Panamares tiene locales comerciales en alquiler en las zonas más transitadas de Panama City. Desde pequeños locales en Via España y El Dorado hasta espacios amplios en centros comerciales de Obarrio y San Francisco. Ideales para arrancar o expandir tu negocio. Contratos flexibles en dólares y orientación de nuestros agentes para elegir la ubicación correcta.",
  },
  {
    slug: "terrenos-en-venta",
    propertyType: "terreno",
    businessType: "venta",
    h1: "Terrenos en Venta en Panama",
    metaTitle: "Terrenos en Venta en Panama",
    metaDescription:
      "Terrenos en venta en Panama City y provincia. Para construcción residencial o comercial.",
    primaryKeyword: "terrenos en venta Panama",
    seoBlock:
      "Encuentra terrenos en venta en Panama para tu próximo proyecto residencial o comercial. Panamares ofrece lotes en Panama City, Panamá Oeste, Chorrera y provincia, con acceso a servicios y vías principales. Cada terreno incluye información de área en metros cuadrados, zonificación y precio. Ideal para constructoras, desarrolladoras e inversores privados que buscan oportunidades de desarrollo.",
  },
  {
    slug: "casas-de-playa-en-venta",
    propertyType: "casa",
    businessType: "venta",
    h1: "Casas de Playa en Venta en Panama",
    metaTitle: "Casas de Playa en Venta en Panama",
    metaDescription:
      "Casas de playa en venta en Panama. Propiedades en Coclé, Farallón y las mejores costas panameñas.",
    primaryKeyword: "casas de playa Panama",
    seoBlock:
      "Descubre casas de playa en venta en Panama con Panamares. Propiedades frente al mar en Farallón, Coronado y las playas de Coclé, a menos de dos horas de Panama City. Desde cabañas privadas hasta villas de lujo con piscina y acceso directo a la playa. La mejor inversión para segunda vivienda o alquiler vacacional en uno de los destinos costeros más cotizados de Centroamérica.",
  },
  {
    slug: "edificios-en-venta",
    propertyType: "edificio",
    businessType: "venta",
    h1: "Edificios en Venta en Panama",
    metaTitle: "Edificios en Venta en Panama City",
    metaDescription:
      "Edificios en venta en Panama City. Inversión inmobiliaria de gran escala.",
    primaryKeyword: "edificios en venta Panama",
    seoBlock:
      "Panamares presenta edificios en venta en Panama City para inversores institucionales y privados. Desde edificios residenciales con unidades rentadas hasta torres de oficinas en zonas prime. Cada propiedad incluye información de área total, número de unidades, ocupación actual y precio. Una oportunidad única para escalar tu portafolio inmobiliario en el mercado más estable de la región.",
  },
  {
    slug: "fincas-en-venta",
    propertyType: "finca",
    businessType: "venta",
    h1: "Fincas en Venta en Panama",
    metaTitle: "Fincas en Venta en Panama",
    metaDescription:
      "Fincas en venta en Panama. Propiedades rurales y agropecuarias en Coclé y provincias.",
    primaryKeyword: "fincas en venta Panama",
    seoBlock:
      "Encuentra fincas en venta en Panama con Panamares. Propiedades rurales en Coclé, Chiriquí, Veraguas y otras provincias, con hectáreas para uso agropecuario, ganadero o ecoturístico. Cada finca incluye información de superficie, acceso vial, fuentes de agua y tipo de suelo. Una inversión sólida para quienes buscan diversificar su portafolio fuera de la ciudad.",
  },
  {
    slug: "lotes-comerciales-en-venta",
    propertyType: "lote comercial",
    businessType: "venta",
    h1: "Lotes Comerciales en Venta en Panama",
    metaTitle: "Lotes Comerciales en Venta en Panama",
    metaDescription:
      "Lotes comerciales y terrenos en venta en Panama City. Oportunidades para desarrollo.",
    primaryKeyword: "lotes comerciales Panama",
    seoBlock:
      "Panamares ofrece lotes comerciales en venta en Panama City y zonas de expansión urbana. Ideales para desarrollos mixtos, centros comerciales, hoteles o edificios de oficinas. Ubicaciones estratégicas en corredores de alto crecimiento con acceso a vías principales y servicios. Nuestros agentes te brindan análisis de zonificación y asesoría para maximizar el potencial de cada lote.",
  },
];

export function getCategoryBySlug(slug: string): CategoryConfig | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export const VALID_CATEGORY_SLUGS = new Set(CATEGORIES.map((c) => c.slug));
