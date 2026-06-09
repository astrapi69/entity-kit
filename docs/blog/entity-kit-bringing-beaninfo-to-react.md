---
title: "Entity-Kit: Bringing Java's BeanInfo Pattern to React"
description: >-
  A headless, type-safe React component library where entities describe
  themselves—so list, grid, detail, and trash views render any type without
  bespoke components. Plus a framework-agnostic core and clean Zod integration.
author: Asterios Raptis
date: 2026-06-09
tags:
  - react
  - typescript
  - headless-ui
  - beaninfo
  - design-patterns
  - zod
  - open-source
canonical_url: https://github.com/astrapi69/entity-kit
---

# Entity-Kit: Bringing Java's BeanInfo Pattern to React

When you build more than one application—a book platform, a health PWA, a
content management system—you keep meeting the same handful of UI patterns:
lists, tile grids, detail views, trash bins, search bars. Every entity type
(books, profiles, comments, articles) needs its own take on each of them.

The naive approach is to copy a set of components for every entity type. The
scalable approach is to **separate data description from presentation**. That is
exactly what Entity-Kit does: a headless React component library that adapts
Java's BeanInfo pattern to TypeScript and React.

## The Problem: Repetitive UI Implementation

A typical application needs, for each entity type:

- a list view with sorting and filtering,
- a tile/card grid for visual browsing,
- a detail view for a single item,
- a trash view for soft-deleted items,
- a search bar that spans the relevant fields.

For three entity types that is already 15 components to build, style, test, and
maintain. Each follows the same structure but with different field names, data
shapes, and a few type-specific rules.

The cost is in the growth, not the first day. Add a fourth entity type and you
write another five components. Real apps reach a dozen entity types—at which
point a single bug in the list view's sorting logic means editing it in a dozen
places, and adding keyboard navigation means touching a dozen components.

This doesn't scale.

## The Solution: Self-Describing Entities

In Java, the BeanInfo pattern lets an object describe itself to the UI. A
`BookBeanInfo` tells the framework: "my display name is the title field, my icon
is this, my visible properties are title, author, and language." The framework
queries that metadata and renders accordingly—without knowing the concrete type.

Entity-Kit brings the same idea to React through a generic
`EntityDescriptor<T>`:

```tsx
import type {EntityDescriptor} from '@astrapi69/entity-kit'
import {BookOpenIcon, PencilIcon, TrashIcon} from '../ui/icons'
import type {Book} from '../models/book'

export const bookDescriptor: EntityDescriptor<Book> = {
    entityName: 'book',
    getId: (item) => item.id,
    displayName: (item) => item.title,
    shortDescription: (item) => `${item.author} · ${item.language}`,
    icon: <BookOpenIcon/>,
    thumbnail: (item) => <img src={item.coverImage} alt={item.title}/>,

    listFields: [
        {key: 'title', label: 'Title', sortable: true},
        {key: 'author', label: 'Author', sortable: true},
        {key: 'language', label: 'Language'},
    ],

    searchableFields: ['title', 'author', 'description'],

    isDeleted: (item) => Boolean(item.deletedAt),
    deletedAt: (item) => item.deletedAt,

    actions: [
        {id: 'edit', label: 'Edit', icon: <PencilIcon/>},
        {id: 'delete', label: 'Delete', icon: <TrashIcon/>, variant: 'danger'},
    ],
}
```

This descriptor holds all the metadata the UI needs. `icon`, `thumbnail`, and a
field's optional `render` are plain `ReactNode`s, so you stay in full control of
what gets drawn. The generic components consume only the descriptor and the raw
data—no business logic, no type-specific assumptions.

Only five members are required—`entityName`, `getId`, `displayName`,
`listFields`, and `isDeleted`. Everything else (`shortDescription`,
`detailFields`, `searchableFields`, `actions`, …) is optional and defaults
sensibly, so a minimal descriptor can be five lines long.

## Architecture: Headless, Styling-Agnostic, Framework-Agnostic Core

Entity-Kit is deliberately headless. The components—`EntityListView`,
`EntityTileView`, `EntityDetailView`, `EntityTrashView`, `EntitySearchBar`,
`EntityViewSwitcher`, `EntityEmptyState`—provide structure, accessibility, and
behavior, but no fixed look.

### Two packages, one pattern

Since v0.3.0 the pattern ships as two packages:

- **`@astrapi69/entity-kit-core`** — framework-agnostic types, the descriptor
  registry, pure utilities (search, sort, label resolution, `data-testid`
  generation), and CSS design tokens. No React, no DOM.
- **`@astrapi69/entity-kit`** — the React bindings (components + hooks). It
  re-exports the entire core, so a React app still imports everything from one
  place.

The split means the descriptor contract is no longer React-specific. A Vue,
Svelte, or Angular binding could sit on the same core and consume the same
descriptors and the same design tokens.

Styling delegates entirely to the consuming app, in one of two modes.

### Mode 1: CSS Custom Properties (Design Tokens)

Components render semantic classes (e.g. `entity-tile`). Your app supplies the
appearance through global CSS variables:

```css
/* Your app's theme */
:root {
    --entity-tile-bg: var(--surface-primary);
    --entity-tile-border: var(--border-subtle);
    --entity-tile-radius: 8px;
    --entity-tile-shadow: 0 1px 3px var(--shadow-color);
}
```

```tsx
<EntityTileView
    items={books}
    descriptor={bookDescriptor}
    onAction={(action, item) => handleAction(action, item)}
/>
```

This is the default for apps with a design-token system, and it ships with a
dark-mode theme out of the box.

### Mode 2: Framework Override via the `classNames` Prop

For Tailwind, CSS Modules, or CSS-in-JS, every component accepts a `classNames`
prop that replaces the default class on each visual slot:

```tsx
<EntityTileView
    items={books}
    descriptor={bookDescriptor}
    onAction={(action, item) => handleAction(action, item)}
    classNames={{
        grid: 'grid grid-cols-3 gap-4',
        tile: 'bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow',
        title: 'text-lg font-bold text-gray-900',
        subtitle: 'text-sm text-gray-500',
        thumbnail: 'w-full h-48 object-cover rounded-t-lg',
        actions: 'flex gap-2 mt-4',
    }}
/>
```

This prevents vendor lock-in. The library mandates neither Tailwind nor any
CSS-in-JS solution; it hands styling responsibility to the application.

## Practical Impact: ~80% Less Code Per View

The upfront cost of such a library is higher than copying components. The return
shows up the moment you add the next feature.

A new view no longer means 100–150 lines of UI, styling, and trash logic. It
means a ~15-line descriptor handed to an existing component—roughly an 80%
reduction in code per view, with bug fixes centralized in the library instead of
scattered across duplicated components.

| Task                    | Before Entity-Kit                           | After Entity-Kit                 |
|-------------------------|---------------------------------------------|----------------------------------|
| New entity view         | 2–3 hours (component, styles, tests, trash) | ~30 minutes (descriptor + theme) |
| Fix a list-sorting bug  | Edit one file per entity type               | Fix once, in entity-kit          |
| Add keyboard navigation | Add to every duplicated view                | Add once, available everywhere   |

## Testability Through Isolation

Strict separation of concerns sharpens the testing strategy. Tests sit at three
isolated levels.

**1. Library level (90+ tests in entity-kit; the core has its own suite).**
Components render against mock descriptors—no app, no backend.

```tsx
// entity-kit/src/components/EntityTileView.test.tsx
const mockDescriptor: EntityDescriptor<{ id: string; name: string }> = {
    entityName: 'mock',
    getId: (item) => item.id,
    displayName: (item) => item.name,
    listFields: [{key: 'name', label: 'Name'}],
    isDeleted: () => false,
}

test('custom classNames replace the defaults', () => {
    render(
        <EntityTileView
            items={mockItems}
            descriptor={mockDescriptor}
            classNames={{grid: 'custom-grid', tile: 'custom-tile'}}
        />,
    )
    expect(document.querySelector('.custom-grid')).toBeInTheDocument()
    expect(document.querySelector('.entity-tile-grid')).not.toBeInTheDocument()
})
```

**2. Descriptor level (pure functions—no React, no DOM).**
Descriptor functions are pure, so they test in milliseconds without mocking.

```ts
// app/src/descriptors/__tests__/bookDescriptor.test.ts
test('displayName returns the book title', () => {
    const book = {id: '1', title: 'My Book', author: 'Aster'}
    expect(bookDescriptor.displayName(book)).toBe('My Book')
})

test('isDeleted detects soft-deleted books', () => {
    expect(bookDescriptor.isDeleted({id: '1', deletedAt: '2026-01-01'})).toBe(true)
})
```

**3. Integration level.**
The app only checks that the right descriptor reaches the generic component.

When a component's implementation changes, only the library tests fail; the app
tests stay green as long as the descriptor API holds. And because every row,
tile, action button, search input, and view toggle emits a stable `data-testid`
derived from the descriptor (`book-<id>`, `book-<id>-delete`, `book-search`,
`view-tile`), Playwright/Cypress selectors survive label, i18n, and styling
changes.

## Integrating Zod for Runtime Validation

Entity-Kit and Zod solve different problems and compose cleanly: they don't
overlap, they stack.

**Core principle:** Zod validates data structure and integrity at runtime; the
descriptor defines how that validated data is presented and interacted with.

### Separation of responsibilities

**Zod (data layer)** defines the *what*: types, formats, and constraints; runtime
validation; framework-agnostic, purely logical.

**EntityDescriptor (presentation layer)** defines the *how*: visible fields,
sortability, actions, and icons; no validation logic; UI-oriented.

### Synergy points

1. **Type safety through inference.** Zod derives the TypeScript type, and that
   type becomes the descriptor's generic—so the descriptor can only touch fields
   that exist in the validated schema.
2. **A clean data pipeline.** Raw API data → `Schema.parse()` → validated object
   → descriptor. The descriptor never worries about missing or malformed data
   because Zod already guaranteed it.
3. **Form integration.** When editing, the pattern pairs with React Hook Form:
   the descriptor lists the fields to render, and Zod provides the validation
   resolver.

### Code example

```tsx
import {z} from 'zod'
import type {EntityDescriptor} from '@astrapi69/entity-kit'

// 1. Zod defines structure and validation.
const BookSchema = z.object({
    id: z.string().uuid(),
    title: z.string().min(1, 'Title is required'),
    author: z.string(),
    deletedAt: z.string().datetime().optional(),
})

// 2. The type is inferred from the schema.
type Book = z.infer<typeof BookSchema>

// 3. The descriptor presents that validated type.
export const bookDescriptor: EntityDescriptor<Book> = {
    entityName: 'book',
    getId: (item) => item.id,
    displayName: (item) => item.title,
    isDeleted: (item) => Boolean(item.deletedAt),

    listFields: [
        {key: 'title', label: 'Title', sortable: true},
        {key: 'author', label: 'Author', sortable: true},
    ],

    actions: [
        {id: 'edit', label: 'Edit'},
        {id: 'delete', label: 'Delete', variant: 'danger'},
    ],
}
```

### Architectural payoff

The descriptor stays lean and free of validation boilerplate; Zod stays free of
UI metadata. Change a validation rule and the descriptor is untouched; change a
view and the schema is untouched.

## Real-World Validation: From Concept to npm

Entity-Kit v0.1.0 shipped to npm after a proof-of-concept integration in a real
app (**Bibliogon**, a book-authoring platform). The PoC surfaced a blocker
immediately: the library declared `react@^18` as a peer dependency, but
Bibliogon runs React 19—which would have broken `npm install` in production.

The fix (`react@^18 || ^19`) plus five improvements from PoC feedback landed in
**v0.2.0**:

1. **i18n support** — labels can be strings *or* functions, enabling
   react-i18next and friends.
2. **Prefiltered trash mode** — for apps that already filter deleted items before
   handing them to the component.
3. **Auto-generated `data-testid` attributes** — key to adopting Playwright E2E.
4. **Truly optional fields** — `shortDescription`, `detailFields`, `actions`, and
   more now default sensibly.
5. **Package `exports` fix** — added `./package.json` for bundler compatibility.

Then **v0.3.0** acted on the broader lesson from the PoC: the descriptor contract
isn't really about React. All types, the registry, the pure utilities, and the
design tokens moved into the framework-agnostic **`@astrapi69/entity-kit-core`**,
with `@astrapi69/entity-kit` re-exporting them and keeping the React components.
Existing imports—including `@astrapi69/entity-kit/styles`—stay unchanged, while
the door opens to bindings for other frameworks.

This loop—build, integrate in a real project, gather feedback, refine—keeps the
library solving actual problems rather than theoretical ones.

## When to Use Entity-Kit

**Use it when:**

- you have several entity types that need the same UI patterns (list, grid,
  detail, trash);
- you maintain multiple apps that could share one component library;
- you want to cut duplication and centralize UI logic;
- you want a testing strategy that isolates component behavior from business
  logic.

**Skip it when:**

- you have a single entity type (the abstraction isn't worth it);
- your UI is highly bespoke and doesn't fit the list/grid/detail/trash model;
- you need a full admin framework (look at Refine or React Admin instead).

## Conclusion

Entity-Kit shows that concepts from established ecosystems—Java's BeanInfo among
them—adapt well to modern frontend architecture. Generic descriptors, headless
components, and a flexible `classNames` pattern produce a library that fits both
enterprise apps and lean PWAs without dictating their styling. The framework-
agnostic core pushes the idea further: the same descriptors and tokens can
outlive any single view layer.

The Zod integration shows where the pattern sits in a broader TypeScript
ecosystem—Zod owns runtime validation and inference, Entity-Kit owns
presentation and interaction—enforcing clean separation without framework
lock-in.

The packages are on npm as
[`@astrapi69/entity-kit`](https://www.npmjs.com/package/@astrapi69/entity-kit)
(currently **v0.3.1**) and
[`@astrapi69/entity-kit-core`](https://www.npmjs.com/package/@astrapi69/entity-kit-core).
Source and API docs:
[github.com/astrapi69/entity-kit](https://github.com/astrapi69/entity-kit).

The core insight: **rules drawn from experience beat rules drawn from theory.**
Entity-Kit exists because of concrete problems in real projects—not because
someone copied a "best practices" template. That's why it works.
