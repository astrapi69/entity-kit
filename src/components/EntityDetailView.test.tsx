import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EntityDetailView } from "./EntityDetailView";
import { bookDescriptor, books } from "../test/fixtures";

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
});
