import { BASE_URL } from "@/lib/config";

export function canonical(path: string): string {
  if (path === "/" || path === "") return `${BASE_URL}/`;
  return `${BASE_URL}${path.replace(/\/$/, "")}`;
}
