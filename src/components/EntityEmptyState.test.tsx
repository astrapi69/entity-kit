import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EntityEmptyState } from "./EntityEmptyState";

describe("EntityEmptyState", () => {
  it("renders a default title", () => {
    render(<EntityEmptyState />);
    expect(screen.getByText("No items")).toBeInTheDocument();
  });

  it("renders title, description, icon and action when provided", () => {
    render(
      <EntityEmptyState
        title="Nothing here"
        description="Add your first book"
        icon={<span data-testid="icon">📭</span>}
        action={<button type="button">Add</button>}
      />,
    );
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
    expect(screen.getByText("Add your first book")).toBeInTheDocument();
    expect(screen.getByTestId("icon")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
  });

  it("uses semantic classes and a status role", () => {
    const { container } = render(<EntityEmptyState />);
    expect(container.querySelector(".entity-empty")).toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("applies custom classNames and drops the defaults for overridden slots", () => {
    const { container } = render(
      <EntityEmptyState
        title="Empty"
        classNames={{ container: "my-empty", title: "my-title" }}
      />,
    );
    expect(container.querySelector(".my-empty")).toBeInTheDocument();
    expect(container.querySelector(".my-title")).toBeInTheDocument();
    expect(container.querySelector(".entity-empty")).not.toBeInTheDocument();
    expect(container.querySelector(".entity-empty__title")).not.toBeInTheDocument();
  });
});
