import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { BASE_URL, isProductionHost } from "@/lib/config";

/**
 * P0-02 (restored): Gate production-style robots.txt on the actual host,
 * not on NEXT_PUBLIC_VERCEL_ENV.
 *
 * The previous gate (`NEXT_PUBLIC_VERCEL_ENV === "production"`) returned
 * `true` for the panamares-sla.vercel.app deploy because Vercel flags
 * `main`-branch builds as the "Production" environment regardless of
 * which domain serves them. Result: staging served production-style
 * `Allow: /` rules and made every staged page crawlable — exactly the
 * regression P0-02 was meant to prevent.
 *
 * Host-based detection via `headers().get("host")` correctly identifies
 * panamares.com / www.panamares.com as the only true production hosts.
 */
export default function robots(): MetadataRoute.Robots {
  const host = headers().get("host");

  if (!isProductionHost(host)) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/studio/", "/api/", "/*?page=", "/*?sort=", "/*?filter="],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/studio/", "/api/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
