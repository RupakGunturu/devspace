import mongoose from "mongoose";
import { config } from "./env";

let connected = false;

export async function connectDB() {
  if (connected) return;
  try {
    await mongoose.connect(config.mongoUri);
    connected = true;
  } catch {
    process.exit(1);
  }
}
