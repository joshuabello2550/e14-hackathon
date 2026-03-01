import { Github, Twitter } from "lucide-react";
import hedgehogIcon from "@/assets/hedgehog.png";

const footerLinks = {
  Product: [
    { label: "How it works", href: "#how-it-works" },
    { label: "Generate test", href: "#generate" },
    { label: "Pricing", href: "#" },
    { label: "Changelog", href: "#" },
  ],
  Developers: [
    { label: "Documentation", href: "#" },
    { label: "API Reference", href: "#" },
    { label: "GitHub", href: "https://github.com" },
    { label: "Examples", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
};

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container py-16">
        {/* Top section: logo + columns */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-6">
          {/* Logo column */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <img src={hedgehogIcon} alt="TestHog" className="h-7 w-7" />
              <span className="font-semibold text-lg tracking-tight text-foreground">
                TestHog
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Turn PostHog session replays into Playwright test cases.
              Automatically.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center border border-border text-muted-foreground transition-colors hover:text-foreground hover:border-foreground/20"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center border border-border text-muted-foreground transition-colors hover:text-foreground hover:border-foreground/20"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-4">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} TestHog. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with PostHog, Playwright & GitHub
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
