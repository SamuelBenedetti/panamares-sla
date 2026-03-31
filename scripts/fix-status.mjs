import { createClient } from "next-sanity";

const client = createClient({
  projectId: "2hojajwk",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: "skY1C2gN11YJqcPWii0DlkWhjdHgmNHIvMpeKuf0ui99uSwlztfjYDCapFilYtAfAKfqeE9hGoCQI9Ju9xW1dZ3tclkrpcnEsOkckKxN6LSShpy5cD2xyXPGjBhLUkgiJwWA6DGDJqAXbCAY2BStgevDXDuS3bOlCUeeFB0IuptPGuhPUxdu",
  useCdn: false,
});

async function run() {
  // Get all properties without listingStatus set
  const props = await client.fetch(
    `*[_type == "property" && !defined(listingStatus)]{_id, title}`
  );

  console.log(`Found ${props.length} properties without listingStatus`);

  for (const p of props) {
    await client.patch(p._id).set({ listingStatus: "activa" }).commit();
    console.log(`  ✓ ${p.title}`);
  }

  console.log(`\n✅ Done! Patched ${props.length} properties to listingStatus: "activa"`);
}

run().catch(console.error);
