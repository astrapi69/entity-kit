import type { ReactNode } from "react";
import type { ViewMode } from "../hooks/useViewMode";

export interface ViewSwitcherOption {
  /** The view mode this option selects. */
  mode: ViewMode;
  /** Accessible label for the toggle button. */
  label: string;
  /** Optional icon shown inside the button. */
  icon?: ReactNode;
}

export interface EntityViewSwitcherProps {
  /** Currently active mode. */
  mode: ViewMode;
  /** Called with the chosen mode when a toggle is activated. */
  onChange: (mode: ViewMode) => void;
  /**
   * Modes to offer, in order. Defaults to list, tile and detail with plain
   * text labels.
   */
  options?: ViewSwitcherOption[];
  /** Extra class names appended to the root element. */
  className?: string;
}

const DEFAULT_OPTIONS: ViewSwitcherOption[] = [
  { mode: "list", label: "List" },
  { mode: "tile", label: "Tile" },
  { mode: "detail", label: "Detail" },
];

/**
 * A set of toggle buttons for switching between list, tile and detail view
 * modes. Controlled — it renders the active mode and reports changes; it owns
 * no state.
 */
export function EntityViewSwitcher({
  mode,
  onChange,
  options = DEFAULT_OPTIONS,
  className,
}: EntityViewSwitcherProps): JSX.Element {
  return (
    <div
      className={["entity-switcher", className].filter(Boolean).join(" ")}
      role="group"
    >
      {options.map((option) => {
        const active = option.mode === mode;
        return (
          <button
            key={option.mode}
            type="button"
            className="entity-switcher__button"
            data-mode={option.mode}
            data-active={active || undefined}
            aria-pressed={active}
            onClick={() => onChange(option.mode)}
          >
            {option.icon != null && (
              <span className="entity-switcher__icon" aria-hidden="true">
                {option.icon}
              </span>
            )}
            <span className="entity-switcher__label">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
