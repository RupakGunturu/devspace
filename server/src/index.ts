import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import passport from "passport";
import { config } from "./config/env";
import { connectDB } from "./config/db";
import authRoutes from "./routes/auth";
import activityRoutes from "./routes/activity";

const app = express();

// Security headers
app.use(helmet());

// Rate limiting — 100 req/min for general, 20 req/min for auth
app.use("/api/", rateLimit({ windowMs: 60_000, max: 100, standardHeaders: true, legacyHeaders: false }));
const authLimiter = rateLimit({ windowMs: 60_000, max: 20, standardHeaders: true, legacyHeaders: false });

// CORS — whitelist local + production origins
const allowedOrigins = [
  config.clientUrl,
  "http://localhost:1000",
  "http://localhost:5173",
  "https://devspace-gold.vercel.app",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: "1mb" }));
app.use(passport.initialize());

// Routes — auth gets stricter rate limit
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/activity", activityRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Global error handler — never leak internals
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  res.status(500).json({ error: "Internal server error" });
});

// Start server
async function start() {
  await connectDB();
  app.listen(config.port, () => {
    // No sensitive data logged
  });
}

start().catch(() => {
  process.exit(1);
});
