/**
 * Flip humanReviewed → true on every property doc that isn't already flipped.
 *
 * Purpose:
 *   Unblocks the last gate of P0-05 (English URLs in sitemap). The sitemap
 *   builder skips properties whose `humanReviewed !== true`, which currently
 *   excludes 127 of 129 published properties. Carlos and Igor have signed
 *   off on the catalog as ready to ship, so we flip them all in one shot.
 *
 * When to run:
 *   Once, after this script ships to main, before re-running the SF crawl
 *   for P0-05 verification. Idempotent: re-running is a no-op (the GROQ
 *   filter excludes already-true docs).
 *
 * Usage:
 *   node scripts/flip-human-reviewed.mjs            # dry-run (default)
 *   node scripts/flip-human-reviewed.mjs --apply    # writes the flip
 *
 * How to revert (if ever needed):
 *   Capture the IDs flipped by the apply run (printed in the summary), then
 *   run the inverse patch in a one-off script:
 *     for (const id of ids) {
 *       await client.patch(id).set({ humanReviewed: false }).commit();
 *     }
 *   Or restore from a Sanity dataset export taken before the flip.
 *
 * Required env (.env.local):
 *   SANITY_WRITE_TOKEN              write-scoped token for the dataset
 *   NEXT_PUBLIC_SANITY_PROJECT_ID   defaults to "2hojajwk"
 *   NEXT_PUBLIC_SANITY_DATASET      MUST equal "production" — script bails otherwise
 */

import { createClient } from "@sanity/client";
import { config } from "dotenv";

config({ path: ".env.local" });

const APPLY = process.argv.includes("--apply");

// Sanity transactions cap at ~256 mutations. 50 keeps us well under, with
// margin for retry-on-conflict noise without splitting a logical batch.
const CHUNK_SIZE = 50;

// ── Pre-flight ───────────────────────────────────────────────────────────────

if (!process.env.SANITY_WRITE_TOKEN) {
  console.error("\n❌ Missing SANITY_WRITE_TOKEN in .env.local\n");
  process.exit(1);
}

const datasetName = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
if (datasetName !== "production") {
  console.error(`\n❌ Refusing to run: NEXT_PUBLIC_SANITY_DATASET="${datasetName}" (expected "production").`);
  console.error("   This script is scoped to the production dataset only. Set the env explicitly to override.\n");
  process.exit(1);
}

const sanity = createClient({
  projectId:  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "2hojajwk",
  dataset:    datasetName,
  token:      process.env.SANITY_WRITE_TOKEN,
  apiVersion: "2023-01-01",
  useCdn:     false,
});

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const startTime = Date.now();
  console.log(`\n${"═".repeat(60)}`);
  console.log(`  Flip humanReviewed → true   ${APPLY ? "· APPLY (writing)" : "· DRY RUN (no writes)"}`);
  console.log(`  Dataset: ${datasetName}`);
  console.log(`${"═".repeat(60)}\n`);

  // 1. Fetch counts and target docs.
  process.stdout.write("📡 Querying Sanity...");
  const [total, alreadyReviewed, toFlip] = await Promise.all([
    sanity.fetch(`count(*[_type == "property"])`),
    sanity.fetch(`count(*[_type == "property" && humanReviewed == true])`),
    sanity.fetch(
      `*[_type == "property" && humanReviewed != true]{
        _id,
        "title": coalesce(titleI18n[_key=="es"][0].value, title)
      } | order(_id asc)`
    ),
  ]);
  console.log(" done");

  console.log(`\n  Total property docs:        ${total}`);
  console.log(`  Already humanReviewed=true: ${alreadyReviewed}`);
  console.log(`  To flip:                    ${toFlip.length}`);

  if (toFlip.length === 0) {
    console.log(`\n✓ Nothing to do — every property is already humanReviewed=true.\n`);
    return;
  }

  // 2. Sample preview.
  console.log(`\n  Sample (first ${Math.min(5, toFlip.length)}):`);
  for (const doc of toFlip.slice(0, 5)) {
    const title = (doc.title ?? "(no title)").slice(0, 60);
    console.log(`    • ${doc._id.padEnd(20)}  ${title}`);
  }

  // 3. Dry-run: stop here.
  if (!APPLY) {
    console.log(`\n${"─".repeat(60)}`);
    console.log(`  DRY RUN — no writes. Re-run with --apply to flip ${toFlip.length} docs.`);
    console.log(`${"─".repeat(60)}\n`);
    return;
  }

  // 4. Apply: chunked transactions.
  console.log(`\n🚀 Applying flip in chunks of ${CHUNK_SIZE}...\n`);
  let flipped = 0;
  let failed = 0;
  const failures = [];

  for (let i = 0; i < toFlip.length; i += CHUNK_SIZE) {
    const chunk = toFlip.slice(i, i + CHUNK_SIZE);
    const chunkLabel = `chunk ${Math.floor(i / CHUNK_SIZE) + 1}/${Math.ceil(toFlip.length / CHUNK_SIZE)} (${chunk.length} docs)`;
    process.stdout.write(`  ${chunkLabel}... `);

    try {
      let tx = sanity.transaction();
      for (const doc of chunk) {
        tx = tx.patch(doc._id, p => p.set({ humanReviewed: true }));
      }
      await tx.commit();
      flipped += chunk.length;
      console.log("✓");
    } catch (err) {
      failed += chunk.length;
      failures.push({ chunkLabel, error: err.message, ids: chunk.map(d => d._id) });
      console.log(`✗  ${err.message.slice(0, 80)}`);
    }
  }

  // 5. Summary.
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n${"─".repeat(60)}`);
  console.log(`  ✓  Flipped:   ${flipped}`);
  console.log(`  ❌ Failed:    ${failed}`);
  console.log(`  ⏱  Elapsed:   ${elapsed}s`);
  console.log(`${"─".repeat(60)}\n`);

  if (failed > 0) {
    console.error("Failed chunks:");
    for (const f of failures) {
      console.error(`  ${f.chunkLabel}: ${f.error}`);
      console.error(`    IDs: ${f.ids.join(", ")}`);
    }
    process.exit(1);
  }
}

main().catch(err => {
  console.error("\n💥 Fatal:", err.message);
  process.exit(1);
});
