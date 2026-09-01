import { useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { CopyButton } from "./CopyButton";

const STYLES: Record<string, { heading: string; body: string; label: string }> = {
  Professional: { heading: "Playfair Display", body: "Source Sans Pro", label: "Professional" },
  Playful: { heading: "Fredoka One", body: "Nunito", label: "Playful" },
  Modern: { heading: "Space Grotesk", body: "Inter", label: "Modern" },
  Elegant: { heading: "Cormorant Garamond", body: "Lato", label: "Elegant" },
  Minimalist: { heading: "IBM Plex Sans", body: "IBM Plex Mono", label: "Minimalist" },
  Bold: { heading: "Archivo Black", body: "Roboto", label: "Bold" },
};

function getCSSImport(style: string) {
  const s = STYLES[style];
  if (!s) return "";
  return `/* Fonts are self-hosted via fontsource */\n/* Import in your CSS: */\n/* @import '@fontsource/${s.heading.toLowerCase().replace(/ /g, "-")}'; */\n/* @import '@fontsource/${s.body.toLowerCase().replace(/ /g, "-")}'; */\n\n/* CSS */\nbody {\n  font-family: '${s.body}', sans-serif;\n}\nh1, h2, h3 {\n  font-family: '${s.heading}', serif;\n}`;
}

export function TypographyPairer() {
  const [selected, setSelected] = useState("Professional");

  const styles = Object.keys(STYLES);
  const current = STYLES[selected];

  return (
    <ToolLayout id="typography-pairer">
      <div className="flex flex-wrap gap-2">
        {styles.map((s) => (
          <button
            key={s}
            onClick={() => setSelected(s)}
            className="rounded-full border-2 px-3 py-1.5 font-mono text-xs font-medium transition-all"
            style={{
              borderColor: selected === s ? "var(--foreground)" : "var(--border)",
              backgroundColor: selected === s ? "var(--foreground)" : undefined,
              color: selected === s ? "var(--background)" : undefined,
            }}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="rounded-md border-2 border-line bg-input-bg p-6">
        <h1
          className="mb-3 text-3xl font-bold text-foreground"
          style={{ fontFamily: `'${current.heading}', serif` }}
        >
          The Quick Brown Fox
        </h1>
        <h2
          className="mb-3 text-xl font-semibold text-foreground"
          style={{ fontFamily: `'${current.heading}', serif` }}
        >
          Jumped Over the Lazy Dog
        </h2>
        <p
          className="text-sm leading-relaxed text-muted"
          style={{ fontFamily: `'${current.body}', sans-serif` }}
        >
          Typography is the art and technique of arranging type to make written language legible,
          readable, and appealing when displayed. Good typography enhances the user experience and
          creates visual hierarchy that guides the reader's eye naturally through content.
        </p>
        <p
          className="mt-3 text-sm leading-relaxed text-muted"
          style={{ fontFamily: `'${current.body}', sans-serif` }}
        >
          AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-muted">
            Heading: <strong>{current.heading}</strong> | Body: <strong>{current.body}</strong>
          </span>
          <CopyButton text={getCSSImport(selected)} />
        </div>
        <pre className="max-h-[200px] overflow-auto rounded-md border-2 border-line bg-input-bg p-3 font-mono text-xs text-foreground">
          {getCSSImport(selected)}
        </pre>
      </div>
    </ToolLayout>
  );
}
