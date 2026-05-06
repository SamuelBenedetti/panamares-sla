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

const prop = await sanity.fetch(
  `*[_type == "property" && wasiId == 9916551][0]{
    _id, _rev, slug, humanReviewed,
    "titleEs": titleI18n[_key=="es"][0].value,
    "titleEn": titleI18n[_key=="en"][0].value,
    "draftHumanReviewed": *[_id == "drafts." + ^._id][0].humanReviewed,
  }`
);
console.log("PROPERTY 9916551:", JSON.stringify(prop, null, 2));

const nbh = await sanity.fetch(
  `*[_type == "neighborhood" && slug.current == "punta-pacifica"][0]{
    _id, name, humanReviewed,
    "draftHumanReviewed": *[_id == "drafts." + ^._id][0].humanReviewed,
  }`
);
console.log("\nNEIGHBORHOOD punta-pacifica:", JSON.stringify(nbh, null, 2));

const allNbh = await sanity.fetch(
  `*[_type == "neighborhood"]{ "slug": slug.current, name, humanReviewed } | order(humanReviewed desc, name asc)`
);
console.log("\nALL NEIGHBORHOODS humanReviewed status:");
for (const n of allNbh) {
  const flag = n.humanReviewed === true ? "✅" : "  ";
  console.log(`  ${flag} ${n.slug.padEnd(28)} ${n.name}`);
}
