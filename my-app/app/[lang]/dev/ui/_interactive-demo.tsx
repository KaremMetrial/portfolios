"use client";

import { useState } from "react";

import { CodeBlock } from "@/components/ui/code-block";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Tabs } from "@/components/ui/tabs";

/** Tabs + SegmentedControl demo (client, so its handlers stay on the client). */
export function InteractiveDemo() {
  const [view, setView] = useState<"cards" | "list">("cards");

  return (
    <>
      <Tabs
        label="Output format"
        items={[
          {
            value: "overview",
            label: "Overview",
            content: <p className="text-sm text-silver">Overview panel.</p>,
          },
          {
            value: "details",
            label: "Details",
            content: <p className="text-sm text-silver">Details panel.</p>,
          },
          {
            value: "code",
            label: "Code",
            content: (
              <CodeBlock
                code={"const regions = await api.getRegions({ lang });"}
                title="lib/api/client.ts"
              />
            ),
          },
        ]}
      />
      <SegmentedControl
        label="View"
        value={view}
        onChange={setView}
        options={[
          { value: "cards", label: "Cards" },
          { value: "list", label: "List" },
        ]}
      />
    </>
  );
}
