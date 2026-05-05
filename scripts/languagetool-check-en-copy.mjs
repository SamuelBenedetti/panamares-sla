/**
 * LanguageTool quality pass on src/lib/copy/en.ts.
 *
 * What it does
 * ────────────
 * 1. Reads src/lib/copy/en.ts as text.
 * 2. Extracts every quoted string literal (handles single/double/backtick quotes).
 * 3. For each string, checks it against the LanguageTool API (api.languagetool.org).
 * 4. Categorizes each suggestion into HIGH (auto-apply) or LOW (flag for review).
 * 5. Applies HIGH-confidence fixes to the file in place (right-to-left to keep offsets stable).
 * 6. Emits tasks/languagetool-report.md with applied fixes + flagged suggestions.
 *
 * Run:
 *   node scripts/languagetool-check-en-copy.mjs           # dry-run: writes report only
 *   node scripts/languagetool-check-en-copy.mjs --write   # apply HIGH fixes to en.ts
 *
 * Confidence tiers
 * ────────────────
 *   HIGH  → auto-apply
 *     - rule.category.id === "TYPOS"
 *     - rule.category.id === "PUNCTUATION" (with replacements)
 *     - rule.category.id === "GRAMMAR" (single replacement only)
 *   LOW   → flag, do not apply
 *     - STYLE / REDUNDANCY / GRAMMAR with multiple replacements
 *   IGNORE
 *     - REGIONALISMS (we want US English; LT sometimes flags valid US spellings)
 *     - rule.id starts with EN_GB (UK preference)
 *     - replacement target is a protected term / proper noun
 *     - match offset falls inside a placeholder (e.g., ${name})
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");
const COPY_PATH = join(REPO_ROOT, "src/lib/copy/en.ts");
const REPORT_PATH = join(REPO_ROOT, "..", "search-leads", "clients", "panamares", "audits", "languagetool-report-en-copy.md");
// Fallback: write report inside repo if external path not writable.
const REPORT_PATH_FALLBACK = join(REPO_ROOT, "tasks/languagetool-report-en-copy.md");

const args = process.argv.slice(2);
const isWrite = args.includes("--write");

const LT_API = "https://api.languagetool.org/v2/check";
const LT_THROTTLE_MS = 1500; // 1 req per 1.5s ≈ 40 req/min
const LT_BACKOFF_MS = 30_000; // on 429, wait 30s

/** Protected terms — never let LT replace these or trigger fixes that touch them. */
const PROTECTED_TERMS = [
  // Brand
  "Panamares",
  // Cities / countries
  "Panama City", "Panama", "Panamá",
  // Neighborhoods
  "Punta Pacífica", "Punta Pacifica",
  "Punta Paitilla", "Avenida Balboa",
  "Costa del Este", "Obarrio", "Calle 50",
  "El Cangrejo", "Marbella", "Albrook", "Coco del Mar",
  "Santa María", "Santa Maria", "Bella Vista",
  "Río Mar", "Rio Mar", "Farallón", "Farallon",
  "Coronado", "Versalles", "Carrasquilla", "Loma Alegre",
  "Amador", "Alto del Chase", "Altos del Golf",
  "Los Andes", "Vía Porras", "Via Porras", "Condado del Rey",
  "San Francisco", "Panama Pacífico", "Panama Pacifico",
  "Antón", "Anton", "David",
  // Provinces / regions
  "Coclé", "Cocle", "Chiriquí", "Veraguas",
  // Awards / certifications
  "RE/MAX", "ACOBIR", "LAMag",
  // Real estate domain
  "penthouse", "Penthouse", "Penthouses", "penthouses",
  "studio", "Studio", "Studios", "studios",
  "condominium", "off-market", "oceanfront", "ecotourism",
  // Streets / buildings
  "Torre Oceánica", "Torre Oceanica",
  // WhatsApp / contact
  "WhatsApp",
];

/** Category-id rules — see docs above. */
const HIGH_CATEGORY_IDS = new Set(["TYPOS", "PUNCTUATION"]);
const LOW_CATEGORY_IDS = new Set(["STYLE", "REDUNDANCY"]);
const IGNORED_CATEGORY_IDS = new Set(["REGIONALISMS"]);

/** rule.id prefixes / exact matches to ignore unconditionally. */
const IGNORED_RULE_IDS = new Set([
  // We want US English, so ignore UK suggestions.
]);
const IGNORED_RULE_PREFIXES = ["EN_GB_"];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── Extract strings ─────────────────────────────────────────────────────────
/**
 * Walks the file and yields { text, start, end, kind } for each string literal.
 * Handles: '...', "...", `...` (with `${...}` interpolations replaced by placeholders).
 * Skips comments (// ... and /* ... *\/).
 */
function extractStrings(src) {
  const out = [];
  let i = 0;
  const len = src.length;

  while (i < len) {
    const c = src[i];

    // Line comment
    if (c === "/" && src[i + 1] === "/") {
      while (i < len && src[i] !== "\n") i++;
      continue;
    }
    // Block comment
    if (c === "/" && src[i + 1] === "*") {
      i += 2;
      while (i < len && !(src[i] === "*" && src[i + 1] === "/")) i++;
      i += 2;
      continue;
    }

    // String start
    if (c === '"' || c === "'" || c === "`") {
      const quote = c;
      const start = i;
      i++;
      let textStart = i;
      let textChunks = [];
      let placeholderMap = []; // [{token, original}]
      let placeholderIndex = 0;

      while (i < len) {
        const ch = src[i];
        if (ch === "\\") {
          i += 2;
          continue;
        }
        if (ch === quote) {
          // End of string
          textChunks.push(src.slice(textStart, i));
          const end = i + 1;
          const raw = src.slice(start, end);
          // Build text with placeholders (only matters for backticks)
          const text = textChunks.join("");
          if (text.length > 0) {
            out.push({ text, start: start + 1, end: end - 1, quote, raw, placeholderMap });
          }
          i = end;
          break;
        }
        if (quote === "`" && ch === "$" && src[i + 1] === "{") {
          textChunks.push(src.slice(textStart, i));
          // Walk braces
          let depth = 1;
          let j = i + 2;
          while (j < len && depth > 0) {
            if (src[j] === "{") depth++;
            else if (src[j] === "}") depth--;
            if (depth === 0) break;
            j++;
          }
          const original = src.slice(i, j + 1);
          const token = `__VAR${placeholderIndex++}__`;
          placeholderMap.push({ token, original, offset: textChunks.join("").length });
          textChunks.push(token);
          i = j + 1;
          textStart = i;
          continue;
        }
        i++;
      }
      // If we reached EOF without closing quote, give up.
      if (i >= len) break;
      continue;
    }

    i++;
  }

  return out;
}

// ── Filtering ────────────────────────────────────────────────────────────────
function shouldSkipString(text) {
  const trimmed = text.trim();
  if (trimmed.length < 4) return true; // too short for meaningful LT
  if (/^[\d\s.,]+$/.test(trimmed)) return true; // numbers only
  if (/^https?:\/\//.test(trimmed)) return true; // URLs
  if (/^[\w._%+-]+@[\w.-]+\.[a-z]{2,}$/i.test(trimmed)) return true; // email
  if (/^[+\d\s\-()]+$/.test(trimmed)) return true; // phone-like
  if (/^[\W_]+$/.test(trimmed)) return true; // only punctuation
  return false;
}

function isProtectedReplacement(text, match) {
  // Reject if any protected term overlaps with the match.
  const matchStart = match.offset;
  const matchEnd = match.offset + match.length;
  for (const term of PROTECTED_TERMS) {
    let idx = 0;
    while (true) {
      idx = text.indexOf(term, idx);
      if (idx === -1) break;
      const termStart = idx;
      const termEnd = idx + term.length;
      // Overlap check
      if (matchStart < termEnd && matchEnd > termStart) {
        return true;
      }
      idx = termEnd;
    }
  }
  return false;
}

function isPlaceholderHit(text, match) {
  // Match falls inside or overlaps a __VAR<n>__ placeholder.
  const matchStart = match.offset;
  const matchEnd = match.offset + match.length;
  const re = /__VAR\d+__/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    if (matchStart < m.index + m[0].length && matchEnd > m.index) {
      return true;
    }
  }
  return false;
}

// ── LanguageTool API ────────────────────────────────────────────────────────
async function checkText(text) {
  const params = new URLSearchParams();
  params.set("text", text);
  params.set("language", "en-US");
  params.set("enabledOnly", "false");
  // Skip all REGIONALISMS rules globally too
  params.set("disabledCategories", "REGIONALISMS");

  let attempts = 0;
  while (attempts < 4) {
    attempts++;
    try {
      const res = await fetch(LT_API, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });
      if (res.status === 429) {
        console.error(`  [lt] 429 rate limit, backing off ${LT_BACKOFF_MS / 1000}s`);
        await sleep(LT_BACKOFF_MS);
        continue;
      }
      if (!res.ok) {
        console.error(`  [lt] ${res.status} ${res.statusText}`);
        return { matches: [] };
      }
      const json = await res.json();
      return json;
    } catch (err) {
      console.error(`  [lt] fetch error: ${err.message}`);
      await sleep(2000);
    }
  }
  return { matches: [] };
}

function categorizeMatch(text, match) {
  const cat = match.rule?.category?.id ?? "";
  const ruleId = match.rule?.id ?? "";

  if (IGNORED_CATEGORY_IDS.has(cat)) return "IGNORE";
  if (IGNORED_RULE_IDS.has(ruleId)) return "IGNORE";
  if (IGNORED_RULE_PREFIXES.some((p) => ruleId.startsWith(p))) return "IGNORE";
  if (isPlaceholderHit(text, match)) return "IGNORE";
  if (isProtectedReplacement(text, match)) return "IGNORE";

  if (HIGH_CATEGORY_IDS.has(cat) && match.replacements?.length > 0) return "HIGH";
  if (cat === "GRAMMAR" && match.replacements?.length === 1) return "HIGH";
  if (LOW_CATEGORY_IDS.has(cat)) return "LOW";
  if (cat === "GRAMMAR" && match.replacements?.length > 1) return "LOW";

  return "LOW";
}

function applyHighFixes(text, highMatches) {
  // Apply right-to-left to preserve offsets.
  const sorted = [...highMatches].sort((a, b) => b.match.offset - a.match.offset);
  let out = text;
  for (const { match } of sorted) {
    const replacement = match.replacements[0]?.value;
    if (replacement === undefined) continue;
    out = out.slice(0, match.offset) + replacement + out.slice(match.offset + match.length);
  }
  return out;
}

function restorePlaceholders(text, placeholderMap) {
  let out = text;
  for (const { token, original } of placeholderMap) {
    out = out.replace(token, original);
  }
  return out;
}

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  const src = readFileSync(COPY_PATH, "utf8");
  console.log(`[lt] Reading ${COPY_PATH} (${src.length} bytes)`);

  const strings = extractStrings(src);
  console.log(`[lt] Extracted ${strings.length} string literals`);

  const filtered = strings.filter((s) => !shouldSkipString(s.text));
  console.log(`[lt] After filter: ${filtered.length} candidates for LT check`);
  console.log(`[lt] Estimated runtime: ${(filtered.length * LT_THROTTLE_MS / 1000 / 60).toFixed(1)} min`);

  const highReport = [];
  const lowReport = [];
  let patchedSrc = src;

  // Process strings right-to-left so offsets in source stay stable when patching
  const orderedForPatch = [...filtered].sort((a, b) => b.start - a.start);

  let processed = 0;
  for (const entry of orderedForPatch) {
    processed++;
    const sample = entry.text.slice(0, 60).replace(/\n/g, "↵");
    process.stderr.write(`\r[lt] (${processed}/${filtered.length}) "${sample}..."          `);

    const result = await checkText(entry.text);
    if (!result.matches || result.matches.length === 0) {
      await sleep(LT_THROTTLE_MS);
      continue;
    }

    const high = [];
    for (const match of result.matches) {
      const tier = categorizeMatch(entry.text, match);
      if (tier === "HIGH") {
        high.push({ match });
        highReport.push({
          original: entry.text.slice(match.offset, match.offset + match.length),
          fixed: match.replacements[0]?.value,
          ruleId: match.rule?.id,
          message: match.shortMessage || match.message,
          context: entry.text.slice(0, 80),
        });
      } else if (tier === "LOW") {
        lowReport.push({
          text: entry.text.slice(match.offset, match.offset + match.length),
          suggestion: match.replacements?.[0]?.value || "(no replacement)",
          ruleId: match.rule?.id,
          message: match.shortMessage || match.message,
          context: entry.text.slice(0, 100),
        });
      }
      // IGNORE: dropped silently
    }

    if (high.length > 0 && isWrite) {
      // Apply high fixes to the string text first
      const fixedText = applyHighFixes(entry.text, high);
      // Restore placeholders if any
      const fixedWithPlaceholders = restorePlaceholders(fixedText, entry.placeholderMap);
      // Original raw segment in source for replacement
      const rawSegment = patchedSrc.slice(entry.start, entry.end);
      // Sanity: do not overwrite if rawSegment with placeholders restored differs from expected
      // Simple replacement strategy: just write the new text into [start, end].
      patchedSrc = patchedSrc.slice(0, entry.start) + fixedWithPlaceholders + patchedSrc.slice(entry.end);
    }

    await sleep(LT_THROTTLE_MS);
  }

  process.stderr.write("\n");

  if (isWrite && patchedSrc !== src) {
    writeFileSync(COPY_PATH, patchedSrc, "utf8");
    console.log(`[lt] Wrote ${highReport.length} HIGH fixes to ${COPY_PATH}`);
  } else {
    console.log(`[lt] DRY-RUN: ${highReport.length} HIGH fixes NOT applied (use --write)`);
  }

  // Build report
  const reportPath = REPORT_PATH_FALLBACK;
  const reportLines = [
    "# LanguageTool Pass — `src/lib/copy/en.ts`",
    "",
    `Generated: ${new Date().toISOString()}`,
    `Mode: ${isWrite ? "WRITE (HIGH fixes applied)" : "DRY-RUN"}`,
    `Strings checked: ${filtered.length} (out of ${strings.length} extracted)`,
    `HIGH fixes: ${highReport.length}`,
    `LOW flagged: ${lowReport.length}`,
    "",
    "## HIGH-confidence fixes (auto-applied on `--write`)",
    "",
    "| Original | Fixed | Rule | Message | Context (snippet) |",
    "|---|---|---|---|---|",
    ...highReport.map(
      (e) =>
        `| \`${(e.original || "").replace(/\|/g, "\\|")}\` | \`${(e.fixed || "").replace(/\|/g, "\\|")}\` | ${e.ruleId || ""} | ${(e.message || "").replace(/\|/g, "\\|")} | ${(e.context || "").replace(/\|/g, "\\|").replace(/\n/g, " ")} |`
    ),
    "",
    "## LOW-confidence flags (review manually — not applied)",
    "",
    "| Text | Suggestion | Rule | Message | Context |",
    "|---|---|---|---|---|",
    ...lowReport.map(
      (e) =>
        `| \`${(e.text || "").replace(/\|/g, "\\|")}\` | \`${(e.suggestion || "").replace(/\|/g, "\\|")}\` | ${e.ruleId || ""} | ${(e.message || "").replace(/\|/g, "\\|")} | ${(e.context || "").replace(/\|/g, "\\|").replace(/\n/g, " ")} |`
    ),
    "",
  ];
  writeFileSync(reportPath, reportLines.join("\n"), "utf8");
  console.log(`[lt] Report → ${reportPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
