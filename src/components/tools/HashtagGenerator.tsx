import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { CopyButton } from "./CopyButton";
import { useToolAccent } from "@/components/ToolAccentContext";

type Platform = "instagram" | "twitter" | "tiktok";

const HASHTAG_DB: Record<string, { tags: string[]; popularity: "hot" | "trending" | "normal" }[]> =
  {
    technology: [
      {
        tags: [
          "#tech",
          "#technology",
          "#innovation",
          "#coding",
          "#developer",
          "#programming",
          "#software",
          "#ai",
          "#machinelearning",
          "#startup",
        ],
        popularity: "hot",
      },
      {
        tags: [
          "#webdev",
          "#javascript",
          "#python",
          "#reactjs",
          "#nodejs",
          "#frontend",
          "#backend",
          "#fullstack",
          "#devops",
          "#cloud",
        ],
        popularity: "trending",
      },
      {
        tags: [
          "#datascience",
          "#cybersecurity",
          "#blockchain",
          "#iot",
          "#5g",
          "#ar",
          "#vr",
          "#saas",
          "#fintech",
          "#edtech",
        ],
        popularity: "normal",
      },
    ],
    business: [
      {
        tags: [
          "#business",
          "#entrepreneur",
          "#startup",
          "#marketing",
          "#growth",
          "#success",
          "#hustle",
          "#boss",
          "#CEO",
          "#founder",
        ],
        popularity: "hot",
      },
      {
        tags: [
          "#digitalmarketing",
          "#socialmediamarketing",
          "#contentmarketing",
          "#emailmarketing",
          "#seo",
          "#branding",
          "#strategy",
          "#leadership",
          "#management",
          "#sales",
        ],
        popularity: "trending",
      },
      {
        tags: [
          "#ecommerce",
          "#remotework",
          "#freelance",
          "#productivity",
          "#mindset",
          "#motivation",
          "#goals",
          "#networking",
          "#investment",
          "#revenue",
        ],
        popularity: "normal",
      },
    ],
    fitness: [
      {
        tags: [
          "#fitness",
          "#workout",
          "#gym",
          "#health",
          "#fit",
          "#motivation",
          "#bodybuilding",
          "#training",
          "#fitnessmotivation",
          "#muscle",
        ],
        popularity: "hot",
      },
      {
        tags: [
          "#weightloss",
          "#yoga",
          "#nutrition",
          "#wellness",
          "#healthylifestyle",
          "#exercise",
          "#fitnessmodel",
          "#personaltrainer",
          "#strengthtraining",
          "#cardio",
        ],
        popularity: "trending",
      },
      {
        tags: [
          "#hiit",
          "#crossfit",
          "#running",
          "#stretching",
          "#pilates",
          "#mealprep",
          "#supplements",
          "#protips",
          "#abs",
          "#glutes",
        ],
        popularity: "normal",
      },
    ],
    food: [
      {
        tags: [
          "#food",
          "#foodie",
          "#instafood",
          "#foodporn",
          "#yummy",
          "#delicious",
          "#cooking",
          "#recipe",
          "#homemade",
          "#dinner",
        ],
        popularity: "hot",
      },
      {
        tags: [
          "#healthyeating",
          "#vegan",
          "#vegetarian",
          "#glutenfree",
          "#keto",
          "#mealprep",
          "#foodblogger",
          "#foodphotography",
          "#restaurant",
          "#chef",
        ],
        popularity: "trending",
      },
      {
        tags: [
          "#brunch",
          "#dessert",
          "#baking",
          "#smoothie",
          "#salad",
          "#pasta",
          "#sushi",
          "#tacos",
          "#pizza",
          "#burger",
        ],
        popularity: "normal",
      },
    ],
    travel: [
      {
        tags: [
          "#travel",
          "#wanderlust",
          "#adventure",
          "#explore",
          "#vacation",
          "#travelgram",
          "#instatravel",
          "#beautiful",
          "#nature",
          "#photo",
        ],
        popularity: "hot",
      },
      {
        tags: [
          "#travelphotography",
          "#backpacking",
          "#solo",
          "#luxurytravel",
          "#roadtrip",
          "#bucketlist",
          "#travelblogger",
          "#globetrotter",
          "#nomad",
          "#digitalnomad",
        ],
        popularity: "trending",
      },
      {
        tags: [
          "#beach",
          "#mountains",
          "#island",
          "#citytrip",
          "#countryside",
          "#hiking",
          "#camping",
          "#cruise",
          "#sunset",
          "#landmarks",
        ],
        popularity: "normal",
      },
    ],
    fashion: [
      {
        tags: [
          "#fashion",
          "#style",
          "#ootd",
          "#fashionblogger",
          "#outfit",
          "#streetstyle",
          "#fashionista",
          "#beauty",
          "#look",
          "#trend",
        ],
        popularity: "hot",
      },
      {
        tags: [
          "#fashionstyle",
          "#womenswear",
          "#menswear",
          "#accessories",
          "#sneakers",
          "#vintage",
          "#sustainablefashion",
          "#luxury",
          "#designer",
          "#runway",
        ],
        popularity: "trending",
      },
      {
        tags: [
          "#casual",
          "#minimal",
          "#boho",
          "#streetwear",
          "#athleisure",
          "#handmade",
          "#jewelry",
          "#hat",
          "#sunglasses",
          "#watch",
        ],
        popularity: "normal",
      },
    ],
    gaming: [
      {
        tags: [
          "#gaming",
          "#gamer",
          "#games",
          "#videogames",
          "#gamingcommunity",
          "#esports",
          "#play",
          "#pcgaming",
          "#consolegaming",
          "#streamer",
        ],
        popularity: "hot",
      },
      {
        tags: [
          "#twitch",
          "#gameplay",
          "#xbox",
          "#playstation",
          "#nintendo",
          "#fortnite",
          "#valorant",
          "#minecraft",
          "#gamedev",
          "#indiegame",
        ],
        popularity: "trending",
      },
      {
        tags: [
          "#rpg",
          "#fps",
          "#moba",
          "#mmorpg",
          "#roguelike",
          "#retro",
          "#arcade",
          "#simulator",
          "#puzzle",
          "#horror",
        ],
        popularity: "normal",
      },
    ],
    music: [
      {
        tags: [
          "#music",
          "#newmusic",
          "#singer",
          "#songwriter",
          "#producer",
          "#rap",
          "#hiphop",
          "#rnb",
          "#pop",
          "#rock",
        ],
        popularity: "hot",
      },
      {
        tags: [
          "#spotify",
          "#soundcloud",
          "#livemusic",
          "#concert",
          "#band",
          "#guitar",
          "#piano",
          "#drums",
          "#bass",
          "#dj",
        ],
        popularity: "trending",
      },
      {
        tags: [
          "#acoustic",
          "#indie",
          "#electronic",
          "#edm",
          "#jazz",
          "#blues",
          "#country",
          "#reggae",
          "#latin",
          "#metal",
        ],
        popularity: "normal",
      },
    ],
    photography: [
      {
        tags: [
          "#photography",
          "#photo",
          "#photooftheday",
          "#photographer",
          "#pic",
          "#camera",
          "#instagood",
          "#nature",
          "#landscape",
          "#portrait",
        ],
        popularity: "hot",
      },
      {
        tags: [
          "#streetphotography",
          "#travelphotography",
          "#wildlifephotography",
          "#filmphotography",
          "#blackandwhite",
          "#macro",
          "#drone",
          "#nightphotography",
          "#lightroom",
          "#canon",
        ],
        popularity: "trending",
      },
      {
        tags: [
          "#sunset",
          "#reflection",
          "#bokeh",
          "#minimal",
          "#architecture",
          "#fashion",
          "#product",
          "#food",
          "#astro",
          "#aerial",
        ],
        popularity: "normal",
      },
    ],
    education: [
      {
        tags: [
          "#education",
          "#learning",
          "#students",
          "#teachers",
          "#school",
          "#college",
          "#university",
          "#onlinelearning",
          "#study",
          "#knowledge",
        ],
        popularity: "hot",
      },
      {
        tags: [
          "#elearning",
          "#motivation",
          "#selfimprovement",
          "#personaldevelopment",
          "#books",
          "#reading",
          "#writing",
          "#math",
          "#science",
          "#history",
        ],
        popularity: "trending",
      },
      {
        tags: [
          "#languages",
          "#coding",
          "#tutorials",
          "#tips",
          "#facts",
          "#homeschool",
          "#scholarship",
          "#exam",
          "#diploma",
          "#career",
        ],
        popularity: "normal",
      },
    ],
  };

function getRelatedCategories(topic: string): string[] {
  const lower = topic.toLowerCase();
  const keywords: Record<string, string[]> = {
    technology: [
      "tech",
      "code",
      "programming",
      "software",
      "app",
      "ai",
      "data",
      "web",
      "computer",
      "digital",
      "cyber",
      "robot",
    ],
    business: [
      "business",
      "marketing",
      "startup",
      "money",
      "sales",
      "entrepreneur",
      "company",
      "brand",
      "finance",
      "invest",
    ],
    fitness: [
      "workout",
      "gym",
      "exercise",
      "health",
      "muscle",
      "fit",
      "training",
      "sport",
      "body",
      "strong",
    ],
    food: [
      "food",
      "cook",
      "recipe",
      "eat",
      "restaurant",
      "chef",
      "kitchen",
      "meal",
      "dinner",
      "lunch",
    ],
    travel: [
      "travel",
      "trip",
      "vacation",
      "explore",
      "adventure",
      "destination",
      "hotel",
      "flight",
      "passport",
      "tour",
    ],
    fashion: [
      "fashion",
      "style",
      "wear",
      "outfit",
      "clothes",
      "shoes",
      "dress",
      "trend",
      "beauty",
      "look",
    ],
    gaming: [
      "game",
      "play",
      "console",
      "pc",
      "stream",
      "esport",
      "fortnite",
      "valorant",
      "minecraft",
      "twitch",
    ],
    music: ["music", "song", "sing", "band", "concert", "guitar", "piano", "rap", "beat", "album"],
    photography: [
      "photo",
      "camera",
      "picture",
      "shoot",
      "lens",
      "film",
      "shot",
      "image",
      "portrait",
      "landscape",
    ],
    education: [
      "learn",
      "study",
      "school",
      "teach",
      "student",
      "book",
      "class",
      "course",
      "exam",
      "lesson",
    ],
  };
  const found: string[] = [];
  for (const [cat, words] of Object.entries(keywords)) {
    if (words.some((w) => lower.includes(w))) found.push(cat);
  }
  if (found.length === 0) found.push("technology", "business");
  return found.slice(0, 3);
}

const platformFormats: Record<Platform, { prefix: string; maxTags: number }> = {
  instagram: { prefix: "#", maxTags: 30 },
  twitter: { prefix: "#", maxTags: 5 },
  tiktok: { prefix: "#", maxTags: 8 },
};

export function HashtagGenerator() {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState<Platform>("instagram");
  const { color } = useToolAccent();

  const hashtags = useMemo(() => {
    if (!topic.trim()) return [];
    const cats = getRelatedCategories(topic);
    const seen = new Set<string>();
    const result: { tag: string; popularity: "hot" | "trending" | "normal" }[] = [];

    for (const cat of cats) {
      const groups = HASHTAG_DB[cat] || [];
      for (const group of groups) {
        for (const tag of group.tags) {
          if (!seen.has(tag)) {
            seen.add(tag);
            result.push({ tag, popularity: group.popularity });
          }
        }
      }
    }

    const customTag = topic.trim().toLowerCase().replace(/\s+/g, "");
    if (!seen.has(`#${customTag}`)) {
      result.unshift({ tag: `#${customTag}`, popularity: "hot" });
    }

    return result.slice(0, platformFormats[platform].maxTags);
  }, [topic, platform]);

  const formattedAll = useMemo(() => hashtags.map((h) => h.tag).join(" "), [hashtags]);

  const popColor = (p: string) => {
    if (p === "hot") return "#ef4444";
    if (p === "trending") return "#f59e0b";
    return color;
  };

  const popLabel = (p: string) => {
    if (p === "hot") return "HOT";
    if (p === "trending") return "TRENDING";
    return "NORMAL";
  };

  return (
    <ToolLayout id="hashtag-generator">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Topic / Keyword
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. javascript, fitness, travel..."
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
            onFocus={(e) => {
              e.currentTarget.style.borderColor = color;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "";
            }}
          />
        </div>
        <div>
          <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Platform
          </label>
          <div className="flex gap-2">
            {(["instagram", "twitter", "tiktok"] as Platform[]).map((p) => (
              <button
                key={p}
                onClick={() => setPlatform(p)}
                className="flex-1 rounded-md border-2 px-3 py-2.5 font-mono text-xs font-medium capitalize transition-all"
                style={{
                  borderColor: platform === p ? color : undefined,
                  backgroundColor: platform === p ? color : undefined,
                  color: platform === p ? "#1a1a2e" : undefined,
                }}
              >
                {p === "instagram" ? "📸 IG" : p === "twitter" ? "🐦 X" : "🎵 TT"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {hashtags.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Generated Hashtags ({hashtags.length})
            </span>
            <ToolButton
              onClick={() => navigator.clipboard.writeText(formattedAll)}
              variant="secondary"
            >
              Copy All
            </ToolButton>
          </div>

          <div className="flex flex-wrap gap-2">
            {hashtags.map((h, i) => (
              <div
                key={i}
                className="group flex items-center gap-2 rounded-full border-2 border-line bg-input-bg px-3 py-1.5 transition-all hover:border-current"
                style={{ ["--hover-color" as string]: popColor(h.popularity) }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = popColor(h.popularity);
                  e.currentTarget.style.color = popColor(h.popularity);
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "";
                  e.currentTarget.style.color = "";
                }}
              >
                <span className="font-mono text-sm font-medium text-foreground">{h.tag}</span>
                <span
                  className="rounded-full px-1.5 py-0.5 font-mono text-[10px] font-bold"
                  style={{
                    backgroundColor: popColor(h.popularity),
                    color: "#1a1a2e",
                  }}
                >
                  {popLabel(h.popularity)}
                </span>
                <CopyButton
                  text={h.tag}
                  className="border-0 px-1 py-0.5 opacity-0 group-hover:opacity-100"
                />
              </div>
            ))}
          </div>

          <div className="rounded-md border-2 border-line bg-input-bg p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
                Copy-Ready
              </span>
              <CopyButton text={formattedAll} />
            </div>
            <p className="whitespace-pre-wrap break-all font-mono text-sm text-foreground">
              {formattedAll}
            </p>
          </div>
        </div>
      )}

      {topic.trim() && hashtags.length === 0 && (
        <p className="text-center font-mono text-sm text-muted">
          No hashtags generated. Try a different topic.
        </p>
      )}
    </ToolLayout>
  );
}
