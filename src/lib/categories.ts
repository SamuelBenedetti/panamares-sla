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
      "Panamares ofrece la mayor selección de apartamentos en venta en Panama City. Desde estudios hasta penthouses, encontrarás opciones en las zonas más exclusivas: Punta Pacífica, Punta Paitilla, Avenida Balboa y Obarrio. Todos los inmuebles son verificados y cuentan con información completa de precio, área en m², habitaciones, baños, estacionamientos y amenidades del edificio. Ya sea para primera vivienda, segunda residencia o inversión con retorno en alquiler, tenemos la propiedad ideal para cada perfil. Nuestros agentes especializados te acompañan en cada paso del proceso de compra, desde la visita hasta la firma del contrato.",
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
      "Encuentra el apartamento en alquiler ideal en Panama City con Panamares. Tenemos opciones en Punta Pacífica, Punta Paitilla, Avenida Balboa, Obarrio y más zonas residenciales de alta demanda. Apartamentos amueblados y sin amueblar, con una o varias habitaciones, en edificios con amenidades completas: piscina, gimnasio, seguridad 24/7 y áreas sociales. Precios competitivos en dólares, contratos transparentes en español y atención personalizada de nuestros agentes. Filtra por zona, número de habitaciones o presupuesto y agenda una visita el mismo día. Encontrar tu próximo hogar en Panamá nunca fue tan fácil.",
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
      "Panamares tiene una amplia selección de casas en venta en Panama City y sus alrededores. Desde residencias familiares en Clayton y Altos del Golf hasta propiedades exclusivas en Costa del Este, Santa María y Las Cumbres. Cada casa cuenta con información detallada de área total, habitaciones, baños, acabados y urbanización. Nuestras propiedades incluyen opciones con jardín privado, piscina y área de empleados en urbanizaciones cerradas con seguridad. Nuestros agentes te orientan para encontrar la propiedad ideal según tu presupuesto, número de integrantes del hogar y estilo de vida en Panama City.",
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
      "Encuentra la casa en alquiler perfecta para tu familia en Panama City con Panamares. Ofrecemos casas en Clayton, Altos del Golf, Costa del Este, Las Cumbres y más urbanizaciones residenciales. Opciones amuebladas y sin amueblar, con jardín, piscina, cuarto de empleados y áreas de juego para niños. Nuestras propiedades están en urbanizaciones cerradas con seguridad privada, ofreciendo comodidad y tranquilidad para toda la familia. Contratos flexibles en dólares, depósitos negociables y acompañamiento de nuestros agentes durante todo el proceso de arrendamiento.",
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
      "Los penthouses en venta en Panama City representan lo más exclusivo del mercado inmobiliario panameño. Panamares cuenta con una selección curada en Punta Pacífica, Punta Paitilla y Avenida Balboa, con vistas panorámicas al océano Pacífico, terrazas privadas y acabados de primera línea. Cada propiedad incluye información completa de precio, metros cuadrados de terraza, habitaciones y amenidades del edificio. Los penthouses más cotizados de la ciudad ofrecen doble altura, piscinas privadas y acceso exclusivo desde el ascensor. Habla con nuestros agentes especializados en propiedades de lujo para recibir asesoramiento personalizado y acceder a las mejores oportunidades del mercado.",
  },
  {
    slug: "penthouses-en-alquiler",
    propertyType: "penthouse",
    businessType: "alquiler",
    h1: "Penthouses en Alquiler en Panama",
    metaTitle: "Penthouses en Alquiler en Panama City",
    metaDescription:
      "Penthouses de lujo en alquiler en Panama City. Vistas panorámicas, acabados premium en Punta Pacífica y Punta Paitilla.",
    primaryKeyword: "penthouse en alquiler Panama City",
    seoBlock:
      "Alquila un penthouse de lujo en Panama City con Panamares. Contamos con una selección exclusiva en Punta Pacífica, Punta Paitilla y Avenida Balboa, con vistas panorámicas al océano Pacífico, terrazas privadas y acabados de primera línea. Ideales para ejecutivos, diplomáticos y familias que buscan lo mejor de la vida en Panamá sin el compromiso de compra. Nuestros penthouses en alquiler incluyen opciones amuebladas, acceso exclusivo desde el ascensor y amenidades premium del edificio. Nuestros agentes especializados en propiedades de lujo te acompañan para encontrar el penthouse perfecto según tus requerimientos y presupuesto.",
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
      "Los apartaestudios en venta en Panama City son la opción ideal para inversión, primera vivienda o residencia céntrica. Panamares ofrece estudios en Obarrio, El Cangrejo, Marbella y zonas céntricas con alta demanda de alquiler, garantizando rentabilidad desde el primer día. Propiedades compactas y bien diseñadas, en edificios modernos con amenidades completas: gimnasio, piscina y lobby profesional. Una inversión rentable en uno de los mercados inmobiliarios más dinámicos de Latinoamérica, con precios de entrada accesibles y alta liquidez. Nuestros agentes te asesoran sobre las mejores opciones según tu perfil de inversión y presupuesto.",
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
      "Panamares ofrece oficinas en venta en las principales zonas corporativas de Panama City. Desde pequeñas unidades en Obarrio y Marbella hasta plantas completas en Calle 50, Punta Pacífica y el corredor financiero de Via España. Espacios modernos con acabados profesionales, estacionamiento incluido y acceso a servicios de primer nivel. Adquirir tu oficina propia en Panama City es una decisión estratégica: contratos en dólares, mercado corporativo en crecimiento y alta demanda de arrendamiento. Invierte en el hub financiero de Latinoamérica con el respaldo de nuestros agentes especializados en inmuebles comerciales y corporativos.",
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
      "Alquila una oficina en Panama City con Panamares y establece tu empresa en el hub financiero de la región. Tenemos opciones en Calle 50, Obarrio, Marbella y Punta Pacífica para empresas de cualquier tamaño, desde unidades individuales hasta plantas completas. Espacios listos para operar, con estacionamiento, seguridad, salas de reuniones y servicios de telecomunicaciones incluidos. También disponemos de espacios de coworking y oficinas para startups y consultores independientes. Contratos flexibles en dólares y asesoría personalizada para encontrar el espacio que mejor se adapta a las necesidades de tu empresa.",
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
      "Invierte en locales comerciales en venta en Panama City con Panamares. Encontrarás opciones en zonas de alto tráfico peatonal y vehicular como San Francisco, Obarrio y Via España — ideales para retail, restaurantes, consultorios médicos y servicios profesionales. Cada propiedad incluye información completa de área total, frente en metros lineales y precio por metro cuadrado, facilitando el análisis de viabilidad de tu negocio. Panama City es uno de los mercados comerciales más activos de Centroamérica, con alta demanda de locales bien ubicados. Nuestros agentes te ayudan a evaluar el potencial de retorno de cada local.",
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
      "Panamares tiene locales comerciales en alquiler en las zonas más transitadas de Panama City. Desde pequeños locales en Via España y El Dorado hasta espacios amplios en centros comerciales de Obarrio, San Francisco y Marbella. Ideales para arrancar o expandir tu negocio en uno de los mercados de consumo más dinámicos de Latinoamérica. Nuestros locales en alquiler incluyen opciones con fachada a calle, zona de carga y descarga y acceso para personas con movilidad reducida. Contratos flexibles en dólares y orientación de nuestros agentes para elegir la ubicación que maximice la visibilidad de tu marca.",
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
      "Encuentra terrenos en venta en Panama para tu próximo proyecto residencial o comercial con Panamares. Ofrecemos lotes en Panama City, Panamá Oeste, La Chorrera y provincia, con acceso a servicios básicos y vías principales de comunicación. Cada terreno incluye información de área en m², zonificación permitida, topografía y precio por metro cuadrado. Ideal para constructoras, desarrolladoras e inversores privados que buscan oportunidades de desarrollo en un mercado con alta valorización. También disponemos de terrenos con planos aprobados listos para construir. Nuestros agentes te acompañan en el análisis y la negociación de cada oportunidad.",
  },
  {
    slug: "terrenos-en-alquiler",
    propertyType: "terreno",
    businessType: "alquiler",
    h1: "Terrenos en Alquiler en Panama",
    metaTitle: "Terrenos en Alquiler en Panama",
    metaDescription:
      "Terrenos en alquiler en Panama City y provincia. Para uso comercial, industrial o agrícola.",
    primaryKeyword: "terrenos en alquiler Panama",
    seoBlock:
      "Encuentra terrenos en alquiler en Panama para tu proyecto comercial, industrial o agropecuario con Panamares. Ofrecemos lotes en Panama City, Panamá Oeste y provincia, con acceso a vías principales y servicios básicos. Cada terreno incluye información de área en m², zonificación permitida y precio mensual. Ideal para empresas que necesitan espacio temporal para operaciones, almacenaje o desarrollo de proyectos sin invertir en compra. Nuestros agentes te orientan para encontrar el terreno en alquiler que mejor se adapta a las necesidades de tu negocio.",
  },
  {
    slug: "casas-de-playa-en-alquiler",
    propertyType: "casa de playa",
    businessType: "alquiler",
    h1: "Casas de Playa en Alquiler en Panama",
    metaTitle: "Casas de Playa en Alquiler en Panama",
    metaDescription:
      "Casas de playa en alquiler en Panama. Propiedades en Coclé, Farallón y las mejores costas panameñas.",
    primaryKeyword: "casas de playa en alquiler Panama",
    seoBlock:
      "Alquila una casa de playa en Panama con Panamares. Propiedades frente al mar en Farallón, Coronado, Santa Clara y las mejores playas de Coclé, a menos de dos horas de Panama City. Desde cabañas privadas hasta villas con piscina y acceso directo a la playa. Ideal para vacaciones, fines de semana o estancias temporales en uno de los destinos costeros más cotizados de Centroamérica. También disponemos de opciones para alquiler turístico de corta estancia. Nuestros agentes conocen cada comunidad costera para ayudarte a encontrar la casa de playa perfecta.",
  },
  {
    slug: "casas-de-playa-en-venta",
    propertyType: "casa de playa",
    businessType: "venta",
    h1: "Casas de Playa en Venta en Panama",
    metaTitle: "Casas de Playa en Venta en Panama",
    metaDescription:
      "Casas de playa en venta en Panama. Propiedades en Coclé, Farallón y las mejores costas panameñas.",
    primaryKeyword: "casas de playa Panama",
    seoBlock:
      "Descubre casas de playa en venta en Panama con Panamares. Propiedades frente al mar en Farallón, Coronado, Santa Clara y las mejores playas de Coclé, a menos de dos horas de Panama City por la autopista Panamericana. Desde cabañas privadas y villas de un nivel hasta residencias de lujo con piscina, acceso directo a la playa y vistas al Pacífico. La mejor inversión para segunda vivienda, residencia vacacional o proyecto de alquiler turístico en uno de los destinos costeros más cotizados de Centroamérica. Nuestros agentes conocen cada proyecto y comunidad costera para orientarte en la mejor decisión.",
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
      "Panamares presenta edificios en venta en Panama City para inversores institucionales y privados que buscan rentabilidad a gran escala. Desde edificios residenciales con unidades rentadas y flujo de caja inmediato hasta torres de oficinas en zonas prime de la ciudad. Cada propiedad incluye información de área total construida, número de unidades o plantas, ocupación actual, ingresos por alquiler y precio total. El mercado panameño ofrece seguridad jurídica, contratos en dólares y alta demanda de arrendamiento. Una oportunidad única para escalar tu portafolio inmobiliario en el mercado más estable de la región.",
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
      "Encuentra fincas en venta en Panama con Panamares. Propiedades rurales en Coclé, Chiriquí, Veraguas y otras provincias, con hectáreas para uso agropecuario, ganadero, ecoturístico o residencial de campo. Cada finca incluye información detallada de superficie total, acceso vial, fuentes de agua, tipo de suelo y uso permitido. También disponemos de fincas con infraestructura existente: corrales, sistemas de riego y viviendas de apoyo. Una inversión sólida y diversificada para quienes buscan oportunidades fuera de la ciudad, con potencial de valorización en zonas de creciente interés turístico y agroproductivo en Panamá.",
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
      "Panamares ofrece lotes comerciales en venta en Panama City y zonas de expansión urbana para desarrolladores e inversores de largo plazo. Ideales para proyectos mixtos, centros comerciales, hoteles, edificios de oficinas o desarrollos residenciales en altura. Ubicaciones estratégicas en corredores de alto crecimiento con acceso a vías principales, redes de servicios y aprobaciones de zonificación comercial vigentes. Panama City es una de las ciudades de mayor dinamismo constructivo de Latinoamérica, con demanda creciente de suelo urbanizable bien ubicado. Nuestros agentes te brindan análisis de zonificación y asesoría completa para maximizar el potencial de cada lote.",
  },
];

export function getCategoryBySlug(slug: string): CategoryConfig | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export const VALID_CATEGORY_SLUGS = new Set(CATEGORIES.map((c) => c.slug));

// Maps a raw Sanity propertyType + businessType to its category slug, used for
// 301 redirects when a listing is sold/retired.
const TYPE_TO_CATEGORY_BASE: Record<string, string> = {
  apartamento: "apartamentos",
  apartaestudio: "apartaestudios",
  casa: "casas",
  "casa de playa": "casas-de-playa",
  penthouse: "penthouses",
  oficina: "oficinas",
  local: "locales-comerciales",
  terreno: "terrenos",
  edificio: "edificios",
  finca: "fincas",
  "lote comercial": "lotes-comerciales",
};

export function getCategorySlugFor(propertyType: string, businessType: "venta" | "alquiler"): string {
  const base = TYPE_TO_CATEGORY_BASE[propertyType];
  if (!base) return businessType === "venta" ? "propiedades-en-venta" : "propiedades-en-alquiler";
  const candidate = `${base}-en-${businessType}`;
  return VALID_CATEGORY_SLUGS.has(candidate)
    ? candidate
    : businessType === "venta" ? "propiedades-en-venta" : "propiedades-en-alquiler";
}
