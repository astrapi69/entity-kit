import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useViewMode } from "./useViewMode";

describe("useViewMode", () => {
  it("defaults to 'list'", () => {
    const { result } = renderHook(() => useViewMode());
    expect(result.current.mode).toBe("list");
  });

  it("honours the provided default mode", () => {
    const { result } = renderHook(() => useViewMode("tile"));
    expect(result.current.mode).toBe("tile");
  });

  it("setMode replaces the current mode", () => {
    const { result } = renderHook(() => useViewMode());
    act(() => result.current.setMode("detail"));
    expect(result.current.mode).toBe("detail");
  });

  it("cycle advances list -> tile -> detail -> list", () => {
    const { result } = renderHook(() => useViewMode("list"));
    act(() => result.current.cycle());
    expect(result.current.mode).toBe("tile");
    act(() => result.current.cycle());
    expect(result.current.mode).toBe("detail");
    act(() => result.current.cycle());
    expect(result.current.mode).toBe("list");
  });
});
