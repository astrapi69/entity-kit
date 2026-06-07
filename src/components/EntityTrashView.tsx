import { useMemo } from "react";
import type {
  ActionDescriptor,
  EntityDescriptor,
  FieldDescriptor,
  TrashClassNames,
} from "../types";
import { EntityListView } from "./EntityListView";
import { EntityEmptyState } from "./EntityEmptyState";
import type { UseEntityListOptions } from "../hooks/useEntityList";
import type { EntityActionHandler } from "./internal";

/** Action id emitted when the user restores a soft-deleted item. */
export const RESTORE_ACTION_ID = "restore";
/** Action id emitted when the user permanently deletes an item. */
export const PERMANENT_DELETE_ACTION_ID = "permanentDelete";

export interface EntityTrashViewProps<T> {
  /** Items to consider. Only soft-deleted ones (per `isDeleted`) are shown. */
  items: T[];
  /** Descriptor describing the items. */
  descriptor: EntityDescriptor<T>;
  /**
   * Invoked when a trash action is activated. The action id is one of
   * {@link RESTORE_ACTION_ID} or {@link PERMANENT_DELETE_ACTION_ID}.
   */
  onAction?: EntityActionHandler<T>;
  /** Label for the restore action. Defaults to "Restore". */
  restoreLabel?: string;
  /** Label for the permanent-delete action. Defaults to "Delete permanently". */
  permanentDeleteLabel?: string;
  /** Column header for the deletion timestamp. Defaults to "Deleted". */
  deletedAtLabel?: string;
  /** Table options forwarded to the underlying list view. */
  options?: UseEntityListOptions;
  /** Node rendered when the trash is empty. */
  emptyState?: React.ReactNode;
  /** Per-slot class-name overrides. `list` is forwarded to the inner list view. */
  classNames?: TrashClassNames;
}

function formatDeletedAt(value: Date | string | null | undefined): string {
  if (value == null) return "";
  if (value instanceof Date) return value.toISOString();
  return value;
}

/**
 * Shows the soft-deleted items of a collection as a list, augmented with a
 * deletion-timestamp column and restore / permanent-delete actions. It reuses
 * {@link EntityListView} via a derived descriptor and adds no business logic —
 * acting on the emitted actions is the host's responsibility.
 */
export function EntityTrashView<T>({
  items,
  descriptor,
  onAction,
  restoreLabel = "Restore",
  permanentDeleteLabel = "Delete permanently",
  deletedAtLabel = "Deleted",
  options,
  emptyState,
  classNames,
}: EntityTrashViewProps<T>): JSX.Element {
  const deletedItems = useMemo(
    () => items.filter((item) => descriptor.isDeleted(item)),
    [items, descriptor],
  );

  const trashDescriptor = useMemo<EntityDescriptor<T>>(() => {
    const trashActions: ActionDescriptor<T>[] = [
      { id: RESTORE_ACTION_ID, label: restoreLabel },
      {
        id: PERMANENT_DELETE_ACTION_ID,
        label: permanentDeleteLabel,
        variant: "danger",
      },
    ];

    const listFields: FieldDescriptor<T>[] = [...descriptor.listFields];

    // Append a render-only deletion-timestamp column when the descriptor knows
    // how to read it. `key` must be a keyof T, so anchor it to an existing
    // field key; the custom renderer ignores that value entirely.
    if (descriptor.deletedAt) {
      const anchorKey =
        descriptor.listFields[0]?.key ?? descriptor.detailFields[0]?.key;
      if (anchorKey !== undefined) {
        const readDeletedAt = descriptor.deletedAt;
        listFields.push({
          key: anchorKey,
          label: deletedAtLabel,
          sortable: false,
          render: (item) => formatDeletedAt(readDeletedAt(item)),
        });
      }
    }

    return { ...descriptor, listFields, actions: trashActions };
  }, [descriptor, restoreLabel, permanentDeleteLabel, deletedAtLabel]);

  if (deletedItems.length === 0) {
    return (
      <div className={classNames?.container ?? "entity-trash"}>
        {emptyState ?? <EntityEmptyState title="Trash is empty" />}
      </div>
    );
  }

  return (
    <div className={classNames?.container ?? "entity-trash"}>
      <EntityListView
        items={deletedItems}
        descriptor={trashDescriptor}
        onAction={onAction}
        options={options}
        classNames={classNames?.list}
      />
    </div>
  );
}
