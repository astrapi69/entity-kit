# @astrapi69/entity-kit

> Headless, type-safe React components built on the **BeanInfo pattern** — works
> with **any** styling approach.

Any object type — a book, a profile, a comment, an article — describes itself
once via an **`EntityDescriptor`**, and generic components (list, tile grid,
detail view, trash, search) render it **without ever knowing the concrete
type**. Styling is fully delegated to your app: use the optional CSS custom
properties, **or** pass a `classNames` prop to wire up Tailwind, CSS Modules or
any CSS framework.

- 🧬 **BeanInfo for React** — one descriptor drives every view of an entity.
- 🪶 **Headless-first** — components render fine with **no stylesheet at all**.
- 🎨 **Any styling approach** — CSS variables, Tailwind, CSS Modules or CSS-in-JS
  via the `classNames` prop. Zero coupling to any of them.
- 🔒 **Type-safe** — strict TypeScript, generic over your entity type `T`. Every
  `classNames` interface is exported for full autocomplete.
- 📊 **TanStack Table** under the hood for sorting, filtering and pagination.
- 🚫 **No business logic, no fetching.** It renders what the descriptor says.

## The BeanInfo pattern

In Java's BeanInfo, a class ships metadata describing its own properties so
generic tooling can introspect and render it. `entity-kit` brings the same idea
to React: instead of writing a bespoke `<BookList>`, `<BookCard>` and
`<BookDetail>`, you write **one** `EntityDescriptor<Book>` and reuse the generic
views. Add a `Profile`? Write `EntityDescriptor<Profile>` — the views are
already done.

## Install

```bash
npm install @astrapi69/entity-kit
```

Peer dependencies (you provide these):

```bash
npm install react react-dom @tanstack/react-table
```

| Peer                    | Version |
| ----------------------- | ------- |
| `react`                 | `^18 \|\| ^19` |
| `react-dom`             | `^18 \|\| ^19` |
| `@tanstack/react-table` | `^8`           |

## Quick example

**1. Describe your entity once:**

```tsx
import type { EntityDescriptor } from "@astrapi69/entity-kit";

interface Book {
  id: string;
  title: string;
  author: string;
  year: number;
  deleted: boolean;
  deletedOn?: string;
}

const bookDescriptor: EntityDescriptor<Book> = {
  entityName: "book",
  getId: (b) => b.id,
  displayName: (b) => b.title,
  shortDescription: (b) => `by ${b.author} (${b.year})`,
  icon: <BookIcon />,
  thumbnail: (b) => <img alt={b.title} src={`/covers/${b.id}.jpg`} />,
  listFields: [
    { key: "title", label: "Title", sortable: true },
    { key: "author", label: "Author", sortable: true },
    { key: "year", label: "Year", sortable: true },
  ],
  detailFields: [
    { key: "title", label: "Title" },
    { key: "author", label: "Author" },
    { key: "year", label: "Year", render: (b) => <strong>{b.year}</strong> },
  ],
  searchableFields: ["title", "author"],
  isDeleted: (b) => b.deleted,
  deletedAt: (b) => b.deletedOn ?? null,
  actions: [
    { id: "edit", label: "Edit" },
    { id: "delete", label: "Delete", variant: "danger", isAvailable: (b) => !b.deleted },
  ],
};
```

**2. Render it with any generic view:**

```tsx
import { EntityTileView } from "@astrapi69/entity-kit";
import "@astrapi69/entity-kit/styles"; // optional default theme

function Library({ books }: { books: Book[] }) {
  return (
    <EntityTileView
      items={books}
      descriptor={bookDescriptor}
      onAction={(actionId, book) => {
        // The library reports the action; you act on it.
        if (actionId === "edit") openEditor(book);
        if (actionId === "delete") softDelete(book);
      }}
    />
  );
}
```

Swap `EntityTileView` for `EntityListView`, `EntityDetailView` or
`EntityTrashView` — same descriptor, different presentation.

### Switching views

```tsx
import { useViewMode, EntityViewSwitcher, EntityListView, EntityTileView } from "@astrapi69/entity-kit";

function Browser({ books }: { books: Book[] }) {
  const { mode, setMode } = useViewMode("tile");
  return (
    <>
      <EntityViewSwitcher mode={mode} onChange={setMode} />
      {mode === "list" && <EntityListView items={books} descriptor={bookDescriptor} />}
      {mode === "tile" && <EntityTileView items={books} descriptor={bookDescriptor} />}
    </>
  );
}
```

## Styling guide

This is the heart of the library: **it works with any styling approach without
coupling to any of them.** Every component renders semantic class names by
default (`entity-tile`, `entity-tile__title`, …) and **also** accepts an
optional `classNames` prop. Each `classNames` slot, when provided, **replaces**
the default class for that slot:

```tsx
<element className={classNames?.title ?? "entity-tile__title"} />
```

Pick whichever of the four approaches below matches your app.

---

### 1. CSS Variables (default, zero-config)

The simplest path. Import the stylesheet, **do not** pass `classNames`, and
override design tokens in your own global CSS.

**Import:**

```tsx
import "@astrapi69/entity-kit/styles";          // all components + dark mode
// …or cherry-pick:
import "@astrapi69/entity-kit/styles/entity-tile.css";
import "@astrapi69/entity-kit/styles/entity-list.css";
```

**`classNames` prop:** none — the components use their semantic defaults.

**Override tokens** (`--entity-{component}-{property}`) anywhere in your CSS:

```css
:root {
  /* Global */
  --entity-font-family: "Inter", sans-serif;
  --entity-radius: 0.75rem;

  /* Tile */
  --entity-tile-bg: #fffdf7;
  --entity-tile-min-width: 260px;
  --entity-tile-title-color: #2a1a00;

  /* Actions */
  --entity-actions-danger-bg: #e11d48;
}
```

```tsx
function Library({ books }: { books: Book[] }) {
  return <EntityTileView items={books} descriptor={bookDescriptor} onAction={onAction} />;
}
```

**Dark mode** ships with the default theme. Activate it by setting
`data-theme="dark"` on any ancestor (or `<html>`):

```html
<html data-theme="dark">
```

```css
/* The bundled defaults.css already remaps every token under: */
[data-theme="dark"] {
  --entity-tile-bg: #1c1c1e;
  --entity-tile-title-color: #f0f0f0;
  /* …and so on. Override these to customise your dark palette. */
}
```

<details>
<summary><strong>All available CSS variables, grouped by component</strong></summary>

```css
/* Global tokens (shared) */
--entity-font-family
--entity-radius
--entity-disabled-opacity

/* List (--entity-list-*) */
--entity-list-color            --entity-list-bg               --entity-list-font-size
--entity-list-head-bg          --entity-list-header-align     --entity-list-header-weight
--entity-list-header-color     --entity-list-border           --entity-list-row-border
--entity-list-row-hover-bg     --entity-list-cell-padding     --entity-list-cell-valign
--entity-list-actions-width    --entity-list-actions-align    --entity-list-sort-gap
--entity-list-sort-indicator-color
--entity-list-pagination-justify --entity-list-pagination-gap --entity-list-pagination-padding
--entity-list-page-button-padding --entity-list-page-button-bg --entity-list-page-button-color
--entity-list-page-button-border  --entity-list-page-status-color --entity-list-page-status-size

/* Tile (--entity-tile-*) */
--entity-tile-min-width        --entity-tile-gap              --entity-tile-card-gap
--entity-tile-bg               --entity-tile-color            --entity-tile-border
--entity-tile-radius           --entity-tile-padding          --entity-tile-shadow
--entity-tile-body-gap         --entity-tile-thumb-ratio      --entity-tile-thumb-bg
--entity-tile-thumb-radius     --entity-tile-thumb-fit        --entity-tile-icon-size
--entity-tile-title-size       --entity-tile-title-weight     --entity-tile-title-color
--entity-tile-subtitle-size    --entity-tile-subtitle-color

/* Detail (--entity-detail-*) */
--entity-detail-bg             --entity-detail-color          --entity-detail-border
--entity-detail-radius         --entity-detail-padding        --entity-detail-header-gap
--entity-detail-header-padding --entity-detail-header-border  --entity-detail-header-margin
--entity-detail-icon-size      --entity-detail-title-size     --entity-detail-title-weight
--entity-detail-subtitle-size  --entity-detail-subtitle-color --entity-detail-fields-columns
--entity-detail-fields-gap     --entity-detail-label-weight   --entity-detail-label-color
--entity-detail-value-color    --entity-detail-footer-margin  --entity-detail-footer-padding
--entity-detail-footer-border

/* Actions (--entity-actions-*) */
--entity-actions-gap           --entity-actions-icon-gap      --entity-actions-padding
--entity-actions-font-size     --entity-actions-color         --entity-actions-bg
--entity-actions-border        --entity-actions-hover-bg      --entity-actions-danger-color
--entity-actions-danger-bg     --entity-actions-danger-border --entity-actions-danger-hover-bg

/* Trash (--entity-trash-*) */
--entity-trash-bg              --entity-trash-head-bg         --entity-trash-color
--entity-trash-cell-color

/* Search (--entity-search-*) */
--entity-search-gap            --entity-search-padding        --entity-search-color
--entity-search-bg             --entity-search-border         --entity-search-placeholder-color
--entity-search-icon-color     --entity-search-clear-size     --entity-search-clear-color
--entity-search-clear-bg       --entity-search-clear-hover-bg

/* View switcher (--entity-switcher-*) */
--entity-switcher-gap          --entity-switcher-padding      --entity-switcher-bg
--entity-switcher-button-padding --entity-switcher-font-size  --entity-switcher-color
--entity-switcher-button-bg    --entity-switcher-active-color --entity-switcher-active-bg
--entity-switcher-active-shadow --entity-switcher-icon-gap

/* Empty state (--entity-empty-*) */
--entity-empty-gap             --entity-empty-padding         --entity-empty-color
--entity-empty-icon-size       --entity-empty-icon-opacity    --entity-empty-title-size
--entity-empty-title-weight    --entity-empty-title-color     --entity-empty-description-size
```

</details>

**Caveats:** because tokens cascade, set them on `:root` (or a scoping
container) — not on the component element, which the library controls.

---

### 2. Tailwind CSS

**Do _not_ import `defaults.css`.** Pass Tailwind utilities through the
`classNames` prop. The default semantic classes are dropped for every slot you
override, so there is nothing to fight with.

**`classNames` prop:** an object of Tailwind utility strings, one per slot.

**`EntityTileView` — responsive grid, hover states, dark mode via `dark:`:**

```tsx
import { EntityTileView } from "@astrapi69/entity-kit";
// No defaults.css import.

<EntityTileView
  items={books}
  descriptor={bookDescriptor}
  onAction={onAction}
  classNames={{
    grid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
    tile: "flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800",
    body: "flex flex-col gap-2",
    thumbnail: "aspect-video overflow-hidden rounded bg-gray-100 dark:bg-gray-700",
    title: "text-base font-semibold text-gray-900 dark:text-gray-50",
    subtitle: "text-sm text-gray-500 dark:text-gray-400",
    actions: "mt-auto flex flex-wrap gap-2",
    actionButton: "rounded px-2.5 py-1 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600",
    dangerActionButton: "rounded px-2.5 py-1 text-sm bg-rose-600 text-white hover:bg-rose-700",
  }}
/>
```

**`EntityListView` — table styling:**

```tsx
<EntityListView
  items={books}
  descriptor={bookDescriptor}
  onAction={onAction}
  classNames={{
    root: "w-full",
    table: "w-full border-collapse text-sm",
    head: "bg-gray-50 dark:bg-gray-800",
    header: "px-3 py-2 text-left font-semibold text-gray-600 dark:text-gray-300",
    sortButton: "inline-flex items-center gap-1 hover:text-gray-900 dark:hover:text-white",
    row: "border-b border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50",
    cell: "px-3 py-2 align-middle",
    actionsCell: "px-3 py-2 text-right whitespace-nowrap",
    actionButton: "rounded px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-700",
    pagination: "flex items-center justify-end gap-3 px-3 py-2",
    pageButton: "rounded border border-gray-300 px-2.5 py-1 disabled:opacity-50 dark:border-gray-600",
    pageStatus: "text-sm text-gray-500",
  }}
/>
```

**`EntityTrashView` — danger-coloured restore / delete:** trash forwards its
`list` slots to the inner list view. Restore is a default-variant button;
permanent delete is a `danger` variant, so it picks up `dangerActionButton`.

```tsx
<EntityTrashView
  items={books}
  descriptor={bookDescriptor}
  onAction={onAction}
  classNames={{
    container: "rounded-lg border border-gray-200 dark:border-gray-700",
    list: {
      table: "w-full border-collapse text-sm",
      cell: "px-3 py-2 text-gray-500 dark:text-gray-400",
      actionsCell: "px-3 py-2 text-right",
      // Restore (default variant):
      actionButton: "rounded px-2 py-1 text-xs bg-emerald-600 text-white hover:bg-emerald-700",
      // Permanent delete (danger variant):
      dangerActionButton: "rounded px-2 py-1 text-xs bg-rose-600 text-white hover:bg-rose-700",
    },
  }}
/>
```

**Caveats:**

- Don't import `defaults.css` — you don't need it and the cascade could clash.
- For dark mode, use Tailwind's `dark:` variant in your slot strings (above) —
  the `[data-theme="dark"]` tokens only apply to the bundled stylesheet.
- Tailwind only generates classes it can see; keep these strings in files
  covered by your `content` globs (not behind runtime string concatenation).

---

### 3. CSS Modules

**Do _not_ import `defaults.css`.** Create a `.module.css` file, import it, and
pass the scoped class names through `classNames`.

**`classNames` prop:** values come from your imported `styles` object.

**`Library.module.css`:**

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1rem;
}
.tile {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  background: #fff;
}
.title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}
.subtitle {
  margin: 0;
  font-size: 0.875rem;
  color: #6b7280;
}

/* Dark mode: target the global theme attribute from inside a module with :global */
:global([data-theme="dark"]) .tile {
  background: #1f2937;
  border-color: #374151;
}
```

**`Library.tsx`:**

```tsx
import { EntityTileView } from "@astrapi69/entity-kit";
import styles from "./Library.module.css";

function Library({ books }: { books: Book[] }) {
  return (
    <EntityTileView
      items={books}
      descriptor={bookDescriptor}
      onAction={onAction}
      classNames={{
        grid: styles.grid,
        tile: styles.tile,
        title: styles.title,
        subtitle: styles.subtitle,
      }}
    />
  );
}
```

**Caveats:** module class names are hashed at build time — always reference them
through the imported object (`styles.grid`), never as string literals. Use
`:global([data-theme="dark"])` to react to a global dark-mode attribute from
within a scoped module.

---

### 4. Styled-components / Emotion (CSS-in-JS)

> ⚠️ **Least recommended.** CSS-in-JS adds runtime style generation on every
> render. Prefer one of the zero-runtime approaches above unless you already
> have a CSS-in-JS codebase. Because the components take **class name strings**,
> the cleanest integration is to read the generated class off a styled element.

**Do _not_ import `defaults.css`.** Create styled wrappers and pass their
generated class names (styled-components/Emotion expose them via the
`.toString()` / `css` APIs):

```tsx
import styled from "styled-components";
import { EntityTileView } from "@astrapi69/entity-kit";

const Grid = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1rem;
`;
const Tile = styled.li`
  border: 1px solid ${(p) => p.theme.border};
  border-radius: 0.5rem;
  padding: 1rem;
  background: ${(p) => p.theme.surface};
`;

function Library({ books }: { books: Book[] }) {
  return (
    <EntityTileView
      items={books}
      descriptor={bookDescriptor}
      onAction={onAction}
      // styled() components stringify to their generated class name:
      classNames={{ grid: `${Grid}`, tile: `${Tile}` }}
    />
  );
}
```

With **Emotion** you can use the `css` helper and pass the resulting class:

```tsx
import { css } from "@emotion/css";

const grid = css`display: grid; gap: 1rem;`;
<EntityTileView /* … */ classNames={{ grid }} />;
```

**Dark mode** flows through your `ThemeProvider` — read `props.theme` inside the
styled definitions as usual.

**Caveats:** the styled component itself is not rendered (only its class name is
used), so component-level props/variants on the wrapper won't apply — keep the
styling purely declarative. Expect runtime overhead versus the other options.

---

### Comparison

| Approach      | Import `defaults.css`? | `classNames` prop? | Dark mode               | Runtime cost | Recommended for                |
| ------------- | ---------------------- | ------------------ | ----------------------- | ------------ | ------------------------------ |
| CSS Variables | **Yes**                | No                 | `[data-theme]`          | Zero         | Apps without a CSS framework   |
| Tailwind      | No                     | **Yes**            | `dark:` prefix          | Zero         | Tailwind projects              |
| CSS Modules   | No                     | **Yes**            | `:global([data-theme])` | Zero         | Scoped styling                 |
| CSS-in-JS     | No                     | **Yes**            | `ThemeProvider`         | Runtime      | Existing CSS-in-JS codebases   |

## Testing guide

The descriptor pattern makes testing unusually clean: the object-to-UI mapping
is just pure functions, and the components are generic, so each layer is tested
in isolation. There are three levels — pick the one that matches what you own.

---

### 1. Library-level (inside entity-kit itself)

For contributors. The generic components are tested against a **mock
descriptor** with minimal fields — no real entity type required. (entity-kit
ships 85 such tests; this documents the pattern.)

A minimal mock descriptor is enough to exercise any component:

```tsx
import type { EntityDescriptor } from "@astrapi69/entity-kit";

interface Widget {
  id: string;
  name: string;
  archived: boolean;
}

const widgets: Widget[] = [
  { id: "1", name: "Alpha", archived: false },
  { id: "2", name: "Beta", archived: false },
];

const widgetDescriptor: EntityDescriptor<Widget> = {
  entityName: "widget",
  getId: (w) => w.id,
  displayName: (w) => w.name,
  shortDescription: () => "",
  icon: "🔧",
  listFields: [{ key: "name", label: "Name" }],
  detailFields: [{ key: "name", label: "Name" }],
  searchableFields: ["name"],
  isDeleted: (w) => w.archived,
  actions: [{ id: "edit", label: "Edit" }],
};
```

```tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EntityTileView } from "@astrapi69/entity-kit";

describe("EntityTileView", () => {
  it("applies the semantic default classes", () => {
    const { container } = render(
      <EntityTileView items={widgets} descriptor={widgetDescriptor} />,
    );
    expect(container.querySelector(".entity-tile-grid")).toBeInTheDocument();
    expect(container.querySelector(".entity-tile__title")).toBeInTheDocument();
  });

  it("lets custom classNames override the defaults", () => {
    const { container } = render(
      <EntityTileView
        items={widgets}
        descriptor={widgetDescriptor}
        classNames={{ grid: "my-grid", title: "my-title" }}
      />,
    );
    expect(container.querySelector(".my-grid")).toBeInTheDocument();
    // The default it replaced must be gone:
    expect(container.querySelector(".entity-tile-grid")).not.toBeInTheDocument();
  });

  it("fires onAction with the action id and item", () => {
    const onAction = vi.fn();
    render(
      <EntityTileView
        items={widgets}
        descriptor={widgetDescriptor}
        onAction={onAction}
      />,
    );
    fireEvent.click(screen.getAllByText("Edit")[0]);
    expect(onAction).toHaveBeenCalledWith("edit", widgets[0]);
  });

  it("renders the empty state for an empty items array", () => {
    render(<EntityTileView items={[]} descriptor={widgetDescriptor} />);
    expect(screen.getByText("No items")).toBeInTheDocument();
  });
});
```

**Gotcha:** when asserting that a `classNames` slot dropped its default, query
the exact default class (e.g. `.entity-tile-grid`) — overriding one slot does
not change the others, so the un-overridden defaults are still present.

---

### 2. Descriptor-level (inside the consuming app)

The highest-value tests you'll write. An `EntityDescriptor` is **pure
functions** — no React, no DOM, no rendering. Test the object-to-UI mapping
directly; these run instantly.

```ts
// descriptors/bookDescriptor.ts
import type { EntityDescriptor } from "@astrapi69/entity-kit";

export interface Book {
  id: string;
  title: string;
  author: string;
  year: number;
  deleted: boolean;
  deletedOn?: string;
}

export const bookDescriptor: EntityDescriptor<Book> = {
  entityName: "book",
  getId: (b) => b.id,
  displayName: (b) => b.title,
  shortDescription: (b) => `by ${b.author} (${b.year})`,
  icon: "📚",
  listFields: [
    { key: "title", label: "Title", sortable: true },
    { key: "author", label: "Author", sortable: true },
    { key: "year", label: "Year", sortable: true },
  ],
  detailFields: [
    { key: "title", label: "Title" },
    { key: "author", label: "Author" },
    { key: "year", label: "Year" },
  ],
  searchableFields: ["title", "author"],
  isDeleted: (b) => b.deleted,
  deletedAt: (b) => b.deletedOn ?? null,
  actions: [
    { id: "edit", label: "Edit" },
    { id: "delete", label: "Delete", variant: "danger", isAvailable: (b) => !b.deleted },
    { id: "restore", label: "Restore", isAvailable: (b) => b.deleted },
  ],
};
```

```ts
// descriptors/bookDescriptor.test.ts  — no React, no DOM
import { describe, expect, it } from "vitest";
import { bookDescriptor, type Book } from "./bookDescriptor";

const active: Book = {
  id: "1", title: "Dune", author: "Herbert", year: 1965, deleted: false,
};
const trashed: Book = {
  id: "2", title: "Old Draft", author: "Herbert", year: 1960,
  deleted: true, deletedOn: "2026-01-15T10:00:00.000Z",
};

describe("bookDescriptor", () => {
  it("maps an item to its display strings", () => {
    expect(bookDescriptor.getId(active)).toBe("1");
    expect(bookDescriptor.displayName(active)).toBe("Dune");
    expect(bookDescriptor.shortDescription(active)).toBe("by Herbert (1965)");
  });

  it("detects soft-deleted items", () => {
    expect(bookDescriptor.isDeleted(active)).toBe(false);
    expect(bookDescriptor.isDeleted(trashed)).toBe(true);
    expect(bookDescriptor.deletedAt?.(trashed)).toBe("2026-01-15T10:00:00.000Z");
    expect(bookDescriptor.deletedAt?.(active)).toBeNull();
  });

  it("filters actions by availability", () => {
    const availableIds = (item: Book) =>
      bookDescriptor.actions
        .filter((a) => a.isAvailable?.(item) ?? true)
        .map((a) => a.id);

    expect(availableIds(active)).toEqual(["edit", "delete"]);
    expect(availableIds(trashed)).toEqual(["edit", "restore"]);
  });

  it("declares complete list and detail fields", () => {
    expect(bookDescriptor.listFields.map((f) => f.key)).toEqual([
      "title", "author", "year",
    ]);
    expect(bookDescriptor.detailFields.map((f) => f.key)).toContain("year");
    expect(bookDescriptor.searchableFields).toEqual(["title", "author"]);
  });
});
```

**Why this matters:** a bug in `displayName`, `getId`, `isDeleted` or an
action's `isAvailable` is a bug in *every* view at once. Catching it here — with
zero rendering — is the cheapest test you can write, so write one for every new
descriptor.

---

### 3. Integration-level (inside the consuming app)

Tests a page/view that composes entity-kit with a descriptor and your app
logic. Render with mock data, assert items appear, and verify that `onAction`
triggers the right behaviour (navigation, API calls). **Mock the API client** so
the view is tested in isolation from the network.

```tsx
// Dashboard.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EntityTileView } from "@astrapi69/entity-kit";
import { bookApi } from "./api/bookApi";
import { bookDescriptor, type Book } from "./descriptors/bookDescriptor";

export function Dashboard() {
  const [books, setBooks] = useState<Book[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    bookApi.list().then(setBooks);
  }, []);

  return (
    <EntityTileView
      items={books}
      descriptor={bookDescriptor}
      onAction={(action, book) => {
        if (action === "edit") navigate(`/books/${book.id}/edit`);
        if (action === "delete") {
          bookApi.remove(book.id).then(() =>
            setBooks((prev) => prev.filter((b) => b.id !== book.id)),
          );
        }
      }}
    />
  );
}
```

```tsx
// Dashboard.test.tsx
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Dashboard } from "./Dashboard";
import { bookApi } from "./api/bookApi";

// Mock the API client — the view is isolated from the network.
vi.mock("./api/bookApi", () => ({
  bookApi: { list: vi.fn(), remove: vi.fn() },
}));

// Mock router navigation so we can assert on it.
const navigate = vi.fn();
vi.mock("react-router-dom", () => ({ useNavigate: () => navigate }));

const books = [
  { id: "1", title: "Dune", author: "Herbert", year: 1965, deleted: false },
  { id: "2", title: "Neuromancer", author: "Gibson", year: 1984, deleted: false },
];

beforeEach(() => {
  vi.mocked(bookApi.list).mockResolvedValue(books);
  vi.mocked(bookApi.remove).mockResolvedValue(undefined);
  navigate.mockClear();
});

describe("Dashboard", () => {
  it("renders the fetched books as tiles", async () => {
    render(<Dashboard />);
    expect(await screen.findByText("Dune")).toBeInTheDocument();
    expect(screen.getByText("Neuromancer")).toBeInTheDocument();
  });

  it("navigates to the editor when Edit is activated", async () => {
    render(<Dashboard />);
    await screen.findByText("Dune");
    fireEvent.click(screen.getAllByText("Edit")[0]);
    expect(navigate).toHaveBeenCalledWith("/books/1/edit");
  });

  it("calls the API and drops the tile when Delete is activated", async () => {
    render(<Dashboard />);
    await screen.findByText("Dune");
    fireEvent.click(screen.getAllByText("Delete")[0]);
    expect(bookApi.remove).toHaveBeenCalledWith("1");
    await waitFor(() =>
      expect(screen.queryByText("Dune")).not.toBeInTheDocument(),
    );
  });
});
```

**Caveat:** keep integration tests focused on *composition and wiring* — that
data flows in and actions flow out. The generic rendering (columns, sorting,
empty states) is already covered library-side, and the mapping is covered
descriptor-side; don't re-test those here.

---

### Choosing a level

| Level       | What it tests        | Dependencies            | Speed   | When to write                    |
| ----------- | -------------------- | ----------------------- | ------- | -------------------------------- |
| Library     | Generic components   | None (mock data)        | Fast    | When contributing to entity-kit  |
| Descriptor  | Object-to-UI mapping | None (pure functions)   | Instant | For every new EntityDescriptor   |
| Integration | Page composition     | entity-kit + descriptor | Medium  | For every page using entity-kit  |
| E2E         | Full user flow       | Everything (real browser) | Slow  | For critical user journeys       |

### Testing with different CSS frameworks

The `classNames` tests are **framework-agnostic**. They assert that a custom
class string *replaces* the semantic default for a slot — and that assertion
holds no matter where the string comes from:

```tsx
// The same test shape works for any approach:
classNames={{ grid: "grid grid-cols-3 gap-4" }}   // Tailwind utilities
classNames={{ grid: styles.grid }}                // CSS Modules (a hashed name)
classNames={{ grid: "my-grid" }}                  // plain semantic class
```

Because every slot is just a `string`, a test that checks
`container.querySelector(".my-grid")` is present and `.entity-tile-grid` is
absent verifies the override mechanism itself — independent of Tailwind, CSS
Modules, or any other string-based class system. You never need to run a real
CSS pipeline to test that your classes are wired through correctly.

## API reference

### Types

| Export                | Description                                                                |
| --------------------- | ------------------------------------------------------------------------- |
| `EntityDescriptor<T>` | The self-description of an entity type. Drives all views.                 |
| `FieldDescriptor<T>`  | A single field: `key`, `label`, optional `render`, `sortable`, `visible`. |
| `ActionDescriptor<T>` | A single action: `id`, `label`, `icon?`, `variant?`, `isAvailable?`.      |
| `ActionVariant`       | `"default" \| "danger"`.                                                  |

**`EntityDescriptor<T>`** members: `entityName`, `getId(item)`,
`displayName(item)`, `shortDescription(item)`, `icon`, `thumbnail?(item)`,
`listFields`, `detailFields`, `searchableFields`, `isDeleted(item)`,
`deletedAt?(item)`, `actions`.

### ClassNames interfaces

Every component accepts an optional `classNames` prop typed by one of these
(all exported for autocomplete). Each field is an optional class string for one
visual slot; an omitted slot falls back to its semantic default class.

| Interface                 | Component            | Key slots                                                                 |
| ------------------------- | ------------------- | ------------------------------------------------------------------------- |
| `TileClassNames`          | `EntityTileView`    | `grid`, `tile`, `body`, `thumbnail`, `title`, `subtitle`, `actions`, `actionButton`, `dangerActionButton` |
| `ListClassNames`          | `EntityListView`    | `root`, `table`, `head`, `header`, `sortButton`, `row`, `cell`, `actionsCell`, `actionButton`, `dangerActionButton`, `pagination`, `pageButton`, `pageStatus` |
| `DetailClassNames`        | `EntityDetailView`  | `container`, `header`, `title`, `subtitle`, `fields`, `field`, `label`, `value`, `footer`, `actions`, `actionButton`, `dangerActionButton` |
| `TrashClassNames`         | `EntityTrashView`   | `container`, `list` (a `ListClassNames` forwarded to the inner list)      |
| `SearchClassNames`        | `EntitySearchBar`   | `container`, `input`, `icon`, `clearButton`                               |
| `ViewSwitcherClassNames`  | `EntityViewSwitcher`| `group`, `button`, `activeButton`, `icon`, `label`                        |
| `EmptyStateClassNames`    | `EntityEmptyState`  | `container`, `icon`, `title`, `description`, `action`                     |
| `ActionsClassNames`       | `EntityActions`     | `actions`, `actionButton`, `dangerActionButton`, `actionIcon`, `actionLabel` |

### Components

| Component            | Renders                                                                   | `classNames`             |
| -------------------- | ------------------------------------------------------------------------- | ------------------------ |
| `EntityListView`     | Sortable, filterable, paginated table from `listFields` (TanStack Table). | `ListClassNames`         |
| `EntityTileView`     | Responsive grid of cards with thumbnail, name, description, actions.      | `TileClassNames`         |
| `EntityDetailView`   | Label/value pairs from `detailFields`, honouring custom renderers.        | `DetailClassNames`       |
| `EntityTrashView`    | `EntityListView` filtered to `isDeleted` items, with restore/delete.      | `TrashClassNames`        |
| `EntitySearchBar`    | Search input filtering over `searchableFields` via `useEntitySearch`.     | `SearchClassNames`       |
| `EntityViewSwitcher` | Toggle buttons for list / tile / detail modes.                            | `ViewSwitcherClassNames` |
| `EntityEmptyState`   | Placeholder for empty collections.                                        | `EmptyStateClassNames`   |
| `EntityActions`      | The per-item action menu (used internally; exported for custom layouts).  | `ActionsClassNames`      |

All view components take `items: T[]` and `descriptor: EntityDescriptor<T>`,
report user intent through an `onAction(actionId, item)` callback, and accept a
`classNames` prop. They never mutate or fetch data.

`EntityTrashView` emits the action ids `RESTORE_ACTION_ID` (`"restore"`) and
`PERMANENT_DELETE_ACTION_ID` (`"permanentDelete"`), both exported as constants.

`EntitySearchBar` works controlled (pass `query`) or uncontrolled, and reports
the filtered list through `onResults(results)` and text through
`onQueryChange(query)`.

### Hooks

| Hook                                        | Returns                                                                                   |
| ------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `useEntityList(items, descriptor, opts?)`   | `{ table, columns, rows, query, setQuery, sorting, setSorting }` — wraps TanStack Table.   |
| `useEntitySearch(items, descriptor, query)` | Items filtered by `query` over `searchableFields`.                                        |
| `useViewMode(defaultMode?)`                 | `{ mode, setMode, cycle }` — toggles `"list" \| "tile" \| "detail"`.                      |

### Registry

| Export               | Description                                                                                  |
| -------------------- | -------------------------------------------------------------------------------------------- |
| `DescriptorRegistry` | Map-based registry: `register()`, `get<T>()`, `has()`, `list()`, `unregister()`, `clear()`.  |
| `descriptorRegistry` | A shared default `DescriptorRegistry` instance.                                              |

```tsx
import { descriptorRegistry } from "@astrapi69/entity-kit";

descriptorRegistry.register(bookDescriptor);
descriptorRegistry.register(profileDescriptor);

const desc = descriptorRegistry.get<Book>("book");
```

## Design rules

This library deliberately does **not**:

- export anything as a default — **named exports only**;
- fetch data or call APIs — it receives data, it does not fetch it;
- contain business logic — it renders what the descriptor says, nothing more;
- ship hardcoded colors, fonts or spacing — everything is a CSS variable or a
  `classNames` slot;
- require styles to function — components are headless-first, and **every**
  component accepts a `classNames` prop.

## License

[MIT](./LICENSE) © Asterios Raptis
