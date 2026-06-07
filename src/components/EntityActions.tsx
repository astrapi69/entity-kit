import type { EntityDescriptor } from "../types";
import type { EntityActionHandler } from "./internal";

export interface EntityActionsProps<T> {
  /** The item the actions apply to. */
  item: T;
  /** Descriptor providing the available actions. */
  descriptor: EntityDescriptor<T>;
  /** Invoked with the action id and item when an action is activated. */
  onAction?: EntityActionHandler<T>;
  /** Extra class names appended to the root element. */
  className?: string;
}

/**
 * Renders the action menu for a single item: one button per descriptor action
 * whose `isAvailable` predicate (when present) returns true. Purely an
 * affordance — it reports activation through `onAction` and performs nothing.
 */
export function EntityActions<T>({
  item,
  descriptor,
  onAction,
  className,
}: EntityActionsProps<T>): JSX.Element | null {
  const available = descriptor.actions.filter(
    (action) => action.isAvailable?.(item) ?? true,
  );

  if (available.length === 0) return null;

  return (
    <div
      className={["entity-actions", className].filter(Boolean).join(" ")}
      role="group"
    >
      {available.map((action) => (
        <button
          key={action.id}
          type="button"
          className="entity-actions__button"
          data-action={action.id}
          data-variant={action.variant ?? "default"}
          onClick={() => onAction?.(action.id, item)}
        >
          {action.icon != null && (
            <span className="entity-actions__icon" aria-hidden="true">
              {action.icon}
            </span>
          )}
          <span className="entity-actions__label">{action.label}</span>
        </button>
      ))}
    </div>
  );
}
