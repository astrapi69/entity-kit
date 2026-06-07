import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EntitySearchBar } from "./EntitySearchBar";
import { bookDescriptor, books } from "../test/fixtures";

describe("EntitySearchBar", () => {
  it("renders an input with the default semantic classes", () => {
    const { container } = render(
      <EntitySearchBar items={books} descriptor={bookDescriptor} />,
    );
    expect(container.querySelector(".entity-search")).toBeInTheDocument();
    expect(container.querySelector(".entity-search__input")).toBeInTheDocument();
  });

  it("emits the full list on mount, then filtered results as the query changes", () => {
    const onResults = vi.fn();
    render(
      <EntitySearchBar
        items={books}
        descriptor={bookDescriptor}
        onResults={onResults}
      />,
    );
    // Initial emit with all items.
    expect(onResults).toHaveBeenLastCalledWith(books);

    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "gibson" },
    });
    const calls = onResults.mock.calls;
    const last = calls[calls.length - 1][0];
    expect(last).toHaveLength(1);
    expect(last[0].title).toBe("Neuromancer");
  });

  it("calls onQueryChange with the typed text", () => {
    const onQueryChange = vi.fn();
    render(
      <EntitySearchBar
        items={books}
        descriptor={bookDescriptor}
        onQueryChange={onQueryChange}
      />,
    );
    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "dune" },
    });
    expect(onQueryChange).toHaveBeenCalledWith("dune");
  });

  it("clears the query via the clear button", () => {
    const onResults = vi.fn();
    render(
      <EntitySearchBar
        items={books}
        descriptor={bookDescriptor}
        onResults={onResults}
      />,
    );
    const input = screen.getByRole("searchbox") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "dune" } });
    expect(input.value).toBe("dune");
    fireEvent.click(screen.getByRole("button", { name: "Clear search" }));
    expect(input.value).toBe("");
    expect(onResults).toHaveBeenLastCalledWith(books);
  });

  it("supports controlled usage via the query prop", () => {
    render(
      <EntitySearchBar
        items={books}
        descriptor={bookDescriptor}
        query="snow"
      />,
    );
    const input = screen.getByRole("searchbox") as HTMLInputElement;
    expect(input.value).toBe("snow");
  });

  it("applies custom classNames and drops the defaults for overridden slots", () => {
    const { container } = render(
      <EntitySearchBar
        items={books}
        descriptor={bookDescriptor}
        classNames={{ container: "my-search", input: "my-input" }}
      />,
    );
    expect(container.querySelector(".my-search")).toBeInTheDocument();
    expect(container.querySelector(".my-input")).toBeInTheDocument();
    expect(container.querySelector(".entity-search")).not.toBeInTheDocument();
    expect(container.querySelector(".entity-search__input")).not.toBeInTheDocument();
  });
});
