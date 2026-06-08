import type { ActionsClassNames, EntityDescriptor } from "../types";
import type { EntityActionHandler } from "./internal";

export interface EntityActionsProps<T> {
  /** The item the actions apply to. */
  item: T;
  /** Descriptor providing the available actions. */
  descriptor: EntityDescriptor<T>;
  /** Invoked with the action id and item when an action is activated. */
  onAction?: EntityActionHandler<T>;
  /** Per-slot class-name overrides. Each slot replaces its semantic default. */
  classNames?: ActionsClassNames;
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
  classNames,
}: EntityActionsProps<T>): React.JSX.Element | null {
  const available = descriptor.actions.filter(
    (action) => action.isAvailable?.(item) ?? true,
  );

  if (available.length === 0) return null;

  return (
    <div className={classNames?.actions ?? "entity-actions"} role="group">
      {available.map((action) => {
        const isDanger = action.variant === "danger";
        const buttonClass = isDanger
          ? (classNames?.dangerActionButton ??
            classNames?.actionButton ??
            "entity-actions__button")
          : (classNames?.actionButton ?? "entity-actions__button");
        return (
          <button
            key={action.id}
            type="button"
            className={buttonClass}
            data-action={action.id}
            data-variant={action.variant ?? "default"}
            onClick={() => onAction?.(action.id, item)}
          >
            {action.icon != null && (
              <span
                className={classNames?.actionIcon ?? "entity-actions__icon"}
                aria-hidden="true"
              >
                {action.icon}
              </span>
            )}
            <span className={classNames?.actionLabel ?? "entity-actions__label"}>
              {action.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
