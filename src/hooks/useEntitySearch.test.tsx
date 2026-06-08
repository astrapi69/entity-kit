import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useEntitySearch } from "./useEntitySearch";
import { bookDescriptor, books } from "../test/fixtures";

describe("useEntitySearch", () => {
  it("returns all items for an empty query", () => {
    const { result } = renderHook(() =>
      useEntitySearch(books, bookDescriptor, ""),
    );
    expect(result.current).toHaveLength(books.length);
  });

  it("returns all items for a whitespace-only query", () => {
    const { result } = renderHook(() =>
      useEntitySearch(books, bookDescriptor, "   "),
    );
    expect(result.current).toHaveLength(books.length);
  });

  it("matches case-insensitively against searchable fields", () => {
    const { result } = renderHook(() =>
      useEntitySearch(books, bookDescriptor, "DUNE"),
    );
    expect(result.current).toHaveLength(1);
    expect(result.current[0].title).toBe("Dune");
  });

  it("matches across multiple searchable fields", () => {
    const { result } = renderHook(() =>
      useEntitySearch(books, bookDescriptor, "herbert"),
    );
    // Two books share the author "Herbert".
    expect(result.current.map((b) => b.id).sort()).toEqual(["1", "4"]);
  });

  it("does not match fields that are not searchable", () => {
    // `year` is not in searchableFields, so searching for it finds nothing.
    const { result } = renderHook(() =>
      useEntitySearch(books, bookDescriptor, "1992"),
    );
    expect(result.current).toHaveLength(0);
  });

  it("returns an empty list when nothing matches", () => {
    const { result } = renderHook(() =>
      useEntitySearch(books, bookDescriptor, "zzz-nope"),
    );
    expect(result.current).toHaveLength(0);
  });

  it("treats a descriptor without searchableFields as having nothing to match", () => {
    const noSearch = { ...bookDescriptor, searchableFields: undefined };
    const empty = renderHook(() => useEntitySearch(books, noSearch, ""));
    expect(empty.result.current).toHaveLength(books.length);
    const queried = renderHook(() => useEntitySearch(books, noSearch, "dune"));
    expect(queried.result.current).toHaveLength(0);
  });
});
