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
});
