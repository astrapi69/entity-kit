import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EntityListView } from "./EntityListView";
import { bookDescriptor, books } from "../test/fixtures";

describe("EntityListView", () => {
  it("renders a column header per visible list field", () => {
    render(<EntityListView items={books} descriptor={bookDescriptor} />);
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Author")).toBeInTheDocument();
    expect(screen.getByText("Year")).toBeInTheDocument();
    // The id field is visible: false and must not appear.
    expect(screen.queryByText("Internal Id")).not.toBeInTheDocument();
  });

  it("renders a row per item with the cell values", () => {
    render(<EntityListView items={books} descriptor={bookDescriptor} />);
    expect(screen.getByText("Dune")).toBeInTheDocument();
    expect(screen.getByText("Neuromancer")).toBeInTheDocument();
  });

  it("renders the empty state when there are no items", () => {
    render(<EntityListView items={[]} descriptor={bookDescriptor} />);
    expect(screen.getByText("No items")).toBeInTheDocument();
  });

  it("sorts when a sortable header is clicked", () => {
    render(<EntityListView items={books} descriptor={bookDescriptor} />);
    fireEvent.click(screen.getByRole("button", { name: /Year/ }));
    const rows = screen.getAllByRole("row");
    // rows[0] is the header row; first data row should be the oldest year.
    const firstData = within(rows[1]).getAllByRole("cell");
    expect(firstData[2]).toHaveTextContent("1960");
  });

  it("fires onAction for a row action", () => {
    const onAction = vi.fn();
    render(
      <EntityListView
        items={books}
        descriptor={bookDescriptor}
        onAction={onAction}
      />,
    );
    const editButtons = screen.getAllByText("Edit");
    fireEvent.click(editButtons[0]);
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onAction.mock.calls[0][0]).toBe("edit");
  });

  it("paginates and renders pagination controls", () => {
    render(
      <EntityListView
        items={books}
        descriptor={bookDescriptor}
        options={{ pageSize: 2 }}
      />,
    );
    expect(screen.getByText("1 / 2")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByText("2 / 2")).toBeInTheDocument();
  });

  it("applies semantic default classes when no classNames prop is given", () => {
    const { container } = render(
      <EntityListView items={books} descriptor={bookDescriptor} />,
    );
    expect(container.querySelector(".entity-list")).toBeInTheDocument();
    expect(container.querySelector(".entity-list__table")).toBeInTheDocument();
    expect(container.querySelector(".entity-list__cell")).toBeInTheDocument();
  });

  it("applies custom classNames and drops the defaults for overridden slots", () => {
    const { container } = render(
      <EntityListView
        items={books}
        descriptor={bookDescriptor}
        classNames={{
          root: "my-list",
          table: "my-table",
          cell: "my-cell",
          actionsCell: "my-actions-cell",
        }}
      />,
    );
    expect(container.querySelector(".my-list")).toBeInTheDocument();
    expect(container.querySelector(".my-table")).toBeInTheDocument();
    expect(container.querySelector(".my-cell")).toBeInTheDocument();
    expect(container.querySelector(".entity-list__table")).not.toBeInTheDocument();
    expect(container.querySelector(".entity-list__cell")).not.toBeInTheDocument();
  });
});
