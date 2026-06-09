import { useMemo } from "react";
import { searchEntities } from "@astrapi69/entity-kit-core";
import type { EntityDescriptor } from "../types";

/**
 * Filters `items` to those whose `descriptor.searchableFields` contain the
 * given query as a case-insensitive substring, memoized. Delegates the actual
 * matching to the framework-agnostic `searchEntities` from entity-kit-core.
 */
export function useEntitySearch<T>(
  items: T[],
  descriptor: EntityDescriptor<T>,
  query: string,
): T[] {
  return useMemo(
    () => searchEntities(items, descriptor, query),
    [items, descriptor, query],
  );
}
