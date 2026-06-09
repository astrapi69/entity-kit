import { useCallback, useState } from "react";
import type { ViewMode } from "@astrapi69/entity-kit-core";

/** The three ways a collection of entities can be presented (from the core). */
export type { ViewMode };

export interface UseViewModeResult {
  /** The currently selected view mode. */
  mode: ViewMode;
  /** Replace the current view mode. */
  setMode: (mode: ViewMode) => void;
  /** Cycle to the next mode in the order list -> tile -> detail -> list. */
  cycle: () => void;
}

const ORDER: ViewMode[] = ["list", "tile", "detail"];

/**
 * Minimal state hook toggling between the supported view modes. Holds no
 * business logic — purely a controlled-ish state container for the active mode.
 */
export function useViewMode(defaultMode: ViewMode = "list"): UseViewModeResult {
  const [mode, setMode] = useState<ViewMode>(defaultMode);

  const cycle = useCallback(() => {
    setMode((current) => {
      const index = ORDER.indexOf(current);
      return ORDER[(index + 1) % ORDER.length];
    });
  }, []);

  return { mode, setMode, cycle };
}
