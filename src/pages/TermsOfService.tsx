import { Link } from "react-router-dom";
import { useEffect } from "react";

const SECTIONS = [
  {
    title: "1. Acceptance of terms",
    body: [
      "By using DevSpace you agree to these terms. If you don't agree, don't use the site. These are kept short and human-readable on purpose.",
    ],
  },
  {
    title: "2. The service",
    body: [
      "DevSpace is a free, student-built platform offering browser-based developer tools, learning games, and written content. There are no accounts required to use the tools, no paywalls, and no subscriptions.",
      "You're free to use everything for personal or educational purposes.",
    ],
  },
  {
    title: "3. Accounts & saved data",
    body: [
      "Sign in (via Google) lets you save bookmarks and activity history. You're responsible for keeping your account credentials safe. You can delete your saved data at any time from your profile.",
    ],
  },
  {
    title: "4. User content",
    body: [
      "Anything you save to your account — bookmarks, game progress, activity — belongs to you. We only use it to provide the features you asked for.",
    ],
  },
  {
    title: "5. No warranties",
    body: [
      "DevSpace is provided 'as is' and 'as available'. A student builds it in spare time, so some tools might be buggy, incomplete, or occasionally wrong. Don't rely on tool output for anything life-or-death.",
    ],
  },
  {
    title: "6. Limitation of liability",
    body: [
      "To the maximum extent permitted by law, DevSpace isn't liable for any damages arising from your use of the site — including decisions made based on tool output.",
    ],
  },
  {
    title: "7. External resources",
    body: [
      "The 'Learn by Playing' section on the Cheat Sheets page lists learning resources created and owned by third parties. DevSpace simply gathers and links to them for students — they're not built by us.",
      "We're not affiliated with, and don't endorse, these projects. Their content, terms, and availability are their own responsibility. Links open in a new tab so it's always clear you're leaving DevSpace.",
    ],
  },
  {
    title: "8. Changes to these terms",
    body: [
      "We may update these terms as the project evolves. Continued use of the site after changes means you accept the updated terms.",
    ],
  },
  {
    title: "9. Contact",
    body: ["Questions about these terms? Reach out through the GitHub repo linked on this site."],
  },
];

export default function TermsOfService() {
  useEffect(() => {
    document.title = "Terms of Service — DevSpace";
  }, []);

  return (
    <section className="mx-auto max-w-3xl px-6 py-16 sm:px-8 sm:py-24">
      <div className="mb-4 font-mono text-xs uppercase tracking-widest text-coral">
        ▸ terms of service
      </div>
      <h1 className="font-display text-4xl font-extrabold leading-tight sm:text-5xl">
        Terms of Service
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
