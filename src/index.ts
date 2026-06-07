// Public API — named exports only.

// Core types
export type {
  ActionVariant,
  ActionDescriptor,
  FieldDescriptor,
  EntityDescriptor,
} from "./types";

// Hooks
export { useViewMode, useEntitySearch, useEntityList } from "./hooks";
export type {
  ViewMode,
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
  EntityViewSwitcherProps,
  ViewSwitcherOption,
} from "./components";

// Registry
export { DescriptorRegistry, descriptorRegistry } from "./registry";
