/**
 * Seed neighborhood documents in Sanity
 * Run: node scripts/seed-neighborhoods.mjs
 * Optional: node scripts/seed-neighborhoods.mjs --dry-run
 */

import { createClient } from "@sanity/client";

const DRY_RUN = process.argv.includes("--dry-run");

const client = createClient({
  projectId: "2hojajwk",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

// Helper to build a Portable Text block from a plain string
let keyCounter = 0;
function block(text) {
  const k = `blk${++keyCounter}`;
  return {
    _type: "block",
    _key: k,
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: `${k}s`, text, marks: [] }],
  };
}

// Each entry: slug, name, avgPricePerM2, seoBlock (plain text), about (array of paragraphs)
const NEIGHBORHOODS = [
  {
    slug: "punta-pacifica",
    name: "Punta Pacífica",
    avgPricePerM2: 3200,
    seoBlock:
      "Punta Pacífica es el barrio más exclusivo de Panama City, con torres residenciales frente al Pacífico y acceso inmediato al Hospital Punta Pacífica, centros comerciales y el Corredor Sur. Con más de 55 propiedades disponibles en Panamares, es la zona con mayor oferta de apartamentos, penthouses y oficinas de lujo en la ciudad.",
    about: [
      "Punta Pacífica es la zona residencial de mayor prestigio en Panama City. Sus torres de cristal dominan el perfil costero de la ciudad, con vistas directas al océano Pacífico y a la Ciudad de Panamá Viejo. Es el barrio preferido por ejecutivos internacionales, diplomáticos y compradores de alto poder adquisitivo.",
      "El barrio concentra algunas de las direcciones más codiciadas del país: el Hospital Punta Pacífica (afiliado a Johns Hopkins Medicine), el Multiplaza Pacific —el centro comercial más exclusivo de Panama City—, y una oferta gastronómica de primer nivel. El acceso al Corredor Sur conecta en minutos con el aeropuerto Tocumen y las playas del Pacífico.",
      "En términos de precio, Punta Pacífica lidera el mercado con valores que oscilan entre $2,800 y $4,500 por metro cuadrado para propiedades nuevas. Los edificios insignia del barrio —The Ocean Club, The Point, Yacht Club Tower— establecen el estándar de acabados y amenidades en toda la ciudad. Para quien busca la mejor dirección en Panama City, Punta Pacífica es la respuesta.",
    ],
  },
  {
    slug: "punta-paitilla",
    name: "Punta Paitilla",
    avgPricePerM2: 2600,
    seoBlock:
      "Punta Paitilla es uno de los barrios residenciales más consolidados de Panama City, conocido por sus torres frente a la bahía y su tranquilidad a pocos minutos del centro financiero. Panamares tiene más de 13 propiedades disponibles entre apartamentos y terrenos en esta zona exclusiva.",
    about: [
      "Punta Paitilla es el barrio residencial más establecido de Panama City. Construido sobre una pequeña península que se adentra en la bahía de Panamá, ofrece vistas panorámicas al skyline de la ciudad, al Casco Antiguo y al Pacífico. Es una zona consolidada, con menos construcción nueva que Punta Pacífica, lo que le da un carácter más residencial y tranquilo.",
      "El barrio es ideal para familias y residentes a largo plazo. A poca distancia a pie se encuentra el Parque Recreativo Omar —el parque urbano más grande de la ciudad—, clínicas especializadas, supermercados y restaurantes de calidad. El acceso al Corredor Sur y a la Avenida Balboa facilita los desplazamientos hacia el centro financiero y el resto de la ciudad.",
      "Los precios en Punta Paitilla se sitúan entre $2,200 y $3,200 por metro cuadrado, ofreciendo una alternativa sólida a Punta Pacífica con un perfil de inquilino y comprador igualmente exigente. Los terrenos disponibles en la zona representan una oportunidad escasa en el mercado, dado el nivel de urbanización del barrio.",
    ],
  },
  {
    slug: "avenida-balboa",
    name: "Avenida Balboa",
    avgPricePerM2: 2400,
    seoBlock:
      "Avenida Balboa es el paseo marítimo de Panama City, con torres residenciales frente al mar y acceso directo al Cinta Costera. Una ubicación central con vistas al Pacífico y conexión inmediata a Punta Pacífica, Miraflores y el centro financiero.",
    about: [
      "Avenida Balboa es el gran paseo marítimo de Panama City. La avenida corre paralela a la bahía desde Punta Paitilla hasta el Casco Antiguo, flanqueada por torres residenciales de altura y la Cinta Costera —el parque lineal costero más largo de la ciudad, con ciclovías, áreas deportivas y zonas de recreo.",
      "Vivir en Avenida Balboa significa tener el mar como vista permanente y el corazón de la ciudad a pocos minutos. La zona conecta directamente con Punta Pacífica, Marbella y el centro bancario de Calle 50, lo que la convierte en una de las ubicaciones más prácticas para profesionales que trabajan en el sector financiero.",
      "Los apartamentos en Avenida Balboa se valoran por sus vistas, la amplitud de los espacios y la proximidad a todo. Los precios oscilan entre $2,000 y $3,000 por metro cuadrado, con edificios que van desde torres boutique hasta complejos con amenidades completas. Es una alternativa muy demandada para quienes buscan vista al mar sin pagar los precios de Punta Pacífica.",
    ],
  },
  {
    slug: "obarrio",
    name: "Obarrio",
    avgPricePerM2: 1900,
    seoBlock:
      "Obarrio es uno de los barrios más dinámicos de Panama City, con una mezcla de residencias, oficinas, restaurantes y locales comerciales en el corazón de la ciudad. Zona muy demandada para alquiler de apartamentos y locales comerciales por su posición central.",
    about: [
      "Obarrio es el barrio más vivaz del centro urbano de Panama City. Situado entre Calle 50 y el Área Bancaria, concentra una oferta excepcional de restaurantes, bares, cafeterías y tiendas que lo convierten en el punto de encuentro favorito de residentes y expatriados. No es un barrio de lujo silencioso — es un barrio con energía propia.",
      "La demanda de alquiler en Obarrio es consistentemente alta, especialmente entre ejecutivos y profesionales que valoran la proximidad a pie a sus oficinas en Calle 50 y el Área Bancaria. Los locales comerciales en Obarrio tienen una de las tasas de ocupación más altas de la ciudad, lo que lo convierte en una zona atractiva para inversión comercial.",
      "Los precios de alquiler de apartamentos en Obarrio son competitivos frente a Punta Pacífica, con un entorno más urbano y accesible. Un apartamento de dos habitaciones ronda entre $1,200 y $1,800 al mes. Para locales comerciales, la demanda supera la oferta disponible en los corredores principales del barrio.",
    ],
  },
  {
    slug: "calle-50",
    name: "Calle 50",
    avgPricePerM2: 2100,
    seoBlock:
      "Calle 50 es el eje financiero y corporativo de Panama City, con oficinas, bancos, hoteles internacionales y restaurantes ejecutivos. La zona más demandada para oficinas en venta y alquiler en toda la ciudad.",
    about: [
      "Calle 50 es el corazón financiero de Panama City y uno de los corredores corporativos más activos de Latinoamérica. Aquí tienen sede los principales bancos internacionales, firmas de abogados, fondos de inversión y sedes regionales de empresas multinacionales. La actividad comercial es permanente y la demanda de espacio de oficinas, constante.",
      "Más allá de las oficinas, Calle 50 y sus calles adyacentes concentran una oferta gastronómica de nivel ejecutivo: restaurantes de autor, hoteles de cinco estrellas como el Waldorf Astoria y el Hard Rock Hotel, y centros comerciales como Multiplaza. El entorno combina eficiencia corporativa con calidad de vida urbana.",
      "Para inversores, Calle 50 ofrece algunas de las mejores rentabilidades en oficinas comerciales de todo Panama City. Los precios por metro cuadrado para compra oscilan entre $1,800 y $2,800, con tasas de ocupación elevadas y demanda sostenida de inquilinos corporativos de primer nivel.",
    ],
  },
  {
    slug: "costa-del-este",
    name: "Costa del Este",
    avgPricePerM2: 2200,
    seoBlock:
      "Costa del Este es la urbanización planificada más moderna de Panama City, con amplias avenidas, parques y torres residenciales de lujo. Ideal para familias que buscan un entorno tranquilo con todas las comodidades urbanas, a 15 minutos del aeropuerto Tocumen.",
    about: [
      "Costa del Este es la urbanización planificada más completa de Panama City. Diseñada con amplias avenidas arboladas, parques, ciclovías y zonas comerciales integradas, ofrece un estilo de vida ordenado y moderno que contrasta con la densidad urbana del centro de la ciudad. Es el destino preferido de familias panameñas de alto poder adquisitivo y ejecutivos con hijos.",
      "La zona cuenta con colegios internacionales, el Hospital Pacífica Salud, centros comerciales de formato abierto y una oferta de restaurantes en constante crecimiento. Su ubicación a 15 minutos del aeropuerto internacional Tocumen la convierte en la elección natural para ejecutivos con viajes frecuentes.",
      "El mercado inmobiliario en Costa del Este combina apartamentos de lujo en torres con amenidades completas y casas en urbanizaciones cerradas con vigilancia 24 horas. Los precios oscilan entre $1,800 y $2,800 por metro cuadrado, con fuerte demanda tanto en venta como en alquiler por parte de familias y empresas con personal expatriado.",
    ],
  },
  {
    slug: "san-francisco",
    name: "San Francisco",
    avgPricePerM2: 1700,
    seoBlock:
      "San Francisco es un barrio residencial y comercial consolidado de Panama City, con una amplia oferta de locales comerciales, apartamentos y servicios. Muy bien comunicado con Calle 50, Marbella y el Corredor Sur.",
    about: [
      "San Francisco es uno de los barrios más grandes y completos de Panama City. Barrio residencial de clase media-alta con una importante presencia comercial, combina edificios de apartamentos modernos con zonas de locales y oficinas de menor escala que las del centro financiero. Es un barrio funcional, con todo lo necesario a distancia caminable.",
      "La Via España atraviesa el corazón del barrio, con una concentración de servicios, clínicas, restaurantes y comercios de uso cotidiano. San Francisco conecta con facilidad a Marbella, Obarrio y al Corredor Sur, lo que lo convierte en una opción práctica para residentes que necesitan moverse por toda la ciudad.",
      "Para locales comerciales en alquiler, San Francisco ofrece una de las mejores relaciones precio-ubicación de Panama City. Los precios de alquiler de apartamentos son más accesibles que en Punta Pacífica o Costa del Este, con una demanda estable sostenida por la comunidad local y los servicios del barrio.",
    ],
  },
  {
    slug: "albrook",
    name: "Albrook",
    avgPricePerM2: 1600,
    seoBlock:
      "Albrook es un barrio tranquilo y arbolado de Panama City, próximo al aeropuerto doméstico Marcos Gelabert y al centro comercial Albrook Mall. Con casas y apartamentos a precios competitivos, es ideal para familias que buscan amplitud y naturaleza dentro de la ciudad.",
    about: [
      "Albrook es uno de los barrios más verdes y tranquilos de Panama City. Antiguo enclave militar convertido en zona residencial, conserva amplias avenidas arboladas, parques y una escala humana que lo diferencia del resto de la ciudad. Es el barrio donde el ruido urbano se detiene.",
      "La proximidad al aeropuerto doméstico Marcos Gelabert y a las terminales de buses del Albrook Mall lo convierte en un nodo de movilidad importante. El centro comercial Albrook Mall, uno de los más grandes de Centroamérica, aporta toda la oferta comercial que el barrio necesita. El Parque Natural Metropolitano está a pocos minutos.",
      "Las propiedades en Albrook tienden a ser casas y apartamentos con más metros cuadrados por el mismo precio que zonas más céntricas. Es una opción muy valorada por familias panameñas y por profesionales que priorizan la calidad del entorno sobre la proximidad al centro financiero.",
    ],
  },
  {
    slug: "coco-del-mar",
    name: "Coco del Mar",
    avgPricePerM2: 2000,
    seoBlock:
      "Coco del Mar es un barrio residencial exclusivo entre Punta Paitilla y San Francisco, conocido por su tranquilidad y la calidad de sus edificios. Con acceso directo a la Cinta Costera y vistas parciales al mar, es una zona muy demandada para residencia familiar.",
    about: [
      "Coco del Mar es uno de los barrios residenciales más tranquilos y buscados de Panama City. Situado entre Punta Paitilla y San Francisco, mantiene un perfil bajo de tráfico y una densidad construida más controlada que sus vecinos inmediatos. Sus calles arboladas y la escala más humana de sus edificios lo diferencian del resto del corredor costero.",
      "El barrio tiene acceso directo a la Cinta Costera, lo que permite paseos a pie o en bicicleta frente al mar sin salir del entorno residencial. La oferta de servicios cotidianos —supermercados, farmacias, restaurantes— es completa y a distancia caminable para la mayoría de los residentes.",
      "Los apartamentos en Coco del Mar son muy valorados por compradores que buscan calidad de vida y tranquilidad sin alejarse del centro de la ciudad. Los precios reflejan esa demanda sostenida, con valores entre $1,800 y $2,500 por metro cuadrado en edificios de calidad.",
    ],
  },
  {
    slug: "santa-maria",
    name: "Santa María",
    avgPricePerM2: 2500,
    seoBlock:
      "Santa María es la urbanización de lujo más exclusiva de la periferia de Panama City, con campos de golf, casas de alta gama y un entorno completamente planificado. Ideal para familias que buscan privacidad, seguridad y el mejor estilo de vida suburbano de Panama.",
    about: [
      "Santa María es la urbanización privada más prestigiosa de Panama City. Desarrollada en torno a un campo de golf de 18 hoyos diseñado por Jack Nicklaus, ofrece un entorno completamente planificado con residencias de alta gama, amplias zonas verdes y el nivel de seguridad y privacidad más alto del mercado panameño.",
      "La urbanización cuenta con su propio club house, restaurante, piscinas y canchas deportivas. La comunidad es compacta y exclusiva, con un perfil de residente que incluye ejecutivos internacionales, diplomáticos y familias panameñas de alto nivel. El acceso controlado y la distancia del tráfico urbano son sus principales atractivos.",
      "Las propiedades en Santa María —casas y villas en la mayoría de los casos— representan el segmento más alto del mercado residencial panameño. Los precios por metro cuadrado superan los $2,200, con propiedades que pueden alcanzar varios millones de dólares. Una inversión de largo plazo en el activo residencial más exclusivo del país.",
    ],
  },
  {
    slug: "marbella",
    name: "Marbella",
    avgPricePerM2: 2000,
    seoBlock:
      "Marbella es un barrio corporativo y residencial en el corazón del centro financiero de Panama City, a pasos de Calle 50 y el Área Bancaria. Muy demandado para oficinas en alquiler y apartamentos ejecutivos.",
    about: [
      "Marbella es el barrio donde lo residencial y lo corporativo conviven en el mismo bloque. Situado a pasos de Calle 50 y el Área Bancaria, es la elección natural para ejecutivos que quieren vivir y trabajar en el mismo entorno. La densidad urbana es alta pero el barrio mantiene una escala más íntima que el corazón de Calle 50.",
      "Los edificios de oficinas boutique de Marbella son muy buscados por firmas medianas de servicios profesionales —abogados, consultores, empresas tecnológicas— que necesitan una dirección corporativa de nivel sin pagar las tarifas de los grandes centros empresariales. La oferta de restaurantes ejecutivos y cafeterías completa el entorno.",
      "Para uso residencial, Marbella ofrece apartamentos ejecutivos bien comunicados con toda la ciudad. La proximidad al Corredor Sur, a Punta Pacífica y al centro financiero lo convierte en una de las zonas más convenientes para profesionales con agenda densa.",
    ],
  },
  {
    slug: "el-cangrejo",
    name: "El Cangrejo",
    avgPricePerM2: 1600,
    seoBlock:
      "El Cangrejo es el barrio más cosmopolita y bohemio de Panama City, con una vibrante escena gastronómica y cultural. Muy demandado para alquiler de apartamentos por su ambiente urbano y su posición central.",
    about: [
      "El Cangrejo es el barrio más cosmopolita de Panama City. Con una densa concentración de restaurantes internacionales, bares, cafeterías y comercios independientes, tiene una energía urbana que lo distingue del resto de la ciudad. Es el barrio favorito de la comunidad expat, artistas y jóvenes profesionales.",
      "La vida en El Cangrejo transcurre en gran medida en la calle. El Via Veneto —su eje gastronómico principal— es el paseo más animado de la ciudad después de Calle Uruguay. El barrio concentra varios de los mejores restaurantes de Panama City, además de algunos de los mercados y tiendas de productos importados más variados del país.",
      "Los apartamentos en El Cangrejo tienen una demanda de alquiler muy estable, especialmente entre expatriados y profesionales que valoran el entorno urbano y caminable. Los precios de alquiler son accesibles comparados con Punta Pacífica, con una calidad de vida cotidiana que muchos consideran superior.",
    ],
  },
  {
    slug: "altos-del-golf",
    name: "Altos del Golf",
    avgPricePerM2: 1800,
    seoBlock:
      "Altos del Golf es un barrio residencial tranquilo y arbolado próximo al Club de Golf de Panamá. Con casas amplias y apartamentos en entorno verde, es ideal para familias que buscan tranquilidad a pocos minutos del centro de la ciudad.",
    about: [
      "Altos del Golf es uno de los barrios residenciales más tranquilos y verdes del área metropolitana de Panama City. Su nombre hace referencia al Club de Golf de Panamá, que bordea el barrio y le aporta amplias zonas verdes y un entorno alejado del ruido urbano. Es un barrio familiar por excelencia.",
      "Las calles de Altos del Golf tienen una escala diferente al resto de la ciudad: más anchas, más arboladas y con menos tráfico. Las casas con jardín son el tipo de propiedad predominante, aunque existen edificios de apartamentos de mediana altura en sus bordes. Es una opción muy valorada por familias panameñas con hijos en edad escolar.",
      "La proximidad a Clayton, al City of Knowledge y a las principales vías de acceso al centro de la ciudad hace de Altos del Golf una ubicación práctica sin renunciar a la calidad de entorno. Los precios son más accesibles que en Costa del Este o Santa María, con propiedades de mayor tamaño por el mismo presupuesto.",
    ],
  },
  {
    slug: "bella-vista",
    name: "Bella Vista",
    avgPricePerM2: 1700,
    seoBlock:
      "Bella Vista es un barrio residencial céntrico de Panama City con buena conectividad y precios accesibles frente a otras zonas exclusivas. Opción sólida para primera vivienda o inversión en alquiler por su posición entre el centro financiero y las zonas costeras.",
    about: [
      "Bella Vista es un barrio residencial consolidado en el corazón de Panama City. Con décadas de historia urbana, combina edificios de apartamentos de distintas épocas con comercios de proximidad y una conectividad excelente hacia todas las zonas de la ciudad. Es un barrio práctico, sin pretensiones de lujo, pero con una ubicación muy eficiente.",
      "Su posición entre el área bancaria de Calle 50 y el corredor costero de Avenida Balboa lo convierte en una opción lógica para profesionales que trabajan en el centro financiero. El acceso a transporte público, la variedad de servicios y la cercanía a restaurantes y comercios son los principales atractivos del barrio.",
      "Para inversión en alquiler, Bella Vista ofrece una demanda estable con precios de entrada más accesibles que Punta Pacífica o Punta Paitilla. Un apartamento de dos habitaciones puede alquilarse entre $900 y $1,400 al mes, con una tasa de vacancia baja sostenida por la demanda del sector corporativo adyacente.",
    ],
  },
  {
    slug: "coronado",
    name: "Coronado",
    avgPricePerM2: 1400,
    seoBlock:
      "Coronado es el balneario más conocido de Panama, a 80 km de Panama City. Con casas de playa, condominios frente al mar y un entorno de resort, es el destino preferido para segunda vivienda y alquiler vacacional en el Pacífico panameño.",
    about: [
      "Coronado es el destino de playa más popular para los residentes de Panama City. A solo 80 kilómetros por la Carretera Interamericana, es alcanzable en menos de una hora, lo que lo convierte en el lugar ideal para segunda residencia, fines de semana y alquiler vacacional. El Río Mar, el Sheraton Bijao y varios condominios de playa de alto nivel están en su entorno.",
      "La zona cuenta con servicios completos para una comunidad de segunda residencia: supermercados, restaurantes, campo de golf, canchas de tenis y clubes de playa. Muchas familias panameñas tienen en Coronado su casa de playa permanente, convirtiéndolo en una comunidad con vida propia más allá de los fines de semana.",
      "Los precios en Coronado son significativamente más accesibles que en Panama City, con casas y condominios frente al mar desde $120,000 hasta $600,000 dependiendo del tamaño y la ubicación. La rentabilidad del alquiler vacacional es atractiva dado el flujo constante de turistas nacionales e internacionales durante todo el año.",
    ],
  },
];

async function run() {
  console.log(`\n🏘  Seeding ${NEIGHBORHOODS.length} neighborhood documents`);
  if (DRY_RUN) console.log("   (DRY RUN — no writes)\n");

  let created = 0;
  let skipped = 0;

  for (const nbh of NEIGHBORHOODS) {
    const docId = `neighborhood-${nbh.slug}`;

    const aboutBlocks = nbh.about.map((para) => block(para));

    const doc = {
      _id: docId,
      _type: "neighborhood",
      name: nbh.name,
      slug: { _type: "slug", current: nbh.slug },
      avgPricePerM2: nbh.avgPricePerM2,
      seoBlock: nbh.seoBlock,
      about: aboutBlocks,
    };

    if (DRY_RUN) {
      console.log(`  [dry] ${docId} — "${nbh.name}"`);
      skipped++;
      continue;
    }

    try {
      await client.createOrReplace(doc);
      console.log(`  ✓ ${docId} — "${nbh.name}"`);
      created++;
    } catch (err) {
      console.error(`  ✗ ${docId} — ${err.message}`);
    }
  }

  console.log(`\nDone. Created/updated: ${created} | Skipped: ${skipped}\n`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
