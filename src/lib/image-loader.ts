// Custom Next.js Image loader.
//
// Why: the Vercel Image Optimization endpoint (/_next/image) consumes a
// monthly budget tied to the project plan. With ~127 properties × ~6 images
// each + neighborhood and agent photos, the catalog blows past the free-tier
// cap quickly, and any new asset returns HTTP 402 Payment Required —
// rendering as a broken image in the browser even though the source is fine.
//
// Sanity already serves transformed images via URL parameters
// (`?w=…&q=…&auto=format`) and runs its own CDN, so we route Sanity-hosted
// assets through that pipeline directly and skip the Vercel optimizer.
//
// Local public-folder paths (e.g. `/hero-bg.jpg`) and other remote hosts
// fall through unchanged. They aren't pre-resized; we accept that — those
// are a handful of static assets and not the volume issue.
//
// This loader is wired via `next.config.mjs` → `images.loader = 'custom'`.
// See SEO impl guide ticket P2-02 for the original audit note.

interface ImageLoaderProps {
  src: string;
  width: number;
  quality?: number;
}

export default function imageLoader({ src, width, quality }: ImageLoaderProps): string {
  if (src.startsWith("https://cdn.sanity.io")) {
    const url = new URL(src);
    url.searchParams.set("w", String(width));
    if (quality) url.searchParams.set("q", String(quality));
    if (!url.searchParams.has("auto")) url.searchParams.set("auto", "format");
    return url.toString();
  }
  // Non-Sanity src (local /public, Unsplash, Figma, Mapbox tiles, etc.)
  // are served as-is. The Image component still uses width/sizes for layout
  // hints; we just don't transcode upstream.
  return src;
}
