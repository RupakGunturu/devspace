import mongoose, { Document, Schema } from "mongoose";

export interface IGameScore {
  gameSlug: string;
  score: number;
  streak: number;
  accuracy: number;
  rank: string;
  playedAt: Date;
}

export interface IToolUsage {
  toolSlug: string;
  usedAt: Date;
}

export interface ISavedTip {
  tipId: string;
  savedAt: Date;
}

export interface IFavorite {
  type: "tool" | "tip" | "cheatsheet" | "game";
  slug: string;
  addedAt: Date;
}

export interface IRecentlyUsed {
  type: string;
  slug: string;
  usedAt: Date;
}

export interface IActivity extends Document {
  userId: mongoose.Types.ObjectId;
  gameScores: IGameScore[];
  toolUsage: IToolUsage[];
  savedTips: ISavedTip[];
  favorites: IFavorite[];
  recentlyUsed: IRecentlyUsed[];
}

const activitySchema = new Schema<IActivity>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    gameScores: [
      {
        gameSlug: { type: String, required: true },
        score: { type: Number, required: true },
        streak: { type: Number, default: 0 },
        accuracy: { type: Number, default: 0 },
        rank: { type: String, default: "" },
        playedAt: { type: Date, default: Date.now },
      },
    ],
    toolUsage: [
      {
        toolSlug: { type: String, required: true },
        usedAt: { type: Date, default: Date.now },
      },
    ],
    savedTips: [
      {
        tipId: { type: String, required: true },
        savedAt: { type: Date, default: Date.now },
      },
    ],
    favorites: [
      {
        type: { type: String, enum: ["tool", "tip", "cheatsheet", "game"], required: true },
        slug: { type: String, required: true },
        addedAt: { type: Date, default: Date.now },
      },
    ],
    recentlyUsed: [
      {
        type: { type: String, required: true },
        slug: { type: String, required: true },
        usedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

activitySchema.index({ userId: 1 });
activitySchema.index({ "gameScores.playedAt": -1 });
activitySchema.index({ "favorites.slug": 1, "favorites.type": 1 });

export const Activity = mongoose.model<IActivity>("Activity", activitySchema);
