import { BASE_URL } from "@/lib/config";

export function canonical(path: string): string {
  if (path === "/" || path === "") return `${BASE_URL}/`;
  return `${BASE_URL}${path.replace(/\/$/, "")}`;
}

export function alternates(esPath: string, enPath: string | null): Record<string, string> {
  const links: Record<string, string> = {
    "es-419": canonical(esPath),
    "x-default": canonical(esPath),
  };
  if (enPath) {
    links["en"] = canonical(enPath);
  }
  return links;
}
