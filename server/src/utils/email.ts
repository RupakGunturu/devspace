import { Resend } from "resend";
import { config } from "../config/env";

const resend = new Resend(config.resendApiKey);

export async function sendResetEmail(email: string, token: string) {
  const resetUrl = `${config.clientUrl}/reset-password?token=${token}`;

  await resend.emails.send({
    from: "DevSpace <onboarding@resend.dev>",
    to: email,
    subject: "Reset your DevSpace password",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <h2 style="color: #1a1a2e; margin-bottom: 16px;">Reset your password</h2>
        <p style="color: #555; line-height: 1.6; margin-bottom: 24px;">
          You requested a password reset. Click the button below to set a new password. This link expires in 1 hour.
        </p>
        <a href="${resetUrl}" style="display: inline-block; background: #00ff88; color: #0d1117; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-weight: 700; font-size: 14px;">
          Reset Password
        </a>
        <p style="color: #999; font-size: 12px; margin-top: 24px;">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `,
  });
}

export async function sendWelcomeEmail(email: string, name: string) {
  await resend.emails.send({
    from: "DevSpace <onboarding@resend.dev>",
    to: email,
    subject: "Welcome to DevSpace!",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <h2 style="color: #1a1a2e; margin-bottom: 16px;">Welcome to DevSpace, ${name}! 🚀</h2>
        <p style="color: #555; line-height: 1.6; margin-bottom: 24px;">
          You're all set. Your game scores, favorites, and activity will now sync across devices.
        </p>
        <a href="${config.clientUrl}" style="display: inline-block; background: #00ff88; color: #0d1117; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-weight: 700; font-size: 14px;">
          Start Exploring
        </a>
      </div>
    `,
  });
}
