import posthog from "posthog-js";

export function usePostHog() {
  posthog.init(import.meta.env.VITE_POSTHOG_API_KEY, {
    api_host: "https://us.i.posthog.com",
    defaults: "2026-01-30",
  });

  return { posthog };
}
