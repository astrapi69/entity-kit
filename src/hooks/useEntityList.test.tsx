import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useEntityList } from "./useEntityList";
import { bookDescriptor, books } from "../test/fixtures";

describe("useEntityList", () => {
  it("derives columns from visible list fields only", () => {
    const { result } = renderHook(() => useEntityList(books, bookDescriptor));
    // The descriptor has 4 list fields, one of which (id) is visible: false.
    expect(result.current.columns).toHaveLength(3);
    expect(result.current.columns.map((c) => c.id)).toEqual([
      "title",
      "author",
      "year",
    ]);
  });

  it("returns all rows when there is no filter and items fit on one page", () => {
    const { result } = renderHook(() => useEntityList(books, bookDescriptor));
    expect(result.current.rows).toHaveLength(books.length);
  });

  it("filters rows by the global query over searchable fields", () => {
    const { result } = renderHook(() => useEntityList(books, bookDescriptor));
    act(() => result.current.setQuery("gibson"));
    expect(result.current.rows).toHaveLength(1);
    expect(result.current.rows[0].title).toBe("Neuromancer");
  });

  it("sorts ascending and descending on a sortable field", () => {
    const { result } = renderHook(() => useEntityList(books, bookDescriptor));
    act(() => result.current.setSorting([{ id: "year", desc: false }]));
    expect(result.current.rows.map((b) => b.year)).toEqual([
      1960, 1965, 1984, 1992,
    ]);
    act(() => result.current.setSorting([{ id: "year", desc: true }]));
    expect(result.current.rows.map((b) => b.year)).toEqual([
      1992, 1984, 1965, 1960,
    ]);
  });

  it("paginates according to pageSize", () => {
    const { result } = renderHook(() =>
      useEntityList(books, bookDescriptor, { pageSize: 2 }),
    );
    expect(result.current.rows).toHaveLength(2);
    expect(result.current.table.getPageCount()).toBe(2);
    act(() => result.current.table.nextPage());
    expect(result.current.rows).toHaveLength(2);
  });

  it("respects an initial query", () => {
    const { result } = renderHook(() =>
      useEntityList(books, bookDescriptor, { initialQuery: "dune" }),
    );
    expect(result.current.rows).toHaveLength(1);
  });
});
