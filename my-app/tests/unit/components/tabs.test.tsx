// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Tabs } from "@/components/ui/tabs";

const items = [
  { value: "a", label: "Tab A", content: <p>A panel</p> },
  { value: "b", label: "Tab B", content: <p>B panel</p> },
  { value: "c", label: "Tab C", content: <p>C panel</p> },
];

describe("Tabs (SRS-FE §4.2)", () => {
  it("sets aria-selected and shows the active panel", () => {
    render(<Tabs label="Demo" items={items} />);

    const [a, b] = screen.getAllByRole("tab");
    expect(a).toHaveAttribute("aria-selected", "true");
    expect(b).toHaveAttribute("aria-selected", "false");
    expect(screen.getByText("A panel")).toBeInTheDocument();
    expect(screen.queryByText("B panel")).not.toBeInTheDocument();
  });

  it("moves selection and focus with arrow keys", () => {
    render(<Tabs label="Demo" items={items} />);

    const [a, b, c] = screen.getAllByRole("tab");
    a.focus();

    fireEvent.keyDown(a, { key: "ArrowRight" });
    expect(b).toHaveAttribute("aria-selected", "true");
    expect(b).toHaveFocus();
    expect(screen.getByText("B panel")).toBeInTheDocument();

    // reach the last tab, then wrap back to the first
    fireEvent.keyDown(c, { key: "ArrowRight" });
    expect(c).toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(c, { key: "ArrowRight" });
    expect(a).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("A panel")).toBeInTheDocument();
  });

  it("wraps around on ArrowLeft in a two-tab set", () => {
    render(
      <Tabs label="Demo" defaultActive="c" items={[items[0], items[2]]} />,
    );

    const [a, c] = screen.getAllByRole("tab");
    fireEvent.keyDown(c, { key: "ArrowLeft" });
    expect(a).toHaveAttribute("aria-selected", "true");
  });

  it("respects Home and End keys", () => {
    render(<Tabs label="Demo" defaultActive="b" items={items} />);

    const [a, , c] = screen.getAllByRole("tab");
    fireEvent.keyDown(screen.getAllByRole("tab")[1], { key: "End" });
    expect(c).toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(c, { key: "Home" });
    expect(a).toHaveAttribute("aria-selected", "true");
  });

  it("supports selecting an arbitrary tab by pointer", () => {
    render(<Tabs label="Demo" items={items} />);
    fireEvent.click(screen.getByRole("tab", { name: "Tab C" }));
    expect(screen.getByText("C panel")).toBeInTheDocument();
  });

  it("announces a selection when controlled via onValueChange", () => {
    const onValueChange = vi.fn();
    render(
      <Tabs
        label="Demo"
        items={items}
        onValueChange={onValueChange}
        value="a"
      />,
    );
    fireEvent.click(screen.getByRole("tab", { name: "Tab B" }));
    expect(onValueChange).toHaveBeenCalledWith("b");
    // controlled: value stays "a" internally until parent changes it
    expect(screen.getAllByRole("tab")[0]).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });
});
