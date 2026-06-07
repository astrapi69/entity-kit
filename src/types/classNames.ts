/**
 * Per-slot class-name overrides for the entity-kit components.
 *
 * Every component accepts an optional `classNames` prop typed by one of these
 * interfaces. Each field maps to one visual slot of the component. When a slot
 * is provided it REPLACES the default semantic class for that slot; when it is
 * omitted the component falls back to its semantic class (e.g. `entity-tile`).
 *
 * This is what lets the library work with CSS custom properties, Tailwind, CSS
 * Modules or any other approach without coupling to any of them.
 */

/**
 * Shared slots for the per-item action menu, used by the list, tile and detail
 * views (and by the standalone {@link EntityActions} component).
 */
export interface ActionsClassNames {
  /** The action group container. */
  actions?: string;
  /** Each action button. */
  actionButton?: string;
  /**
   * Override applied to buttons whose action `variant` is `"danger"`. Falls
   * back to `actionButton` when omitted.
   */
  dangerActionButton?: string;
  /** The icon wrapper inside an action button. */
  actionIcon?: string;
  /** The label inside an action button. */
  actionLabel?: string;
}

/** Slots for {@link EntityTileView}. */
export interface TileClassNames {
  /** The grid wrapping all tiles. */
  grid?: string;
  /** Each tile/card. */
  tile?: string;
  /** The clickable body of a tile (thumbnail + text). */
  body?: string;
  /** The thumbnail container. */
  thumbnail?: string;
  /** The entity icon shown when there is no thumbnail. */
  icon?: string;
  /** The tile title (display name). */
  title?: string;
  /** The tile subtitle (short description). */
  subtitle?: string;
  /** The action group container. */
  actions?: string;
  /** Each action button. */
  actionButton?: string;
  /** Override applied to `"danger"` action buttons. */
  dangerActionButton?: string;
}

/** Slots for {@link EntityListView}. */
export interface ListClassNames {
  /** The outer wrapper around the table and pagination. */
  root?: string;
  /** The `<table>`. */
  table?: string;
  /** The `<thead>`. */
  head?: string;
  /** Each header `<tr>`. */
  headerRow?: string;
  /** Each header `<th>`. */
  header?: string;
  /** The trailing actions header cell. */
  headerActions?: string;
  /** The sort toggle button inside a sortable header. */
  sortButton?: string;
  /** The `<tbody>`. */
  body?: string;
  /** Each body `<tr>`. */
  row?: string;
  /** Each body `<td>`. */
  cell?: string;
  /** The trailing actions cell. */
  actionsCell?: string;
  /** The action group container. */
  actions?: string;
  /** Each action button. */
  actionButton?: string;
  /** Override applied to `"danger"` action buttons. */
  dangerActionButton?: string;
  /** The pagination bar. */
  pagination?: string;
  /** Each pagination button. */
  pageButton?: string;
  /** The "page x / y" status text. */
  pageStatus?: string;
}

/** Slots for {@link EntityDetailView}. */
export interface DetailClassNames {
  /** The article wrapper. */
  container?: string;
  /** The header (icon + heading). */
  header?: string;
  /** The entity icon. */
  icon?: string;
  /** The heading wrapper (title + subtitle). */
  heading?: string;
  /** The title (display name). */
  title?: string;
  /** The subtitle (short description). */
  subtitle?: string;
  /** The `<dl>` of fields. */
  fields?: string;
  /** Each field wrapper. */
  field?: string;
  /** Each field label (`<dt>`). */
  label?: string;
  /** Each field value (`<dd>`). */
  value?: string;
  /** The footer holding the actions. */
  footer?: string;
  /** The action group container. */
  actions?: string;
  /** Each action button. */
  actionButton?: string;
  /** Override applied to `"danger"` action buttons. */
  dangerActionButton?: string;
}

/** Slots for {@link EntityTrashView}. */
export interface TrashClassNames {
  /** The outer wrapper around the trash list. */
  container?: string;
  /** Class names forwarded to the inner {@link EntityListView}. */
  list?: ListClassNames;
}

/** Slots for {@link EntitySearchBar}. */
export interface SearchClassNames {
  /** The container wrapping the input. */
  container?: string;
  /** The search `<input>`. */
  input?: string;
  /** An optional leading icon slot. */
  icon?: string;
  /** The clear button shown when there is a query. */
  clearButton?: string;
}

/** Slots for {@link EntityViewSwitcher}. */
export interface ViewSwitcherClassNames {
  /** The toggle group container. */
  group?: string;
  /** Each toggle button. */
  button?: string;
  /** Additional class applied to the active button (in addition to `button`). */
  activeButton?: string;
  /** The icon inside a button. */
  icon?: string;
  /** The label inside a button. */
  label?: string;
}

/** Slots for {@link EntityEmptyState}. */
export interface EmptyStateClassNames {
  /** The container. */
  container?: string;
  /** The icon/illustration wrapper. */
  icon?: string;
  /** The title. */
  title?: string;
  /** The description. */
  description?: string;
  /** The call-to-action wrapper. */
  action?: string;
}
