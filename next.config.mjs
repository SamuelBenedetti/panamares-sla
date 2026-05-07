import bundleAnalyzer from "@next/bundle-analyzer";
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Load redirect map for the panamares.com legacy → new-site migration.
 *
 * P0-10: Search Leads Agency owns redirect-map.csv. The file maps every
 * inbound URL the old (Wasi-driven) panamares.com served to its closest
 * equivalent on the new site. 301 (permanent: true) preserves ~90% of link
 * equity from inbound backlinks + Google's index of the old URLs.
 *
 * Schema: 2 columns, comma-separated, header row "old_url,new_url".
 *   old_url: full URL (https://panamares.com/...) or path-relative (/...)
 *   new_url: path-relative (/propiedades/...) or full URL.
 *
 * Empty/missing file → returns []. Build does NOT fail if the CSV is
 * absent — keeps preview/staging deploys working until Chris delivers.
 */
function loadLegacyRedirectMap() {
  const csvPath = join(__dirname, "redirect-map.csv");
  if (!existsSync(csvPath)) return [];

  const csv = readFileSync(csvPath, "utf-8");
  const rows = csv.split(/\r?\n/).slice(1).filter(Boolean);

  const redirects = [];
  for (const row of rows) {
    // Naive split — assumes URLs do not contain unescaped commas.
    const [rawOld, rawNew] = row.split(",").map((s) => s.trim());
    if (!rawOld || !rawNew) continue;

    // Convert old_url to a path source. Strip protocol + host if present.
    const source = rawOld.replace(/^https?:\/\/(www\.)?panamares\.com/, "") || "/";
    redirects.push({ source, destination: rawNew, permanent: true });
  }
  return redirects;
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Custom loader bypasses Vercel's /_next/image optimizer for Sanity
    // assets (which already transform via URL params on their own CDN).
    // Avoids the monthly optimizer budget cap that was returning 402 for
    // newly-added neighborhood photos. See ticket P2-02 in the SEO impl
    // guide and src/lib/image-loader.ts for the implementation.
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "www.figma.com",
      },
    ],
  },
  async redirects() {
    return [
      // Internal: legacy listing-hub deep links → new neighborhood detail
      {
        source: "/propiedades-en-venta/:neighborhood",
        destination: "/barrios/:neighborhood",
        permanent: true,
      },
      {
        source: "/propiedades-en-alquiler/:neighborhood",
        destination: "/barrios/:neighborhood",
        permanent: true,
      },
      // P0-10: Legacy panamares.com URL map (loaded from redirect-map.csv).
      // Empty array when the CSV does not exist (pre-cutover state).
      ...loadLegacyRedirectMap(),
    ];
  },
  async headers() {
    return [
      // P1-01: Sitewide security headers. CSP is shipped Report-Only first
      // so we can observe violations in production for a couple of weeks
      // before flipping to enforcing mode.
      {
        source: "/:path*",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
          {
            key: "Content-Security-Policy-Report-Only",
            value: [
              "default-src 'self'",
              "img-src 'self' data: blob: https://cdn.sanity.io https://images.unsplash.com https://*.mapbox.com",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://vercel.live",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' data: https://fonts.gstatic.com",
              "connect-src 'self' https://*.sanity.io https://va.vercel-scripts.com https://vercel.live https://*.mapbox.com",
              "frame-src 'self' https://www.google.com",
              "frame-ancestors 'self'",
            ].join("; "),
          },
        ],
      },
      // P0-02: Deindex staging (any non-production host)
      {
        source: "/:path*",
        has: [{ type: "host", value: "(?!panamares\\.com$).*" }],
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
      {
        source: "/(apartamentos|apartaestudios|casas|casas-de-playa|penthouses|oficinas|locales|locales-comerciales|terrenos|lotes-comerciales|edificios|fincas|propiedades-en-venta|propiedades-en-alquiler|barrios)/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=3600, stale-while-revalidate=60",
          },
        ],
      },
      {
        source: "/propiedades/:slug*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=1800, stale-while-revalidate=60",
          },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);