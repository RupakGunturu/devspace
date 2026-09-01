import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import passport from "passport";
import { config } from "./config/env";
import authRoutes from "./routes/auth";
import activityRoutes from "./routes/activity";
import adminRoutes from "./routes/admin";

const app = express();

// Behind Render's reverse proxy — honor X-Forwarded-Proto so passport builds
// HTTPS OAuth callback URLs (Google rejects http:// redirect URIs).
app.set("trust proxy", 1);

// Security headers
app.use(helmet());

// Rate limiting — 100 req/min for general, 60 req/min for auth (disabled in tests)
if (process.env.NODE_ENV !== "test") {
  app.use(
    "/api/",
    rateLimit({ windowMs: 60_000, max: 100, standardHeaders: true, legacyHeaders: false }),
  );
}
// /me (session restore on page load) is exempt — it is token-authenticated and must not be rate-limited out
const authLimiter =
  process.env.NODE_ENV === "test"
    ? (req: Request, _res: Response, next: NextFunction) => next()
    : rateLimit({
        windowMs: 60_000,
        max: 60,
        standardHeaders: true,
        legacyHeaders: false,
        skip: (req) => req.path === "/me",
      });

// CORS — whitelist local + production origins
const allowedOrigins = [
  config.clientUrl,
  "http://localhost:1000",
  "http://localhost:1001",
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

// Admin routes — protected by authenticate + authorize("admin") at route level.
// A looser rate limit so admin CRUD/deploy operations are not throttled out.
app.use(
  "/api/admin",
  process.env.NODE_ENV === "test"
    ? (req: Request, _res: Response, next: NextFunction) => next()
    : rateLimit({ windowMs: 60_000, max: 300, standardHeaders: true, legacyHeaders: false }),
  adminRoutes,
);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Global error handler — never leak internals
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  res.status(500).json({ error: "Internal server error" });
});

export default app;
