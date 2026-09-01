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
  | "mcp-skill";

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
}

const contentSchema = new Schema<IContentItem>(
  {
    slug: { type: String, required: true, unique: true, trim: true },
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
contentSchema.index({ slug: 1, type: 1 });

export const ContentItem = mongoose.model<IContentItem>("ContentItem", contentSchema);
