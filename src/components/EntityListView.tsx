import { flexRender } from "@tanstack/react-table";
import type { EntityDescriptor } from "../types";
import { useEntityList, type UseEntityListOptions } from "../hooks/useEntityList";
import { EntityActions } from "./EntityActions";
import { EntityEmptyState } from "./EntityEmptyState";
import type { EntityActionHandler } from "./internal";

export interface EntityListViewProps<T> {
  /** Items to render. The library never fetches — data flows in here. */
  items: T[];
  /** Descriptor describing how to render and sort the items. */
  descriptor: EntityDescriptor<T>;
  /** Invoked when a row action is activated. */
  onAction?: EntityActionHandler<T>;
  /** Table options forwarded to {@link useEntityList}. */
  options?: UseEntityListOptions;
  /** Show pagination controls. Defaults to true. */
  showPagination?: boolean;
  /** Node rendered when there are no items. */
  emptyState?: React.ReactNode;
  /** Extra class names appended to the root element. */
  className?: string;
}

/**
 * Renders a collection of entities as a sortable, paginated table whose columns
 * come from `descriptor.listFields`. Each row carries an action menu. Sorting,
 * filtering and pagination are delegated to TanStack Table via
 * {@link useEntityList}.
 */
export function EntityListView<T>({
  items,
  descriptor,
  onAction,
  options,
  showPagination = true,
  emptyState,
  className,
}: EntityListViewProps<T>): JSX.Element {
  const { table } = useEntityList(items, descriptor, options);
  const rows = table.getRowModel().rows;
  const hasActions = descriptor.actions.length > 0;

  if (items.length === 0) {
    return <>{emptyState ?? <EntityEmptyState />}</>;
  }

  return (
    <div className={["entity-list", className].filter(Boolean).join(" ")}>
      <table className="entity-list__table">
        <thead className="entity-list__head">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="entity-list__row">
              {headerGroup.headers.map((header) => {
                const canSort = header.column.getCanSort();
                const sorted = header.column.getIsSorted();
                return (
                  <th
                    key={header.id}
                    className="entity-list__header"
                    data-sortable={canSort}
                    data-sorted={sorted || undefined}
                    aria-sort={
                      sorted === "asc"
                        ? "ascending"
                        : sorted === "desc"
                          ? "descending"
                          : undefined
                    }
                  >
                    {canSort ? (
                      <button
                        type="button"
                        className="entity-list__sort"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {sorted === "asc" && (
                          <span aria-hidden="true" className="entity-list__sort-indicator">
                            {" ↑"}
                          </span>
                        )}
                        {sorted === "desc" && (
                          <span aria-hidden="true" className="entity-list__sort-indicator">
                            {" ↓"}
                          </span>
                        )}
                      </button>
                    ) : (
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )
                    )}
                  </th>
                );
              })}
              {hasActions && (
                <th className="entity-list__header entity-list__header--actions">
                  {""}
                </th>
              )}
            </tr>
          ))}
        </thead>
        <tbody className="entity-list__body">
          {rows.map((row) => (
            <tr key={row.id} className="entity-list__row">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="entity-list__cell">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
              {hasActions && (
                <td className="entity-list__cell entity-list__cell--actions">
                  <EntityActions
                    item={row.original}
                    descriptor={descriptor}
                    onAction={onAction}
                  />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {showPagination && table.getPageCount() > 1 && (
        <div className="entity-list__pagination">
          <button
            type="button"
            className="entity-list__page-button"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"Previous"}
          </button>
          <span className="entity-list__page-status">
            {table.getState().pagination.pageIndex + 1}
            {" / "}
            {table.getPageCount()}
          </span>
          <button
            type="button"
            className="entity-list__page-button"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {"Next"}
          </button>
        </div>
      )}
    </div>
  );
}
