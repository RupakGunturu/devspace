import { useState, useMemo } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { CopyButton } from "./CopyButton";
import { useToolAccent } from "@/components/ToolAccentContext";

type Culture = "japanese" | "norse" | "celtic" | "african" | "indian" | "greek";
type Gender = "male" | "female" | "neutral";

const NAME_DATA: Record<Culture, Record<Gender, { name: string; meaning: string }[]>> = {
  japanese: {
    male: [
      { name: "Haruki", meaning: "Spring child" },
      { name: "Kenji", meaning: "Strong, vigorous" },
      { name: "Takeshi", meaning: "Warrior, brave" },
      { name: "Ryo", meaning: "Cool, refreshing" },
      { name: "Daichi", meaning: "Great wisdom" },
      { name: "Sora", meaning: "Sky, heaven" },
      { name: "Kaito", meaning: "Ocean, hero" },
      { name: "Ren", meaning: "Lotus, love" },
      { name: "Yuki", meaning: "Snow, happiness" },
      { name: "Akira", meaning: "Bright, clear" },
    ],
    female: [
      { name: "Sakura", meaning: "Cherry blossom" },
      { name: "Yuki", meaning: "Snow, happiness" },
      { name: "Hana", meaning: "Flower" },
      { name: "Aoi", meaning: "Blue, hollyhock" },
      { name: "Emi", meaning: "Beautiful blessing" },
      { name: "Rin", meaning: "Dignified, cool" },
      { name: "Mika", meaning: "Beautiful flower" },
      { name: "Nana", meaning: "Seven, grace" },
      { name: "Suki", meaning: "Beloved, moon" },
      { name: "Akari", meaning: "Light, brightness" },
    ],
    neutral: [
      { name: "Ren", meaning: "Lotus, love" },
      { name: "Kai", meaning: "Ocean, shell" },
      { name: "Yuki", meaning: "Snow, happiness" },
      { name: "Sora", meaning: "Sky, heaven" },
      { name: "Noa", meaning: "Freedom, love" },
      { name: "Rin", meaning: "Dignified" },
      { name: "Haru", meaning: "Spring" },
      { name: "Aoi", meaning: "Blue" },
      { name: "Michi", meaning: "Path, road" },
      { name: "Kaze", meaning: "Wind" },
    ],
  },
  norse: {
    male: [
      { name: "Erik", meaning: "Eternal ruler" },
      { name: "Bjorn", meaning: "Bear" },
      { name: "Ragnar", meaning: "Warrior of the gods" },
      { name: "Leif", meaning: "Heir, descendant" },
      { name: "Sigurd", meaning: "Victory guardian" },
      { name: "Thor", meaning: "Thunder" },
      { name: "Olaf", meaning: "Ancestral relic" },
      { name: "Harald", meaning: "Army ruler" },
      { name: "Gunnar", meaning: "Bold warrior" },
      { name: "Stellan", meaning: "Calm, peaceful" },
    ],
    female: [
      { name: "Freya", meaning: "Noble woman" },
      { name: "Astrid", meaning: "Divine beauty" },
      { name: "Ingrid", meaning: "Beautiful, beloved" },
      { name: "Sigrid", meaning: "Victory, beautiful" },
      { name: "Eira", meaning: "Mercy, protection" },
      { name: "Solveig", meaning: "Sun strength" },
      { name: "Thyra", meaning: "Thor's warrior" },
      { name: "Helga", meaning: "Holy, blessed" },
      { name: "Ragna", meaning: "Counsel, wisdom" },
      { name: "Liv", meaning: "Life, protection" },
    ],
    neutral: [
      { name: "Ash", meaning: "Ash tree" },
      { name: "Raven", meaning: "Dark bird" },
      { name: "Storm", meaning: "Tempest" },
      { name: "Skald", meaning: "Poet" },
      { name: "Fenrir", meaning: "Destined wolf" },
      { name: "Saga", meaning: "Story, seeing" },
      { name: "Vale", meaning: "Wandering" },
      { name: "Blodeu", meaning: "Flower bloom" },
      { name: "Nord", meaning: "North" },
      { name: "Frost", meaning: "Ice cold" },
    ],
  },
  celtic: {
    male: [
      { name: "Declan", meaning: "Full of goodness" },
      { name: "Ronan", meaning: "Little seal" },
      { name: "Cian", meaning: "Ancient, enduring" },
      { name: "Oisín", meaning: "Little deer" },
      { name: "Finn", meaning: "Fair, bright" },
      { name: "Eamon", meaning: "Wealthy protector" },
      { name: "Lorcan", meaning: "Fierce, small" },
      { name: "Niall", meaning: "Champion, cloud" },
      { name: "Daire", meaning: "Fertile, oak" },
      { name: "Tadhg", meaning: "Poet, storyteller" },
    ],
    female: [
      { name: "Niamh", meaning: "Bright, radiant" },
      { name: "Siobhan", meaning: "God's grace" },
      { name: "Aoife", meaning: "Beautiful, radiant" },
      { name: "Ciara", meaning: "Dark, black-haired" },
      { name: "Grainne", meaning: "Grace, love" },
      { name: "Deirdre", meaning: "Sorrowful, woman" },
      { name: "Maeve", meaning: "Intoxicating" },
      { name: "Roisin", meaning: "Little rose" },
      { name: "Aisling", meaning: "Dream, vision" },
      { name: "Saoirse", meaning: "Freedom, liberty" },
    ],
    neutral: [
      { name: "Blair", meaning: "Field, plain" },
      { name: "Carys", meaning: "Love" },
      { name: "Emrys", meaning: "Immortal" },
      { name: "Kiran", meaning: "Ray of light" },
      { name: "Taran", meaning: "Thunder" },
      { name: "Briar", meaning: "Thorny patch" },
      { name: "Rowan", meaning: "Red-haired, tree" },
      { name: "Lyric", meaning: "Song, poetry" },
      { name: "Sage", meaning: "Wise" },
      { name: "Glenn", meaning: "Valley" },
    ],
  },
  african: {
    male: [
      { name: "Kofi", meaning: "Born on Friday" },
      { name: "Amari", meaning: "Builder, immortal" },
      { name: "Idris", meaning: "Interpreter, studious" },
      { name: "Jabari", meaning: "Brave, fearless" },
      { name: "Kwame", meaning: "Born on Saturday" },
      { name: "Mandla", meaning: "Strength, power" },
      { name: "Tendai", meaning: "Be thankful" },
      { name: "Zuberi", meaning: "Strong, powerful" },
      { name: "Chidi", meaning: "God exists" },
      { name: "Olumide", meaning: "My wealth has arrived" },
    ],
    female: [
      { name: "Amara", meaning: "Grace, immortal" },
      { name: "Zuri", meaning: "Beautiful" },
      { name: "Nia", meaning: "Purpose, intention" },
      { name: "Amina", meaning: "Trustworthy, honest" },
      { name: "Kira", meaning: "Sun, throne" },
      { name: "Sade", meaning: "Honor earns crown" },
      { name: "Thandiwe", meaning: "Beloved one" },
      { name: "Imani", meaning: "Faith, belief" },
      { name: "Ayanna", meaning: "Beautiful flower" },
      { name: "Nneka", meaning: "Mother is supreme" },
    ],
    neutral: [
      { name: "Ekon", meaning: "Strong" },
      { name: "Eshe", meaning: "Life" },
      { name: "Kiano", meaning: "Grace" },
      { name: "Lulu", meaning: "Pearl" },
      { name: "Mosi", meaning: "First born" },
      { name: "Nuru", meaning: "Shining, light" },
      { name: "Suki", meaning: "Sharp" },
      { name: "Tano", meaning: "Second born" },
      { name: "Umi", meaning: "Life, mother" },
      { name: "Zola", meaning: "Quiet, earth" },
    ],
  },
  indian: {
    male: [
      { name: "Arjun", meaning: "Bright, shining" },
      { name: "Dev", meaning: "God, divine" },
      { name: "Kiran", meaning: "Ray of light" },
      { name: "Ravi", meaning: "Sun" },
      { name: "Vikram", meaning: "Brave, valiant" },
      { name: "Aditya", meaning: "Sun god" },
      { name: "Rohan", meaning: "Ascending, fragrant" },
      { name: "Nikhil", meaning: "Complete, whole" },
      { name: "Sanjay", meaning: "Victorious" },
      { name: "Veer", meaning: "Brave, warrior" },
    ],
    female: [
      { name: "Priya", meaning: "Beloved" },
      { name: "Anya", meaning: "Infinite, grace" },
      { name: "Diya", meaning: "Lamp, light" },
      { name: "Kavya", meaning: "Poetry, wisdom" },
      { name: "Nisha", meaning: "Night, darkness" },
      { name: "Meera", meaning: "Devotee, ocean" },
      { name: "Sara", meaning: "Princess, pure" },
      { name: "Riya", meaning: "Singer, graceful" },
      { name: "Isha", meaning: "Goddess, ruler" },
      { name: "Lila", meaning: "Divine play" },
    ],
    neutral: [
      { name: "Arin", meaning: "Peaceful" },
      { name: "Kai", meaning: "Earth, water" },
      { name: "Rei", meaning: "Flower, ray" },
      { name: "Sia", meaning: "Helpful, helper" },
      { name: "Ani", meaning: "Beautiful" },
      { name: "Devi", meaning: "Goddess" },
      { name: "Guru", meaning: "Teacher, master" },
      { name: "Hari", meaning: "Golden, monkey god" },
      { name: "Jaya", meaning: "Victory" },
      { name: "Kavi", meaning: "Poet, sage" },
    ],
  },
  greek: {
    male: [
      { name: "Alexis", meaning: "Defender" },
      { name: "Dimitri", meaning: "Earth lover" },
      { name: "Leonidas", meaning: "Lion-like" },
      { name: "Nikos", meaning: "Victory of the people" },
      { name: "Theodoros", meaning: "Gift of god" },
      { name: "Costas", meaning: "Constant, steadfast" },
      { name: "Yannis", meaning: "God is gracious" },
      { name: "Achilles", meaning: "Thin-lipped" },
      { name: "Hector", meaning: "Steadfast" },
      { name: "Odysseus", meaning: "Wrathful, journey" },
    ],
    female: [
      { name: "Athena", meaning: "Goddess of wisdom" },
      { name: "Helena", meaning: "Bright, shining" },
      { name: "Calliope", meaning: "Beautiful voice" },
      { name: "Stella", meaning: "Star" },
      { name: "Thalia", meaning: "To flourish" },
      { name: "Irene", meaning: "Peace" },
      { name: "Ariana", meaning: "Most holy" },
      { name: "Penelope", meaning: "Weaver" },
      { name: "Cassandra", meaning: "She who excels" },
      { name: "Sophia", meaning: "Wisdom" },
    ],
    neutral: [
      { name: "Alex", meaning: "Defender" },
      { name: "Dana", meaning: "From the sea" },
      { name: "Eros", meaning: "Love" },
      { name: "Iris", meaning: "Rainbow" },
      { name: "Kai", meaning: "Sea" },
      { name: "Nyx", meaning: "Night" },
      { name: "Orion", meaning: "Rising, dawn" },
      { name: "Phoenix", meaning: "Dark red" },
      { name: "Rhea", meaning: "Flowing stream" },
      { name: "Thea", meaning: "Goddess, light" },
    ],
  },
};

export function CharacterNameGenerator() {
  const [culture, setCulture] = useState<Culture>("japanese");
  const [gender, setGender] = useState<Gender>("male");
  const { color } = useToolAccent();

  const names = useMemo(() => {
    const data = NAME_DATA[culture]?.[gender] || [];
    const shuffled = [...data].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 10);
  }, [culture, gender]);

  const allNames = useMemo(() => names.map((n) => `${n.name} — ${n.meaning}`).join("\n"), [names]);

  return (
    <ToolLayout id="character-name-generator">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Culture
          </label>
          <div className="flex flex-wrap gap-2">
            {(["japanese", "norse", "celtic", "african", "indian", "greek"] as Culture[]).map((c) => (
              <button
                key={c}
                onClick={() => setCulture(c)}
                className="rounded-full border-2 px-3 py-1.5 font-mono text-xs font-medium capitalize transition-all"
                style={{
                  borderColor: culture === c ? color : "var(--border)",
                  backgroundColor: culture === c ? color : undefined,
                  color: culture === c ? "#fff" : undefined,
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Gender
          </label>
          <div className="flex gap-2">
            {(["male", "female", "neutral"] as Gender[]).map((g) => (
              <button
                key={g}
                onClick={() => setGender(g)}
                className="flex-1 rounded-full border-2 px-3 py-1.5 font-mono text-xs font-medium capitalize transition-all"
                style={{
                  borderColor: gender === g ? color : "var(--border)",
                  backgroundColor: gender === g ? color : undefined,
                  color: gender === g ? "#fff" : undefined,
                }}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Generated Names ({names.length})
          </span>
          <CopyButton text={allNames} />
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {names.map((n) => (
            <div
              key={n.name}
              className="flex items-center justify-between rounded-md border-2 border-line bg-input-bg px-4 py-2.5"
            >
              <div>
                <p className="font-mono text-sm font-bold text-foreground">{n.name}</p>
                <p className="font-mono text-[10px] text-muted">{n.meaning}</p>
              </div>
              <CopyButton text={n.name} className="border-0 px-1 py-0" />
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
