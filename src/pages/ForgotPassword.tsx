import { useState } from "react";
import { Link } from "react-router-dom";
import { authApi } from "@/lib/api";
import { toast } from "@/components/ui/toaster";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSent(true);
      toast.success("Reset email sent!");
    } catch (err: any) {
      toast.danger(err.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-[420px] flex-col items-center justify-center px-6 py-16">
        <div className="w-full rounded-md border-2 border-line bg-paper p-8 text-center">
          <div className="mb-4 text-4xl">📧</div>
          <h1 className="mb-2 font-display text-2xl font-bold">Check your email</h1>
          <p className="mb-6 text-sm text-muted">
            If an account exists with <strong>{email}</strong>, we sent a password reset link. Check your spam folder if you don't see it.
          </p>
          <Link
            to="/login"
            className="inline-block rounded-md border-0 bg-green px-6 py-3 text-sm font-bold text-ink no-underline transition-all hover:opacity-85"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-[420px] flex-col items-center justify-center px-6 py-16">
      <div className="w-full rounded-md border-2 border-line bg-paper p-8">
        <h1 className="mb-2 font-display text-2xl font-bold">Forgot password?</h1>
        <p className="mb-6 text-sm text-muted">
          Enter your email and we'll send you a reset link.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-md border-[1.5px] border-line bg-paper-dim px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-yellow"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-md border-0 bg-green px-4 py-3 text-sm font-bold text-ink transition-all hover:opacity-85 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-muted">
          Remember your password?{" "}
          <Link to="/login" className="text-yellow no-underline hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
