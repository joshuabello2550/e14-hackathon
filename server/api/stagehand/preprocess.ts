import type { SessionEvent } from "../posthog/posthog.types";

/**
 * Check if two events are duplicates within a time window
 */
export function isDuplicate(
  e1: SessionEvent,
  e2: SessionEvent,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _timeWindowMs: number
): boolean {
  // const time1 = new Date(e1.timestamp).getTime();
  // const time2 = new Date(e2.timestamp).getTime();
  // const timeDiff = Math.abs(time2 - time1);

  // // Must be within time window
  // if (timeDiff > timeWindowMs) {
  //     return false;
  // }

  // Must be same type
  if (e1.event_type !== e2.event_type) {
    return false;
  }

  // Must be same window
  if (e1.window_id !== e2.window_id) {
    return false;
  }

  // Must interact with same element (or both empty)
  const html1 = e1.selected_html?.trim() || "";
  const html2 = e2.selected_html?.trim() || "";

  if (html1 !== html2) {
    return false;
  }

  return true;
}

/**
 * Check if event is noise (should be filtered out)
 */
export function isNoise(event: SessionEvent): boolean {
  // Page leave events
  if (event.event === "$pageleave") {
    return true;
  }

  // Empty pageviews (just page loads)
  if (event.event === "$pageview" && !event.elements_html) {
    return true;
  }

  // Clicks with no target
  if (event.event_type === "click" && !event.selected_html) {
    return true;
  }

  // Empty change events
  if (event.event_type === "change" && !event.selected_html) {
    return true;
  }

  return false;
}

/**
 * Deduplicate and filter session events
 * This is deterministic - no LLM needed
 */
export function preprocessEvents(
  events: SessionEvent[],
  timeWindowMs: number = 500
): SessionEvent[] {
  const cleaned: SessionEvent[] = [];

  for (const event of events) {
    // Skip noise
    if (isNoise(event)) {
      continue;
    }

    // Check if duplicate of last event
    const lastEvent = cleaned[cleaned.length - 1];
    if (lastEvent && isDuplicate(event, lastEvent, timeWindowMs)) {
      continue;
    }

    cleaned.push(event);
  }

  return cleaned;
}

/**
 * Get statistics about preprocessing
 */
export function getPreprocessingStats(
  original: SessionEvent[],
  preprocessed: SessionEvent[]
): {
  original: number;
  preprocessed: number;
  removed: number;
} {
  const removed = original.length - preprocessed.length;

  return {
    original: original.length,
    preprocessed: preprocessed.length,
    removed,
  };
}
