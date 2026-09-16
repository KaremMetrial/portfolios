/**
 * POST /api/revalidate — signed webhook from the backend (FR-FE-20, FR-FE-21).
 *
 * Verifies X-Webhook-Signature: t=<ts>,v1=<hmac>
 * HMAC-SHA256 of "{t}.{raw_body}" with REVALIDATE_SECRET.
 * Rejects timestamps older than 5 minutes.
 * De-duplicates event ids (in-memory LRU).
 * Calls revalidateTag(tag, 'max') for every tag in data.tags.
 */
import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

import { serverEnv } from "@/lib/env.server";

// ── HMAC verification (constant-time) ───────────────────────────────────────

async function verifySignature(
  secret: string,
  t: string,
  v1: string,
  rawBody: string,
): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(`${t}.${rawBody}`),
  );

  const computed = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // Constant-time comparison.
  if (computed.length !== v1.length) return false;
  let result = 0;
  for (let i = 0; i < computed.length; i++) {
    result |= computed.charCodeAt(i) ^ v1.charCodeAt(i);
  }
  return result === 0;
}

// ── Dedup LRU (in-memory) ──────────────────────────────────────────────────

const seen = new Map<string, number>();
const MAX_SEEN = 200;
const DEDUP_WINDOW_MS = 30_000;

function dedup(id: string): boolean {
  const now = Date.now();
  // Evict old entries.
  for (const [key, ts] of seen) {
    if (now - ts > DEDUP_WINDOW_MS) seen.delete(key);
  }
  if (seen.has(id)) return true;
  seen.set(id, now);
  // Trim if needed.
  if (seen.size > MAX_SEEN) {
    const first = seen.keys().next().value;
    if (first !== undefined) seen.delete(first);
  }
  return false;
}

// ── Handler ─────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const secret = serverEnv.REVALIDATE_SECRET;

  if (!secret) {
    return NextResponse.json(
      { success: false, error: "revalidation_not_configured" },
      { status: 503 },
    );
  }

  // ── Parse signature header ──────────────────────────────────────────────

  const sigHeader = request.headers.get("x-webhook-signature");
  if (!sigHeader) {
    return NextResponse.json(
      { success: false, error: "missing_signature" },
      { status: 401 },
    );
  }

  const match = sigHeader.match(/^t=(\d+),v1=([a-f0-9]+)$/);
  if (!match) {
    return NextResponse.json(
      { success: false, error: "invalid_signature_format" },
      { status: 401 },
    );
  }

  const [, tStr, v1] = match;
  const t = Number(tStr);

  // ── Validate timestamp (±5 min) ────────────────────────────────────────

  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - t) > 300) {
    return NextResponse.json(
      { success: false, error: "timestamp_too_old" },
      { status: 401 },
    );
  }

  // ── Verify HMAC ────────────────────────────────────────────────────────

  const rawBody = await request.text();
  const valid = await verifySignature(secret, tStr, v1, rawBody);
  if (!valid) {
    return NextResponse.json(
      { success: false, error: "invalid_signature" },
      { status: 401 },
    );
  }

  // ── Parse payload ──────────────────────────────────────────────────────

  let payload: {
    id?: string;
    data?: { tags?: string[] };
  };

  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json(
      { success: false, error: "invalid_json" },
      { status: 400 },
    );
  }

  const tags = payload.data?.tags;
  if (!Array.isArray(tags) || tags.length === 0) {
    return NextResponse.json(
      { success: false, error: "missing_tags" },
      { status: 400 },
    );
  }

  // ── Deduplicate ────────────────────────────────────────────────────────

  if (payload.id && dedup(payload.id)) {
    return NextResponse.json({ success: true, revalidated: [], deduplicated: true });
  }

  // ── Revalidate ─────────────────────────────────────────────────────────

  const revalidated: string[] = [];
  for (const tag of tags) {
    try {
      revalidateTag(tag, "max");
      revalidated.push(tag);
    } catch (e) {
      console.error(`[revalidate] Failed to revalidate tag "${tag}":`, e);
    }
  }

  return NextResponse.json({ success: true, revalidated });
}
