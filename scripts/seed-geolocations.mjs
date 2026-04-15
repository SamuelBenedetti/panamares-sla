/**
 * One-shot: desagrupa pins solapados en el mapa.
 *
 * Problema: el import inicial asignó a todas las properties de un barrio la
 * MISMA coordenada (el centroide del barrio), así que Mapbox apila N pins
 * encima del mismo punto y solo se ve uno.
 *
 * Fix: para cada zona con 2+ listings en la misma coord, aplica un jitter
 * aleatorio (~±200m) alrededor del centroide. Idempotente: busca clusters
 * donde ≥2 listings comparten exactamente las mismas lat/lng.
 *
 * Uso:
 *   node scripts/seed-geolocations.mjs --dry-run
 *   node scripts/seed-geolocations.mjs
 */

import { createClient } from "@sanity/client";

const DRY_RUN = process.argv.includes("--dry-run");

const client = createClient({
  projectId: "2hojajwk",
  dataset: "production",
  token:
    "skY1C2gN11YJqcPWii0DlkWhjdHgmNHIvMpeKuf0ui99uSwlztfjYDCapFilYtAfAKfqeE9hGoCQI9Ju9xW1dZ3tclkrpcnEsOkckKxN6LSShpy5cD2xyXPGjBhLUkgiJwWA6DGDJqAXbCAY2BStgevDXDuS3bOlCUeeFB0IuptPGuhPUxdu",
  apiVersion: "2023-01-01",
  useCdn: false,
});

function jitter() {
  // ±0.002° ≈ ±220m — radio suficiente para que los pins se vean separados
  // pero sin sacar a la propiedad del barrio.
  return (Math.random() - 0.5) * 0.004;
}

async function main() {
  console.log(`🔎 Leyendo properties con location...\n`);

  const props = await client.fetch(`*[_type == "property" && defined(location)] {
    _id, title, zone, location
  }`);

  // Agrupa por coord exacta (redondeada a 5 decimales ≈ 1m)
  const byCoord = new Map();
  for (const p of props) {
    const key = `${p.location.lat.toFixed(5)},${p.location.lng.toFixed(5)}`;
    if (!byCoord.has(key)) byCoord.set(key, []);
    byCoord.get(key).push(p);
  }

  const clusters = Array.from(byCoord.values()).filter((list) => list.length >= 2);
  console.log(`Clusters con pins solapados: ${clusters.length}`);
  if (DRY_RUN) console.log("🔍 DRY RUN\n");

  let updated = 0;
  for (const cluster of clusters) {
    const [baseLat, baseLng] = [cluster[0].location.lat, cluster[0].location.lng];
    console.log(`\n📍 ${cluster[0].zone ?? "?"} — ${cluster.length} listings en (${baseLat}, ${baseLng})`);

    // Deja el primero donde está; el resto se mueve con jitter
    for (const p of cluster.slice(1)) {
      const lat = baseLat + jitter();
      const lng = baseLng + jitter();
      const location = { _type: "geopoint", lat, lng };

      console.log(`  ${p._id.padEnd(18)} → (${lat.toFixed(5)}, ${lng.toFixed(5)}) ${p.title.substring(0, 45)}`);

      if (!DRY_RUN) {
        try {
          await client.patch(p._id).set({ location }).commit();
          updated++;
        } catch (err) {
          console.log(`  ✗ ${err.message}`);
        }
      } else {
        updated++;
      }
    }
  }

  console.log(`\n${"─".repeat(60)}`);
  console.log(`✅ Actualizados: ${updated}`);
}

main().catch((err) => {
  console.error("\n💥 Error:", err.message);
  process.exit(1);
});
