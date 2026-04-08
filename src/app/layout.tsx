import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import "flag-icons/css/flag-icons.min.css";
import { organizationSchema } from "@/lib/jsonld";

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
  metadataBase: new URL("https://panamares.com"),
  title: {
    default: "Bienes Raíces en Panama City | Panamares",
    template: "%s | Panamares",
  },
  description:
    "Panamares — inmobiliaria de lujo en Panama City. Apartamentos, casas, penthouses, oficinas y más en las mejores zonas de la ciudad.",
  openGraph: {
    siteName: "Panamares",
    locale: "es_PA",
    type: "website",
    images: [
      {
        url: "/barrio-punta-pacifica.png",
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
    canonical: "https://panamares.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="font-body antialiased bg-white text-brand-navy">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }}
        />
        {children}
        {/* Google Translate — after page renders */}
        <div id="google_translate_element" style={{ position: "absolute", top: "-9999px", left: "-9999px" }} suppressHydrationWarning />
        <Script id="gt-init" strategy="lazyOnload">{`
          window.googleTranslateElementInit = function() {
            new google.translate.TranslateElement({
              pageLanguage: 'es',
              includedLanguages: 'en,es',
              autoDisplay: false
            }, 'google_translate_element');
          };
        `}</Script>
        <Script
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="lazyOnload"
        />
        <style dangerouslySetInnerHTML={{ __html: `
          body { top: 0 !important; }
          .goog-te-banner-frame { display: none !important; }
          iframe.skiptranslate { display: none !important; }
        `}} />
      </body>
    </html>
  );
}
