import { Link } from "react-router-dom";
import { useEffect } from "react";

const SECTIONS = [
  {
    title: "1. What we collect",
    body: [
      "DevSpace is built to run entirely in your browser. Most tools never send your data anywhere.",
      "If you sign in, we store your Google account name and email so we can save things like your bookmarks and activity history. If you don't sign in, we don't have an account for you at all.",
      "Things like your theme preference and saved game progress are kept in your browser's local storage and never leave your device.",
    ],
  },
  {
    title: "2. Cookies & local storage",
    body: [
      "We don't use advertising cookies or tracking cookies. We use local storage for small things like your theme choice, and an optional auth token (kept on your device) if you sign in.",
      "You can clear this at any time from your browser's site settings.",
    ],
  },
  {
    title: "3. Third-party services",
    body: [
      "Sign in uses Google Identity Services, which handles the OAuth handshake according to Google's own privacy policy.",
      "Some tools may call public third-party APIs (for example, IP lookup or WHOIS). Those requests go directly from your browser to the provider.",
      "We load fonts from our own bundle, so no external font services track you.",
    ],
  },
  {
    title: "4. External links",
    body: [
      "Tools and content may link to external websites, including the 'Learn by Playing' section on the Cheat Sheets page, which lists community-curated learning resources that we don't control or own.",
      "Those links open in a new tab and are not tracked by us. We're not responsible for the privacy practices, content, or availability of those external sites.",
    ],
  },
  {
    title: "5. Changes to this policy",
    body: [
      "If this policy changes, we'll update this page. Since DevSpace is a student project, the most accurate description of our data handling is always this: we keep as little as possible.",
    ],
  },
  {
    title: "6. Contact",
    body: [
      "Questions about privacy? Reach out through the GitHub repo linked on this site — issues and pull requests are welcome.",
    ],
  },
];

export default function PrivacyPolicy() {
  useEffect(() => {
    document.title = "Privacy Policy — DevSpace";
  }, []);

  return (
    <section className="mx-auto max-w-3xl px-6 py-16 sm:px-8 sm:py-24">
      <div className="mb-4 font-mono text-xs uppercase tracking-widest text-coral">
        ▸ privacy policy
      </div>
      <h1 className="font-display text-4xl font-extrabold leading-tight sm:text-5xl">
        Privacy Policy
      </h1>
      <p className="mt-3 font-mono text-sm text-muted">Last updated: August 2026</p>

      <div className="mt-10 space-y-8">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <h2 className="font-display text-xl font-bold text-foreground">{section.title}</h2>
            <div className="mt-2 space-y-3 text-muted">
              {section.body.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-12 border-t-2 border-dashed border-line pt-6 text-sm text-muted">
        <Link to="/" className="text-yellow no-underline">
          Back to DevSpace
        </Link>
      </p>
    </section>
  );
}
