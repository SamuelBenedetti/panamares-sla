// Central locale-aware copy accessor.
// Use `getCopy(locale)` from any server or client component to read user-visible
// strings. The shape is enforced by `Copy` in `./types.ts` — both `es` and `en`
// must satisfy it, which is the build-time parity guard for P0-05.

import type { Locale, Copy } from "./types";
import { es } from "./es";
import { en } from "./en";

const COPY: Record<Locale, Copy> = { es, en };

export function getCopy(locale: Locale): Copy {
  return COPY[locale];
}

export type { Locale, Copy };
export { es, en };
