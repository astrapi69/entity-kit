import type { EntityDescriptor } from "../types";

/** A small entity type used across the test suite. */
export interface Book {
  id: string;
  title: string;
  author: string;
  year: number;
  deleted: boolean;
  deletedOn?: string;
}

export const books: Book[] = [
  { id: "1", title: "Dune", author: "Herbert", year: 1965, deleted: false },
  { id: "2", title: "Neuromancer", author: "Gibson", year: 1984, deleted: false },
  { id: "3", title: "Snow Crash", author: "Stephenson", year: 1992, deleted: false },
  {
    id: "4",
    title: "Old Draft",
    author: "Herbert",
    year: 1960,
    deleted: true,
    deletedOn: "2026-01-15T10:00:00.000Z",
  },
];

export const bookDescriptor: EntityDescriptor<Book> = {
  entityName: "book",
  getId: (b) => b.id,
  displayName: (b) => b.title,
  shortDescription: (b) => `by ${b.author} (${b.year})`,
  icon: <span data-testid="book-icon">📚</span>,
  thumbnail: (b) => <img alt={b.title} src={`/covers/${b.id}.jpg`} />,
  listFields: [
    { key: "title", label: "Title", sortable: true },
    { key: "author", label: "Author", sortable: true },
    { key: "year", label: "Year", sortable: true },
    { key: "id", label: "Internal Id", visible: false },
  ],
  detailFields: [
    { key: "title", label: "Title" },
    { key: "author", label: "Author" },
    {
      key: "year",
      label: "Year",
      render: (b) => <em data-testid="year-render">{b.year}</em>,
    },
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
