import { describe, expect, it } from "vitest";
import type {
  ActionDescriptor,
  EntityDescriptor,
  FieldDescriptor,
  TileClassNames,
  ListClassNames,
  DetailClassNames,
  TrashClassNames,
  SearchClassNames,
  ViewSwitcherClassNames,
  EmptyStateClassNames,
} from "./index";

interface Book {
  id: string;
  title: string;
  author: string;
  deleted: boolean;
  deletedOn?: string;
}

const sample: Book = {
  id: "1",
  title: "Dune",
  author: "Herbert",
  deleted: false,
};

describe("FieldDescriptor", () => {
  it("requires a key from T and a label, and accepts an optional renderer", () => {
    const field: FieldDescriptor<Book> = {
      key: "title",
      label: "fields.title",
      sortable: true,
      visible: true,
      render: (item) => item.title.toUpperCase(),
    };

    expect(field.key).toBe("title");
    expect(field.label).toBe("fields.title");
    expect(field.render?.(sample)).toBe("DUNE");
  });

  it("works with only the required members", () => {
    const field: FieldDescriptor<Book> = { key: "author", label: "Author" };
    expect(field.sortable).toBeUndefined();
    expect(field.visible).toBeUndefined();
    expect(field.render).toBeUndefined();
  });
});

describe("ActionDescriptor", () => {
  it("carries id, label, variant and an availability predicate", () => {
    const action: ActionDescriptor<Book> = {
      id: "delete",
      label: "actions.delete",
      variant: "danger",
      isAvailable: (item) => !item.deleted,
    };

    expect(action.variant).toBe("danger");
    expect(action.isAvailable?.(sample)).toBe(true);
  });

  it("defaults variant and availability to undefined when omitted", () => {
    const action: ActionDescriptor<Book> = { id: "edit", label: "Edit" };
    expect(action.variant).toBeUndefined();
    expect(action.isAvailable).toBeUndefined();
  });
});

describe("EntityDescriptor", () => {
  const descriptor: EntityDescriptor<Book> = {
    entityName: "book",
    getId: (item) => item.id,
    displayName: (item) => item.title,
    shortDescription: (item) => `by ${item.author}`,
    icon: "📚",
    thumbnail: (item) => `/covers/${item.id}.jpg`,
    listFields: [
      { key: "title", label: "Title", sortable: true },
      { key: "author", label: "Author" },
    ],
    detailFields: [
      { key: "title", label: "Title" },
      { key: "author", label: "Author" },
    ],
    searchableFields: ["title", "author"],
    isDeleted: (item) => item.deleted,
    deletedAt: (item) => item.deletedOn ?? null,
    actions: [{ id: "edit", label: "Edit" }],
  };

  it("exposes a getId that returns a string identifier", () => {
    const id: string = descriptor.getId(sample);
    expect(id).toBe("1");
  });

  it("describes an entity through pure functions over T", () => {
    expect(descriptor.entityName).toBe("book");
    expect(descriptor.displayName(sample)).toBe("Dune");
    expect(descriptor.shortDescription(sample)).toBe("by Herbert");
    expect(descriptor.thumbnail?.(sample)).toBe("/covers/1.jpg");
    expect(descriptor.isDeleted(sample)).toBe(false);
    expect(descriptor.deletedAt?.(sample)).toBeNull();
  });

  it("exposes searchable fields that are keys of T", () => {
    expect(descriptor.searchableFields).toContain("title");
    expect(descriptor.searchableFields.every((k) => k in sample || k === "deletedOn")).toBe(true);
  });

  it("is generic over any object shape", () => {
    interface Profile {
      handle: string;
      bio: string;
      removed: boolean;
    }
    const profileDescriptor: EntityDescriptor<Profile> = {
      entityName: "profile",
      getId: (p) => p.handle,
      displayName: (p) => p.handle,
      shortDescription: (p) => p.bio,
      icon: "👤",
      listFields: [{ key: "handle", label: "Handle" }],
      detailFields: [{ key: "bio", label: "Bio" }],
      searchableFields: ["handle"],
      isDeleted: (p) => p.removed,
      actions: [],
    };
    expect(profileDescriptor.entityName).toBe("profile");
  });
});

describe("ClassNames interfaces", () => {
  it("type every documented per-component slot as an optional string", () => {
    // Compile-time contract: each interface accepts its slots as strings. The
    // runtime assertions just confirm the objects are usable.
    const tile: TileClassNames = { grid: "g", tile: "t", title: "ti" };
    const list: ListClassNames = { root: "r", table: "tb", row: "ro" };
    const detail: DetailClassNames = { container: "c", label: "l", value: "v" };
    const trash: TrashClassNames = { container: "c", list: { root: "r" } };
    const search: SearchClassNames = { container: "c", input: "i" };
    const switcher: ViewSwitcherClassNames = { group: "g", activeButton: "a" };
    const empty: EmptyStateClassNames = { container: "c", title: "t" };

    expect(tile.grid).toBe("g");
    expect(list.root).toBe("r");
    expect(detail.label).toBe("l");
    expect(trash.list?.root).toBe("r");
    expect(search.input).toBe("i");
    expect(switcher.activeButton).toBe("a");
    expect(empty.title).toBe("t");
  });
});
