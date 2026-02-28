import { useState } from "react";
import "./App.css";
import { getSessionEventsData } from "./api/sessionEventsQuery";
import { usePostHog } from "@posthog/react";

const handleSubmit = async (
  projectId: string,
  sessionId: string,
  apiKey: string
) => {
  console.log("Project ID:", projectId);
  console.log("Session ID:", sessionId);
  console.log("API Key:", apiKey);

  const events = await getSessionEventsData(sessionId, projectId, apiKey);
  console.log("Session Events:", events);
};

const App = () => {
  const [projectId, setProjectId] = useState(
    import.meta.env.VITE_POSTHOG_TEST_PROJECT_ID || ""
  );
  const [sessionId, setSessionId] = useState(
    import.meta.env.VITE_POSTHOG_TEST_SESSION_ID || ""
  );
  const [apiKey, setApiKey] = useState(
    import.meta.env.VITE_POSTHOG_TEST_API_KEY || ""
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(projectId, sessionId, apiKey);
  };

  return (
    <form
      onSubmit={onSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        maxWidth: "400px",
        margin: "2rem auto",
      }}
    >
      <label>
        Project ID
        <input
          type="text"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          placeholder="Enter project ID"
        />
      </label>
      <label>
        Session ID
        <input
          type="text"
          value={sessionId}
          onChange={(e) => setSessionId(e.target.value)}
          placeholder="Enter session ID"
        />
      </label>
      <label>
        API Key
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter API key"
        />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};

export default App;
