// Helpers for reading values produced by `sanity-plugin-internationalized-array`.
// The plugin stores translatable fields as an array of `{ _key, value }` entries
// keyed by language code (e.g. `"es"`, `"en"`). These resolvers pick the entry
// for the requested locale and fall back gracefully when a translation is
// missing — so the site keeps rendering ES copy even before EN translations
// are filled in by an editor.

import type { PortableTextBlock } from "@portabletext/types";
import type { Locale } from "@/lib/copy/types";

export interface I18nString {
  _key: string;
  value?: string;
}

export interface I18nText {
  _key: string;
  value?: string;
}

export interface I18nPortableText {
  _key: string;
  value?: PortableTextBlock[];
}

function pickEntry<T extends { _key: string }>(
  field: T[] | undefined,
  key: string
): T | undefined {
  if (!field || field.length === 0) return undefined;
  return field.find((entry) => entry._key === key);
}

function isEmptyString(v: string | undefined | null): boolean {
  return !v || v.trim().length === 0;
}

function isEmptyPortableText(v: PortableTextBlock[] | undefined | null): boolean {
  return !v || v.length === 0;
}

/**
 * Resolve an internationalized string. Falls back to ES if the requested locale
 * is missing/empty, then to the explicit `fallback` (legacy field or copy
 * bundle string). Returns an empty string if nothing is available.
 */
export function resolveI18nString(
  field: I18nString[] | undefined,
  locale: Locale,
  fallback?: string
): string {
  const primary = pickEntry(field, locale);
  if (primary && !isEmptyString(primary.value)) return primary.value as string;

  if (locale !== "es") {
    const es = pickEntry(field, "es");
    if (es && !isEmptyString(es.value)) return es.value as string;
  }

  return fallback ?? "";
}

/**
 * Resolve an internationalized multi-line text field. Same fallback chain as
 * `resolveI18nString`.
 */
export function resolveI18nText(
  field: I18nText[] | undefined,
  locale: Locale,
  fallback?: string
): string {
  return resolveI18nString(field as I18nString[] | undefined, locale, fallback);
}

/**
 * Resolve an internationalized PortableText (rich text) field. Returns an
 * empty array when no value is available so callers can safely guard with
 * `value.length > 0` or render `<PortableText value={value} />` directly.
 */
export function resolveI18nPortableText(
  field: I18nPortableText[] | undefined,
  locale: Locale,
  fallback?: PortableTextBlock[]
): PortableTextBlock[] {
  const primary = pickEntry(field, locale);
  if (primary && !isEmptyPortableText(primary.value)) {
    return primary.value as PortableTextBlock[];
  }

  if (locale !== "es") {
    const es = pickEntry(field, "es");
    if (es && !isEmptyPortableText(es.value)) {
      return es.value as PortableTextBlock[];
    }
  }

  return fallback ?? [];
}
