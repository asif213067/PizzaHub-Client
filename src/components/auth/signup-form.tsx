"use client";

import { useState, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signUp, signIn } from "@/lib/auth-client";
import { syncAuthToken } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, Upload, X, ImageIcon } from "lucide-react";

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

type Role = "customer" | "vendor";

function validatePassword(pwd: string): string | null {
  if (pwd.length < 6) return "Password must be at least 6 characters.";
  if (!/[A-Z]/.test(pwd)) return "Password must contain at least one uppercase letter.";
  if (!/[a-z]/.test(pwd)) return "Password must contain at least one lowercase letter.";
  return null;
}

function SignUpFormFields() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("customer");

  // Profile image upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Handle image selected from computer or mobile file picker
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError("Selected image must be under 2MB.");
      return;
    }

    setError(null);
    setSelectedFile(file);

    // Create a local preview
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  function handleRemoveImage() {
    setSelectedFile(null);
    setImagePreview(null);
    setImageUrlInput("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate password rules: min 6 chars, 1 uppercase, 1 lowercase
    const pwdError = validatePassword(password);
    if (pwdError) {
      setError(pwdError);
      return;
    }

    // Role security check: strictly ensure customer or vendor
    const safeRole: Role = role === "vendor" ? "vendor" : "customer";

    setLoading(true);

    try {
      // Determine final image URL or data preview if provided
      const finalImage = imagePreview || imageUrlInput.trim() || undefined;

      const result = await signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        image: finalImage,
        // @ts-expect-error – Better Auth additionalFields
        role: safeRole,
      });

      if (result.error) {
        setError(result.error.message ?? "Registration failed. Please try again.");
        setLoading(false);
        return;
      }

      setSuccess("Account created successfully! Redirecting...");

      // Sync verified JWT with Express backend
      await syncAuthToken(email.trim());

      setTimeout(() => {
        const roleDashboard =
          safeRole === "vendor" ? "/dashboard/vendor" : "/dashboard/customer";
        router.push(callbackUrl || roleDashboard);
      }, 700);
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  }

  async function handleGoogleSignUp() {
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

  const roleCards: { id: Role; emoji: string; label: string; desc: string }[] = [
    { id: "customer", emoji: "🍕", label: "Customer", desc: "Browse and order pizza" },
    { id: "vendor", emoji: "🏪", label: "Vendor", desc: "Restaurant owner: publish menu items" },
  ];

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card rounded-3xl shadow-lg border border-border/60 px-6 sm:px-8 py-8 sm:py-10 transition-colors">
        {/* Heading */}
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-card-foreground mb-1 tracking-tight">
          Create your account
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          Join PizzaHub as a customer or a restaurant.
        </p>

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleSignUp}
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
        <form onSubmit={handleSignUp} className="flex flex-col gap-4">
          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-card-foreground pl-1" htmlFor="signup-name">
              Full name
            </label>
            <input
              id="signup-name"
              type="text"
              autoComplete="name"
              placeholder="Your full name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-muted/50 dark:bg-muted border border-border rounded-full px-4 py-2.5 text-sm text-card-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-card-foreground pl-1" htmlFor="signup-email">
              Email
            </label>
            <input
              id="signup-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-muted/50 dark:bg-muted border border-border rounded-full px-4 py-2.5 text-sm text-card-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-card-foreground pl-1" htmlFor="signup-password">
              Password
            </label>
            <input
              id="signup-password"
              type="password"
              autoComplete="new-password"
              placeholder="Create a password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-muted/50 dark:bg-muted border border-border rounded-full px-4 py-2.5 text-sm text-card-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition"
            />
            <p className="text-[11px] text-muted-foreground pl-2 mt-0.5">
              Must be at least 6 characters, with one uppercase and one lowercase letter.
            </p>
          </div>

          {/* Profile Image (Optional - Device Upload / Link) */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between pl-1">
              <label className="text-xs font-semibold text-card-foreground">
                Profile Image
              </label>
              <span className="text-[11px] text-muted-foreground">Optional (can skip)</span>
            </div>

            {imagePreview ? (
              /* Selected Image Preview */
              <div className="flex items-center gap-3 bg-muted/40 border border-border rounded-2xl p-2.5 animate-in fade-in duration-150">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreview}
                  alt="Profile Preview"
                  className="size-11 rounded-full object-cover border border-border shadow-2xs"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-card-foreground truncate">
                    {selectedFile ? selectedFile.name : "Custom profile picture"}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {selectedFile
                      ? `${(selectedFile.size / 1024).toFixed(0)} KB · Ready to save`
                      : "Image attached"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="p-1.5 rounded-full text-muted-foreground hover:text-destructive hover:bg-muted transition-colors cursor-pointer"
                  title="Remove image"
                >
                  <X className="size-4" />
                </button>
              </div>
            ) : (
              /* Image Upload Picker / Option */
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  {/* Native file input for Mobile & Computer */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="profile-file-input"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 flex items-center justify-center gap-2 bg-muted/50 dark:bg-muted border border-dashed border-border hover:border-primary/50 hover:bg-muted/80 rounded-full px-4 py-2.5 text-xs font-medium text-foreground transition-all cursor-pointer"
                  >
                    <Upload className="size-3.5 text-muted-foreground" />
                    <span>Upload from device</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className="p-2.5 rounded-full bg-muted/40 border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    title={showUrlInput ? "Hide image URL" : "Enter image URL instead"}
                  >
                    <ImageIcon className="size-3.5" />
                  </button>
                </div>

                {showUrlInput && (
                  <input
                    type="url"
                    placeholder="Or paste an image URL (https://...)"
                    value={imageUrlInput}
                    onChange={(e) => {
                      setImageUrlInput(e.target.value);
                      setImagePreview(e.target.value.trim() || null);
                    }}
                    className="w-full bg-muted/40 dark:bg-muted border border-border rounded-full px-4 py-2 text-xs text-card-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-ring transition animate-in fade-in duration-150"
                  />
                )}
              </div>
            )}
          </div>

          {/* Account Role Selection */}
          <div className="flex flex-col gap-2 pt-1">
            <span className="text-xs font-semibold text-card-foreground pl-1">
              Account role
            </span>
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              {roleCards.map((card) => {
                const isSelected = role === card.id;
                return (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => setRole(card.id)}
                    className={[
                      "flex flex-col items-start gap-1 rounded-2xl border-2 p-3 text-left transition-all cursor-pointer",
                      isSelected
                        ? "border-primary bg-accent/25 dark:bg-accent/15 shadow-2xs"
                        : "border-border/80 bg-muted/40 dark:bg-muted hover:border-primary/40",
                    ].join(" ")}
                  >
                    <span className="text-2xl leading-none select-none">{card.emoji}</span>
                    <span className="text-sm font-bold text-card-foreground mt-1">
                      {card.label}
                    </span>
                    <span className="text-[11px] text-muted-foreground leading-snug">
                      {card.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full bg-[image:var(--gradient-primary)] hover:brightness-105 active:brightness-95 text-white rounded-full py-2.5 font-semibold text-sm shadow-md transition-all mt-2 cursor-pointer"
          >
            {loading ? "Creating account…" : "Create Account"}
          </Button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link
            href={callbackUrl ? `/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/auth/signin"}
            className="font-semibold text-primary hover:underline transition-colors"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export function SignUpForm() {
  return (
    <Suspense fallback={<div className="text-sm text-muted-foreground text-center py-8">Loading sign up...</div>}>
      <SignUpFormFields />
    </Suspense>
  );
}
