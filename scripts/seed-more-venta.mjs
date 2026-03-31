import { createClient } from "next-sanity";

const client = createClient({
  projectId: "2hojajwk",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: "skY1C2gN11YJqcPWii0DlkWhjdHgmNHIvMpeKuf0ui99uSwlztfjYDCapFilYtAfAKfqeE9hGoCQI9Ju9xW1dZ3tclkrpcnEsOkckKxN6LSShpy5cD2xyXPGjBhLUkgiJwWA6DGDJqAXbCAY2BStgevDXDuS3bOlCUeeFB0IuptPGuhPUxdu",
  useCdn: false,
});

const extra = [
  { title: "Apartamento en Punta Paitilla frente al mar", propertyType: "apartamento", price: 480000, bedrooms: 3, bathrooms: 2, area: 165, zone: "Punta Paitilla", province: "Panamá", lat: 8.9802, lng: -79.5153 },
  { title: "Casa en Marbella con piscina privada", propertyType: "casa", price: 620000, bedrooms: 4, bathrooms: 3, area: 320, zone: "Marbella", province: "Panamá", lat: 8.9854, lng: -79.5215 },
  { title: "Apartamento en Obarrio zona céntrica", propertyType: "apartamento", price: 290000, bedrooms: 2, bathrooms: 2, area: 120, zone: "Obarrio", province: "Panamá", lat: 8.9867, lng: -79.5269 },
  { title: "Penthouse en Calle 50 con terraza panorámica", propertyType: "penthouse", price: 1100000, bedrooms: 4, bathrooms: 4, area: 400, zone: "Calle 50", province: "Panamá", lat: 8.9841, lng: -79.5244 },
  { title: "Apartamento nuevo en Altos del Golf", propertyType: "apartamento", price: 355000, bedrooms: 2, bathrooms: 2, area: 135, zone: "Altos del Golf", province: "Panamá", lat: 9.0220, lng: -79.5060 },
  { title: "Casa en San Francisco remodelada", propertyType: "casa", price: 540000, bedrooms: 4, bathrooms: 3, area: 290, zone: "San Francisco", province: "Panamá", lat: 8.9889, lng: -79.5088 },
  { title: "Apartamento de inversión en Vía Porras", propertyType: "apartamento", price: 198000, bedrooms: 2, bathrooms: 1, area: 90, zone: "Vía Porras", province: "Panamá", lat: 9.0012, lng: -79.4988 },
  { title: "Loft moderno en Casco Antiguo", propertyType: "apartamento", price: 310000, bedrooms: 2, bathrooms: 2, area: 105, zone: "Casco Viejo", province: "Panamá", lat: 8.9519, lng: -79.5346 },
  { title: "Casa de playa en Río Mar", propertyType: "casa", price: 275000, bedrooms: 3, bathrooms: 2, area: 180, zone: "Río Mar", province: "Panamá Oeste", lat: 8.4920, lng: -79.9650 },
  { title: "Apartamento ejecutivo en Versalles", propertyType: "apartamento", price: 245000, bedrooms: 3, bathrooms: 2, area: 130, zone: "Versalles", province: "Panamá", lat: 9.0152, lng: -79.5198 },
  { title: "Townhouse en Albrook con jardín", propertyType: "casa", price: 395000, bedrooms: 3, bathrooms: 3, area: 220, zone: "Albrook", province: "Panamá", lat: 8.9847, lng: -79.5614 },
  { title: "Apartamento con terraza en Carrasquilla", propertyType: "apartamento", price: 165000, bedrooms: 2, bathrooms: 1, area: 88, zone: "Carrasquilla", province: "Panamá", lat: 9.0048, lng: -79.5102 },
];

async function run() {
  // Find any existing agent to use as reference
  const agents = await client.fetch('*[_type == "agent"][0..2]{_id}');
  if (!agents.length) {
    console.error("No agents found. Run seed.mjs first.");
    process.exit(1);
  }

  console.log(`Adding ${extra.length} more venta properties...`);
  for (let i = 0; i < extra.length; i++) {
    const p = extra[i];
    const agentId = agents[i % agents.length]._id;
    const slug = p.title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/-+$/, "");

    await client.create({
      _type: "property",
      title: p.title,
      slug: { _type: "slug", current: slug },
      businessType: "venta",
      propertyType: p.propertyType,
      price: p.price,
      bedrooms: p.bedrooms,
      bathrooms: p.bathrooms,
      area: p.area,
      province: p.province,
      zone: p.zone,
      location: { _type: "geopoint", lat: p.lat, lng: p.lng },
      featured: false,
      features: ["Excelente ubicación", "Acabados de primera", "Seguridad 24/7"],
      agent: { _type: "reference", _ref: agentId },
      description: [{
        _type: "block",
        _key: Math.random().toString(36).slice(2),
        children: [{ _type: "span", _key: "s1", text: `${p.title}. Ubicada en ${p.zone}, ${p.province}. ${p.area}m² de construcción.`, marks: [] }],
        markDefs: [],
        style: "normal",
      }],
    });
    console.log(`  ✓ ${p.title}`);
  }

  console.log(`\n✅ Done! Added ${extra.length} venta properties.`);
}

run().catch(console.error);
