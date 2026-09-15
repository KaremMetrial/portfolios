// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { SegmentedControl } from "@/components/ui/segmented-control";

const options = [
  { value: "cards", label: "Cards" },
  { value: "list", label: "List" },
];

describe("SegmentedControl (SRS-FE §4.2)", () => {
  it("implements a radio group with ARIA", () => {
    render(
      <SegmentedControl
        label="View"
        value="cards"
        options={options}
        onChange={() => {}}
      />,
    );

    expect(
      screen.getByRole("radiogroup", { name: "View" }),
    ).toBeInTheDocument();
    const cards = screen.getByRole("radio", { name: "Cards" });
    const list = screen.getByRole("radio", { name: "List" });
    expect(cards).toHaveAttribute("aria-checked", "true");
    expect(list).toHaveAttribute("aria-checked", "false");
  });

  it("selects on pointer and reports the change", () => {
    const onChange = vi.fn();
    render(
      <SegmentedControl
        label="View"
        value="cards"
        options={options}
        onChange={onChange}
      />,
    );
    fireEvent.click(screen.getByRole("radio", { name: "List" }));
    expect(onChange).toHaveBeenCalledWith("list");
  });

  it("moves selection with arrow keys, in logical (RTL) order", () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <SegmentedControl
        label="View"
        value="cards"
        options={options}
        onChange={onChange}
      />,
    );

    fireEvent.keyDown(screen.getByRole("radiogroup"), { key: "ArrowRight" });
    expect(onChange).toHaveBeenLastCalledWith("list");
    expect(screen.getByRole("radio", { name: "List" })).toHaveFocus();

    // Re-render as controlled with the new value, then move back with ArrowLeft.
    rerender(
      <SegmentedControl
        label="View"
        value="list"
        options={options}
        onChange={onChange}
      />,
    );
    fireEvent.keyDown(screen.getByRole("radiogroup"), { key: "ArrowLeft" });
    expect(onChange).toHaveBeenLastCalledWith("cards");
  });

  it("keeps only the active option in the tab order", () => {
    render(
      <SegmentedControl
        label="View"
        value="list"
        options={options}
        onChange={() => {}}
      />,
    );
    expect(screen.getByRole("radio", { name: "List" })).toHaveAttribute(
      "tabindex",
      "0",
    );
    expect(screen.getByRole("radio", { name: "Cards" })).toHaveAttribute(
      "tabindex",
      "-1",
    );
  });
});
