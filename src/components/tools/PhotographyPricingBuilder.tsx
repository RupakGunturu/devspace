import { useState, useMemo } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { useToolAccent } from "@/components/ToolAccentContext";

export function PhotographyPricingBuilder() {
  const [hours, setHours] = useState("4");
  const [photos, setPhotos] = useState("50");
  const [prints, setPrints] = useState("0");
  const [album, setAlbum] = useState("0");
  const [travel, setTravel] = useState("0");
  const { color } = useToolAccent();

  const pricing = useMemo(() => {
    const h = parseInt(hours) || 0;
    const p = parseInt(photos) || 0;
    const pr = parseInt(prints) || 0;
    const a = parseInt(album) || 0;
    const t = parseInt(travel) || 0;

    const hourlyRate = 150;
    const photoRate = 5;
    const printRate = 25;
    const albumRate = 200;
    const travelRate = 0.65;

    const baseCost = h * hourlyRate + p * photoRate + pr * printRate + a * albumRate + t * travelRate;

    return {
      basic: {
        name: "Basic",
        hours: Math.max(1, Math.floor(h * 0.5)),
        photos: Math.floor(p * 0.5),
        prints: 0,
        album: 0,
        travel: t,
      },
      standard: {
        name: "Standard",
        hours: h,
        photos: p,
        prints: pr,
        album: a,
        travel: t,
      },
      premium: {
        name: "Premium",
        hours: Math.ceil(h * 1.5),
        photos: Math.ceil(p * 1.5),
        prints: Math.ceil(pr * 1.5),
        album: Math.max(1, a),
        travel: t,
      },
    };
  }, [hours, photos, prints, album, travel]);

  const calcPrice = (tier: typeof pricing.basic) => {
    return tier.hours * 150 + tier.photos * 5 + tier.prints * 25 + tier.album * 200 + tier.travel * 0.65;
  };

  return (
    <ToolLayout id="photography-pricing-builder">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: "Hours", value: hours, set: setHours },
          { label: "Photos", value: photos, set: setPhotos },
          { label: "Prints", value: prints, set: setPrints },
          { label: "Album Pages", value: album, set: setAlbum },
          { label: "Travel (miles)", value: travel, set: setTravel },
        ].map(({ label, value, set }) => (
          <div key={label}>
            <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
              {label}
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => set(e.target.value)}
              className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none"
            />
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {Object.values(pricing).map((tier) => {
          const price = calcPrice(tier);
          const isStandard = tier.name === "Standard";
          return (
            <div
              key={tier.name}
              className="flex flex-col gap-3 rounded-md border-2 bg-input-bg p-5"
              style={{
                borderColor: isStandard ? color : "var(--border)",
              }}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-bold text-foreground">{tier.name}</span>
                {isStandard && (
                  <span
                    className="rounded-full px-2 py-0.5 font-mono text-[10px] font-bold"
                    style={{ backgroundColor: color, color: "#fff" }}
                  >
                    POPULAR
                  </span>
                )}
              </div>
              <p className="font-mono text-3xl font-bold" style={{ color }}>
                ${price.toFixed(0)}
              </p>
              <div className="flex flex-col gap-1 font-mono text-xs text-muted">
                <span>{tier.hours} hours coverage</span>
                <span>{tier.photos} edited photos</span>
                {tier.prints > 0 && <span>{tier.prints} prints</span>}
                {tier.album > 0 && <span>{tier.album} album pages</span>}
                {tier.travel > 0 && <span>{tier.travel} miles travel</span>}
              </div>
              <div className="border-t border-line pt-2">
                <p className="font-mono text-[10px] uppercase text-muted">Breakdown</p>
                <div className="mt-1 flex flex-col gap-0.5 font-mono text-[10px] text-muted">
                  <span>Coverage: {tier.hours}h × $150 = ${tier.hours * 150}</span>
                  <span>Photos: {tier.photos} × $5 = ${tier.photos * 5}</span>
                  {tier.prints > 0 && <span>Prints: {tier.prints} × $25 = ${tier.prints * 25}</span>}
                  {tier.album > 0 && <span>Album: {tier.album} × $200 = ${tier.album * 200}</span>}
                  {tier.travel > 0 && <span>Travel: {tier.travel}mi × $0.65 = $${(tier.travel * 0.65).toFixed(0)}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ToolLayout>
  );
}
