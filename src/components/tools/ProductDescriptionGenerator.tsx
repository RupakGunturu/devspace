import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { useToolAccent } from "@/components/ToolAccentContext";
import { CopyButton } from "./CopyButton";

const CATEGORIES = ["Electronics", "Fashion", "Food", "Home", "Beauty"] as const;
const TONES = ["Professional", "Casual", "Luxury", "Playful"] as const;
const PRICE_POINTS = ["budget", "mid", "premium"] as const;

const TONE_INTROS: Record<string, string> = {
  Professional:
    "Engineered for performance and reliability, this product delivers exceptional quality that meets the highest industry standards.",
  Casual:
    "You're going to love this one! It's designed to make your everyday life a little easier and a lot more enjoyable.",
  Luxury:
    "Indulge in uncompromising elegance with this meticulously crafted masterpiece, designed for the discerning individual.",
  Playful:
    "Get ready to be obsessed! This little gem is about to become your new favorite thing \u2014 trust us on this one.",
};

const CATEGORY_HOOKS: Record<string, string> = {
  Electronics: "Packed with cutting-edge technology",
  Fashion: "Crafted with premium materials and timeless design",
  Food: "Made with carefully sourced, quality ingredients",
  Home: "Designed to elevate your living space",
  Beauty: "Formulated with skin-loving ingredients",
};

export function ProductDescriptionGenerator() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<string>("Electronics");
  const [features, setFeatures] = useState("");
  const [pricePoint, setPricePoint] = useState<string>("mid");
  const [audience, setAudience] = useState("");
  const [tone, setTone] = useState<string>("Professional");
  const [generated, setGenerated] = useState(false);
  const { color } = useToolAccent();

  const featureList = useMemo(
    () =>
      features
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
    [features],
  );

  const result = useMemo(() => {
    if (!name.trim()) return null;

    const toneLabel = tone.toLowerCase();
    const priceLabel =
      pricePoint === "budget" ? "affordable" : pricePoint === "premium" ? "premium" : "competitive";
    const audienceText = audience.trim() || "discerning customers";
    const hook = CATEGORY_HOOKS[category];
    const intro = TONE_INTROS[tone];

    const shortDesc = `${name} \u2014 ${hook.toLowerCase()}, designed for ${audienceText}. ${intro.slice(0, -1)} at a ${priceLabel} price point.`;

    const longDesc = [
      `Introducing the ${name}, a standout ${category.toLowerCase()} product built with ${audienceText} in mind. ${intro} Whether you're looking for reliability, style, or innovation, ${name} checks every box.`,
      featureList.length > 0
        ? `Featuring ${featureList.map((f, i) => (i === featureList.length - 1 ? `and ${f}` : f)).join(", ")}, this product goes beyond the ordinary. Every detail has been thoughtfully considered to provide an experience that truly stands out in the ${category.toLowerCase()} market.`
        : `Every detail has been thoughtfully considered to provide an experience that truly stands out in the ${category.toLowerCase()} market. From its sleek design to its reliable performance, this product is built to impress.`,
      `${name} is perfect for ${audienceText} who demand quality without compromise. At a ${priceLabel} price point, it offers exceptional value that\u2019s hard to find elsewhere. Join thousands of satisfied customers who have already made the switch.`,
    ].join("\n\n");

    const bullets =
      featureList.length > 0
        ? featureList.map((f) => `\u2022 ${f.charAt(0).toUpperCase() + f.slice(1)}`).join("\n")
        : `\u2022 Premium ${category.toLowerCase()} quality\n\u2022 Designed for ${audienceText}\n\u2022 ${priceLabel.charAt(0).toUpperCase() + priceLabel.slice(1)} price point\n\u2022 Satisfaction guaranteed`;

    const seoMeta = `Shop ${name} \u2014 ${featureList[0] || hook.toLowerCase()}. Designed for ${audienceText}. Free shipping on orders over $50. Order now!`;

    return { shortDesc, longDesc, bullets, seoMeta };
  }, [name, category, pricePoint, audience, tone, featureList]);

  const handleGenerate = () => {
    if (name.trim()) setGenerated(true);
  };

  const fullOutput = useMemo(() => {
    if (!result) return "";
    return [
      `SHORT DESCRIPTION:\n${result.shortDesc}`,
      `\nLONG DESCRIPTION:\n${result.longDesc}`,
      `\nBULLET-POINT FEATURES:\n${result.bullets}`,
      `\nSEO META DESCRIPTION:\n${result.seoMeta}`,
    ].join("\n");
  }, [result]);

  return (
    <ToolLayout id="product-description-generator">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Product Name
          </span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. UltraBoost Pro Headphones"
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
            style={{ borderColor: name ? color : undefined }}
          />
        </div>
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Target Audience
          </span>
          <input
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            placeholder="e.g. fitness enthusiasts"
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
            style={{ borderColor: audience ? color : undefined }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Category
          </span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Price Point
          </span>
          <select
            value={pricePoint}
            onChange={(e) => setPricePoint(e.target.value)}
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none"
          >
            {PRICE_POINTS.map((p) => (
              <option key={p} value={p}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Tone
          </span>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none"
          >
            {TONES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Key Features (comma-separated)
        </span>
        <input
          value={features}
          onChange={(e) => setFeatures(e.target.value)}
          placeholder="e.g. noise cancellation, 40hr battery, bluetooth 5.3"
          className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
          style={{ borderColor: features ? color : undefined }}
        />
      </div>

      <div>
        <ToolButton onClick={handleGenerate} disabled={!name.trim()}>
          Generate Description
        </ToolButton>
      </div>

      {generated && result && (
        <div className="space-y-4">
          <div className="rounded-md border-2 border-line bg-input-bg p-4">
            <div className="mb-1 font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Short Description
            </div>
            <p className="font-mono text-sm text-input-text">{result.shortDesc}</p>
          </div>

          <div className="rounded-md border-2 border-line bg-input-bg p-4">
            <div className="mb-2 font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Long Description
            </div>
            {result.longDesc.split("\n\n").map((para, i) => (
              <p key={i} className="mb-3 font-mono text-sm text-input-text last:mb-0">
                {para}
              </p>
            ))}
          </div>

          <div className="rounded-md border-2 border-line bg-input-bg p-4">
            <div className="mb-2 font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Bullet-Point Features
            </div>
            <pre className="font-mono text-sm text-input-text whitespace-pre-wrap">
              {result.bullets}
            </pre>
          </div>

          <div className="rounded-md border-2 border-line bg-input-bg p-4">
            <div className="mb-1 flex items-center justify-between">
              <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
                SEO Meta Description
              </span>
              <CopyButton text={result.seoMeta} />
            </div>
            <p className="font-mono text-sm text-input-text">{result.seoMeta}</p>
            <div className="mt-1 font-mono text-xs text-muted">
              {result.seoMeta.length} / 160 characters
            </div>
          </div>

          <div className="rounded-md border-2 border-line bg-input-bg p-4">
            <div className="mb-1 flex items-center justify-between">
              <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
                Full Output
              </span>
              <CopyButton text={fullOutput} />
            </div>
            <pre className="max-h-[300px] overflow-auto font-mono text-sm text-input-text whitespace-pre-wrap">
              {fullOutput}
            </pre>
          </div>
        </div>
      )}

      {!generated && (
        <div className="rounded-md border-2 border-dashed border-line p-8 text-center font-mono text-sm text-muted">
          Fill in product details and click Generate to create your description
        </div>
      )}
    </ToolLayout>
  );
}
