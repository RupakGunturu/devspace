import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { authApi } from "@/lib/api";
import { toast } from "@/components/ui/toaster";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { refreshUser } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-[420px] flex-col items-center justify-center px-6 py-16">
        <div className="w-full rounded-md border-2 border-line bg-paper p-8 text-center">
          <div className="mb-4 text-4xl">❌</div>
          <h1 className="mb-2 font-display text-2xl font-bold">Invalid reset link</h1>
          <p className="mb-6 text-sm text-muted">
            This password reset link is invalid or has expired.
          </p>
          <Link
            to="/forgot-password"
            className="inline-block rounded-md border-0 bg-green px-6 py-3 text-sm font-bold text-ink no-underline transition-all hover:opacity-85"
          >
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { token: jwtToken } = await authApi.resetPassword(token, password);
      localStorage.setItem("ds_token", jwtToken);
      await refreshUser();
      toast.success("Password reset! Welcome back.");
      navigate("/");
    } catch (err: any) {
      toast.danger(err.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-[420px] flex-col items-center justify-center px-6 py-16">
      <div className="w-full rounded-md border-2 border-line bg-paper p-8">
        <h1 className="mb-2 font-display text-2xl font-bold">Set new password</h1>
        <p className="mb-6 text-sm text-muted">Choose a strong password for your account.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="password"
            placeholder="New password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="rounded-md border-[1.5px] border-line bg-paper-dim px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-yellow"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-md border-0 bg-green px-4 py-3 text-sm font-bold text-ink transition-all hover:opacity-85 disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
