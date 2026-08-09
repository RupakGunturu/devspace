"use client";
import { Link } from "react-router-dom";

import SocialButton from "@/components/ui/social-button";

function Footer() {
  return (
    <footer className="pt-12 pb-0 px-4 md:px-6 bg-background">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-8 md:mb-0">
            <Link
              to="/"
              className="flex items-center gap-2 font-display text-xl font-extrabold text-foreground no-underline"
            >
              <img
                src="/favicon.png"
                alt=""
                aria-hidden="true"
                className="h-5 w-5 object-contain"
              />
              <span>
                dev<span className="text-yellow">/</span>space
              </span>
            </Link>

            <h1 className="text-muted mt-4 text-sm">
              Built by a Student, For Students & Developers
            </h1>
            <div className="mt-4">
              <SocialButton
                label="Share DevSpace"
                onShare={(_, item) => {
                  const url = window.location.href;
                  if (item.label === "Share on Twitter") {
                    window.open(
                      `https://x.com/intent/tweet?text=${encodeURIComponent("I've been using #DevSpace — free dev tools, games & tips for coders!")}&url=${encodeURIComponent(url)}`,
                      "_blank",
                      "noopener,noreferrer",
                    );
                  } else if (item.label === "Share on LinkedIn") {
                    window.open(
                      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
                      "_blank",
                      "noopener,noreferrer",
                    );
                  } else {
                    navigator.clipboard.writeText(url).catch(() => {});
                  }
                }}
              />
            </div>
            <p className="text-sm text-muted mt-5">
              &copy; {new Date().getFullYear()} dev<span className="text-yellow">/</span>space. All
              rights reserved.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-4 text-foreground">Pages</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/tools" className="text-muted hover:text-foreground transition-colors">
                    Tools
                  </Link>
                </li>
                <li>
                  <Link to="/games" className="text-muted hover:text-foreground transition-colors">
                    Games
                  </Link>
                </li>
                <li>
                  <Link
                    to="/cheat-sheets"
                    className="text-muted hover:text-foreground transition-colors"
                  >
                    Cheat Sheets
                  </Link>
                </li>
                <li>
                  <Link to="/tips" className="text-muted hover:text-foreground transition-colors">
                    Tips
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-muted hover:text-foreground transition-colors">
                    About
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-foreground">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/privacy-policy"
                    className="text-muted hover:text-foreground transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/tos" className="text-muted hover:text-foreground transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-6 w-full overflow-hidden h-[5.5em] md:h-[6em] lg:h-[8em] flex items-start justify-center">
          <h1 className="text-center text-[13vw] sm:text-6xl md:text-8xl lg:text-[13rem] font-display font-extrabold select-none tracking-[0.12em] leading-[0.85] text-muted/40">
            <span>dev</span>
            <span className="text-yellow/40 mx-2 md:mx-4">/</span>
            <span>space</span>
          </h1>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
