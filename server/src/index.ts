import express from "express";
import cors from "cors";
import passport from "passport";
import { config } from "./config/env";
import { connectDB } from "./config/db";
import authRoutes from "./routes/auth";
import activityRoutes from "./routes/activity";

const app = express();

// Middleware
app.use(cors({ origin: config.clientUrl, credentials: true }));
app.use(express.json());
app.use(passport.initialize());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/activity", activityRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Start server
async function start() {
  await connectDB();
  app.listen(config.port, () => {
    console.log(`DevSpace API running on port ${config.port}`);
  });
}

start().catch(console.error);
