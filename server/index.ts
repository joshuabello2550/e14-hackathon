import express from "express";
import cors from "cors";
import { createFileWithGitHubApp } from "./createTestFiles";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/create-file", async (req, res) => {
  const { installationId, owner, repo, content } = req.body;

  try {
    await createFileWithGitHubApp({
      installationId,
      owner,
      repo,
      path: "./tests/test.txt",
      content,
      message: "Auto commit",
    });

    res.json({ success: true });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(3001, () => {
  console.log("Backend running on port 3001");
});
