export const SITE_NAME = "Panamares";
export const BASE_URL = "https://panamares.vercel.app";

// WhatsApp — replace with the real number before launch
// Format: country code + number, no spaces or dashes
export const WHATSAPP_NUMBER = "50766000000";

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
