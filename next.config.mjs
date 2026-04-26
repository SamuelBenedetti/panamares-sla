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
  async headers() {
    return [
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
