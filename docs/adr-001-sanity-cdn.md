# ADR-001 — Sanity client uses `useCdn: false`

**Status:** Accepted · 2026-05-06
**Deciders:** Sam (fullstack), reviewed by senior-seo agent (advisory)

## Context

Panamares relies on a `humanReviewed` boolean stored on Sanity docs (properties + neighborhoods) to decide at request time whether to render an EN page or 308-redirect to its ES counterpart. The flag is the only thing that distinguishes "hidden until reviewed" from "indexable in EN" — flipping it must propagate to user-visible pages in seconds, not minutes.

We discovered that even after wiring up:

1. A Sanity webhook on `Create | Update | Delete` for the relevant doc types
2. An `/api/revalidate` route handler that calls `revalidatePath` for ES + EN routes
3. A `revalidateTag("sanity")` blanket invalidation
4. A `sanityFetch` wrapper with `next: { tags: ["sanity"], revalidate: 60 }`

…toggling `humanReviewed` in Studio still took **exactly 60 seconds** to reach the user. The webhook attempts in Sanity Manage all returned 200 with `{revalidated:true}` in <1s, so the issue was not in the webhook → endpoint → Next.js cache layer.

Root cause: the Sanity client was created with `useCdn: true`, which routes reads to Sanity's edge cache (`{projectId}.apicdn.sanity.io`). That edge cache has a separate ~30-60s propagation window outside our control. Even after the Next.js fetch cache was correctly invalidated, the next `client.fetch()` call hit a stale edge node and got the pre-publish snapshot.

## Decision

Set `useCdn: false` on the public-facing Sanity client (`src/sanity/lib/client.ts`).

```ts
export const client = createClient({
  projectId, dataset,
  apiVersion: "2026-05-07",
  useCdn: false, // <-- this ADR
});
```

Reads now go to the live API (`{projectId}.api.sanity.io`), bypassing the edge cache entirely.

## Consequences

### Positive

- **Sub-second propagation** of every Sanity publish to user-visible pages. Verified end-to-end at 0.4–0.6s round-trip (`scripts/test-revalidate-timing.mjs`).
- The `humanReviewed` gate behaves as designed.
- Same benefit applies to every other field (price, photos, descriptions, listingStatus, etc.) — Carlos publishes, sees the change immediately.
- Removes a confusing intermittent bug class ("sometimes the change appears, sometimes not, eventually it does").

### Negative

- **+50–200 ms per Sanity read** (live API vs CDN). At Panamares' traffic scale this is invisible to visitors because:
  - Pages are SSG / cached at the Vercel edge — most GETs never hit Sanity.
  - The Next.js fetch wrapper still caches with `revalidate: 60 + tags`, so within a 60s window only the first request after invalidation pays the cost.
- **Lower rate limit** (500 req/sec on the live API vs 5000 req/sec on the CDN). At ~127 properties × peak ~5–10 regen events per minute, we are roughly 0.001% of the limit. No risk.

### Neutral

- The two write clients used by `scripts/sync-wasi.mjs` and `src/app/api/leads/route.ts` were already on `useCdn: false` (correct for writes). No change there.

## Alternatives considered

### A. Selective caching (two clients)

Maintain `client` (CDN) for non-gated queries and `clientFresh` (no CDN) for `humanReviewed`-dependent queries.

- ✅ Maximises cache hit rate
- ❌ Adds a "which client should I use" decision point on every new query
- ❌ Easy to use the wrong client and silently regress to the original bug
- 🔁 Reconsider if Panamares scales past ~100k visits/month

### B. Keep `useCdn: true`, drop the gate

- ❌ Removes the white-hat SEO guarantee that no half-translated EN page gets indexed. Non-starter.

### C. Accept 60s propagation

- ❌ Matches Carlos's stated UX expectation poorly (publishes are paired with confirming the result)
- ❌ Hides a real consistency bug rather than fixing it

## Reconsider when

- Panamares' average daily Sanity reads exceed ~1M (we'd be at ~5% of the rate limit and worth optimising)
- Any latency-sensitive UI metric regresses (TTFB, hydration time on regen events)
- Sanity introduces tag-aware CDN purging (would let us go back to A with the simplicity of useCdn:true)
