import type { DetailClassNames, EntityDescriptor } from "../types";
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
  /** Per-slot class-name overrides. Each slot replaces its semantic default. */
  classNames?: DetailClassNames;
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
  classNames,
}: EntityDetailViewProps<T>): React.JSX.Element {
  const fields = visibleFields(descriptor.detailFields);

  return (
    <article className={classNames?.container ?? "entity-detail"}>
      {showHeader && (
        <header className={classNames?.header ?? "entity-detail__header"}>
          <span className={classNames?.icon ?? "entity-detail__icon"} aria-hidden="true">
            {descriptor.icon}
          </span>
          <div className={classNames?.heading ?? "entity-detail__heading"}>
            <h2 className={classNames?.title ?? "entity-detail__title"}>
              {descriptor.displayName(item)}
            </h2>
            <p className={classNames?.subtitle ?? "entity-detail__subtitle"}>
              {descriptor.shortDescription(item)}
            </p>
          </div>
        </header>
      )}

      <dl className={classNames?.fields ?? "entity-detail__fields"}>
        {fields.map((field) => (
          <div
            key={String(field.key)}
            className={classNames?.field ?? "entity-detail__field"}
          >
            <dt className={classNames?.label ?? "entity-detail__label"}>
              {field.label}
            </dt>
            <dd className={classNames?.value ?? "entity-detail__value"}>
              {renderFieldValue(field, item)}
            </dd>
          </div>
        ))}
      </dl>

      {descriptor.actions.length > 0 && (
        <footer className={classNames?.footer ?? "entity-detail__footer"}>
          <EntityActions
            item={item}
            descriptor={descriptor}
            onAction={onAction}
            classNames={{
              actions: classNames?.actions ?? "entity-detail__actions",
              actionButton: classNames?.actionButton,
              dangerActionButton: classNames?.dangerActionButton,
            }}
          />
        </footer>
      )}
    </article>
  );
}
