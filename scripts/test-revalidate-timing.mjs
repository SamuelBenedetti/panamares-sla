/**
 * End-to-end timing test of the humanReviewed gate cycle.
 *
 *   1. Probe URL EN → expect 308 (because humanReviewed:false right now)
 *   2. Patch humanReviewed:true on the published doc — this triggers Sanity
 *      webhook → /api/revalidate → revalidateTag("sanity")
 *   3. Poll the URL every 500 ms; record T_seen when it flips to 200
 *   4. Patch humanReviewed:false → poll until 308 → record
 *   5. Print round-trip times
 */

import { createClient } from "@sanity/client";
import { config } from "dotenv";
config({ path: ".env.local" });

const sanity = createClient({
  projectId:  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "2hojajwk",
  dataset:    process.env.NEXT_PUBLIC_SANITY_DATASET   ?? "production",
  token:      process.env.SANITY_WRITE_TOKEN,
  apiVersion: "2023-01-01",
  useCdn:     false,
});

const DOC_ID = "wasi-9916551";
const URL_EN = "https://panamares-sla.vercel.app/en/properties/apartments-for-sale-punta-pacifica-9916551";

async function probeStatus(url) {
  const res = await fetch(url, { method: "HEAD", redirect: "manual" });
  return res.status;
}

async function pollUntil(url, expectedStatus, label, maxSeconds = 90) {
  const start = Date.now();
  let attempts = 0;
  while ((Date.now() - start) / 1000 < maxSeconds) {
    attempts++;
    const status = await probeStatus(url);
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    if (status === expectedStatus) {
      console.log(`  ✅ ${label} — flipped to ${status} after ${elapsed}s (${attempts} probes)`);
      return Number(elapsed);
    }
    process.stdout.write(`  …polling (${elapsed}s, status=${status})\r`);
    await new Promise(r => setTimeout(r, 500));
  }
  console.log(`  ❌ ${label} — never reached ${expectedStatus} in ${maxSeconds}s`);
  return null;
}

async function setHumanReviewed(value) {
  await sanity.patch(DOC_ID).set({ humanReviewed: value }).commit();
}

async function main() {
  console.log(`\n${"═".repeat(60)}`);
  console.log("  E2E timing test — humanReviewed gate");
  console.log(`${"═".repeat(60)}\n`);

  // Initial state
  console.log("1. Setting baseline: humanReviewed:false");
  await setHumanReviewed(false);
  await new Promise(r => setTimeout(r, 5000)); // give time to settle
  const initialStatus = await probeStatus(URL_EN);
  console.log(`   URL initial status: ${initialStatus} (expecting 308)\n`);

  // Test A: false → true
  console.log("2. Toggle humanReviewed:false → true");
  console.log("   Patching Sanity now...");
  await setHumanReviewed(true);
  console.log("   Patched. Polling URL until 200...");
  const trueTime = await pollUntil(URL_EN, 200, "true→200");

  console.log("");

  // Test B: true → false
  console.log("3. Toggle humanReviewed:true → false");
  console.log("   Patching Sanity now...");
  await setHumanReviewed(false);
  console.log("   Patched. Polling URL until 308...");
  const falseTime = await pollUntil(URL_EN, 308, "false→308");

  console.log(`\n${"─".repeat(60)}`);
  console.log("  Results");
  console.log(`${"─".repeat(60)}`);
  console.log(`  Toggle ON  (false→true→200): ${trueTime ?? "TIMEOUT"} s`);
  console.log(`  Toggle OFF (true→false→308): ${falseTime ?? "TIMEOUT"} s`);
  console.log(`${"─".repeat(60)}\n`);

  // Restore baseline (false, as Sam left it)
  await setHumanReviewed(false);
  console.log("Baseline restored (humanReviewed:false).\n");
}

main().catch(err => {
  console.error("\n💥 Fatal:", err.message);
  process.exit(1);
});
