import mongoose, { Document, Schema } from "mongoose";

export type ContentType =
  | "post"
  | "stack-breakdown"
  | "startup-term"
  | "tool"
  | "game"
  | "tip"
  | "cheat-sheet"
  | "hidden-gem"
  | "hiring"
  | "mcp-skill"
  | "series"
  | "learning-resource";

export interface CodeFileInput {
  path: string; // e.g. "src/components/games/MyGame.tsx"
  content: string;
  isMain: boolean;
}

export interface IContentItem extends Document {
  slug: string;
  type: ContentType;
  series?: string;
  title: string;
  description: string;
  body: string;
  image?: string;
  images: string[];
  tags: string[];
  status: "draft" | "published";
  version: number;
  lastEditedBy?: string;
  codeFiles?: CodeFileInput[];
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  icon?: string;
  tagline?: string;
  category?: string;
  faviconDomain?: string;
  externalUrl?: string;
  url?: string;
  color?: string;
  colors?: Record<string, string>;
  difficulty?: "easy" | "medium" | "hard";
  resourceCost?: "free" | "freemium" | "paid";
  isListing?: boolean;
  cadence?: string;
  content?: Record<string, unknown>[];
  learningResources?: Record<string, unknown>[];
  name?: string;
  productName?: string;
  codeAvailable?: boolean;
  codeDeployedAt?: Date;
}

const contentSchema = new Schema<IContentItem>(
  {
    slug: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: [
        "post",
        "stack-breakdown",
        "startup-term",
        "tool",
        "game",
        "tip",
        "cheat-sheet",
        "hidden-gem",
        "hiring",
        "mcp-skill",
        "series",
        "learning-resource",
      ],
      required: true,
      index: true,
    },
    series: { type: String, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    body: { type: String, default: "" },
    image: { type: String },
    images: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    status: { type: String, enum: ["draft", "published"], default: "draft", index: true },
    version: { type: Number, default: 1 },
    lastEditedBy: { type: String },
    icon: { type: String },
    tagline: { type: String },
    category: { type: String, index: true },
    faviconDomain: { type: String },
    externalUrl: { type: String },
    url: { type: String },
    color: { type: String },
    colors: { type: Schema.Types.Mixed },
    difficulty: { type: String, enum: ["easy", "medium", "hard"] },
    resourceCost: { type: String, enum: ["free", "freemium", "paid"] },
    isListing: { type: Boolean },
    cadence: { type: String },
    content: { type: [Schema.Types.Mixed], default: [] },
    learningResources: { type: [Schema.Types.Mixed], default: [] },
    name: { type: String },
    productName: { type: String },
    codeAvailable: { type: Boolean },
    codeDeployedAt: { type: Date },
    codeFiles: [
      {
        path: { type: String, required: true },
        content: { type: String, default: "" },
        isMain: { type: Boolean, default: false },
      },
    ],
    publishedAt: { type: Date },
  },
  { timestamps: true },
);

contentSchema.index({ type: 1, status: 1 });
contentSchema.index({ slug: 1, type: 1 }, { unique: true });

export const ContentItem = mongoose.model<IContentItem>("ContentItem", contentSchema);
