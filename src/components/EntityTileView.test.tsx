import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EntityTileView } from "./EntityTileView";
import { bookDescriptor, books, type Book } from "../test/fixtures";
import type { EntityDescriptor } from "../types";

describe("EntityTileView", () => {
  it("renders a card per item with title and description", () => {
    render(<EntityTileView items={books} descriptor={bookDescriptor} />);
    expect(screen.getByText("Dune")).toBeInTheDocument();
    expect(screen.getByText("by Herbert (1965)")).toBeInTheDocument();
  });

  it("renders the descriptor thumbnail", () => {
    render(<EntityTileView items={books} descriptor={bookDescriptor} />);
    expect(screen.getByAltText("Dune")).toBeInTheDocument();
  });

  it("renders the empty state when there are no items", () => {
    render(<EntityTileView items={[]} descriptor={bookDescriptor} />);
    expect(screen.getByText("No items")).toBeInTheDocument();
  });

  it("calls onSelect when a tile body is clicked", () => {
    const onSelect = vi.fn();
    render(
      <EntityTileView
        items={books}
        descriptor={bookDescriptor}
        onSelect={onSelect}
      />,
    );
    fireEvent.click(screen.getByText("Dune"));
    expect(onSelect).toHaveBeenCalledWith(books[0]);
  });

  it("renders an action menu per card", () => {
    const onAction = vi.fn();
    render(
      <EntityTileView
        items={books}
        descriptor={bookDescriptor}
        onAction={onAction}
      />,
    );
    fireEvent.click(screen.getAllByText("Edit")[1]);
    expect(onAction).toHaveBeenCalledWith("edit", books[1]);
  });

  it("applies semantic default classes when no classNames prop is given", () => {
    const { container } = render(
      <EntityTileView items={books} descriptor={bookDescriptor} />,
    );
    expect(container.querySelector(".entity-tile-grid")).toBeInTheDocument();
    expect(container.querySelector(".entity-tile")).toBeInTheDocument();
    expect(container.querySelector(".entity-tile__title")).toBeInTheDocument();
  });

  it("applies custom classNames and drops the defaults for overridden slots", () => {
    const { container } = render(
      <EntityTileView
        items={books}
        descriptor={bookDescriptor}
        classNames={{
          grid: "my-grid",
          tile: "my-tile",
          title: "my-title",
        }}
      />,
    );
    expect(container.querySelector(".my-grid")).toBeInTheDocument();
    expect(container.querySelector(".my-tile")).toBeInTheDocument();
    expect(container.querySelector(".my-title")).toBeInTheDocument();
    // Overridden defaults must NOT be present.
    expect(container.querySelector(".entity-tile-grid")).not.toBeInTheDocument();
    expect(container.querySelector(".entity-tile__title")).not.toBeInTheDocument();
  });

  it("sets a data-testid on each tile from entityName and getId", () => {
    render(<EntityTileView items={books} descriptor={bookDescriptor} />);
    expect(screen.getByTestId("book-1")).toBeInTheDocument();
    expect(screen.getByTestId("book-3")).toBeInTheDocument();
  });

  it("works with a minimal descriptor (optional fields omitted)", () => {
    const minimal: EntityDescriptor<Book> = {
      entityName: "book",
      getId: (b) => b.id,
      displayName: (b) => b.title,
      listFields: [{ key: "title", label: "Title" }],
      isDeleted: (b) => b.deleted,
    };
    const { container } = render(
      <EntityTileView items={books} descriptor={minimal} />,
    );
    expect(screen.getByText("Dune")).toBeInTheDocument();
    // actions default to [] -> no action group rendered
    expect(container.querySelector(".entity-actions")).not.toBeInTheDocument();
  });
});
