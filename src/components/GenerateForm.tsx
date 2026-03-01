import { ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";

const GenerateForm = () => {
  const [sessionId, setSessionId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [posthogApiKey, setPosthogApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "generating" | "success" | "error"
  >("idle");
  const [fileTimestamp, setFileTimestamp] = useState<number | null>(null);

  // CORE LOGIC: Generate test case and push to GitHub
  const generateTestCase = async () => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const installationId = 113203245;
    const owner = "joshuabello2550";
    const repo = "e14-hackathon";

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

    // Step 3: Create the file in GitHub
    const res = await fetch(`${BASE_URL}/api/create-file`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ installationId, owner, repo, content: code }),
    });
    console.log("create file response: ", await res.json());
    const { timestamp } = await res.json();
    setFileTimestamp(timestamp);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionId || !projectId || !posthogApiKey) return;

    setIsLoading(true);
    setStatus("generating");

    await generateTestCase();

    // Simulate generation process
    await new Promise((resolve) => setTimeout(resolve, 2500));
    setStatus("success");
    setIsLoading(false);
  };

  const inputClasses =
    "w-full rounded-lg border border-border bg-secondary/50 px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 input-glow transition-all";

  return (
    <section id="generate" className="relative py-24">
      <div className="container max-w-2xl">
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 border border-border bg-secondary/50 px-4 py-1.5 text-xs font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />
            Powered by PostHog Session Replay
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Generate a test case
          </h2>
          <p className="mt-3 text-muted-foreground">
            Enter your session details below and we'll generate a test case and
            push it to GitHub.
          </p>
        </div>

        <form onSubmit={handleGenerate} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Session ID
            </label>
            <input
              type="text"
              placeholder="e.g. 018f3a2b-4c5d-7e8f-9a0b-1c2d3e4f5a6b"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              className={inputClasses}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Project ID
            </label>
            <input
              type="text"
              placeholder="e.g. 12345"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className={inputClasses}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              PostHog API Key
            </label>
            <input
              type="password"
              placeholder="phx_..."
              value={posthogApiKey}
              onChange={(e) => setPosthogApiKey(e.target.value)}
              className={inputClasses}
              required
            />
            <p className="text-xs text-muted-foreground">
              Your personal API key from PostHog → Settings → Personal API Keys
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading || !sessionId || !projectId || !posthogApiKey}
            className="group flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed glow-primary"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating test case...
              </>
            ) : (
              <>
                Generate & Push to GitHub
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </form>

        {status === "success" && (
          <div className="mt-6 rounded-lg border border-primary/20 bg-primary/5 p-4 animate-fade-in-up">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary text-xs">✓</span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Test case generated successfully!
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Your test has been pushed to{" "}
                  <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-primary">
                    tests/testStagehand-{fileTimestamp}.js
                  </code>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default GenerateForm;
