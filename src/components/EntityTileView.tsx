import type { EntityDescriptor, TileClassNames } from "../types";
import { EntityActions } from "./EntityActions";
import { EntityEmptyState } from "./EntityEmptyState";
import type { EntityActionHandler } from "./internal";

export interface EntityTileViewProps<T> {
  /** Items to render as tiles. */
  items: T[];
  /** Descriptor describing how to present each item. */
  descriptor: EntityDescriptor<T>;
  /** Invoked when a tile action is activated. */
  onAction?: EntityActionHandler<T>;
  /** Optional click handler for the tile body. */
  onSelect?: (item: T) => void;
  /** Node rendered when there are no items. */
  emptyState?: React.ReactNode;
  /** Per-slot class-name overrides. Each slot replaces its semantic default. */
  classNames?: TileClassNames;
}

/**
 * Renders a collection of entities as a responsive grid of cards. Each card
 * shows the descriptor's thumbnail, display name, short description and action
 * menu. The grid is a plain element styled by the `grid` slot — with the
 * default CSS it is a responsive CSS grid; with Tailwind you pass grid classes.
 */
export function EntityTileView<T>({
  items,
  descriptor,
  onAction,
  onSelect,
  emptyState,
  classNames,
}: EntityTileViewProps<T>): React.JSX.Element {
  if (items.length === 0) {
    return <>{emptyState ?? <EntityEmptyState />}</>;
  }

  return (
    <ul className={classNames?.grid ?? "entity-tile-grid"}>
      {items.map((item) => {
        const thumbnail = descriptor.thumbnail?.(item);
        return (
          <li key={descriptor.getId(item)} className={classNames?.tile ?? "entity-tile"}>
            <div
              className={classNames?.body ?? "entity-tile__body"}
              role={onSelect ? "button" : undefined}
              tabIndex={onSelect ? 0 : undefined}
              onClick={onSelect ? () => onSelect(item) : undefined}
              onKeyDown={
                onSelect
                  ? (event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onSelect(item);
                      }
                    }
                  : undefined
              }
            >
              <div
                className={classNames?.thumbnail ?? "entity-tile__thumbnail"}
                aria-hidden={thumbnail == null}
              >
                {thumbnail ?? (
                  <span className={classNames?.icon ?? "entity-tile__icon"}>
                    {descriptor.icon}
                  </span>
                )}
              </div>
              <h3 className={classNames?.title ?? "entity-tile__title"}>
                {descriptor.displayName(item)}
              </h3>
              <p className={classNames?.subtitle ?? "entity-tile__subtitle"}>
                {descriptor.shortDescription(item)}
              </p>
            </div>
            <EntityActions
              item={item}
              descriptor={descriptor}
              onAction={onAction}
              classNames={{
                actions: classNames?.actions ?? "entity-tile__actions",
                actionButton: classNames?.actionButton,
                dangerActionButton: classNames?.dangerActionButton,
              }}
            />
          </li>
        );
      })}
    </ul>
  );
}
