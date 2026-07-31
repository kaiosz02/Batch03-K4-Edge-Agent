"use client";

import { trackEvent } from "@/lib/api";

/** Shared anonymous session id (same key as useTutorChat). */
export function getTelemetrySessionId(): string {
  if (typeof window === "undefined") return "ssr";
  const existing = localStorage.getItem("vpet_session");
  if (existing) return `user-${existing}`;
  const id = Math.random().toString(36).slice(2);
  localStorage.setItem("vpet_session", id);
  return `user-${id}`;
}

export function track(
  event: string,
  payload: Record<string, unknown> = {}
): void {
  trackEvent({
    event,
    session_id: getTelemetrySessionId(),
    payload,
  });
}
