// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Dialog } from "@/components/ui/dialog";

describe("Dialog (SRS-FE §4.2)", () => {
  it("renders an aria-modal dialog with a labelled title", () => {
    render(
      <Dialog open onOpenChange={() => {}} title="Confirm">
        <p>Body</p>
      </Dialog>,
    );

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(
      screen.getByRole("heading", { name: "Confirm" }),
    ).toBeInTheDocument();
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Dialog open onOpenChange={onOpenChange} title="Confirm">
        <button>Inside</button>
      </Dialog>,
    );

    const dialog = screen.getByRole("dialog");
    await user.click(dialog); // ensure focus within dialog
    fireEvent.keyDown(dialog, { key: "Escape" });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("closes when the overlay backdrop is clicked", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Dialog open onOpenChange={onOpenChange} title="Confirm">
        <button>Inside</button>
      </Dialog>,
    );

    // Backdrop is the first child of the portal wrapper.
    const backdrop =
      screen.getByRole("dialog").parentElement!.firstElementChild!;
    await user.click(backdrop);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("traps focus between the first and last focusable elements", () => {
    render(
      <Dialog open onOpenChange={() => {}} title="Confirm">
        <button>First</button>
        <button>Last</button>
      </Dialog>,
    );

    // DOM order: [Close, First, Last]
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(3);

    buttons[0].focus();
    expect(buttons[0]).toHaveFocus();

    // Shift+Tab from the first focusable wraps to the last.
    fireEvent.keyDown(screen.getByRole("dialog"), {
      key: "Tab",
      shiftKey: true,
    });
    expect(buttons[2]).toHaveFocus();

    // Tab from the last focusable wraps to the first.
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Tab" });
    expect(buttons[0]).toHaveFocus();
  });

  it("returns focus to the trigger on close", async () => {
    const trigger = document.createElement("button");
    trigger.textContent = "Open";
    document.body.appendChild(trigger);
    trigger.focus();

    const { unmount } = render(
      <Dialog open onOpenChange={() => {}} title="Confirm">
        <button>Inside</button>
      </Dialog>,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    unmount(); // simulate close by removal
    expect(document.activeElement).toBe(trigger);

    trigger.remove();
  });

  it("renders a sheet from the inline-start size (RTL-safe)", () => {
    render(
      <Dialog
        open
        onOpenChange={() => {}}
        title="Sheet"
        variant="sheet"
        side="start"
      >
        <p>Body</p>
      </Dialog>,
    );
    // inset-inline-start + inset-y-0 place it on whichever edge is "start".
    expect(screen.getByRole("dialog").className).toContain(
      "inset-inline-start-0",
    );
  });
});
