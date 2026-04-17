/**
 * Shared formatting utilities — import from here, never redefine locally.
 */

/**
 * Full currency format: $150,000
 * Use in property cards, detail pages, comparison tables.
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Compact currency format: $150K / $1.5M
 * Use in tight spaces: map popups, range slider labels.
 */
export function formatPriceCompact(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${Math.round(value / 1_000)}K`;
  return `$${value}`;
}

/**
 * Escapes user-supplied strings before embedding them in HTML (e.g. email bodies).
 * Prevents accidental HTML injection — not intended as a full XSS sanitizer.
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Basic email format check (RFC-lite). Use alongside server-side validation.
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
