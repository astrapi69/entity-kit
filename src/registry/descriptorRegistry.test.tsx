import { beforeEach, describe, expect, it } from "vitest";
import {
  DescriptorRegistry,
  descriptorRegistry,
} from "./descriptorRegistry";
import { bookDescriptor } from "../test/fixtures";
import type { EntityDescriptor } from "../types";

interface Profile {
  handle: string;
  removed: boolean;
}

const profileDescriptor: EntityDescriptor<Profile> = {
  entityName: "profile",
  getId: (p) => p.handle,
  displayName: (p) => p.handle,
  shortDescription: () => "",
  icon: "👤",
  listFields: [{ key: "handle", label: "Handle" }],
  detailFields: [{ key: "handle", label: "Handle" }],
  searchableFields: ["handle"],
  isDeleted: (p) => p.removed,
  actions: [],
};

describe("DescriptorRegistry", () => {
  let registry: DescriptorRegistry;

  beforeEach(() => {
    registry = new DescriptorRegistry();
  });

  it("registers and retrieves by entity name", () => {
    registry.register(bookDescriptor);
    const retrieved = registry.get("book");
    expect(retrieved).toBe(bookDescriptor);
  });

  it("returns undefined for unknown names", () => {
    expect(registry.get("unknown")).toBeUndefined();
  });

  it("reports membership with has()", () => {
    expect(registry.has("book")).toBe(false);
    registry.register(bookDescriptor);
    expect(registry.has("book")).toBe(true);
  });

  it("lists registered descriptors in insertion order", () => {
    registry.register(bookDescriptor);
    registry.register(profileDescriptor);
    expect(registry.list().map((d) => d.entityName)).toEqual([
      "book",
      "profile",
    ]);
  });

  it("overwrites on re-registration of the same name", () => {
    registry.register(bookDescriptor);
    const replacement = { ...bookDescriptor, icon: "📕" };
    registry.register(replacement);
    expect(registry.get("book")).toBe(replacement);
    expect(registry.list()).toHaveLength(1);
  });

  it("unregisters and clears", () => {
    registry.register(bookDescriptor);
    registry.register(profileDescriptor);
    expect(registry.unregister("book")).toBe(true);
    expect(registry.unregister("book")).toBe(false);
    expect(registry.list()).toHaveLength(1);
    registry.clear();
    expect(registry.list()).toHaveLength(0);
  });

  it("preserves the concrete type via the get<T> parameter", () => {
    registry.register(bookDescriptor);
    const retrieved = registry.get<{ title: string }>("book");
    // Type-level assertion; runtime check confirms the function is callable.
    expect(retrieved?.entityName).toBe("book");
  });

  it("exposes a shared default registry singleton", () => {
    expect(descriptorRegistry).toBeInstanceOf(DescriptorRegistry);
  });
});
