import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EntityDetailView } from "./EntityDetailView";
import { bookDescriptor, books, type Book } from "../test/fixtures";
import type { EntityDescriptor } from "../types";

describe("EntityDetailView", () => {
  const book = books[0];

  it("renders the header with display name and description", () => {
    render(<EntityDetailView item={book} descriptor={bookDescriptor} />);
    expect(
      screen.getByRole("heading", { name: "Dune" }),
    ).toBeInTheDocument();
    expect(screen.getByText("by Herbert (1965)")).toBeInTheDocument();
  });

  it("renders detail fields as label/value pairs", () => {
    render(<EntityDetailView item={book} descriptor={bookDescriptor} />);
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Author")).toBeInTheDocument();
    expect(screen.getByText("Herbert")).toBeInTheDocument();
  });

  it("uses a custom field renderer when provided", () => {
    render(<EntityDetailView item={book} descriptor={bookDescriptor} />);
    const rendered = screen.getByTestId("year-render");
    expect(rendered.tagName).toBe("EM");
    expect(rendered).toHaveTextContent("1965");
  });

  it("can hide the header", () => {
    render(
      <EntityDetailView
        item={book}
        descriptor={bookDescriptor}
        showHeader={false}
      />,
    );
    expect(
      screen.queryByRole("heading", { name: "Dune" }),
    ).not.toBeInTheDocument();
  });

  it("fires onAction from the footer action buttons", () => {
    const onAction = vi.fn();
    render(
      <EntityDetailView
        item={book}
        descriptor={bookDescriptor}
        onAction={onAction}
      />,
    );
    fireEvent.click(screen.getByText("Edit"));
    expect(onAction).toHaveBeenCalledWith("edit", book);
  });

  it("applies semantic default classes when no classNames prop is given", () => {
    const { container } = render(
      <EntityDetailView item={book} descriptor={bookDescriptor} />,
    );
    expect(container.querySelector(".entity-detail")).toBeInTheDocument();
    expect(container.querySelector(".entity-detail__label")).toBeInTheDocument();
    expect(container.querySelector(".entity-detail__value")).toBeInTheDocument();
  });

  it("applies custom classNames and drops the defaults for overridden slots", () => {
    const { container } = render(
      <EntityDetailView
        item={book}
        descriptor={bookDescriptor}
        classNames={{ container: "my-detail", label: "my-label", value: "my-value" }}
      />,
    );
    expect(container.querySelector(".my-detail")).toBeInTheDocument();
    expect(container.querySelector(".my-label")).toBeInTheDocument();
    expect(container.querySelector(".my-value")).toBeInTheDocument();
    expect(container.querySelector(".entity-detail__label")).not.toBeInTheDocument();
    expect(container.querySelector(".entity-detail__value")).not.toBeInTheDocument();
  });

  it("resolves a function field label (i18n factory)", () => {
    const i18nDescriptor = {
      ...bookDescriptor,
      detailFields: [{ key: "title" as const, label: () => "Tytuł" }],
    };
    render(<EntityDetailView item={book} descriptor={i18nDescriptor} />);
    expect(screen.getByText("Tytuł")).toBeInTheDocument();
  });

  it("works with a minimal descriptor (no detailFields or actions)", () => {
    const minimal: EntityDescriptor<Book> = {
      entityName: "book",
      getId: (b) => b.id,
      displayName: (b) => b.title,
      listFields: [{ key: "title", label: "Title" }],
      isDeleted: (b) => b.deleted,
    };
    const { container } = render(
      <EntityDetailView item={book} descriptor={minimal} />,
    );
    expect(screen.getByRole("heading", { name: "Dune" })).toBeInTheDocument();
    // detailFields defaults to [] -> no field rows; actions [] -> no footer
    expect(container.querySelector(".entity-detail__field")).not.toBeInTheDocument();
    expect(container.querySelector(".entity-detail__footer")).not.toBeInTheDocument();
  });
});
