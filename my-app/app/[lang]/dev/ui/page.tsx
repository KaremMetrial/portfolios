import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DialogDemo } from "./_dialog-demo";
import { InteractiveDemo } from "./_interactive-demo";
import { ToastDemo } from "./_toast-demo";
import { MetrialMark } from "@/components/brand/metrial-mark";
import { MetrialWordmark } from "@/components/brand/metrial-wordmark";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { SlopeDivider } from "@/components/motion/slope-divider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { JsonViewer } from "@/components/ui/json-viewer";
import { SectionHeader } from "@/components/ui/section-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Stat } from "@/components/ui/stat";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip } from "@/components/ui/tooltip";
import { isProduction } from "@/lib/env";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/** Design-system showcase (FE-1). Never served in production (FR-FE-96). */
export default async function DevUiPage({
  params,
}: PageProps<"/[lang]/dev/ui">) {
  const { lang } = await params;
  // Remove the route from the production build entirely.
  if (isProduction) notFound();

  void lang;

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="mb-12 flex flex-col gap-4">
        <MetrialMark className="h-12 w-auto" />
        <h1 className="font-display text-2xl font-bold text-offwhite">
          Design system — /dev/ui
        </h1>
        <p className="max-w-2xl text-silver">
          Every primitive renders in en and ar, dark theme, with and without
          reduced motion. This route is{" "}
          <span className="text-gold">noindex</span> and returns 404 in
          production.
        </p>
      </div>
      {/* ── Brand ------------------------------------------------ */}
      <SectionHeader eyebrow="Brand" title="Mark & wordmark" />
      <div className="mt-6 grid gap-6 rounded-[--radius-card] border border-line bg-surface p-6 md:grid-cols-2">
        <div className="flex items-center gap-4">
          <MetrialMark className="h-10 w-auto" />
          <MetrialWordmark />
        </div>
        <p className="text-sm text-silver">
          Decorative mark plus tracked display type from the brand sheet (§4.2).
        </p>
      </div>

      {/* ── Buttons / badges / chips ---------------------------- */}
      <SectionHeader
        eyebrow="Actions"
        title="Buttons, badges, chips"
        className="mt-16"
      />
      <div className="mt-6 grid gap-8 rounded-[--radius-card] border border-line bg-surface p-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-widest text-silver">
            Buttons
          </p>
          <div className="flex flex-wrap gap-3">
            <Button>Primary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Button magnetic>Magnetic</Button>
            <Button disabled>Disabled</Button>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-widest text-silver">
            Badges
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge pulse>Available</Badge>
            <Badge tone="success">Healthy</Badge>
            <Badge tone="danger">Degraded</Badge>
            <Badge tone="neutral">Offline</Badge>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-widest text-silver">Chips</p>
          <div className="flex flex-wrap gap-2">
            <Chip>PHP</Chip>
            <Chip>Laravel</Chip>
            <Chip active>PostgreSQL</Chip>
            <Chip>Redis</Chip>
          </div>
        </div>
      </div>

      {/* ── Cards / headers / stats ----------------------------- */}
      <SectionHeader
        eyebrow="Content"
        title="Cards, headers, stats"
        className="mt-16"
      />
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card interactive>
          <h3 className="font-display text-lg font-semibold">
            Interactive card
          </h3>
          <p className="mt-2 text-sm text-silver">
            Hover reveals the gold sheen across the top edge — the project
            surface used from FE-4.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <Button size="sm" variant="ghost">
              Case study
            </Button>
            <Tooltip label="Requires the backend">
              <Button size="sm">Live demo</Button>
            </Tooltip>
          </div>
        </Card>
        <div className="grid grid-cols-2 gap-6 rounded-[--radius-card] border border-line bg-surface p-6">
          <Stat label="Years shipping" value={6} />
          <Stat label="Open source repos" value={24} />
          <Stat label="Uptime" value={99} suffix="%" />
          <Stat label="Case studies" value={8} />
        </div>
      </div>
      {/* ── Motion ----------------------------------------------- */}
      <SectionHeader
        eyebrow="Motion"
        title="Reveal, stagger, slope"
        className="mt-16"
      />
      <div className="mt-6 rounded-[--radius-card] border border-line bg-surface p-6">
        <Reveal>
          <p className="text-sm text-silver">
            Single <span className="font-mono">Reveal</span> — fades up on
            scroll, reduced-motion aware.
          </p>
        </Reveal>
        <Stagger className="mt-4 grid gap-2 sm:grid-cols-3">
          {(Array.from({ length: 3 }) as string[]).map((_, i) => (
            <StaggerItem
              key={i}
              className="rounded-md border border-line bg-charcoal/40 p-3 text-sm text-offwhite/80"
            >
              Staggered item {i + 1}
            </StaggerItem>
          ))}
        </Stagger>
        <div className="mt-6 flex items-center gap-3">
          <SlopeDivider />
          <span className="text-xs text-silver">slope divider accent</span>
        </div>
      </div>

      {/* ── Interactive --------------------------------------- */}
      <SectionHeader
        eyebrow="Interactive"
        title="Tabs, segmented, dialog, toast"
        className="mt-16"
      />
      <div className="mt-6 grid gap-6 rounded-[--radius-card] border border-line bg-surface p-6">
        <InteractiveDemo />
        <div className="flex flex-wrap items-center gap-3">
          <DialogDemo />
          <ToastDemo />
        </div>
      </div>
      {/* ── Data ------------------------------------------------ */}
      <SectionHeader
        eyebrow="Data"
        title="Skeleton, JSON, code"
        className="mt-16"
      />
      <div className="mt-6 grid gap-6 rounded-[--radius-card] border border-line bg-surface p-6 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-2/3" label="Loading profile" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
        <Card>
          <Textarea
            rows={3}
            defaultValue="A textarea field…"
            aria-label="Notes"
            className="font-mono"
          />
        </Card>
        <JsonViewer
          className="md:col-span-2"
          data={{ ok: true, latency_ms: 42, request_id: "req_9f1" }}
        />
      </div>
    </div>
  );
}
