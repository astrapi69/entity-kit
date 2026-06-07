import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EntityViewSwitcher } from "./EntityViewSwitcher";

describe("EntityViewSwitcher", () => {
  it("renders the default list/tile/detail toggles", () => {
    render(<EntityViewSwitcher mode="list" onChange={() => {}} />);
    expect(screen.getByText("List")).toBeInTheDocument();
    expect(screen.getByText("Tile")).toBeInTheDocument();
    expect(screen.getByText("Detail")).toBeInTheDocument();
  });

  it("marks the active mode with aria-pressed", () => {
    render(<EntityViewSwitcher mode="tile" onChange={() => {}} />);
    const tile = screen.getByRole("button", { name: "Tile" });
    expect(tile).toHaveAttribute("aria-pressed", "true");
    const list = screen.getByRole("button", { name: "List" });
    expect(list).toHaveAttribute("aria-pressed", "false");
  });

  it("calls onChange with the chosen mode", () => {
    const onChange = vi.fn();
    render(<EntityViewSwitcher mode="list" onChange={onChange} />);
    fireEvent.click(screen.getByText("Detail"));
    expect(onChange).toHaveBeenCalledWith("detail");
  });

  it("honours custom options", () => {
    render(
      <EntityViewSwitcher
        mode="list"
        onChange={() => {}}
        options={[
          { mode: "list", label: "Rows" },
          { mode: "tile", label: "Cards" },
        ]}
      />,
    );
    expect(screen.getByText("Rows")).toBeInTheDocument();
    expect(screen.getByText("Cards")).toBeInTheDocument();
    expect(screen.queryByText("Detail")).not.toBeInTheDocument();
  });

  it("applies default classes when no classNames prop is given", () => {
    const { container } = render(
      <EntityViewSwitcher mode="list" onChange={() => {}} />,
    );
    expect(container.querySelector(".entity-switcher")).toBeInTheDocument();
    expect(container.querySelector(".entity-switcher__button")).toBeInTheDocument();
  });

  it("applies custom classNames including activeButton on the active toggle", () => {
    const { container } = render(
      <EntityViewSwitcher
        mode="tile"
        onChange={() => {}}
        classNames={{ group: "my-group", button: "my-btn", activeButton: "is-active" }}
      />,
    );
    expect(container.querySelector(".my-group")).toBeInTheDocument();
    expect(container.querySelectorAll(".my-btn")).toHaveLength(3);
    expect(container.querySelector(".entity-switcher")).not.toBeInTheDocument();
    // Only the active (tile) button carries the activeButton class.
    const active = container.querySelectorAll(".is-active");
    expect(active).toHaveLength(1);
    expect(active[0]).toHaveAttribute("data-mode", "tile");
  });
});
