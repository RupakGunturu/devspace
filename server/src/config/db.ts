import mongoose from "mongoose";
import { config } from "./env";

let connected = false;

export async function connectDB() {
  if (connected) return;
  try {
    console.log("Connecting to MongoDB…");
    await mongoose.connect(config.mongoUri);
    connected = true;
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed:", (err as Error)?.message ?? err);
    process.exit(1);
  }
}
