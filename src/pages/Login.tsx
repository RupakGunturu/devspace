import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { authApi } from "@/lib/api";
import { toast } from "@/components/ui/toaster";
import GoogleIcon from "@/components/GoogleIcon";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate("/");
    } catch (err: any) {
      toast.danger(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-[420px] flex-col items-center justify-center px-6 py-16">
      <div className="w-full rounded-md border-2 border-line bg-paper p-8">
        <h1 className="mb-2 font-display text-2xl font-bold">Welcome back</h1>
        <p className="mb-6 text-sm text-muted">Sign in to sync your progress across devices.</p>

        <a
          href={authApi.getGoogleUrl()}
          className="mb-4 flex w-full items-center justify-center gap-3 rounded-md border-[1.5px] border-line bg-paper-dim px-4 py-3 text-sm font-semibold text-foreground transition-all hover:border-foreground"
        >
          <GoogleIcon className="shrink-0" />
          Continue with Google
        </a>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-line" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-paper px-2 text-muted">or</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-md border-[1.5px] border-line bg-paper-dim px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-yellow"
          />
          <input
            type="password"
            placeholder="Password"
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
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-4 flex items-center justify-between text-xs text-muted">
          <Link to="/forgot-password" className="text-yellow no-underline hover:underline">
            Forgot password?
          </Link>
          <Link to="/signup" className="text-yellow no-underline hover:underline">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
