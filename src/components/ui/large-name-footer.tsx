"use client";
import { Link } from "react-router-dom";

import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";

function Footer() {
  return (
    <footer className="pt-12 pb-0 px-4 md:px-6 bg-background">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-8 md:mb-0">
            <Link to="/" className="flex items-center gap-2">
              <Icons.logo className="icon-class w-8 text-foreground" />
              <h2 className="text-lg font-bold font-display text-foreground">
                dev<span className="text-yellow">/</span>space
              </h2>
            </Link>

            <h1 className="text-muted mt-4 text-sm">
              Built by a Student, For Students & Developers
            </h1>
            <div className="mt-2">
              <Link to="https://x.com/compose/tweet?text=I%27ve%20been%20using%20%23DevSpace%20%E2%80%94%20free%20dev%20tools%2C%20games%20%26%20tips%20for%20coders!">
                <Button variant="secondary">
                  Share DevSpace
                  <Icons.twitter className="icon-class ml-1 w-3.5" />
                </Button>
              </Link>
            </div>
            <p className="text-sm text-muted mt-5">
              &copy; {new Date().getFullYear()} dev<span className="text-yellow">/</span>space. All rights reserved.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
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
                  <Link to="/cheat-sheets" className="text-muted hover:text-foreground transition-colors">
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
              <h3 className="font-semibold mb-4 text-foreground">Socials</h3>
              <ul className="space-y-2">
                <li>
                  <a href="https://github.com/arihantcodes/spectrum-ui" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-foreground transition-colors">
                    Github
                  </a>
                </li>
                <li>
                  <a href="https://www.linkedin.com/in/arihantcodes" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-foreground transition-colors">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="https://x.com/arihantcodes" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-foreground transition-colors">
                    X
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-foreground">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/privacy-policy" className="text-muted hover:text-foreground transition-colors">
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
        <div className="w-full overflow-hidden h-[4em] md:h-[5em] lg:h-[7em] flex items-start justify-center">
          <h1 className="text-center text-5xl md:text-7xl lg:text-[12rem] font-display font-extrabold select-none tracking-[0.12em] leading-[0.85]">
            <span className="text-foreground">dev</span>
            <span className="text-yellow mx-2 md:mx-4">/</span>
            <span className="text-foreground">space</span>
          </h1>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
