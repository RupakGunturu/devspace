import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "@/components/ui/toaster";
import GoogleLoginPopup from "@/components/GoogleLoginPopup";
import { getLastAccount } from "@/lib/rememberAccount";

export default function Login() {
  const { user, login, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const lastUser = getLastAccount();
  const showChooser = !user && !!lastUser && !showForm;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate(redirectTo);
    } catch (err) {
      toast.danger(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = async () => {
    setLoading(true);
    try {
      await refreshUser();
      if (localStorage.getItem("ds_token")) {
        navigate(redirectTo);
        return;
      }
      setEmail(lastUser?.email ?? "");
      setShowForm(true);
      toast.danger("Session expired — enter your password to continue");
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-[420px] flex-col items-center justify-center px-6 py-16">
        <div className="w-full rounded-md border-2 border-line bg-paper p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-green/10 font-display text-2xl font-bold text-green">
            {user.avatar ? (
              <img src={user.avatar} alt="" className="h-full w-full rounded-full object-cover" />
            ) : (
              user.name.charAt(0).toUpperCase()
            )}
          </div>
          <h1 className="mb-1 font-display text-2xl font-bold">Signed in as</h1>
          <p className="font-display text-lg font-bold text-foreground">{user.name}</p>
          <p className="mb-6 text-sm text-muted">{user.email}</p>
          <button
            type="button"
            onClick={() => navigate(redirectTo)}
            className="w-full rounded-md border-0 bg-green px-4 py-3 text-sm font-bold text-ink transition-all hover:opacity-85"
          >
            Continue to DevSpace
          </button>
          <p className="mt-4 text-xs text-muted">
            Not you?{" "}
            <button
              type="button"
              onClick={logout}
              className="cursor-pointer border-0 bg-transparent p-0 font-inherit text-yellow no-underline hover:underline"
            >
              Sign out
            </button>
          </p>
        </div>
      </div>
    );
  }

  if (showChooser) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-[420px] flex-col items-center justify-center px-6 py-16">
        <div className="w-full rounded-md border-2 border-line bg-paper p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-green/10 font-display text-2xl font-bold text-green">
            {lastUser.avatar ? (
              <img
                src={lastUser.avatar}
                alt=""
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              lastUser.name.charAt(0).toUpperCase()
            )}
          </div>
          <h1 className="mb-1 font-display text-2xl font-bold">Welcome back</h1>
          <p className="mb-1 text-sm text-muted">Continue as</p>
          <p className="font-display text-lg font-bold text-foreground">{lastUser.name}</p>
          <p className="mb-6 text-sm text-muted">{lastUser.email}</p>
          <button
            type="button"
            onClick={handleContinue}
            disabled={loading}
            className="w-full rounded-md border-0 bg-green px-4 py-3 text-sm font-bold text-ink transition-all hover:opacity-85 disabled:opacity-50"
          >
            {loading ? "Checking..." : `Continue as ${lastUser.name}`}
          </button>
          <p className="mt-4 text-xs text-muted">
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="cursor-pointer border-0 bg-transparent p-0 font-inherit text-yellow no-underline hover:underline"
            >
              Use another account
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-[420px] flex-col items-center justify-center px-6 py-16">
      <div className="w-full rounded-md border-2 border-line bg-paper p-8">
        {showForm && lastUser && (
          <p className="mb-4 text-center text-xs text-muted">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="cursor-pointer border-0 bg-transparent p-0 font-inherit text-yellow no-underline hover:underline"
            >
              ← Back to {lastUser.name}
            </button>
          </p>
        )}
        <h1 className="mb-2 font-display text-2xl font-bold">Welcome back</h1>
        <p className="mb-6 text-sm text-muted">Sign in to sync your progress across devices.</p>

        <GoogleLoginPopup className="mb-2 w-full" onSuccess={() => navigate(redirectTo)} />
        <p className="mb-4 text-center text-[11px] leading-relaxed text-muted">
          Your name, email, and avatar will be imported from your Google account.
        </p>

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
