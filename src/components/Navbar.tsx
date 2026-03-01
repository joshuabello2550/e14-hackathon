import { ArrowRight, Github } from "lucide-react";
import hedgehogIcon from "@/assets/hedgehog.png";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img src={hedgehogIcon} alt="TestHog" className="h-7 w-7" />
          <span className="font-semibold text-lg tracking-tight text-foreground">
            TestHog
          </span>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground hover:border-foreground/20"
          >
            <Github className="h-4 w-4" />
            GitHub
          </a>
          <a
            href="#generate"
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:brightness-110"
          >
            Get Started
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
