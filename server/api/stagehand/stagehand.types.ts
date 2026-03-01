import type { SessionEvent } from "../posthog/posthog.types";

/**
 * Stagehand action types
 */
export type ActionType = "click" | "fill" | "select" | "navigate";

/**
 * Structured action for Stagehand
 */
export interface StagehandAction {
  action: ActionType;
  target: string; // Natural language description
  value?: string; // For fill/select actions
  reasoning?: string;
  originalEventIndex: number;
}

/**
 * Configuration options
 */
export interface ConverterConfig {
  deduplicationTimeWindow?: number;
  model: string;
}

/**
 * Conversion result with metadata
 */
export interface ConversionResult {
  code: string;
  actions: StagehandAction[];
  stats: {
    originalEvents: SessionEvent[];
    deduplicatedEvents: SessionEvent[];
    generatedActions: number;
    hasPopups: boolean;
    processingTimeMs: number;
  };
}
