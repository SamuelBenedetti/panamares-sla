// English neighborhood seoBlocks. Empty in PR1 — populated in PR2.
// Keys MUST mirror `neighborhoods.es.ts` exactly. The Record signature lets PR2
// add or remove entries without ceremony, but the explicit list below is the
// canonical set of slugs for PR1 review.

export interface NeighborhoodCopy {
  seoBlock: string;
}

export const neighborhoodsEn: Record<string, NeighborhoodCopy> = {
  // Populated in PR2 from `neighborhoods.es.ts`.
};
