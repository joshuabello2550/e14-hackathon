import { generateText, Output } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import type { StagehandAction, ConverterConfig } from "./stagehand.types";
import type { SessionEvent } from "../posthog/posthog.types";

/**
 * System prompt for the agent
 */
const SYSTEM_PROMPT = `You are an expert at analyzing user session events and converting them to Stagehand test actions.

Key principles:
1. **selected_html might be wrong** - it often points to a child element (like <span> inside <button>)
2. **Look at elements_html for parent elements** - buttons, links, inputs are what users interact with
3. **Use natural language descriptions** - "the 'Sign in with Google' button" not "button[id='google-signin']"
4. **Be specific** - Include visible text when available

Common patterns:
- <span>/<div> clicked → Look for parent <button>/<a> in elements_html
- Icon clicked → Look for button/link containing the icon
- Empty text → Check parent elements for meaningful labels`;

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY, // or your key directly
});

/**
 * Convert a single event to a Stagehand action
 */
export async function convertEventToAction(
  event: SessionEvent,
  eventIndex: number,
  allEvents: SessionEvent[],
  config: ConverterConfig
): Promise<StagehandAction> {
  // Get surrounding context (2 events before, 2 after)
  const contextStart = Math.max(0, eventIndex - 2);
  const contextEnd = Math.min(allEvents.length, eventIndex + 3);
  const contextEvents = allEvents.slice(contextStart, contextEnd);

  try {
    const result = await generateText({
      model: anthropic(config.model),
      system: SYSTEM_PROMPT,
      output: Output.object({
        schema: z.object({
          action: z
            .enum(["click", "fill", "select", "navigate"])
            .describe("Type of action to perform"),
          target: z
            .string()
            .describe(
              "Natural language description for Stagehand (e.g., 'the Sign in with Google button')"
            ),
          value: z
            .string()
            .optional()
            .describe("Value for fill/select actions"),
        }),
      }),
      prompt: `Analyze this event and convert it to a Stagehand action.

Current event (index ${eventIndex}):
- Type: ${event.event_type}
- Selected HTML: ${event.selected_html || "(empty)"}
- Elements HTML: ${event.elements_html || "(empty)"}
- URL: ${event.current_url}
- Window ID: ${event.window_id}

Context (surrounding events):
${contextEvents
  .map((e, i) => {
    const idx = contextStart + i;
    const marker = idx === eventIndex ? "→ " : "  ";
    return `${marker}[${idx}] ${e.event_type} - ${
      e.elements_html || "(empty)"
    }`;
  })
  .join("\n")}

Tasks:
1. Determine the actual interactive element (check if selected_html is a child, look at elements_html for parent)
2. Generate a natural language description for Stagehand`,
    });

    const action: StagehandAction = {
      ...result.output,
      originalEventIndex: eventIndex,
    };
    // console.log("action: ", action);

    return action;
  } catch (error) {
    console.error(`Failed to convert event ${eventIndex}:`, error);

    // Fallback: create basic action
    return {
      action: getBasicActionType(event),
      target: extractBasicTarget(event),
      originalEventIndex: eventIndex,
      reasoning: "Fallback action (agent failed)",
    };
  }
}

/**
 * Convert all events to actions
 */
export async function convertEventsToActions(
  events: SessionEvent[],
  config: ConverterConfig
): Promise<StagehandAction[]> {
  const actions = await Promise.all(
    events.map((event, i) => convertEventToAction(event, i, events, config))
  );

  return actions;
}

/**
 * Get basic action type as fallback
 */
function getBasicActionType(event: SessionEvent): StagehandAction["action"] {
  if (event.event_type === "click") return "click";
  if (event.event_type === "change") return "fill";
  if (event.event_type === "submit") return "click";
  if (event.event === "$pageview") return "navigate";
  return "click";
}

/**
 * Extract basic target as fallback
 */
function extractBasicTarget(event: SessionEvent): string {
  // Try to extract text from selected_html
  const htmlText = event.selected_html?.replace(/<[^>]*>/g, "").trim();

  if (htmlText && htmlText.length > 0 && htmlText.length < 50) {
    return `the '${htmlText}' element`;
  }

  return "the element";
}
