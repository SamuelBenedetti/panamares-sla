export const SITE_NAME = "Panamares";

/**
 * Canonical base URL — set NEXT_PUBLIC_BASE_URL in your environment.
 * Falls back to the Vercel deployment URL so staging links still work.
 */
export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://panamares.vercel.app";

// WhatsApp principal — propiedades e inquiries generales
export const WHATSAPP_NUMBER = "50765871849";

// WhatsApp equipo — "únete al equipo" / agentes independientes
export const WHATSAPP_EQUIPO_NUMBER = "50764206919";

// Teléfono — E.164 para tel: links
export const PANAMARES_TEL = "+50765871849";

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
