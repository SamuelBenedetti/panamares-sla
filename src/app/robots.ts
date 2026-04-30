import type { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  //! This is just for testing with https://www.screamingfrog - Switch to the production URL panamares.com when you're done
  const isProduction = BASE_URL === "https://panamares-sla.vercel.app/";

  if (!isProduction) {
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
