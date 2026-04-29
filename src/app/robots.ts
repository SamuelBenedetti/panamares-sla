import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
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
    sitemap: "https://panamares-sla.vercel.app/sitemap.xml",
    host: "https://panamares-sla.vercel.app",
  };
}
