import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { authApi } from "@/lib/api";
import { toast } from "@/components/ui/toaster";
import GoogleIcon from "@/components/GoogleIcon";
import GoogleLoginPopup from "@/components/GoogleLoginPopup";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(name, email, password);
      toast.success("Account created! Welcome to DevSpace.");
      navigate("/");
    } catch (err: any) {
      toast.danger(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-[420px] flex-col items-center justify-center px-6 py-16">
      <div className="w-full rounded-md border-2 border-line bg-paper p-8">
        <h1 className="mb-2 font-display text-2xl font-bold">Create account</h1>
        <p className="mb-6 text-sm text-muted">Save your game scores, favorites, and progress.</p>

        <GoogleLoginPopup
          className="mb-2 w-full"
          onSuccess={() => navigate("/")}
        />

        <a
          href={authApi.getGoogleUrl()}
          className="mb-4 flex w-full items-center justify-center gap-3 rounded-md border-[1.5px] border-line bg-paper-dim px-4 py-3 text-sm font-semibold text-muted transition-all hover:border-foreground hover:text-foreground"
        >
          <GoogleIcon className="shrink-0" />
          Continue with Google (Full page)
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
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="rounded-md border-[1.5px] border-line bg-paper-dim px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-yellow"
          />
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
            placeholder="Password (min 6 characters)"
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
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-muted">
          Already have an account?{" "}
          <Link to="/login" className="text-yellow no-underline hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
