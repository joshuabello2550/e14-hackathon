import express from "express";
import cors from "cors";
import { createFileWithGitHubApp } from "./createTestFiles";
import { sessionToStagehand } from "./api/stagehand/sessionToStagehand.ts";
import { getSessionEventsData } from "./api/posthog/sessionEventsQuery.ts";

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.post("/api/create-file", async (req, res) => {
  const { installationId, owner, repo, content } = req.body;

  try {
    await createFileWithGitHubApp({
      installationId,
      owner,
      repo,
      path: `tests/testStagehand-${Date.now()}.js`,
      content,
      message: "adding a testcase",
    });

    res.json({ success: true });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/session-events", async (req, res) => {
  const { sessionId, projectId, posthogApiKey } = req.body;

  try {
    const events = await getSessionEventsData(
      sessionId,
      projectId,
      posthogApiKey
    );
    res.json({ success: true, events });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/session-to-stagehand", async (req, res) => {
  const { sessionEvents } = req.body;

  try {
    const result = await sessionToStagehand(sessionEvents);
    res.json({ success: true, ...result });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(3001, () => {
  console.log("Backend running on port 3001");
});
