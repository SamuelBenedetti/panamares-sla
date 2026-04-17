import type { CategoryConfig } from "@/lib/categories";

export interface Faq {
  question: string;
  answer: string;
}

// ── Shared answers by property type ─────────────────────────────────────────

const PROCESS_COMPRA = `El proceso de compra en Panama consta de cuatro etapas: selección del inmueble, firma de la promesa de compraventa, trámites notariales y registro en el Registro Público. Los contratos se firman en español y los precios están en dólares americanos. Panamares te acompaña en cada paso, coordinando con abogados y gestores de trámites para que el proceso sea ágil y seguro.`;

const EXTRANJERO_COMPRA = `Sí. Los extranjeros tienen los mismos derechos de propiedad que los ciudadanos panameños. No se requiere residencia ni permiso especial para adquirir inmuebles. Panama ofrece seguridad jurídica respaldada por el Registro Público y contratos en dólares, lo que lo convierte en uno de los mercados más atractivos para inversores internacionales en Latinoamérica.`;

const EXTRANJERO_ALQUILER = `Sí. Los extranjeros pueden alquilar libremente en Panama sin necesidad de permiso especial. Los contratos de arrendamiento se firman en español y los pagos se realizan en dólares americanos. Generalmente se solicita pasaporte vigente, referencias y uno o dos meses de depósito. Panamares te asesora para que el proceso sea sencillo desde el primer contacto.`;

const PRECIOS_DOLARES = `Sí. Panama usa el dólar americano como moneda oficial, lo que elimina el riesgo cambiario para inversores y arrendatarios internacionales. Todos los contratos de alquiler y los precios de los listados están expresados en USD.`;

// ── Per-type price references ────────────────────────────────────────────────

const PRICE_REFS: Record<string, { venta: string; alquiler: string }> = {
  apartamento: {
    venta: "Los apartamentos en venta en Panama City oscilan entre $120,000 para estudios y $1,500,000+ para penthouses en torres frente al mar. Los apartamentos estándar de 2-3 habitaciones en Punta Pacífica o Punta Paitilla suelen cotizarse entre $280,000 y $600,000, con precio por metro cuadrado que varía según el edificio y la vista.",
    alquiler: "El alquiler de apartamentos en Panama City parte desde $700/mes para estudios hasta $5,000+/mes para unidades de lujo en primera línea. Un apartamento de 2 habitaciones en zona exclusiva como Punta Pacífica o Avenida Balboa ronda los $1,200–$2,500/mes dependiendo del edificio y amenidades.",
  },
  penthouse: {
    venta: "Los penthouses en venta en Panama City parten desde $500,000 y pueden superar los $3,000,000 en torres de primera línea con vistas al Pacífico. La diferencia de precio frente a un apartamento estándar refleja la terraza privada, los acabados premium y la exclusividad del piso más alto del edificio.",
    alquiler: "El alquiler de penthouses en Panama City varía entre $3,000 y $10,000/mes según la torre, el barrio y las amenidades. Son la opción preferida de ejecutivos y familias que buscan espacio, privacidad y vistas panorámicas sin comprometer la ubicación céntrica.",
  },
  casa: {
    venta: "Las casas en venta en Panama City oscilan entre $250,000 para residencias básicas y $3,000,000+ para villas en urbanizaciones cerradas de lujo. Clayton, Altos del Golf y Costa del Este ofrecen opciones entre $400,000 y $1,200,000 con jardín, piscina y seguridad privada.",
    alquiler: "El alquiler de casas en Panama City parte desde $1,200/mes y puede llegar a $8,000/mes para villas de lujo. Las urbanizaciones más demandadas como Clayton, Santa María y Costa del Este tienen precios entre $2,000 y $5,000/mes, incluidas áreas verdes y acceso a club privado.",
  },
  oficina: {
    venta: "Las oficinas en venta en Panama City van desde $80,000 para módulos pequeños hasta $2,000,000+ para plantas completas en torres corporativas de Calle 50. El precio por metro cuadrado en zona prime oscila entre $2,000 y $4,500 USD según acabados, piso y proximidad al centro financiero.",
    alquiler: "El alquiler de oficinas en Panama City parte desde $500/mes para espacios pequeños hasta $15,000+/mes para plantas completas en Calle 50 o Marbella. El precio promedio por metro cuadrado en zona corporativa es de $18–$35 USD/mes, generalmente sin incluir estacionamiento.",
  },
  local: {
    venta: "Los locales comerciales en venta en Panama City oscilan entre $60,000 para pequeños módulos y $1,500,000+ para locales en zonas de alto tráfico. El precio por metro cuadrado depende del frente a la calle, la zona y la afluencia de público.",
    alquiler: "El alquiler de locales comerciales en Panama City varía entre $400 y $15,000/mes. En zonas de alta afluencia como Obarrio y San Francisco, el precio promedio ronda los $20–$45 USD/m² al mes, mientras que en zonas secundarias puede estar entre $10 y $20 USD/m².",
  },
  apartaestudio: {
    venta: "Los apartaestudios en venta en Panama City oscilan entre $80,000 y $250,000. Su principal atractivo es el retorno por alquiler, que puede superar el 6% anual en zonas con alta demanda de inquilinos corporativos como El Cangrejo u Obarrio.",
    alquiler: "El alquiler de apartaestudios en Panama City parte desde $600/mes. Su alta demanda entre ejecutivos y estudiantes los convierte en uno de los segmentos más dinámicos del mercado, especialmente en barrios céntricos con acceso a servicios.",
  },
  terreno: {
    venta: "Los terrenos en venta en Panama varían enormemente según la zona: desde $50/m² en áreas rurales hasta $2,000+/m² en zonas prime de Panama City. Los lotes en urbanizaciones cerradas de Costa del Este o Santa María suelen costar entre $300 y $800/m².",
    alquiler: "—",
  },
  "casa de playa": {
    venta: "Las casas de playa en venta en Panama oscilan entre $150,000 para cabañas básicas y $2,000,000+ para villas frente al mar en Farallón o Coronado. El valor por metro cuadrado sigue creciendo gracias al auge del turismo y la demanda de alquiler vacacional.",
    alquiler: "—",
  },
  default: {
    venta: "Los precios varían según zona, acabados y características del inmueble. Consulta con nuestros asesores para obtener un rango actualizado y comparar las opciones disponibles en el mercado.",
    alquiler: "Los precios de alquiler varían según la zona y las características del inmueble. Contacta con nuestros asesores para obtener precios actualizados y comparar las opciones disponibles.",
  },
};

function getPrice(propertyType: string, businessType: "venta" | "alquiler"): string {
  const ref = PRICE_REFS[propertyType] ?? PRICE_REFS.default;
  return ref[businessType] ?? PRICE_REFS.default[businessType];
}

// ── Zones by property type ───────────────────────────────────────────────────

const ZONES_BY_TYPE: Record<string, string> = {
  apartamento: "Punta Pacífica, Punta Paitilla, Avenida Balboa y Obarrio",
  penthouse: "Punta Pacífica, Punta Paitilla y Avenida Balboa",
  casa: "Clayton, Altos del Golf, Costa del Este y Santa María",
  oficina: "Calle 50, Obarrio y Marbella",
  local: "Obarrio, San Francisco y Vía España",
  apartaestudio: "El Cangrejo, Obarrio y el centro histórico de Panama City",
  terreno: "zonas de expansión de Panama City, Panamá Oeste y Coclé",
  "casa de playa": "Farallón, Coronado y las costas de Coclé",
  default: "las principales zonas de Panama City",
};

function getZones(propertyType: string): string {
  return ZONES_BY_TYPE[propertyType] ?? ZONES_BY_TYPE.default;
}

// ── Public helpers ────────────────────────────────────────────────────────────

/**
 * Returns 4 static FAQs for a Tier 2 category page.
 */
export function getCategoryFaqs(config: CategoryConfig): Faq[] {
  const { propertyType, businessType, h1 } = config;
  const typeLabel = h1.split(" en Panama")[0].toLowerCase();
  const zones = getZones(propertyType);
  const priceText = getPrice(propertyType, businessType);

  if (businessType === "venta") {
    return [
      {
        question: `¿Cuánto cuesta comprar ${typeLabel} en Panama City?`,
        answer: priceText,
      },
      {
        question: `¿Cuáles son los mejores barrios para comprar ${typeLabel} en Panama?`,
        answer: `Las zonas más demandadas para ${typeLabel} son ${zones}. Cada barrio tiene su propio perfil de precio, estilo de vida y potencial de revalorización. Panamares tiene listados activos en todas estas zonas y puede asesorarte sobre cuál se adapta mejor a tu presupuesto y objetivos.`,
      },
      {
        question: `¿Cómo funciona el proceso de compra de ${typeLabel} en Panama?`,
        answer: PROCESS_COMPRA,
      },
      {
        question: `¿Puede un extranjero comprar ${typeLabel} en Panama?`,
        answer: EXTRANJERO_COMPRA,
      },
    ];
  }

  return [
    {
      question: `¿Cuánto cuesta alquilar ${typeLabel} en Panama City?`,
      answer: priceText,
    },
    {
      question: `¿Cuáles son los mejores barrios para alquilar ${typeLabel} en Panama?`,
      answer: `Las zonas con mayor oferta y demanda de ${typeLabel} en alquiler son ${zones}. La elección del barrio depende de tu presupuesto, necesidad de transporte, proximidad al trabajo y estilo de vida. Nuestros asesores te orientan para encontrar la opción que mejor se adapta a tus prioridades.`,
    },
    {
      question: `¿Qué documentos necesito para alquilar ${typeLabel} en Panama?`,
      answer: `Generalmente se solicita identificación vigente (pasaporte o cédula), referencias personales o laborales, comprobante de ingresos y uno o dos meses de depósito en garantía. Para extranjeros basta con el pasaporte. Panamares coordina con el propietario para agilizar la revisión de documentos y la firma del contrato.`,
    },
    {
      question: `¿Los precios de alquiler son en dólares en Panama?`,
      answer: PRECIOS_DOLARES,
    },
  ];
}

/**
 * Returns 4 static FAQs for a Tier 3 geo-type page.
 */
export function getGeoTypeFaqs(config: CategoryConfig, neighborhoodName: string): Faq[] {
  const { propertyType, businessType, h1 } = config;
  const typeLabel = h1.split(" en Panama")[0].toLowerCase();
  const priceText = getPrice(propertyType, businessType);

  if (businessType === "venta") {
    return [
      {
        question: `¿Cuánto cuesta comprar ${typeLabel} en ${neighborhoodName}?`,
        answer: priceText,
      },
      {
        question: `¿Por qué comprar ${typeLabel} en ${neighborhoodName}, Panama?`,
        answer: `${neighborhoodName} es una de las zonas más valoradas de Panama City por su ubicación estratégica, calidad de vida y potencial de revalorización. La demanda sostenida de propiedades en este barrio lo convierte en una opción sólida tanto para residencia propia como para inversión a largo plazo.`,
      },
      {
        question: `¿Cómo funciona el proceso de compra en Panama?`,
        answer: PROCESS_COMPRA,
      },
      {
        question: `¿Puede un extranjero comprar ${typeLabel} en ${neighborhoodName}?`,
        answer: EXTRANJERO_COMPRA,
      },
    ];
  }

  return [
    {
      question: `¿Cuánto cuesta alquilar ${typeLabel} en ${neighborhoodName}?`,
      answer: priceText,
    },
    {
      question: `¿Por qué alquilar ${typeLabel} en ${neighborhoodName}, Panama?`,
      answer: `${neighborhoodName} combina acceso a servicios, transporte y una comunidad consolidada que lo hace ideal para familias, profesionales y expatriados. La oferta de ${typeLabel} en este barrio es variada, con opciones amuebladas y sin amueblar que se adaptan a distintos presupuestos y estilos de vida.`,
    },
    {
      question: `¿Qué documentos necesito para alquilar ${typeLabel} en Panama?`,
      answer: `Generalmente se solicita identificación vigente (pasaporte o cédula), referencias y uno o dos meses de depósito en garantía. Para extranjeros basta con el pasaporte. Panamares coordina con el propietario para agilizar la revisión de documentos y la firma del contrato.`,
    },
    {
      question: `¿Puede un extranjero alquilar en Panama?`,
      answer: EXTRANJERO_ALQUILER,
    },
  ];
}
