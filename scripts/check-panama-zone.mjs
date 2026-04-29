import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "2hojajwk",
  dataset: "production",
  token: "skcFABMWfxi5sYQqNR5akprBOXlehryPeI9cAhZqwEY1YaFi4wKvEOZZWu1TxrFMIE8xbc2Cl0bnWHQQmGwhPRnZ20j6An0qkfLx0x7A44IeFYUIIysnsARwjFgL7iI2JsJewsoFgIGdJvi7gA49lbMivmsMb2Eck39Bwxl1NRlzXfI0yk9J",
  apiVersion: "2024-01-01",
  useCdn: false,
});

const count = await client.fetch(`count(*[_type == "property" && zone == "Panamá"])`);
console.log(`Propiedades con zone "Panamá": ${count}`);
