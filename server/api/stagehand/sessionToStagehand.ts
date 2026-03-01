import type { SessionEvent } from "../posthog/posthog.types.ts";
import { convertEventsToActions } from "./agent.ts";
import { generateStagehandCode, getCodeStats } from "./codeGeneration.ts";
import { preprocessEvents } from "./preprocess.ts";
import type { ConversionResult, ConverterConfig } from "./stagehand.types.ts";

/**
 * Main function: Convert session events to Stagehand test code
 *
 * Architecture:
 * 1. Preprocessing (deterministic) - Deduplicate and filter
 * 2. Agent Analysis (LLM-powered) - Understand events and determine actions
 * 3. Code Generation (deterministic) - Generate final Stagehand code
 */
export async function sessionToStagehand(
  sessionEvents: SessionEvent[]
): Promise<ConversionResult> {
  const startTime = Date.now();

  // Default config
  const fullConfig: ConverterConfig = {
    deduplicationTimeWindow: 500,
    model: "claude-haiku-4-5",
  };

  // ============================================
  // LAYER 1: PREPROCESSING (Deterministic)
  // ============================================
  const preprocessed = preprocessEvents(
    sessionEvents,
    fullConfig.deduplicationTimeWindow
  );

  //   const preprocessStats = getPreprocessingStats(sessionEvents, preprocessed);
  //   console.log("preprocessed: ", preprocessed);
  // ============================================
  // LAYER 2-3: AGENT ANALYSIS (LLM-Powered)
  // ============================================
  const actions = await convertEventsToActions(preprocessed, fullConfig);

  // ============================================
  // LAYER 4: CODE GENERATION (Deterministic)
  // ============================================
  const initialUrl = sessionEvents[0]?.current_url || "";
  const code = generateStagehandCode(actions, initialUrl);
  const codeStats = getCodeStats(actions);

  const endTime = Date.now();

  return {
    code,
    actions,
    stats: {
      originalEvents: sessionEvents,
      deduplicatedEvents: preprocessed,
      generatedActions: actions.length,
      hasPopups: codeStats.hasPopups,
      processingTimeMs: endTime - startTime,
    },
  };
}
