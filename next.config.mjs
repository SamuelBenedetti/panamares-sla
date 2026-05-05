import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
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