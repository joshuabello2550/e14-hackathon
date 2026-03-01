import { ArrowRight, Code2, GitBranch, Sparkles } from "lucide-react";
import hedgehogIcon from "@/assets/hedgehog.png";

const HeroSection = () => {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center bg-grid px-4 pt-16">
      {/* Gradient overlay at top */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />

      {/* Orange glow behind center */}
      <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />

      <div className="relative z-10 max-w-3xl text-center">
        {/* Announcement pill */}
        <a
          href="#generate"
          className="group mb-8 inline-flex items-center gap-2 border border-border bg-secondary/50 px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
        >
          <img src={hedgehogIcon} alt="" className="h-4 w-4" />
          Turn session replays into test cases
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </a>

        <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-7xl">
          Session to test.
          <br />
          <span className="text-primary">Automatically.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed">
          Paste your PostHog session ID and we generate a Playwright test case,
          then push it straight to your GitHub repo.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href="#generate"
            className="group flex items-center gap-2 rounded-lg bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 glow-primary"
          >
            Get started
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="#how-it-works"
            className="flex items-center gap-2 rounded-lg border border-border px-8 py-3.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:border-foreground/20"
          >
            How it works
          </a>
        </div>
      </div>

      {/* Feature pills at bottom */}
      <div
        id="how-it-works"
        className="relative z-10 mt-24 grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3"
      >
        {[
          {
            icon: Code2,
            title: "Fetch session replay",
            desc: "We pull events from your PostHog session recording via the API.",
          },
          {
            icon: Sparkles,
            title: "Generate test case",
            desc: "AI transforms user interactions into a clean Playwright test.",
          },
          {
            icon: GitBranch,
            title: "Push to GitHub",
            desc: "The generated test is committed and pushed to your repo.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="border border-border bg-card/50 p-6 backdrop-blur-sm transition-colors hover:border-primary/20"
          >
            <item.icon className="mb-3 h-5 w-5 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">
              {item.title}
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
