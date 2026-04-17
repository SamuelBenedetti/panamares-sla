export const SITE_NAME = "Panamares";

/**
 * Canonical base URL — set NEXT_PUBLIC_BASE_URL in your environment.
 * Falls back to the Vercel deployment URL so staging links still work.
 */
export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://panamares.vercel.app";

// WhatsApp — replace with the real number before launch
// Format: country code + number, no spaces or dashes
export const WHATSAPP_NUMBER = "50766000000";

// Phone — used as fallback when a listing has no assigned agent.
// E.164 format for tel: links (no spaces/dashes).
export const PANAMARES_TEL = "+50766000000";

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
