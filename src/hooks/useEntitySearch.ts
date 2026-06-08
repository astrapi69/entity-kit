import { useMemo } from "react";
import type { EntityDescriptor } from "../types";

/**
 * Coerce an arbitrary field value to a lowercase string for case-insensitive
 * substring matching. Non-string/number values that cannot be sensibly
 * stringified yield an empty string so they simply never match.
 */
function toSearchString(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value.toLowerCase();
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value).toLowerCase();
  }
  if (value instanceof Date) return value.toISOString().toLowerCase();
  return "";
}

/**
 * Filters `items` to those whose `descriptor.searchableFields` contain the
 * given query as a case-insensitive substring. An empty/whitespace query
 * returns the items unchanged. Pure filtering — no fetching, no mutation.
 */
export function useEntitySearch<T>(
  items: T[],
  descriptor: EntityDescriptor<T>,
  query: string,
): T[] {
  const { searchableFields } = descriptor;

  return useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (needle === "") return items;

    return items.filter((item) =>
      (searchableFields ?? []).some((field) =>
        toSearchString(item[field]).includes(needle),
      ),
    );
  }, [items, searchableFields, query]);
}
