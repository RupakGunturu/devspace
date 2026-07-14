import { Request, Response } from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import { config } from "../config/env";
import { User } from "../models/User";
import { Activity } from "../models/Activity";
import { sendResetEmail, sendWelcomeEmail } from "../utils/email";

function generateToken(userId: string): string {
  return jwt.sign({ userId }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
}

async function fetchAndEncodeAvatar(url: string): Promise<string | undefined> {
  try {
    // Request a reasonable size from Google
    const sizedUrl = url.replace(/(=s\d+-c|\/s\d+-c|-c)$/i, "=s192-c");
    const res = await fetch(sizedUrl);
    if (!res.ok) return url;
    const contentType = res.headers.get("content-type") || "image/jpeg";
    const buffer = Buffer.from(await res.arrayBuffer());
    return `data:${contentType};base64,${buffer.toString("base64")}`;
  } catch {
    return url;
  }
}

// ─── Passport Strategies ───

passport.use(
  new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
    try {
      const user = await User.findOne({ email: email.toLowerCase() }).select("+passwordHash");
      if (!user || !user.passwordHash) {
        return done(null, false, { message: "Invalid email or password" });
      }
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return done(null, false, { message: "Invalid email or password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }),
);

if (config.googleClientId && config.googleClientSecret) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.googleClientId,
        clientSecret: config.googleClientSecret,
        callbackURL: "/api/auth/google/callback",
        scope: ["profile", "email"],
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) return done(new Error("No email from Google"), undefined);

          const rawPhoto = profile.photos?.[0]?.value;
          const cachedAvatar = rawPhoto ? await fetchAndEncodeAvatar(rawPhoto) : undefined;

          let user = await User.findOne({ googleId: profile.id });
          if (!user) {
            user = await User.findOne({ email: email.toLowerCase() });
            if (user) {
              user.googleId = profile.id;
              user.provider = "google";
              if (!user.avatar && cachedAvatar) user.avatar = cachedAvatar;
              await user.save();
            } else {
              user = await User.create({
                name: profile.displayName,
                email: email.toLowerCase(),
                provider: "google",
                googleId: profile.id,
                avatar: cachedAvatar,
              });
              await Activity.create({ userId: user._id });
              sendWelcomeEmail(email, profile.displayName).catch(() => {});
            }
          } else if (!user.avatar?.startsWith("data:") && cachedAvatar) {
            // Refresh expired Google URL with cached base64
            user.avatar = cachedAvatar;
            await user.save();
          }
          return done(null, user);
        } catch (err) {
          return done(err, undefined);
        }
      },
    ),
  );
}

passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// ─── Controllers ───

export async function signup(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ error: "Name, email, and password are required" });
      return;
    }
    if (password.length < 6) {
      res.status(400).json({ error: "Password must be at least 6 characters" });
      return;
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      res.status(409).json({ error: "Email already in use" });
      return;
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      passwordHash: password,
      provider: "local",
    });

    await Activity.create({ userId: user._id });
    sendWelcomeEmail(user.email, user.name).catch(() => {});

    const token = generateToken(user._id.toString());
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar, provider: user.provider },
    });
  } catch {
    res.status(500).json({ error: "Signup failed" });
  }
}

export async function login(req: Request, res: Response) {
  passport.authenticate("local", { session: false }, (err: any, user: any, info: any) => {
    if (err) {
      res.status(500).json({ error: "Login failed" });
      return;
    }
    if (!user) {
      res.status(401).json({ error: info?.message || "Invalid credentials" });
      return;
    }
    const token = generateToken(user._id.toString());
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar, provider: user.provider },
    });
  })(req, res);
}

export function googleAuth(req: Request, res: Response, next: any) {
  if (!config.googleClientId) {
    res.status(503).json({ error: "Google auth not configured" });
    return;
  }
  passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
}

export function googleCallback(req: Request, res: Response, next: any) {
  passport.authenticate("google", { session: false, failureRedirect: `${config.clientUrl}/login` })(
    req,
    res,
    () => {
      const user = req.user as any;
      const token = generateToken(user._id.toString());
      res.redirect(`${config.clientUrl}/auth/callback?token=${token}`);
    },
  );
}

export async function forgotPassword(req: Request, res: Response) {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ error: "Email is required" });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Don't reveal whether user exists
      res.json({ message: "If an account exists, a reset email was sent" });
      return;
    }

    const token = crypto.randomBytes(32).toString("hex");
    const hash = crypto.createHash("sha256").update(token).digest("hex");

    user.resetPasswordToken = hash;
    user.resetPasswordExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    await sendResetEmail(user.email, token);
    res.json({ message: "If an account exists, a reset email was sent" });
  } catch {
    res.status(500).json({ error: "Failed to send reset email" });
  }
}

export async function resetPassword(req: Request, res: Response) {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      res.status(400).json({ error: "Token and password are required" });
      return;
    }
    if (password.length < 6) {
      res.status(400).json({ error: "Password must be at least 6 characters" });
      return;
    }

    const hash = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hash,
      resetPasswordExpiry: { $gt: new Date() },
    }).select("+resetPasswordToken +resetPasswordExpiry");

    if (!user) {
      res.status(400).json({ error: "Invalid or expired reset token" });
      return;
    }

    user.passwordHash = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    const jwtToken = generateToken(user._id.toString());
    res.json({
      token: jwtToken,
      user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar, provider: user.provider },
    });
  } catch {
    res.status(500).json({ error: "Password reset failed" });
  }
}

export async function getMe(req: Request, res: Response) {
  const user = (req as any).user;
  if (!user) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  res.json({
    user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar, provider: user.provider },
  });
}

export async function updateProfile(req: Request, res: Response) {
  const authUser = (req as any).user;
  if (!authUser) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const { name, avatar } = req.body;
  const user = await User.findById(authUser._id);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  if (name) user.name = name.trim();
  if (avatar !== undefined) user.avatar = avatar;
  await user.save();

  res.json({
    user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar, provider: user.provider },
  });
}
