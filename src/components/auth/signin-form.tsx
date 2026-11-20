"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { syncAuthToken } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle } from "lucide-react";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.14 0 5.95 1.08 8.17 2.86l6.1-6.1C34.46 3.19 29.5 1 24 1 14.82 1 7.07 6.49 3.64 14.26l7.14 5.55C12.6 13.59 17.84 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.52 24.5c0-1.56-.14-3.07-.4-4.5H24v8.5h12.65c-.55 2.9-2.19 5.35-4.67 7l7.14 5.55C43.35 37.17 46.52 31.3 46.52 24.5z"
      />
      <path
        fill="#FBBC05"
        d="M10.78 28.19A14.5 14.5 0 0 1 9.5 24c0-1.46.25-2.87.68-4.19L3.04 14.26A23.93 23.93 0 0 0 1 24c0 3.86.93 7.5 2.57 10.74l7.21-6.55z"
      />
      <path
        fill="#34A853"
        d="M24 47c5.5 0 10.12-1.82 13.5-4.95l-7.14-5.55C28.6 38.1 26.42 39 24 39c-6.16 0-11.4-4.09-13.22-9.81l-7.14 5.55C7.07 42.51 14.82 47 24 47z"
      />
    </svg>
  );
}

function SignInFormFields() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const blockedParam = searchParams.get("error") === "blocked";
  const callbackUrl = searchParams.get("callbackUrl");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(
    blockedParam ? "Your account has been blocked. Please contact support." : null
  );
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const result = await signIn.email({
        email,
        password,
      });

      if (result.error) {
        setError(result.error.message ?? "Invalid email or password.");
        setLoading(false);
        return;
      }

      setSuccess("Signed in successfully! Redirecting...");

      const user = result.data?.user as { role?: string; isBlocked?: boolean } | undefined;

      if (user?.isBlocked) {
        setError("Your account has been blocked. Access denied.");
        setSuccess(null);
        setLoading(false);
        return;
      }

      // Sync verified JWT with Express backend
      await syncAuthToken(email);

      const role = user?.role;
      setTimeout(() => {
        const roleDashboard =
          role === "admin"
            ? "/dashboard/admin"
            : role === "vendor"
            ? "/dashboard/vendor"
            : "/dashboard/customer";
        router.push(callbackUrl || roleDashboard);
      }, 700);
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setError(null);
    setSuccess(null);
    setGoogleLoading(true);
    try {
      // Store callbackUrl before OAuth redirect so the callback page can use it
      if (callbackUrl) {
        sessionStorage.setItem("auth_callback_url", callbackUrl);
      }
      await signIn.social({ provider: "google", callbackURL: "/auth/callback" });
    } catch {
      setError("Could not connect to Google. Please try again.");
      setGoogleLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card rounded-3xl shadow-lg border border-border/60 px-6 sm:px-8 py-8 sm:py-10 transition-colors">
        {/* Heading */}
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-card-foreground mb-1 tracking-tight">
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          Sign in to order pizza or manage your restaurant.
        </p>

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading || loading}
          className="w-full flex items-center justify-center gap-2.5 bg-muted/60 dark:bg-muted border border-border/80 rounded-full py-2.5 text-sm font-medium text-card-foreground hover:bg-muted transition-colors disabled:opacity-60 cursor-pointer shadow-2xs"
        >
          <GoogleIcon />
          {googleLoading ? "Connecting to Google…" : "Continue with Google"}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-border/70" />
          <span className="text-xs text-muted-foreground font-medium">or continue with email</span>
          <div className="flex-1 h-px bg-border/70" />
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-4 flex items-center gap-2 p-3 text-xs sm:text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-2xl animate-in fade-in duration-200">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 flex items-center gap-2 p-3 text-xs sm:text-sm text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl animate-in fade-in duration-200">
            <CheckCircle2 className="size-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSignIn} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-card-foreground pl-1" htmlFor="signin-email">
              Email
            </label>
            <input
              id="signin-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-muted/50 dark:bg-muted border border-border rounded-full px-4 py-2.5 text-sm text-card-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-card-foreground pl-1" htmlFor="signin-password">
              Password
            </label>
            <input
              id="signin-password"
              type="password"
              autoComplete="current-password"
              placeholder="Your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-muted/50 dark:bg-muted border border-border rounded-full px-4 py-2.5 text-sm text-card-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition"
            />
          </div>

          <Button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full bg-[image:var(--gradient-primary)] hover:brightness-105 active:brightness-95 text-white rounded-full py-2.5 font-semibold text-sm shadow-md transition-all mt-2 cursor-pointer"
          >
            {loading ? "Signing in…" : "Sign In"}
          </Button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          New to PizzaHub?{" "}
          <Link
            href={callbackUrl ? `/auth/signup?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/auth/signup"}
            className="font-semibold text-primary hover:underline transition-colors"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export function SignInForm() {
  return (
    <Suspense fallback={<div className="text-sm text-muted-foreground text-center py-8">Loading sign in...</div>}>
      <SignInFormFields />
    </Suspense>
  );
}
