import type { ReactNode } from "react";
import type { EmptyStateClassNames } from "../types";

export interface EntityEmptyStateProps {
  /** Primary message. Defaults to a generic "No items" text. */
  title?: string;
  /** Optional secondary explanation. */
  description?: string;
  /** Optional icon/illustration shown above the title. */
  icon?: ReactNode;
  /** Optional call-to-action element (e.g. a button) shown below the text. */
  action?: ReactNode;
  /** Per-slot class-name overrides. Each slot replaces its semantic default. */
  classNames?: EmptyStateClassNames;
}

/**
 * Placeholder rendered when an entity collection is empty. Carries no logic; it
 * only displays the provided messaging.
 */
export function EntityEmptyState({
  title = "No items",
  description,
  icon,
  action,
  classNames,
}: EntityEmptyStateProps): React.JSX.Element {
  return (
    <div className={classNames?.container ?? "entity-empty"} role="status">
      {icon != null && (
        <div className={classNames?.icon ?? "entity-empty__icon"} aria-hidden="true">
          {icon}
        </div>
      )}
      <p className={classNames?.title ?? "entity-empty__title"}>{title}</p>
      {description != null && (
        <p className={classNames?.description ?? "entity-empty__description"}>
          {description}
        </p>
      )}
      {action != null && (
        <div className={classNames?.action ?? "entity-empty__action"}>{action}</div>
      )}
    </div>
  );
}
