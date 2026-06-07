import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EntityActions } from "./EntityActions";
import { bookDescriptor, books } from "../test/fixtures";

describe("EntityActions", () => {
  const activeBook = books[0]; // not deleted
  const deletedBook = books[3]; // deleted

  it("renders only available actions for an item", () => {
    render(<EntityActions item={activeBook} descriptor={bookDescriptor} />);
    // edit + delete available, restore not (only for deleted)
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
    expect(screen.queryByText("Restore")).not.toBeInTheDocument();
  });

  it("reflects availability for a deleted item", () => {
    render(<EntityActions item={deletedBook} descriptor={bookDescriptor} />);
    expect(screen.getByText("Restore")).toBeInTheDocument();
    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
  });

  it("invokes onAction with the action id and item", () => {
    const onAction = vi.fn();
    render(
      <EntityActions
        item={activeBook}
        descriptor={bookDescriptor}
        onAction={onAction}
      />,
    );
    fireEvent.click(screen.getByText("Delete"));
    expect(onAction).toHaveBeenCalledWith("delete", activeBook);
  });

  it("exposes the variant via a data attribute", () => {
    const { container } = render(
      <EntityActions item={activeBook} descriptor={bookDescriptor} />,
    );
    const deleteBtn = container.querySelector('[data-action="delete"]');
    expect(deleteBtn).toHaveAttribute("data-variant", "danger");
  });

  it("renders nothing when no actions are available", () => {
    const noActions = { ...bookDescriptor, actions: [] };
    const { container } = render(
      <EntityActions item={activeBook} descriptor={noActions} />,
    );
    expect(container.querySelector(".entity-actions")).not.toBeInTheDocument();
  });

  it("applies default classes when no classNames prop is given", () => {
    const { container } = render(
      <EntityActions item={activeBook} descriptor={bookDescriptor} />,
    );
    expect(container.querySelector(".entity-actions")).toBeInTheDocument();
    expect(container.querySelector(".entity-actions__button")).toBeInTheDocument();
  });

  it("applies custom classNames, using dangerActionButton for danger actions", () => {
    const { container } = render(
      <EntityActions
        item={activeBook}
        descriptor={bookDescriptor}
        classNames={{
          actions: "my-actions",
          actionButton: "btn",
          dangerActionButton: "btn-danger",
        }}
      />,
    );
    expect(container.querySelector(".my-actions")).toBeInTheDocument();
    expect(container.querySelector(".entity-actions")).not.toBeInTheDocument();
    // edit = default variant -> btn; delete = danger -> btn-danger
    expect(screen.getByText("Edit").closest("button")).toHaveClass("btn");
    expect(screen.getByText("Delete").closest("button")).toHaveClass("btn-danger");
  });
});
