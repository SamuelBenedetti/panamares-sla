import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import "flag-icons/css/flag-icons.min.css";
import { organizationSchema } from "@/lib/jsonld";
import { BASE_URL } from "@/lib/config";

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
    canonical: BASE_URL,
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
        {/* Google Translate removed — was loading ~150 KiB unnecessarily.
            NOTE: LangToggle (Navbar) sets googtrans cookies; translation will
            no longer apply until GT is restored or replaced with a native i18n
            solution (next-intl / next-i18next). */}
      </body>
    </html>
  );
}
