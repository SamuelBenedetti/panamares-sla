const STORAGE_KEY = "panamares_compare";
export const MAX_COMPARE = 3;

export function getCompareIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function addToCompare(id: string): boolean {
  const ids = getCompareIds();
  if (ids.includes(id) || ids.length >= MAX_COMPARE) return false;
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids, id]));
  window.dispatchEvent(new Event("compare-updated"));
  return true;
}

export function removeFromCompare(id: string): void {
  const ids = getCompareIds().filter((i) => i !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event("compare-updated"));
}

export function toggleCompare(id: string): void {
  if (getCompareIds().includes(id)) removeFromCompare(id);
  else addToCompare(id);
}

export function clearCompare(): void {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event("compare-updated"));
}
