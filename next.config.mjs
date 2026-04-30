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
      // P0-02: Deindex staging (any non-production host) — temporarily disabled for SF audit
      // {
      //   source: "/:path*",
      //   has: [{ type: "host", value: "(?!panamares\\.com$).*" }],
      //   headers: [
      //     { key: "X-Robots-Tag", value: "noindex, nofollow" },
      //   ],
      // },
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