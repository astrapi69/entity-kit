// Public API — named exports only.
//
// The framework-agnostic core (types, utilities, registry and design tokens)
// lives in @astrapi69/entity-kit-core and is re-exported here, so apps can keep
// importing everything from "@astrapi69/entity-kit". The React components live
// in this package.

// Re-export the entire core: types, the registry (DescriptorRegistry,
// descriptorRegistry) and the utilities (resolveLabel, searchEntities,
// sortEntities, generateTestId, withDescriptorDefaults, …).
export * from "@astrapi69/entity-kit-core";

// React-bound descriptor types (renderable nodes are React nodes). These
// explicit exports shadow the core's framework-agnostic versions of the same
// names, so React consumers get `ReactNode`-typed `icon`/`render`/`thumbnail`.
export type {
  EntityDescriptor,
  FieldDescriptor,
  ActionDescriptor,
} from "./types";

// Hooks
export { useViewMode, useEntitySearch, useEntityList } from "./hooks";
export type {
  UseViewModeResult,
  UseEntityListOptions,
  UseEntityListResult,
} from "./hooks";

// Components
export {
  EntityActions,
  EntityEmptyState,
  EntityListView,
  EntityTileView,
  EntityDetailView,
  EntityTrashView,
  EntitySearchBar,
  EntityViewSwitcher,
  RESTORE_ACTION_ID,
  PERMANENT_DELETE_ACTION_ID,
} from "./components";
export type {
  EntityActionsProps,
  EntityActionHandler,
  EntityEmptyStateProps,
  EntityListViewProps,
  EntityTileViewProps,
  EntityDetailViewProps,
  EntityTrashViewProps,
  EntitySearchBarProps,
  EntityViewSwitcherProps,
  ViewSwitcherOption,
} from "./components";
