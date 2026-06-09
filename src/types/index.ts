// Types now live in @astrapi69/entity-kit-core. This module is a thin shim that
// re-exports them, binding the framework-agnostic `Node` generic to React's
// `ReactNode` so descriptors, fields and actions render React content. No types
// are defined here — only re-exported/aliased from the core.

import type { ReactNode } from "react";
import type {
  EntityDescriptor as CoreEntityDescriptor,
  FieldDescriptor as CoreFieldDescriptor,
  ActionDescriptor as CoreActionDescriptor,
} from "@astrapi69/entity-kit-core";

/** React-bound descriptor: renderable nodes (`icon`, `thumbnail`, `render`) are React nodes. */
export type EntityDescriptor<T> = CoreEntityDescriptor<T, ReactNode>;
/** React-bound field descriptor: `render` returns a React node. */
export type FieldDescriptor<T> = CoreFieldDescriptor<T, ReactNode>;
/** React-bound action descriptor: `icon` is a React node. */
export type ActionDescriptor<T> = CoreActionDescriptor<T, ReactNode>;

// Framework-agnostic types pass through unchanged from the core.
export type {
  ActionVariant,
  LabelValue,
  ViewMode,
  TrashViewOptions,
  ActionsClassNames,
  TileClassNames,
  ListClassNames,
  DetailClassNames,
  TrashClassNames,
  SearchClassNames,
  ViewSwitcherClassNames,
  EmptyStateClassNames,
} from "@astrapi69/entity-kit-core";
