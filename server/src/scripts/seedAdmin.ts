import mongoose from "mongoose";
import { config } from "../config/env";
import { User } from "../models/User";
import { createInterface } from "readline";
import { promisify } from "util";

const rl = createInterface({ input: process.stdin, output: process.stdout });
const question = promisify(rl.question).bind(rl) as unknown as (q: string) => Promise<string>;

async function main() {
  console.log("── DevSpace Admin Setup ─────────────────────────────");

  const emailArg = process.argv[2];
  const passwordArg = process.argv[3];

  const email = (emailArg && emailArg.trim()) || (await question("Admin email: ")).trim();
  const password =
    (passwordArg && passwordArg.trim()) ||
    (await question("Admin password (min 6 chars): ")).trim();
  const name = (await question("Admin name (default: Admin): ")).trim() || "Admin";

  if (!email || !password || password.length < 6) {
    console.error("✖ Email is required and password must be at least 6 characters.");
    process.exit(1);
  }

  try {
    await mongoose.connect(config.mongoUri);

    const normalized = email.toLowerCase();
    let user = await User.findOne({ email: normalized });

    if (user) {
      user.role = "admin";
      if (passwordArg) user.passwordHash = password;
      if (user.passwordHash) user.passwordHash = password;
      await user.save();
      console.log(`✓ Updated existing user "${normalized}" → role: admin`);
    } else {
      user = await User.create({
        name,
        email: normalized,
        passwordHash: password,
        role: "admin",
        provider: "local",
      });
      console.log(`✓ Created admin user "${normalized}"`);
    }

    console.log("");
    console.log("── Success ─────────────────────────────────────────");
    console.log(`  Email:    ${normalized}`);
    console.log(`  Password: ${"*".repeat(password.length)} (set by you)`);
    console.log(`  Role:     admin`);
    console.log("");
    console.log("  Use these credentials at devspace /admin.");
    console.log("  You can also link a Google login to this email later.");
  } catch (err) {
    console.error("✖ Admin setup failed:", (err as Error)?.message ?? err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    rl.close();
  }
}

main();
