/**
 * Defensive decoder for HTML entities that leak in from copy-paste out of
 * Word/web into the WASI editor. Covers Spanish accents (the original
 * motivation), the most common Word-paste artifacts (en/em dash, ellipsis,
 * smart quotes), structural entities, and numeric refs (decimal + hex).
 *
 * Idempotent: decoded text contains no `&xxx;` sequences, so a second pass
 * is a no-op. Safe to run on already-clean input.
 *
 * Extracted from `scripts/sync-wasi.mjs` so the one-shot migration script
 * (`scripts/migrate-html-entities.mjs`) can reuse the exact same lookup table
 * and decoding logic without divergence. Keep additions in this file — both
 * scripts pick them up automatically.
 */

// Named-entity lookup (case-insensitive). Order doesn't matter — we replace
// via a single global regex that captures the name and looks it up here.
export const HTML_ENTITIES = {
  // Spanish accents (original list)
  ntilde: "ñ", aacute: "á", eacute: "é", iacute: "í", oacute: "ó",
  uacute: "ú", uuml:   "ü",
  // Structural
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
  // Word-paste artifacts
  ndash: "–", mdash: "—", hellip: "…",
  laquo: "«", raquo: "»",
  lsquo: "‘", rsquo: "’", ldquo: "“", rdquo: "”",
  // Symbols
  copy: "©", reg: "®", trade: "™",
  // Math / typographic — common in real-estate listings (m², m³, ½, ¼, ¾)
  sup2: "²", sup3: "³",
  frac12: "½", frac14: "¼", frac34: "¾",
  deg: "°", times: "×", divide: "÷", plusmn: "±",
  micro: "µ", middot: "·", bull: "•",
};

export function decodeHtmlEntities(s) {
  if (!s) return s;
  return String(s)
    // Named entities (case-insensitive on the name; entity names may contain
    // digits, e.g. &sup2;, &frac12;).
    .replace(/&([a-zA-Z][a-zA-Z0-9]*);/g, (m, name) => {
      const lower = name.toLowerCase();
      if (HTML_ENTITIES[lower] != null) {
        const v = HTML_ENTITIES[lower];
        // Preserve case for letter entities (Ntilde → Ñ, Aacute → Á, …)
        if (name[0] === name[0].toUpperCase() && lower !== name) {
          return v.toUpperCase();
        }
        return v;
      }
      return m; // unknown entity — leave intact rather than mangling text
    })
    // Hex numeric: &#xHHHH; or &#XHHHH;
    .replace(/&#[xX]([0-9a-fA-F]+);/g, (_, h) => {
      const n = parseInt(h, 16);
      return Number.isFinite(n) ? String.fromCodePoint(n) : "";
    })
    // Decimal numeric: &#NNNN;
    .replace(/&#(\d+);/g, (_, d) => {
      const n = Number(d);
      return Number.isFinite(n) ? String.fromCodePoint(n) : "";
    });
}
