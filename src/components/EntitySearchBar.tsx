import { useEffect, useRef, useState } from "react";
import type { EntityDescriptor, SearchClassNames } from "../types";
import { useEntitySearch } from "../hooks/useEntitySearch";

export interface EntitySearchBarProps<T> {
  /** Items to search over. The library filters, it never fetches. */
  items: T[];
  /** Descriptor providing `searchableFields`. */
  descriptor: EntityDescriptor<T>;
  /** Controlled query value. When provided, the input is controlled. */
  query?: string;
  /** Initial query for uncontrolled usage. Defaults to "". */
  defaultQuery?: string;
  /** Called whenever the query text changes. */
  onQueryChange?: (query: string) => void;
  /** Called with the filtered items whenever the query or items change. */
  onResults?: (results: T[]) => void;
  /** Placeholder text for the input. */
  placeholder?: string;
  /** Accessible label for the input. Defaults to "Search". */
  ariaLabel?: string;
  /** Optional leading icon. */
  icon?: React.ReactNode;
  /** Show a clear button while there is a query. Defaults to true. */
  showClear?: boolean;
  /** Per-slot class-name overrides. Each slot replaces its semantic default. */
  classNames?: SearchClassNames;
}

/**
 * A search input that filters `items` over `descriptor.searchableFields` via
 * {@link useEntitySearch} and reports the filtered list through `onResults`.
 * Works controlled (pass `query`) or uncontrolled. It holds no business logic
 * beyond wiring the input to the search hook.
 */
export function EntitySearchBar<T>({
  items,
  descriptor,
  query,
  defaultQuery = "",
  onQueryChange,
  onResults,
  placeholder,
  ariaLabel = "Search",
  icon,
  showClear = true,
  classNames,
}: EntitySearchBarProps<T>): React.JSX.Element {
  const [internalQuery, setInternalQuery] = useState(defaultQuery);
  const isControlled = query !== undefined;
  const value = isControlled ? query : internalQuery;

  const results = useEntitySearch(items, descriptor, value);

  // Report results without re-running on every parent re-render: hold the
  // latest callback in a ref and emit only when the filtered list changes.
  const onResultsRef = useRef(onResults);
  useEffect(() => {
    onResultsRef.current = onResults;
  });
  useEffect(() => {
    onResultsRef.current?.(results);
  }, [results]);

  const update = (next: string): void => {
    if (!isControlled) setInternalQuery(next);
    onQueryChange?.(next);
  };

  return (
    <div className={classNames?.container ?? "entity-search"}>
      {icon != null && (
        <span className={classNames?.icon ?? "entity-search__icon"} aria-hidden="true">
          {icon}
        </span>
      )}
      <input
        type="search"
        className={classNames?.input ?? "entity-search__input"}
        value={value}
        placeholder={placeholder}
        aria-label={ariaLabel}
        data-testid={`${descriptor.entityName}-search`}
        onChange={(event) => update(event.target.value)}
      />
      {showClear && value !== "" && (
        <button
          type="button"
          className={classNames?.clearButton ?? "entity-search__clear"}
          aria-label="Clear search"
          onClick={() => update("")}
        >
          {"×"}
        </button>
      )}
    </div>
  );
}
