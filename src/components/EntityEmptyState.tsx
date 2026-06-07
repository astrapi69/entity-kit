import type { ReactNode } from "react";

export interface EntityEmptyStateProps {
  /** Primary message. Defaults to a generic "No items" text. */
  title?: string;
  /** Optional secondary explanation. */
  description?: string;
  /** Optional icon/illustration shown above the title. */
  icon?: ReactNode;
  /** Optional call-to-action element (e.g. a button) shown below the text. */
  action?: ReactNode;
  /** Extra class names appended to the root element. */
  className?: string;
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
  className,
}: EntityEmptyStateProps): JSX.Element {
  return (
    <div
      className={["entity-empty", className].filter(Boolean).join(" ")}
      role="status"
    >
      {icon != null && (
        <div className="entity-empty__icon" aria-hidden="true">
          {icon}
        </div>
      )}
      <p className="entity-empty__title">{title}</p>
      {description != null && (
        <p className="entity-empty__description">{description}</p>
      )}
      {action != null && <div className="entity-empty__action">{action}</div>}
    </div>
  );
}
