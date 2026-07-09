import { SERIES } from "../data/series";

export function SeriesFilter({
  active,
  onChange,
  series = SERIES.map((s) => s.slug),
}: {
  active: string | null;
  onChange: (slug: string | null) => void;
  series?: string[];
}) {
  const list = SERIES.filter((s) => series.includes(s.slug));
  const Pill = ({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) => (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer rounded-full border-2 px-3.5 py-1.5 font-mono text-[12px] font-medium transition-all ${
        isActive
          ? "border-yellow bg-yellow text-ink"
          : "border-line text-muted hover:border-yellow hover:bg-yellow hover:text-ink"
      }`}
    >
      {label}
    </button>
  );
  return (
    <div className="mb-8 flex flex-wrap gap-2.5">
      <Pill label="All" isActive={active === null} onClick={() => onChange(null)} />
      {list.map((s) => (
        <Pill
          key={s.slug}
          label={`${s.icon} ${s.label}`}
          isActive={active === s.slug}
          onClick={() => onChange(s.slug)}
        />
      ))}
    </div>
  );
}
