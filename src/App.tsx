import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

const BASE_URL = "http://localhost:3001";

const App = () => {
  const [sessionId, setSessionId] = useState(
    import.meta.env.VITE_POSTHOG_TEST_SESSION_ID || ""
  );
  const [projectId, setProjectId] = useState(
    import.meta.env.VITE_POSTHOG_TEST_PROJECT_ID || ""
  );
  const [posthogApiKey, setPosthogApiKey] = useState(
    import.meta.env.VITE_POSTHOG_TEST_API_KEY || ""
  );

  const handleSubmit = async () => {
    // Step 1: Fetch session events
    const eventsRes = await fetch(`${BASE_URL}/api/session-events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, projectId, posthogApiKey }),
    });
    const { events } = await eventsRes.json();
    console.log("events: ", events);

    // Step 2: Convert events to Stagehand code
    const stagehandRes = await fetch(`${BASE_URL}/api/session-to-stagehand`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionEvents: events }),
    });
    const { code } = await stagehandRes.json();
    console.log("generated code: ", code);

    // // Step 3: Create the file in GitHub
    // await fetch(`${BASE_URL}/api/create-file`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ content: code }),
    // });
  };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <input
            type="text"
            placeholder="Session ID"
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
          />
          <input
            type="text"
            placeholder="Project ID"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
          />
          <input
            type="text"
            placeholder="PostHog API Key"
            value={posthogApiKey}
            onChange={(e) => setPosthogApiKey(e.target.value)}
          />
        </div>
        <button onClick={handleSubmit}>Submit</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
};

export default App;
