import type { ElementType, SessionEvent } from "./types";

export function chainToElements(
  chain: string,
  options: { throwOnError?: boolean } = {}
): ElementType[] {
  const elements: ElementType[] = [];

  // Below splits all elements by ;, while ignoring escaped quotes and semicolons within quotes
  const splitChainRegex = /(?:[^\s;"]|"(?:\\.|[^"])*")+/g;

  // Below splits the tag/classes from attributes
  // Needs a regex because classes can have : too
  const splitClassAttributes = /(.*?)($|:([a-zA-Z\-_0-9]*=.*))/g;
  const parseAttributesRegex = /((.*?)="((?:\\"|[^"])*)")/gm;

  chain = chain.replace(/\n/g, "");

  try {
    Array.from(chain.matchAll(splitChainRegex))
      .map((r) => r[0])
      .forEach((elString, index) => {
        const elStringSplit =
          Array.from(elString.matchAll(splitClassAttributes))[0] ?? [];
        const attributes =
          elStringSplit.length > 3 && elStringSplit[3]
            ? Array.from(elStringSplit[3].matchAll(parseAttributesRegex)).map(
                (a) => [a[2], a[3]]
              )
            : [];

        const element: ElementType = {
          attributes: {},
          order: index,
          tag_name: "",
        };

        if (elStringSplit[1]) {
          const tagAndClass = elStringSplit[1].split(".");
          element.tag_name = tagAndClass[0] ?? "";
          if (tagAndClass.length > 1) {
            element.attr_class = tagAndClass.slice(1).filter(Boolean);
          }
        }

        for (const [key, value] of attributes) {
          if (key == "href") {
            element.href = value;
          } else if (key == "nth-child") {
            element.nth_child = parseInt(value ?? "");
          } else if (key == "nth-of-type") {
            element.nth_of_type = parseInt(value ?? "");
          } else if (key == "text") {
            element.text = value;
          } else if (key == "attr_id") {
            element.attr_id = value;
          } else if (key) {
            if (!element.attributes) {
              element.attributes = {};
            }
            element.attributes[key] = value ?? "";
          }
        }
        elements.push(element);
      });
  } catch (error) {
    if (options.throwOnError) {
      throw error;
    }
  }
  return elements;
}

export function elementsToNestedHtmlString(
  elements: ElementType[],
  options?: {
    indent?: string;
    includeStyle?: boolean;
    includeValue?: boolean;
  }
): { elementsHtml: string; selectedHtml: string } {
  const indentUnit = options?.indent ?? "  ";
  const includeStyle = options?.includeStyle ?? true;
  const includeValue = options?.includeValue ?? false;

  const els = elements.reverse();
  if (!els.length) return { elementsHtml: "", selectedHtml: "" };

  const openTag = (el: ElementType): string => {
    const attrs: string[] = [];

    if (el.attr_id) attrs.push(`id="${el.attr_id}"`);
    if (el.attr_class?.length) attrs.push(`class="${el.attr_class.join(" ")}"`);

    for (const [k, v] of Object.entries(el.attributes ?? {})) {
      if (!includeStyle && k === "style") continue;
      if (!includeValue && k === "value") continue;
      if (v === undefined || v === "") continue;
      attrs.push(`${k}="${v}"`);
    }

    return `<${el.tag_name}${attrs.length ? " " + attrs.join(" ") : ""}>`;
  };

  const closeTag = (el: ElementType): string => `</${el.tag_name}>`;

  const lines: string[] = [];

  const deepestElement = els[els.length - 1]!;
  const deepestHtml = `${openTag(deepestElement)}${
    deepestElement.text ?? ""
  }${closeTag(deepestElement)}`;

  for (let i = 0; i < els.length - 1; i++) {
    const el = els[i]!;
    lines.push(`${indentUnit.repeat(i)}${openTag(el)}`);
  }
  lines.push(`${indentUnit.repeat(els.length - 1)}${deepestHtml}`);

  // close all tags in reverse with indentation
  for (let i = els.length - 2; i >= 0; i--) {
    lines.push(`${indentUnit.repeat(i)}${closeTag(els[i]!)}`);
  }

  return { elementsHtml: lines.join("\n"), selectedHtml: deepestHtml };
}

export async function getSessionEventsData(
  sessionId: string,
  projectId: string,
  posthogApiKey: string
): Promise<SessionEvent[]> {
  const POSTHOG_HOST = "https://us.posthog.com";

  const START_ISO = "2026-01-22T00:00:00.000Z";
  const END_ISO = "2026-01-22T01:00:00.000Z";

  const url = `${POSTHOG_HOST}/api/projects/${projectId}/query/`;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${posthogApiKey}`,
  };

  const payload = {
    query: {
      kind: "HogQLQuery",
      query: `
            SELECT
              uuid,
              event,
              timestamp,
              elements_chain,
              properties.$window_id,
              properties.$current_url,
              properties.$event_type,
              properties.$viewport_width,
              properties.$viewport_height,
              properties.$screen_name,
              distinct_id
            FROM events
            WHERE timestamp > toDateTime('${START_ISO}') - INTERVAL 24 HOUR
              AND timestamp < toDateTime('${END_ISO}') + INTERVAL 24 HOUR
              AND $session_id = '${sessionId}'
            ORDER BY timestamp ASC
            LIMIT 50000
          `,
    },
    name: "session_events_for_replay",
  };

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  // 👇 ONLY CHANGE: map positional rows → typed objects
  const results: SessionEvent[] = data.results.map((row: any[]) => {
    const elements = chainToElements(row[3]);
    const { elementsHtml, selectedHtml } = elementsToNestedHtmlString(elements);
    return {
      // uuid: row[0],
      event: row[1],
      timestamp: row[2],
      // elements: chainToElements(row[3]),
      elements_html: elementsHtml,
      selected_html: selectedHtml,
      window_id: row[4],
      current_url: row[5],
      event_type: row[6],
      // viewport_width: row[7],
      // viewport_height: row[8],
      // screen_name: row[9],
      // distinct_id: row[10],
    };
  });

  return results;
}
