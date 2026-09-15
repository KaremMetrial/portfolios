"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";

/** Interactive dialog demo for `/dev/ui`. */
export function DialogDemo() {
  const [open, setOpen] = useState(false);
  const [sheet, setSheet] = useState(false);

  return (
    <>
      <Button variant="ghost" onClick={() => setOpen(true)}>
        Open dialog
      </Button>
      <Button variant="ghost" onClick={() => setSheet(true)}>
        Open sheet
      </Button>

      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="About this dialog"
        closeLabel="Close dialog"
      >
        <p>
          Focus is trapped here. Press Escape to close, or Tab to move between
          the buttons below.
        </p>
        <div className="mt-4 flex gap-3">
          <Button size="sm" onClick={() => setOpen(false)}>
            Confirm
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </div>
      </Dialog>

      <Dialog
        open={sheet}
        onOpenChange={setSheet}
        title="Side sheet"
        variant="sheet"
        side="end"
        closeLabel="Close sheet"
      >
        <p>Slides from the inline-end (RTL-aware).</p>
        <div className="mt-4 flex gap-3">
          <Button size="sm" onClick={() => setSheet(false)}>
            Close
          </Button>
        </div>
      </Dialog>
    </>
  );
}
