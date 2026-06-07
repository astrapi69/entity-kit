import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  EntityTrashView,
  PERMANENT_DELETE_ACTION_ID,
  RESTORE_ACTION_ID,
} from "./EntityTrashView";
import { bookDescriptor, books } from "../test/fixtures";

describe("EntityTrashView", () => {
  it("renders only soft-deleted items", () => {
    render(<EntityTrashView items={books} descriptor={bookDescriptor} />);
    // Only "Old Draft" is deleted in the fixture.
    expect(screen.getByText("Old Draft")).toBeInTheDocument();
    expect(screen.queryByText("Dune")).not.toBeInTheDocument();
  });

  it("shows a deletion-timestamp column", () => {
    render(<EntityTrashView items={books} descriptor={bookDescriptor} />);
    expect(screen.getByText("Deleted")).toBeInTheDocument();
    expect(
      screen.getByText("2026-01-15T10:00:00.000Z"),
    ).toBeInTheDocument();
  });

  it("offers restore and permanent-delete actions", () => {
    render(<EntityTrashView items={books} descriptor={bookDescriptor} />);
    expect(screen.getByText("Restore")).toBeInTheDocument();
    expect(screen.getByText("Delete permanently")).toBeInTheDocument();
  });

  it("emits the trash action ids", () => {
    const onAction = vi.fn();
    render(
      <EntityTrashView
        items={books}
        descriptor={bookDescriptor}
        onAction={onAction}
      />,
    );
    fireEvent.click(screen.getByText("Restore"));
    expect(onAction).toHaveBeenCalledWith(RESTORE_ACTION_ID, books[3]);
    fireEvent.click(screen.getByText("Delete permanently"));
    expect(onAction).toHaveBeenCalledWith(
      PERMANENT_DELETE_ACTION_ID,
      books[3],
    );
  });

  it("renders an empty state when nothing is deleted", () => {
    const active = books.filter((b) => !b.deleted);
    render(<EntityTrashView items={active} descriptor={bookDescriptor} />);
    expect(screen.getByText("Trash is empty")).toBeInTheDocument();
  });
});
