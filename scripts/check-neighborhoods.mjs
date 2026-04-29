import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "2hojajwk",
  dataset: "production",
  token: "skcFABMWfxi5sYQqNR5akprBOXlehryPeI9cAhZqwEY1YaFi4wKvEOZZWu1TxrFMIE8xbc2Cl0bnWHQQmGwhPRnZ20j6An0qkfLx0x7A44IeFYUIIysnsARwjFgL7iI2JsJewsoFgIGdJvi7gA49lbMivmsMb2Eck39Bwxl1NRlzXfI0yk9J",
  apiVersion: "2024-01-01",
  useCdn: false,
});

const results = await client.fetch(
  `*[_type == "neighborhood"] | order(name asc) {
    name,
    "slug": slug.current,
    avgPricePerM2,
    "hasSeoBlock": defined(seoBlock) && length(seoBlock) > 0
  }`
);

if (results.length === 0) {
  console.log("❌ No hay documentos de tipo 'neighborhood' en Sanity.");
} else {
  console.log(`✅ ${results.length} barrio(s) encontrados:\n`);
  for (const r of results) {
    console.log(`  ${r.name} (${r.slug})`);
    console.log(`    avgPricePerM2: ${r.avgPricePerM2 ?? "—"}`);
    console.log(`    seoBlock: ${r.hasSeoBlock ? "✅ tiene contenido" : "❌ vacío"}`);
  }
}
