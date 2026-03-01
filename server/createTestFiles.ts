import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";
import fs from "fs";

export const createFileWithGitHubApp = async ({
  installationId,
  owner,
  repo,
  path,
  content,
  message,
}: {
  installationId: number;
  owner: string;
  repo: string;
  path: string;
  content: string;
  message: string;
}) => {
  const privateKey = fs.readFileSync("github-app-private-key.pem", "utf8");
  console.log("process.env.GITHUB_APP_ID", process.env.GITHUB_APP_ID);

  const octokit = new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: process.env.GITHUB_APP_ID!,
      privateKey: privateKey,
      installationId,
    },
  });

  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    message,
    content: Buffer.from(content).toString("base64"),
    branch: "main",
  });

  return { success: true };
};
