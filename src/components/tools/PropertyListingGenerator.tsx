import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { useToolAccent } from "@/components/ToolAccentContext";
import { CopyButton } from "./CopyButton";

const PROPERTY_TYPES = ["Single Family Home", "Condo", "Townhouse", "Apartment", "Multi-Family", "Land", "Commercial"] as const;
const PRICE_POINTS = ["Budget-Friendly", "Mid-Range", "Premium", "Luxury"] as const;

export function PropertyListingGenerator() {
  const [propType, setPropType] = useState<string>("Single Family Home");
  const [bedrooms, setBedrooms] = useState("3");
  const [bathrooms, setBathrooms] = useState("2");
  const [sqft, setSqft] = useState("1800");
  const [features, setFeatures] = useState("");
  const [location, setLocation] = useState("");
  const [pricePoint, setPricePoint] = useState<string>("Mid-Range");
  const [generated, setGenerated] = useState(false);
  const { color } = useToolAccent();

  const featureList = useMemo(
    () => features.split(",").map((f) => f.trim()).filter(Boolean),
    [features]
  );

  const result = useMemo(() => {
    const bed = parseInt(bedrooms) || 0;
    const bath = parseInt(bathrooms) || 0;
    const area = parseInt(sqft) || 0;
    const loc = location.trim() || "this desirable neighborhood";
    const priceDesc = pricePoint.toLowerCase();

    const headlines: Record<string, string[]> = {
      "Single Family Home": [
        `Stunning ${bed}-Bedroom ${propType} in ${loc}`,
        `Your Dream ${bed}BR/${bath}BA Home Awaits in ${loc}`,
        `Exquisite ${area.toLocaleString()} Sq Ft ${propType} — ${loc}`,
      ],
      Condo: [
        `Modern ${bed}-Bedroom Condo in the Heart of ${loc}`,
        `Luxury Living: ${bed}BR/${bath}BA Condo in ${loc}`,
        `Sleek ${area.toLocaleString()} Sq Ft Condo — ${loc}`,
      ],
      Townhouse: [
        `Contemporary ${bed}-Bedroom Townhouse in ${loc}`,
        `Elegant ${bed}BR/${bath}BA Townhome — ${loc}`,
        `Stylish Townhouse Living in ${loc}`,
      ],
      Apartment: [
        `Spacious ${bed}-Bedroom Apartment in ${loc}`,
        `${bed}BR/${bath}BA Apartment — ${loc}`,
        `Bright & Airy ${area.toLocaleString()} Sq Ft Apartment`,
      ],
      default: [
        `${propType} in ${loc} — ${bed}BR/${bath}BA`,
        `Exceptional ${propType} Opportunity in ${loc}`,
        `${area.toLocaleString()} Sq Ft ${propType} — ${loc}`,
      ],
    };

    const headlineOptions = headlines[propType] || headlines.default;
    const headline = headlineOptions[0];

    const introPool = [
      `Welcome to this ${priceDesc} ${propType.toLowerCase()} that perfectly blends modern living with timeless appeal.`,
      `Discover the perfect home in this beautifully designed ${propType.toLowerCase()} located in ${loc}.`,
      `This exceptional ${propType.toLowerCase()} offers the ideal combination of comfort, style, and location.`,
    ];

    const bodyPool = [
      `Featuring ${bed} generously sized bedroom${bed !== 1 ? "s" : ""} and ${bath} well-appointed bathroom${bath !== 1 ? "s" : ""}, this ${area.toLocaleString()}-square-foot ${propType.toLowerCase()} provides ample space for comfortable living. The open floor plan creates a seamless flow between living areas, making it perfect for both everyday living and entertaining guests.`,
      `With ${bed} bedroom${bed !== 1 ? "s" : ""}, ${bath} bathroom${bath !== 1 ? "s" : ""}, and ${area.toLocaleString()} square feet of thoughtfully designed space, this ${propType.toLowerCase()} offers a lifestyle of comfort and convenience. Every detail has been carefully considered to create a home that is both functional and beautiful.`,
    ];

    const featuresText = featureList.length > 0
      ? `Standout features include: ${featureList.join(", ")}. These premium features elevate this ${propType.toLowerCase()} beyond the ordinary, providing an exceptional living experience.`
      : `This ${priceDesc} ${propType.toLowerCase()} includes quality finishes throughout, modern appliances, and energy-efficient systems that reduce utility costs while maximizing comfort.`;

    const locationText = loc !== "this desirable neighborhood"
      ? `Located in ${loc}, you'll enjoy convenient access to shopping, dining, parks, and top-rated schools. The neighborhood offers a welcoming community atmosphere while maintaining easy access to major transportation routes.`
      : `The property is situated in a highly sought-after area with excellent amenities nearby. From parks and recreation to shopping and dining, everything you need is just moments away. This location combines suburban tranquility with urban convenience.`;

    const closingPool = [
      `This ${priceDesc} ${propType.toLowerCase()} represents an outstanding opportunity to own in ${loc}. Schedule your private showing today and experience everything this remarkable home has to offer.`,
      `Don't miss this opportunity to make this ${propType.toLowerCase()} your new home. Contact us today to arrange a viewing and see for yourself why this property stands out in the ${loc} market.`,
    ];

    const headlineText = headline;
    const description = [
      introPool[Math.floor(Math.random() * introPool.length)],
      bodyPool[Math.floor(Math.random() * bodyPool.length)],
      featuresText,
      locationText,
      closingPool[Math.floor(Math.random() * closingPool.length)],
    ].join("\n\n");

    const keyFeatures = featureList.length > 0
      ? featureList
      : [
          `${bed} bedrooms, ${bath} bathrooms`,
          `${area.toLocaleString()} sq ft living space`,
          "Modern kitchen with updated appliances",
          "Spacious living and dining areas",
          "Convenient location in " + loc,
          "Energy-efficient features",
        ];

    const neighborhoodHighlights = [
      "Top-rated schools nearby",
      "Shopping and dining within minutes",
      "Public transportation access",
      "Parks and recreational facilities",
      "Low crime rate area",
      "Strong property value appreciation",
    ];

    return { headlineText, description, keyFeatures, neighborhoodHighlights };
  }, [propType, bedrooms, bathrooms, sqft, features, location, pricePoint, featureList]);

  const handleGenerate = () => setGenerated(true);

  const fullText = useMemo(() => {
    if (!result) return "";
    return [
      `HEADLINE:\n${result.headlineText}`,
      `\nDESCRIPTION:\n${result.description}`,
      `\nKEY FEATURES:\n${result.keyFeatures.map((f) => `\u2022 ${f}`).join("\n")}`,
      `\nNEIGHBORHOOD HIGHLIGHTS:\n${result.neighborhoodHighlights.map((h) => `\u2022 ${h}`).join("\n")}`,
    ].join("\n");
  }, [result]);

  return (
    <ToolLayout id="property-listing-generator">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">Property Type</span>
          <select
            value={propType}
            onChange={(e) => setPropType(e.target.value)}
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none"
          >
            {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">Price Point</span>
          <select
            value={pricePoint}
            onChange={(e) => setPricePoint(e.target.value)}
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none"
          >
            {PRICE_POINTS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { label: "Bedrooms", value: bedrooms, set: setBedrooms, placeholder: "3" },
          { label: "Bathrooms", value: bathrooms, set: setBathrooms, placeholder: "2" },
          { label: "Square Feet", value: sqft, set: setSqft, placeholder: "1800" },
        ].map(({ label, value, set, placeholder }) => (
          <div key={label}>
            <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">{label}</span>
            <input
              type="number"
              value={value}
              onChange={(e) => set(e.target.value)}
              placeholder={placeholder}
              className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
              style={{ borderColor: value ? color : undefined }}
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">Location</span>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Downtown Austin, TX"
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
            style={{ borderColor: location ? color : undefined }}
          />
        </div>
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">Key Features (comma-separated)</span>
          <input
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
            placeholder="e.g. pool, fireplace, updated kitchen"
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
            style={{ borderColor: features ? color : undefined }}
          />
        </div>
      </div>

      <div>
        <ToolButton onClick={handleGenerate}>Generate Listing</ToolButton>
      </div>

      {generated && result && (
        <div className="space-y-4">
          <div className="rounded-md border-2 p-4" style={{ borderColor: color }}>
            <div className="mb-1 font-mono text-xs font-medium uppercase tracking-wider text-muted">Headline</div>
            <h3 className="font-display text-xl font-extrabold" style={{ color }}>{result.headlineText}</h3>
          </div>

          <div className="rounded-md border-2 border-line bg-input-bg p-4">
            <div className="mb-2 font-mono text-xs font-medium uppercase tracking-wider text-muted">Full Description</div>
            {result.description.split("\n\n").map((para, i) => (
              <p key={i} className="mb-3 font-mono text-sm text-input-text last:mb-0">{para}</p>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-md border-2 border-line bg-input-bg p-4">
              <div className="mb-2 font-mono text-xs font-medium uppercase tracking-wider text-muted">Key Features</div>
              <ul className="space-y-1">
                {result.keyFeatures.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 font-mono text-sm text-input-text">
                    <span style={{ color }}>&#10003;</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-md border-2 border-line bg-input-bg p-4">
              <div className="mb-2 font-mono text-xs font-medium uppercase tracking-wider text-muted">Neighborhood Highlights</div>
              <ul className="space-y-1">
                {result.neighborhoodHighlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 font-mono text-sm text-input-text">
                    <span style={{ color }}>&#9679;</span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-md border-2 border-line bg-input-bg p-4">
            <div className="mb-1 flex items-center justify-between">
              <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">Full Listing</span>
              <CopyButton text={fullText} />
            </div>
            <pre className="max-h-[300px] overflow-auto whitespace-pre-wrap break-all font-mono text-sm text-input-text">
              {fullText}
            </pre>
          </div>
        </div>
      )}

      {!generated && (
        <div className="rounded-md border-2 border-dashed border-line p-8 text-center font-mono text-sm text-muted">
          Configure property details above and click Generate to create your listing
        </div>
      )}
    </ToolLayout>
  );
}
