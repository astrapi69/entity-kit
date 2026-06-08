/**
 * A label is either a literal string or a zero-arg factory that returns one.
 * The factory form lets consuming apps wire up i18n — e.g. `() => t("book.title")`
 * — so the label is resolved at render time, in the active locale.
 */
export type LabelValue = string | (() => string);

/** Resolve a {@link LabelValue} to its string form. */
export function resolveLabel(label: LabelValue): string {
  return typeof label === "function" ? label() : label;
}
