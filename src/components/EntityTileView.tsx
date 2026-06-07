import type { EntityDescriptor } from "../types";
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
  /** Returns a stable React key for an item. Defaults to the descriptor id. */
  getKey?: (item: T, index: number) => React.Key;
  /** Node rendered when there are no items. */
  emptyState?: React.ReactNode;
  /** Extra class names appended to the root element. */
  className?: string;
}

/**
 * Renders a collection of entities as a responsive CSS grid of cards. Each card
 * shows the descriptor's thumbnail, display name, short description and action
 * menu. Layout is a grid; the actual track sizing is delegated to CSS variables.
 */
export function EntityTileView<T>({
  items,
  descriptor,
  onAction,
  onSelect,
  getKey,
  emptyState,
  className,
}: EntityTileViewProps<T>): JSX.Element {
  if (items.length === 0) {
    return <>{emptyState ?? <EntityEmptyState />}</>;
  }

  return (
    <ul className={["entity-tile", className].filter(Boolean).join(" ")}>
      {items.map((item, index) => {
        const thumbnail = descriptor.thumbnail?.(item);
        return (
          <li
            key={getKey ? getKey(item, index) : descriptor.getId(item)}
            className="entity-tile__card"
          >
            <div
              className="entity-tile__body"
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
              <div className="entity-tile__thumbnail" aria-hidden={thumbnail == null}>
                {thumbnail ?? (
                  <span className="entity-tile__icon">{descriptor.icon}</span>
                )}
              </div>
              <h3 className="entity-tile__title">{descriptor.displayName(item)}</h3>
              <p className="entity-tile__description">
                {descriptor.shortDescription(item)}
              </p>
            </div>
            <EntityActions
              item={item}
              descriptor={descriptor}
              onAction={onAction}
              className="entity-tile__actions"
            />
          </li>
        );
      })}
    </ul>
  );
}
