<script setup lang="ts">
import { ref } from "vue";
import { getSessionEventsData } from "../api/sessionEventsData";
import { onMounted } from "vue"

defineProps<{ msg: string }>();

const sessionId = ref("");
const postHogApiKey = ref("");
const submitted = ref(false);
const projectId = ref("");

function handleSubmit() {
  console.log("Session ID:", sessionId.value);
  console.log("PostHog API Key:", postHogApiKey.value);
  console.log("Project ID:", projectId.value);
  submitted.value = true;
}

onMounted(async () => {
  const data = await getSessionEventsData(sessionId.value, projectId.value, postHogApiKey.value)
  console.log("Session Events Data:", data)
})
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <form @submit.prevent="handleSubmit">
      <div class="field">
        <label for="session-id">Session ID</label>
        <input
          id="session-id"
          v-model="sessionId"
          type="text"
          placeholder="Enter session ID"
        />
      </div>
      <div class="field">
        <label for="posthog-key">PostHog API Key</label>
        <input
          id="posthog-key"
          v-model="postHogApiKey"
          type="text"
          placeholder="Enter PostHog API key"
        />
      </div>
       <div class="field">
        <label for="project-id">Project Id</label>
        <input
          id="project-id"
          v-model="projectId"
          type="text"
          placeholder="Enter Project ID"
        />
      </div>
      <button type="submit">Submit</button>
    </form>

    <div v-if="submitted" class="output">
      <p><strong>Session ID:</strong> {{ sessionId }}</p>
      <p><strong>PostHog API Key:</strong> {{ postHogApiKey }}</p>
    </div>
  </div>
</template>

<style scoped>
.card {
  max-width: 400px;
  margin: 0 auto;
}

.field {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  text-align: left;
}

.field label {
  margin-bottom: 0.25rem;
  font-weight: 600;
}

.field input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

button[type="submit"] {
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
}

.output {
  margin-top: 1.5rem;
  padding: 1rem;
  background: #f4f4f4;
  border-radius: 4px;
  text-align: left;
}
</style>
