import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { headers } from "next/headers";
import "./globals.css";
import "flag-icons/css/flag-icons.min.css";
import { organizationSchema, websiteSchema } from "@/lib/jsonld";
import { canonical } from "@/lib/seo";
import { BASE_URL } from "@/lib/config";
import { getLocaleFromPath } from "@/lib/i18n";
import GoogleTranslate from "@/components/layout/GoogleTranslate";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Bienes Raíces en Panama City │ Panamares",
    template: "%s │ Panamares",
  },
  description:
    "Panamares — inmobiliaria de lujo en Panama City. Apartamentos, casas, penthouses, oficinas y más en las mejores zonas de la ciudad.",
  openGraph: {
    siteName: "Panamares",
    locale: "es_419",
    type: "website",
    images: [
      {
        url: "/hero-bg.jpg",
        width: 1200,
        height: 630,
        alt: "Panamares — Inmobiliaria de lujo en Panama City",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@panamares",
  },
  alternates: {
    canonical: canonical("/"),
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Detect locale from the request path so `<html lang>` is correct on /en/*.
  // The `x-pathname` header is set by middleware (src/middleware.ts).
  const headerList = await headers();
  const path = headerList.get("x-pathname") ?? "/";
  const locale = getLocaleFromPath(path);
  const htmlLang = locale === "en" ? "en" : "es-419";

  return (
    <html lang={htmlLang} className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="font-body antialiased bg-white text-brand-navy">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema()) }}
        />
        {children}
        <GoogleTranslate />
        <SpeedInsights />
      </body>
    </html>
  );
}
