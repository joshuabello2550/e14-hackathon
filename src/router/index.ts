import { createRouter, createWebHistory } from "vue-router";
import { usePostHog } from "@/composables/usePostHog";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [],
});

const { posthog } = usePostHog();

export default router;
