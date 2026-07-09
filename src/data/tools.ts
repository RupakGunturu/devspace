export type Tool = {
  slug: string;
  name: string;
  icon: string;
  tagline: string;
  description: string;
};

export const TOOLS: Tool[] = [
  { slug: "json-formatter", name: "JSON Formatter", icon: "🧩", tagline: "Validate & prettify instantly, no server round-trip.", description: "Paste JSON, get it formatted or catch the exact error location — everything runs in your browser." },
  { slug: "regex-tester", name: "Regex Tester", icon: "🔎", tagline: "Test patterns and see every match.", description: "Try patterns with flags, see live matches highlighted, and inspect capture groups." },
  { slug: "contrast-checker", name: "Contrast Checker", icon: "🎨", tagline: "WCAG-compliant color pair validator.", description: "Enter two colors, get the contrast ratio and AA/AAA verdict for normal and large text." },
  { slug: "markdown-previewer", name: "Markdown Previewer", icon: "📝", tagline: "Split-pane markdown, live-rendered.", description: "Type on the left, see the rendered output on the right. Sanitized and safe." },
  { slug: "base64-url-codec", name: "Base64 / URL Codec", icon: "🔁", tagline: "Encode and decode without a shell.", description: "Base64 encode/decode and URL encode/decode side by side." },
  { slug: "uuid-hash", name: "UUID & Hash Generator", icon: "🔐", tagline: "Generate UUIDs and hashes client-side.", description: "Generate v4 UUIDs and SHA-1/256/512 hashes for any input, all in the browser." },
];

export const toolBySlug = (slug: string) => TOOLS.find((t) => t.slug === slug);
