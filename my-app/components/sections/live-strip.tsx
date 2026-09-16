"use client";

import { useEffect, useState, useCallback } from "react";

type Status = {
  ok: boolean;
  latencyMs: number;
  requestId: string;
};

type LiveStripProps = {
  apiUrl: string;
  operational: string;
  unavailable: string;
};

/**
 * Live strip island (FR-FE-32):
 * Calls GET {API}/health from the browser after idle.
 * Shows "● operational · 42 ms · req 7f3a…"
 * Degrades to "status unavailable" without error styling.
 */
export function LiveStrip({ apiUrl, operational, unavailable }: LiveStripProps) {
  const [status, setStatus] = useState<Status | null>(null);
  const [error, setError] = useState(false);

  const checkHealth = useCallback(async () => {
    try {
      const start = performance.now();
      const res = await fetch(`${apiUrl}/health`, {
        signal: AbortSignal.timeout(5_000),
      });
      const latencyMs = Math.round(performance.now() - start);
      const requestId = res.headers.get("x-request-id") || "";
      setStatus({ ok: res.ok, latencyMs, requestId });
      setError(false);
    } catch {
      setError(true);
    }
  }, [apiUrl]);

  useEffect(() => {
    // Wait for browser idle before first call.
    const id = requestIdleCallback
      ? requestIdleCallback(() => checkHealth())
      : setTimeout(() => checkHealth(), 0);

    // Poll every 30s while visible.
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        checkHealth();
      }
    }, 30_000);

    const onVisibility = () => {
      if (document.visibilityState === "visible") checkHealth();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      if (typeof id === "number") clearTimeout(id);
      else if (id && typeof id === "object" && "cancel" in id) {
        (id as { cancel: () => void }).cancel();
      }
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [checkHealth]);

  if (error || !status) {
    return (
      <p className="font-mono text-xs text-silver/60">{unavailable}</p>
    );
  }

  const reqShort = status.requestId.slice(0, 4);

  return (
    <p className="font-mono text-xs text-silver">
      <span
        aria-hidden="true"
        className={`mr-1.5 inline-block h-2 w-2 rounded-full ${status.ok ? "bg-success" : "bg-danger"}`}
      />
      <span className={status.ok ? "text-success" : "text-danger"}>
        {operational}
      </span>
      {" · "}
      {status.latencyMs} ms
      {reqShort && (
        <>
          {" · "}
          <span className="text-silver/60">req {reqShort}…</span>
        </>
      )}
    </p>
  );
}
