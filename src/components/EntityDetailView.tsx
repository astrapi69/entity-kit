import type { EntityDescriptor } from "../types";
import { EntityActions } from "./EntityActions";
import { renderFieldValue, visibleFields } from "./internal";
import type { EntityActionHandler } from "./internal";

export interface EntityDetailViewProps<T> {
  /** The single item to render in detail. */
  item: T;
  /** Descriptor describing the detail fields and actions. */
  descriptor: EntityDescriptor<T>;
  /** Invoked when an action button is activated. */
  onAction?: EntityActionHandler<T>;
  /** Show the entity header (icon + display name + description). Defaults to true. */
  showHeader?: boolean;
  /** Extra class names appended to the root element. */
  className?: string;
}

/**
 * Renders a single entity as label/value pairs taken from
 * `descriptor.detailFields`, honouring per-field custom renderers, followed by
 * the item's action buttons.
 */
export function EntityDetailView<T>({
  item,
  descriptor,
  onAction,
  showHeader = true,
  className,
}: EntityDetailViewProps<T>): JSX.Element {
  const fields = visibleFields(descriptor.detailFields);

  return (
    <article className={["entity-detail", className].filter(Boolean).join(" ")}>
      {showHeader && (
        <header className="entity-detail__header">
          <span className="entity-detail__icon" aria-hidden="true">
            {descriptor.icon}
          </span>
          <div className="entity-detail__heading">
            <h2 className="entity-detail__title">{descriptor.displayName(item)}</h2>
            <p className="entity-detail__subtitle">
              {descriptor.shortDescription(item)}
            </p>
          </div>
        </header>
      )}

      <dl className="entity-detail__fields">
        {fields.map((field) => (
          <div key={String(field.key)} className="entity-detail__field">
            <dt className="entity-detail__label">{field.label}</dt>
            <dd className="entity-detail__value">
              {renderFieldValue(field, item)}
            </dd>
          </div>
        ))}
      </dl>

      {descriptor.actions.length > 0 && (
        <footer className="entity-detail__footer">
          <EntityActions
            item={item}
            descriptor={descriptor}
            onAction={onAction}
            className="entity-detail__actions"
          />
        </footer>
      )}
    </article>
  );
}
