import type { ReactNode } from "react";
import type { FieldDescriptor } from "../types";

/** Callback fired when the user activates an action on an item. */
export type EntityActionHandler<T> = (actionId: string, item: T) => void;

/** Visible fields only — `visible` defaults to true when omitted. */
export function visibleFields<T>(
  fields: FieldDescriptor<T>[],
): FieldDescriptor<T>[] {
  return fields.filter((field) => field.visible !== false);
}

/**
 * Renders the value of a single field: the descriptor's custom renderer when
 * provided, otherwise a best-effort stringification of the raw value.
 */
export function renderFieldValue<T>(
  field: FieldDescriptor<T>,
  item: T,
): ReactNode {
  if (field.render) return field.render(item);
  const value = item[field.key];
  if (value == null) return "";
  if (value instanceof Date) return value.toISOString();
  // Numbers, strings and booleans render directly; objects fall back to String.
  return String(value);
}
