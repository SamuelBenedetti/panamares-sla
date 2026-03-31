import { createClient } from "next-sanity";

const client = createClient({
  projectId: "2hojajwk",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: "skY1C2gN11YJqcPWii0DlkWhjdHgmNHIvMpeKuf0ui99uSwlztfjYDCapFilYtAfAKfqeE9hGoCQI9Ju9xW1dZ3tclkrpcnEsOkckKxN6LSShpy5cD2xyXPGjBhLUkgiJwWA6DGDJqAXbCAY2BStgevDXDuS3bOlCUeeFB0IuptPGuhPUxdu",
  useCdn: false,
});

// ── Agents ──
const agents = [
  { name: "Carlos Mendoza", role: "Director Comercial", phone: "+507 6587-1849", email: "carlos@panamares.com", bio: "Más de 15 años de experiencia en el mercado inmobiliario panameño. Especialista en propiedades de lujo en Punta Pacífica y Costa del Este." },
  { name: "María Fernanda Ríos", role: "Asesora Senior", phone: "+507 6420-6919", email: "maria@panamares.com", bio: "Experta en inversiones inmobiliarias y propiedades residenciales. Conocimiento profundo de las zonas de San Francisco, El Cangrejo y Bella Vista." },
  { name: "Roberto Castillo", role: "Asesor Inmobiliario", phone: "+507 6312-4455", email: "roberto@panamares.com", bio: "Especializado en propiedades comerciales y terrenos en Panamá Oeste y áreas de expansión urbana." },
  { name: "Ana Lucía Vargas", role: "Asesora de Alquileres", phone: "+507 6789-3210", email: "ana@panamares.com", bio: "Dedicada al mercado de alquileres de lujo. Amplia cartera de clientes internacionales buscando residencia en Panamá." },
  { name: "Diego Herrera", role: "Asesor de Inversiones", phone: "+507 6555-8877", email: "diego@panamares.com", bio: "Consultor especializado en oportunidades de inversión inmobiliaria, proyectos en pre-venta y propiedades con alto retorno." },
];

// ── Properties ──
const properties = [
  { title: "Penthouse en Punta Pacífica con vista al mar", businessType: "venta", propertyType: "penthouse", price: 1250000, bedrooms: 4, bathrooms: 4, area: 380, province: "Panamá", zone: "Punta Pacífica", lat: 8.9824, lng: -79.5199, featured: true, features: ["Vista panorámica al océano", "Piscina privada", "Terraza de 80m²", "3 estacionamientos", "Lobby con seguridad 24/7", "Gimnasio y spa"] },
  { title: "Apartamento moderno en Costa del Este", businessType: "venta", propertyType: "apartamento", price: 320000, bedrooms: 3, bathrooms: 2, area: 145, province: "Panamá", zone: "Costa del Este", lat: 9.0075, lng: -79.4636, featured: true, features: ["Cocina abierta con isla", "Pisos de porcelanato", "Área social techada", "2 estacionamientos", "Cerca de colegios internacionales"] },
  { title: "Casa de lujo en Clayton con jardín", businessType: "venta", propertyType: "casa", price: 875000, bedrooms: 5, bathrooms: 4, area: 450, province: "Panamá", zone: "Clayton", lat: 9.0128, lng: -79.5620, featured: true, features: ["Jardín de 200m²", "Piscina", "Cuarto de servicio", "Estudio", "3 estacionamientos", "Calle sin salida"] },
  { title: "Loft en Casco Viejo restaurado", businessType: "venta", propertyType: "apartamento", price: 285000, bedrooms: 1, bathrooms: 1, area: 85, province: "Panamá", zone: "Casco Viejo", lat: 8.9519, lng: -79.5346, featured: true, features: ["Techos altos de 4m", "Acabados coloniales restaurados", "Balcón con vista a la bahía", "Edificio histórico"] },
  { title: "Apartamento en San Francisco con línea blanca", businessType: "alquiler", propertyType: "apartamento", price: 1800, bedrooms: 2, bathrooms: 2, area: 110, province: "Panamá", zone: "San Francisco", lat: 8.9889, lng: -79.5088, featured: true, features: ["Amoblado completo", "Línea blanca nueva", "Piscina y gimnasio", "Cerca del metro", "Seguridad 24/7"] },
  { title: "Oficina premium en Torre de las Américas", businessType: "alquiler", propertyType: "oficina", price: 3500, bedrooms: 0, bathrooms: 2, area: 120, province: "Panamá", zone: "Punta Pacífica", lat: 8.9810, lng: -79.5185, featured: true, features: ["Piso alto con vista", "Divisiones de vidrio", "Sala de conferencias", "Recepción", "4 estacionamientos"] },
  { title: "Terreno en Coronado frente a la playa", businessType: "venta", propertyType: "terreno", price: 195000, bedrooms: 0, bathrooms: 0, area: 800, province: "Panamá Oeste", zone: "Coronado", lat: 8.5408, lng: -79.9281, featured: false, features: ["Frente de playa", "Acceso directo", "Servicios disponibles", "Zona turística"] },
  { title: "Casa en Boquete con vista al volcán", businessType: "venta", propertyType: "casa", price: 420000, bedrooms: 3, bathrooms: 3, area: 280, province: "Chiriquí", zone: "Boquete", lat: 8.7761, lng: -82.4369, featured: false, features: ["Vista al Volcán Barú", "Jardín tropical", "Chimenea", "Agua caliente natural", "Clima de montaña"] },
  { title: "Apartamento de lujo en Bella Vista", businessType: "venta", propertyType: "apartamento", price: 410000, bedrooms: 3, bathrooms: 3, area: 180, province: "Panamá", zone: "Bella Vista", lat: 8.9807, lng: -79.5282, featured: false, features: ["Acabados de lujo", "Cocina italiana", "Balcón amplio", "Área social en azotea", "2 estacionamientos"] },
  { title: "Local comercial en Vía España", businessType: "alquiler", propertyType: "local", price: 4200, bedrooms: 0, bathrooms: 1, area: 95, province: "Panamá", zone: "El Cangrejo", lat: 8.9833, lng: -79.5236, featured: false, features: ["Esquinero", "Alto tráfico peatonal", "Vitrina amplia", "Aire acondicionado central"] },
  { title: "Penthouse dúplex en Avenida Balboa", businessType: "venta", propertyType: "penthouse", price: 980000, bedrooms: 3, bathrooms: 3, area: 310, province: "Panamá", zone: "Avenida Balboa", lat: 8.9725, lng: -79.5315, featured: false, features: ["Doble altura", "Terraza con jacuzzi", "Vista a la Cinta Costera", "Cocina abierta", "Walk-in closet"] },
  { title: "Casa adosada en Brisas del Golf", businessType: "venta", propertyType: "casa", price: 265000, bedrooms: 3, bathrooms: 2, area: 160, province: "Panamá", zone: "Brisas del Golf", lat: 9.0358, lng: -79.4644, featured: false, features: ["Comunidad cerrada", "Piscina comunal", "Parque infantil", "Cerca de Ciudad del Saber"] },
  { title: "Estudio amoblado en El Cangrejo", businessType: "alquiler", propertyType: "apartamento", price: 950, bedrooms: 1, bathrooms: 1, area: 48, province: "Panamá", zone: "El Cangrejo", lat: 8.9853, lng: -79.5247, featured: false, features: ["Totalmente amoblado", "Internet incluido", "Lavandería en piso", "Cerca de restaurantes"] },
  { title: "Apartamento familiar en Condado del Rey", businessType: "venta", propertyType: "apartamento", price: 175000, bedrooms: 3, bathrooms: 2, area: 120, province: "Panamá", zone: "Condado del Rey", lat: 9.0270, lng: -79.5340, featured: false, features: ["Conjunto residencial", "Áreas verdes", "Seguridad 24/7", "Cerca de centros comerciales", "2 estacionamientos"] },
  { title: "Villa en Buenaventura Golf & Beach Resort", businessType: "venta", propertyType: "casa", price: 750000, bedrooms: 4, bathrooms: 4, area: 350, province: "Panamá Oeste", zone: "Buenaventura", lat: 8.3658, lng: -80.1394, featured: false, features: ["Campo de golf", "Acceso a playa", "Club social", "Piscina privada", "Terraza BBQ"] },
  { title: "Oficina en Obarrio zona bancaria", businessType: "alquiler", propertyType: "oficina", price: 2200, bedrooms: 0, bathrooms: 1, area: 75, province: "Panamá", zone: "Obarrio", lat: 8.9867, lng: -79.5269, featured: false, features: ["Zona bancaria", "Fácil acceso", "Aire acondicionado", "Planta de emergencia"] },
  { title: "Apartamento con vista al Canal en Amador", businessType: "venta", propertyType: "apartamento", price: 520000, bedrooms: 2, bathrooms: 2, area: 130, province: "Panamá", zone: "Amador", lat: 8.9473, lng: -79.5527, featured: false, features: ["Vista directa al Canal", "Acabados premium", "Área de BBQ", "Muelle cercano", "Ciclovía"] },
  { title: "Casa de playa en Pedasi", businessType: "venta", propertyType: "casa", price: 340000, bedrooms: 3, bathrooms: 2, area: 200, province: "Los Santos", zone: "Pedasí", lat: 7.5279, lng: -80.0262, featured: false, features: ["A 5 min de la playa", "Estilo tropical", "Terraza amplia", "Jardín con palmeras", "Tranquilidad total"] },
  { title: "Apartamento ejecutivo en Santa María Golf", businessType: "alquiler", propertyType: "apartamento", price: 2800, bedrooms: 2, bathrooms: 2, area: 140, province: "Panamá", zone: "Santa María", lat: 9.0195, lng: -79.5001, featured: false, features: ["Club de golf", "Amoblado de lujo", "Piscina infinity", "Gimnasio", "Concierge"] },
  { title: "Terreno para desarrollo en Colón", businessType: "venta", propertyType: "terreno", price: 380000, bedrooms: 0, bathrooms: 0, area: 2500, province: "Colón", zone: "Colón Centro", lat: 9.3547, lng: -79.9017, featured: false, features: ["Uso comercial permitido", "Esquina principal", "Servicios públicos", "Alta densidad permitida"] },
  { title: "Penthouse en Yoo Panamá by Starck", businessType: "venta", propertyType: "penthouse", price: 1650000, bedrooms: 4, bathrooms: 5, area: 420, province: "Panamá", zone: "Avenida Balboa", lat: 8.9718, lng: -79.5298, featured: false, features: ["Diseño Philippe Starck", "Piscina privada en terraza", "Vista 360°", "Domótica completa", "Bodega de vinos"] },
  { title: "Local comercial en Multiplaza", businessType: "alquiler", propertyType: "local", price: 8500, bedrooms: 0, bathrooms: 2, area: 150, province: "Panamá", zone: "Punta Pacífica", lat: 8.9830, lng: -79.5175, featured: false, features: ["Alto tráfico", "Centro comercial premium", "Aire acondicionado central", "Estacionamiento para clientes"] },
  { title: "Casa campestre en El Valle de Antón", businessType: "venta", propertyType: "casa", price: 295000, bedrooms: 3, bathrooms: 2, area: 220, province: "Coclé", zone: "El Valle de Antón", lat: 8.6036, lng: -80.1253, featured: false, features: ["Clima fresco todo el año", "Jardín amplio", "Cerca del mercado artesanal", "Vista a las montañas", "Comunidad segura"] },
  { title: "Apartamento nuevo en PH Rivage", businessType: "venta", propertyType: "apartamento", price: 690000, bedrooms: 3, bathrooms: 3, area: 200, province: "Panamá", zone: "Avenida Balboa", lat: 8.9730, lng: -79.5305, featured: false, features: ["Edificio nuevo", "Lobby de doble altura", "Piscina en azotea", "Salón de eventos", "Vista al mar"] },
  { title: "Casa en Ciudad del Saber", businessType: "alquiler", propertyType: "casa", price: 3200, bedrooms: 4, bathrooms: 3, area: 280, province: "Panamá", zone: "Clayton", lat: 9.0145, lng: -79.5598, featured: false, features: ["Comunidad internacional", "Jardín tropical", "Cerca de escuelas", "Ambiente tranquilo", "Seguridad privada"] },
  { title: "Apartamento en Coco del Mar remodelado", businessType: "venta", propertyType: "apartamento", price: 230000, bedrooms: 2, bathrooms: 1, area: 95, province: "Panamá", zone: "Coco del Mar", lat: 9.0010, lng: -79.4920, featured: false, features: ["Totalmente remodelado", "Cocina moderna", "Balcón con brisa marina", "1 estacionamiento", "Lavandería"] },
];

async function seed() {
  // Create agents
  console.log("Creating agents...");
  const agentIds = [];
  for (const a of agents) {
    const doc = await client.create({
      _type: "agent",
      name: a.name,
      slug: { _type: "slug", current: a.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-") },
      role: a.role,
      phone: a.phone,
      email: a.email,
      bio: [{ _type: "block", _key: Math.random().toString(36).slice(2), children: [{ _type: "span", _key: "s1", text: a.bio, marks: [] }], markDefs: [], style: "normal" }],
    });
    agentIds.push(doc._id);
    console.log(`  ✓ ${a.name}`);
  }

  // Create properties
  console.log("\nCreating properties...");
  for (let i = 0; i < properties.length; i++) {
    const p = properties[i];
    const agentId = agentIds[i % agentIds.length];
    await client.create({
      _type: "property",
      title: p.title,
      slug: { _type: "slug", current: p.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/-+$/,"") },
      businessType: p.businessType,
      propertyType: p.propertyType,
      price: p.price,
      bedrooms: p.bedrooms,
      bathrooms: p.bathrooms,
      area: p.area,
      province: p.province,
      zone: p.zone,
      location: { _type: "geopoint", lat: p.lat, lng: p.lng },
      featured: p.featured,
      features: p.features,
      agent: { _type: "reference", _ref: agentId },
      description: [{ _type: "block", _key: Math.random().toString(36).slice(2), children: [{ _type: "span", _key: "s1", text: `${p.title}. Ubicada en ${p.zone}, ${p.province}. ${p.area}m² de construcción con acabados de primera calidad. Excelente oportunidad de ${p.businessType === "venta" ? "inversión" : "vivienda"} en una de las mejores zonas del país.`, marks: [] }], markDefs: [], style: "normal" }],
    });
    console.log(`  ✓ ${p.title}`);
  }

  console.log(`\n✅ Done! Created ${agentIds.length} agents and ${properties.length} properties.`);
}

seed().catch(console.error);
