import type { Visibility } from "@/bitacora.config";

/**
 * Filtro per-item por visibilidad. Items sin campo `visibility` heredan
 * `sectionDefault`. `private` nunca es accesible vía feeds (ni con token).
 *
 * Uso: `filterByVisibility(items, allowed, sectionDefault)` donde `allowed`
 * incluye los niveles que el caller tiene permiso para ver.
 */
export type WithVisibility<T> = T & { visibility?: Visibility };

export function effectiveVisibility<T>(
  item: WithVisibility<T>,
  sectionDefault: Visibility,
): Visibility {
  return item.visibility ?? sectionDefault;
}

export function filterByVisibility<T>(
  items: WithVisibility<T>[],
  allowed: Visibility[],
  sectionDefault: Visibility,
): WithVisibility<T>[] {
  const set: Set<Visibility> = new Set(allowed.filter((v) => v !== "private"));
  return items.filter((it) => set.has(effectiveVisibility(it, sectionDefault)));
}

/** Niveles permitidos según presencia de token org válido. */
export function allowedLevels(hasOrgToken: boolean): Visibility[] {
  return hasOrgToken ? ["public", "org"] : ["public"];
}
