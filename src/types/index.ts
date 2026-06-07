import type { ReactNode } from "react";

export type {
  ActionsClassNames,
  TileClassNames,
  ListClassNames,
  DetailClassNames,
  TrashClassNames,
  SearchClassNames,
  ViewSwitcherClassNames,
  EmptyStateClassNames,
} from "./classNames";

/**
 * Visual emphasis for an action. `default` is a neutral action, `danger` marks
 * a destructive action (delete, permanent removal) that consuming apps usually
 * style with a warning color.
 */
export type ActionVariant = "default" | "danger";

/**
 * Describes a single action that can be performed on an entity item, e.g.
 * "edit", "delete", "restore". The library only renders the action affordance
 * and reports activation back to the host — it never performs the action
 * itself.
 */
export interface ActionDescriptor<T> {
  /** Stable identifier, unique within a descriptor's `actions`. */
  id: string;
  /** i18n key or human label for the action. */
  label: string;
  /** Optional icon (any renderable node, e.g. an SVG or icon component). */
  icon?: ReactNode;
  /** Visual emphasis. Defaults to `default` when omitted. */
  variant?: ActionVariant;
  /**
   * Predicate deciding whether the action applies to a given item. When
   * omitted the action is always available.
   */
  isAvailable?: (item: T) => boolean;
}

/**
 * Describes how a single field of an entity is labelled and rendered. A field
 * always maps to a property key of `T`; an optional custom renderer overrides
 * the default value rendering.
 */
export interface FieldDescriptor<T> {
  /** Property key on `T` this field reads from. */
  key: keyof T;
  /** i18n key or human label for the field/column header. */
  label: string;
  /**
   * Custom renderer for the field value. When omitted, components render the
   * raw value. Receives the whole item so renderers can combine fields.
   */
  render?: (item: T) => ReactNode;
  /** Whether the field can be sorted on in list views. Defaults to `false`. */
  sortable?: boolean;
  /** Whether the field is shown. Defaults to `true` when omitted. */
  visible?: boolean;
}

/**
 * The BeanInfo-style self-description of an entity type `T`. A descriptor lets
 * generic components render, sort, search and act on items of `T` without ever
 * knowing the concrete type.
 */
export interface EntityDescriptor<T> {
  /** Stable machine name for the entity type, e.g. `"book"`. Used as registry key. */
  entityName: string;
  /** Stable, unique identifier for a single item. Used as React key. */
  getId: (item: T) => string;
  /** Human/i18n display name for a single item (title shown in tiles, details). */
  displayName: (item: T) => string;
  /** Short one-line summary of an item (tile subtitle, list secondary text). */
  shortDescription: (item: T) => string;
  /** Icon representing the entity type as a whole (renderable node). */
  icon: ReactNode;
  /** Optional per-item thumbnail (image URL or renderable node). */
  thumbnail?: (item: T) => ReactNode;
  /** Fields shown as columns in list views. */
  listFields: FieldDescriptor<T>[];
  /** Fields shown as label/value pairs in the detail view. */
  detailFields: FieldDescriptor<T>[];
  /** Property keys that free-text search matches against. */
  searchableFields: (keyof T)[];
  /** Whether an item is soft-deleted (drives the trash view). */
  isDeleted: (item: T) => boolean;
  /** When the item was soft-deleted, if known. */
  deletedAt?: (item: T) => Date | string | null | undefined;
  /** Actions offered for items of this entity type. */
  actions: ActionDescriptor<T>[];
}
