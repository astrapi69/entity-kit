import { useMemo, useState } from "react";
import {
  type ColumnDef,
  type SortingState,
  type Table,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { EntityDescriptor, FieldDescriptor } from "../types";

export interface UseEntityListOptions {
  /** Rows per page. Defaults to 10. */
  pageSize?: number;
  /** Initial sorting state. Defaults to unsorted. */
  initialSorting?: SortingState;
  /** Initial global search query applied across `searchableFields`. */
  initialQuery?: string;
}

export interface UseEntityListResult<T> {
  /** The underlying TanStack Table instance for full control. */
  table: Table<T>;
  /** Column definitions derived from the descriptor's visible list fields. */
  columns: ColumnDef<T>[];
  /** Rows of the current page after sorting and filtering. */
  rows: T[];
  /** The active global search query. */
  query: string;
  /** Update the global search query. */
  setQuery: (query: string) => void;
  /** Current sorting state. */
  sorting: SortingState;
  /** Update the sorting state. */
  setSorting: (sorting: SortingState) => void;
}

/** Visible fields only — `visible` defaults to true when omitted. */
function visibleFields<T>(fields: FieldDescriptor<T>[]): FieldDescriptor<T>[] {
  return fields.filter((field) => field.visible !== false);
}

function toSearchString(value: unknown): string {
  if (value == null) return "";
  if (value instanceof Date) return value.toISOString().toLowerCase();
  return String(value).toLowerCase();
}

/**
 * Wraps TanStack Table to provide sorted, filtered and paginated access to a
 * collection of entities, driven entirely by `descriptor.listFields` and
 * `descriptor.searchableFields`. Holds no fetching and no business logic.
 */
export function useEntityList<T>(
  items: T[],
  descriptor: EntityDescriptor<T>,
  options: UseEntityListOptions = {},
): UseEntityListResult<T> {
  const { pageSize = 10, initialSorting = [], initialQuery = "" } = options;

  const [sorting, setSorting] = useState<SortingState>(initialSorting);
  const [query, setQuery] = useState<string>(initialQuery);

  const columns = useMemo<ColumnDef<T>[]>(() => {
    // Two fields may map to the same key (e.g. a synthetic render-only column
    // anchored to an existing key). Column ids must be unique, so suffix any
    // repeat occurrence while keeping the first stable.
    const usedIds = new Set<string>();
    return visibleFields(descriptor.listFields).map((field, index) => {
      const accessor = field.key as keyof T & string;
      let id = String(field.key);
      if (usedIds.has(id)) id = `${id}__${index}`;
      usedIds.add(id);
      const column: ColumnDef<T> = {
        id,
        accessorKey: accessor,
        header: field.label,
        enableSorting: field.sortable === true,
        // Sort ascending on first click for every column type (TanStack
        // defaults numeric columns to descending-first otherwise).
        sortDescFirst: false,
        cell: field.render
          ? (ctx) => field.render?.(ctx.row.original)
          : (ctx) => ctx.getValue() as never,
      };
      return column;
    });
  }, [descriptor.listFields]);

  const searchableFields = descriptor.searchableFields;

  const table = useReactTable<T>({
    data: items,
    columns,
    state: { sorting, globalFilter: query },
    onSortingChange: setSorting,
    onGlobalFilterChange: setQuery,
    enableSortingRemoval: true,
    globalFilterFn: (row, _columnId, filterValue: string) => {
      const needle = String(filterValue).trim().toLowerCase();
      if (needle === "") return true;
      return searchableFields.some((field) =>
        toSearchString(row.original[field]).includes(needle),
      );
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize, pageIndex: 0 } },
  });

  const rows = table.getRowModel().rows.map((row) => row.original);

  return { table, columns, rows, query, setQuery, sorting, setSorting };
}
