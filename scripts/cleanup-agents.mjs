/**
 * Keep only the first agent, delete the rest.
 * All properties are reassigned to the surviving agent.
 * Run: node scripts/cleanup-agents.mjs
 */

import { createClient } from "@sanity/client";

const PROJECT_ID = "2hojajwk";
const DATASET = "production";
const TOKEN =
  "skY1C2gN11YJqcPWii0DlkWhjdHgmNHIvMpeKuf0ui99uSwlztfjYDCapFilYtAfAKfqeE9hGoCQI9Ju9xW1dZ3tclkrpcnEsOkckKxN6LSShpy5cD2xyXPGjBhLUkgiJwWA6DGDJqAXbCAY2BStgevDXDuS3bOlCUeeFB0IuptPGuhPUxdu";

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  token: TOKEN,
  apiVersion: "2023-01-01",
  useCdn: false,
});

async function main() {
  // Fetch all agents ordered by creation date — keep the first
  const agents = await client.fetch(
    `*[_type == "agent"] | order(_createdAt asc) { _id, name }`
  );

  if (agents.length === 0) {
    console.log("No agents found.");
    return;
  }

  const [keep, ...remove] = agents;
  console.log(`✅ Keeping: ${keep.name} (${keep._id})`);
  console.log(`🗑  Deleting ${remove.length} agent(s): ${remove.map((a) => a.name).join(", ")}\n`);

  // Reassign all properties that reference a deleted agent to the keeper
  for (const agent of remove) {
    const props = await client.fetch(
      `*[_type == "property" && agent._ref == $id]{ _id }`,
      { id: agent._id }
    );

    if (props.length > 0) {
      console.log(`  Reassigning ${props.length} properties from ${agent.name} → ${keep.name}`);
      const tx = client.transaction();
      for (const p of props) {
        tx.patch(p._id, { set: { agent: { _type: "reference", _ref: keep._id } } });
      }
      await tx.commit();
    }

    await client.delete(agent._id);
    console.log(`  Deleted agent: ${agent.name}`);
  }

  console.log("\n✅ Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
