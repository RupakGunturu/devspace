import dotenv from "dotenv";
dotenv.config();

const isProd = process.env.NODE_ENV === "production";

function required(key: string, fallback?: string): string {
  const val = process.env[key] || fallback;
  if (!val) {
    throw new Error(`Missing required env variable: ${key}`);
  }
  return val;
}

function optional(key: string, fallback = ""): string {
  return process.env[key] || fallback;
}

export const config = {
  port: parseInt(process.env.PORT || "2000", 10),
  isProduction: isProd,
  mongoUri: required("MONGODB_URI"),
  jwtSecret: required("JWT_SECRET", isProd ? undefined : "devspace-dev-secret-do-not-use-in-prod"),
  jwtExpiresIn: optional("JWT_EXPIRES_IN", "7d"),
  googleClientId: optional("GOOGLE_CLIENT_ID"),
  googleClientSecret: optional("GOOGLE_CLIENT_SECRET"),
  resendApiKey: optional("RESEND_API_KEY"),
  clientUrl: required("CLIENT_URL", isProd ? undefined : "http://localhost:1000"),
};
