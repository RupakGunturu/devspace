import { Link } from "react-router-dom";
import { useEffect } from "react";
import { SectionHead, StickerCard } from "../components/site";
import { cheatSheets } from "../data/cheat-sheets";

export default function CheatSheetsIndex() {
  useEffect(() => {
    document.title = "Cheat Sheets — DevSpace";
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20">
      <SectionHead idx="03" title="Cheat Sheets" />
      <p className="mb-10 max-w-xl text-sm text-muted">
        Quick references for every developer. Search, learn, copy.
      </p>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {cheatSheets.map((s, i) => (
          <StickerCard
            key={s.id}
            icon="📖"
            title={s.title}
            index={i}
            to={`/cheat-sheets/${s.id}`}
          >
            {s.description}
          </StickerCard>
        ))}
      </div>
    </section>
  );
}
