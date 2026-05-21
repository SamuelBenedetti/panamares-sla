export const SITE_NAME = "Panamares";

/**
 * Canonical base URL — set NEXT_PUBLIC_BASE_URL in your environment.
 * Falls back to the Vercel deployment URL so staging links still work.
 */
export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ??
  (process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : "http://localhost:3000");

/**
 * Production host detection by hostname, NOT by NEXT_PUBLIC_VERCEL_ENV.
 *
 * On Vercel, deploys to the `main` branch are flagged as the "Production"
 * environment regardless of the URL they're served on. That includes
 * panamares-sla.vercel.app (our staging URL). Using VERCEL_ENV to gate
 * crawl-blocking behavior (X-Robots-Tag, robots.txt) caused staging to
 * serve production-style "indexable" signals — the regression P0-02 was
 * meant to prevent.
 *
 * The only host that is truly production is panamares.com (the apex
 * domain we'll DNS-cut over to at launch). Treat everything else
 * (preview deploys, panamares-sla.vercel.app, localhost) as non-prod.
 *
 * Accepts the value from `headers().get("host")`. Falls back to false on
 * null/undefined — preserves the safer default of "block crawl unless
 * we're certain this is production".
 */
export function isProductionHost(host: string | null | undefined): boolean {
  if (!host) return false;
  // Strip port if present (e.g. "panamares.com:443")
  const hostname = host.split(":")[0].toLowerCase();
  return hostname === "panamares.com" || hostname === "www.panamares.com";
}

// ── Contacto ──────────────────────────────────────────────────────────────────
export const PANAMARES_TEL      = "+50765871849";
export const PANAMARES_PHONE    = "+507 6587-1849"; // formato display
export const PANAMARES_PHONE_2  = "+507 6420-6919";
export const PANAMARES_STREET   = "Torre Oceánica, Piso 18";
export const PANAMARES_LOCALITY = "Punta Pacífica";
export const PANAMARES_POSTAL_CODE = "0832";
export const PANAMARES_LAT      = 8.9936;
export const PANAMARES_LNG      = -79.5197;
export const PANAMARES_PRICE_RANGE = "$$$$";
export const PANAMARES_OPENING_HOURS = ["Mo-Fr 08:00-18:00", "Sa 09:00-13:00"];
export const PANAMARES_EMAIL_INFO   = "info@panamares.com";
export const PANAMARES_EMAIL_VENTAS = "ventas@panamares.com";

// ── WhatsApp ──────────────────────────────────────────────────────────────────
export const WHATSAPP_NUMBER       = "50765871849";
export const WHATSAPP_EQUIPO_NUMBER = "50764206919";

export const WHATSAPP_URL =
  "https://wa.me/50765871849?text=Hola%2C%20me%20interesa%20una%20propiedad%20en%20Panamares";

export const WHATSAPP_EQUIPO_URL =
  "https://wa.me/50764206919?text=Hola%2C%20soy%20agente%20inmobiliario%20y%20me%20gustar%C3%ADa%20unirme%20al%20equipo%20de%20Panamares.";

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
