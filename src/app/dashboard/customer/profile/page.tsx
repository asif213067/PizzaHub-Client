"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Camera,
  Loader2,
  CheckCircle2,
  AlertCircle,
  User,
  Phone,
  MapPin,
  Mail,
  Save,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { api, syncAuthToken } from "@/lib/api-client";
import { useSession, updateUser } from "@/lib/auth-client";
import { uploadToImgBB } from "@/lib/upload-imgbb";
import { userService } from "@/services/user.service";

interface CustomerProfile {
  _id?: string;
  name?: string;
  email?: string;
  image?: string;
  phone?: string;
  address?: string;
  role?: string;
  createdAt?: string;
}

export default function CustomerProfilePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile data from API
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Editable form fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // Image upload states
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadedImgUrl, setUploadedImgUrl] = useState<string>("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Save states
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  // Sync auth token
  useEffect(() => {
    if (session?.user?.email) {
      syncAuthToken(session.user.email);
    }
  }, [session]);

  // Fetch profile data
  const fetchProfile = useCallback(async () => {
    try {
      const res = await userService.getProfile();
      if (res?.data) {
        setProfile(res.data as unknown as CustomerProfile);
        setName(res.data.name ?? "");
        setPhone(res.data.phone ?? "");
        setAddress(res.data.address ?? "");
        setImagePreview(res.data.image ?? null);
        setUploadedImgUrl(res.data.image ?? "");
      }
    } catch {
      toast.error("Failed to load profile. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Track dirty state
  useEffect(() => {
    if (!profile) return;
    const changed =
      name !== (profile.name ?? "") ||
      phone !== (profile.phone ?? "") ||
      address !== (profile.address ?? "") ||
      uploadedImgUrl !== (profile.image ?? "");
    setIsDirty(changed);
  }, [name, phone, address, uploadedImgUrl, profile]);

  // Handle image file selection & ImgBB upload
  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are supported.");
      return;
    }

    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);

    setIsUploadingImage(true);
    try {
      const url = await uploadToImgBB(file);
      setUploadedImgUrl(url);
      setImagePreview(url);
      toast.success("Photo uploaded successfully!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload image.";
      toast.error(msg);
      // Revert preview on failure
      setImagePreview(profile?.image ?? null);
    } finally {
      setIsUploadingImage(false);
    }
  }

  function handleRemovePhoto() {
    setImagePreview(null);
    setUploadedImgUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // Save profile
  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaveError(null);
    setSaveSuccess(null);

    if (!name.trim()) {
      setSaveError("Full name cannot be empty.");
      return;
    }
    if (isUploadingImage) {
      setSaveError("Please wait for the image upload to complete.");
      return;
    }

    setIsSaving(true);
    try {
      const payload: Record<string, string> = {
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
      };

      // Only include image if changed
      if (uploadedImgUrl !== (profile?.image ?? "")) {
        payload.image = uploadedImgUrl;
      }

      const res = await userService.updateProfile(payload);

      if (res?.success) {
        // Update Better Auth session store so client state updates immediately
        try {
          await updateUser({
            name: name.trim(),
            image: uploadedImgUrl || undefined,
          });
        } catch (authErr) {
          console.warn("Better Auth updateUser background note:", authErr);
        }

        // Immediately notify all navbars and headers across the application
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("pizzahub-profile-updated", {
              detail: {
                name: name.trim(),
                image: uploadedImgUrl || "",
              },
            })
          );
        }

        setSaveSuccess("Profile updated successfully!");
        toast.success("Profile saved!");
        if (res.data) {
          setProfile(res.data);
          setIsDirty(false);
        }
        router.refresh();
      } else {
        const msg = res?.message || "Failed to update profile.";
        setSaveError(msg);
        toast.error(msg);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save profile.";
      setSaveError(msg);
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  }

  // Loading skeleton
  if (loading) {
    return (
      <div className="flex-1 flex flex-col">
        <DashboardHeader
          title="Profile Settings"
          subtitle="Manage your personal information and preferences."
        />
        <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-8 max-w-3xl w-full mx-auto space-y-5">
          <div className="bg-white dark:bg-card border border-stone-200/70 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xs animate-pulse">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center mb-8">
              <div className="size-20 rounded-2xl bg-muted/60 shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="w-36 h-5 bg-muted/60 rounded" />
                <div className="w-24 h-3 bg-muted/40 rounded" />
              </div>
            </div>
            {[1, 2, 3].map((n) => (
              <div key={n} className="mb-5">
                <div className="w-20 h-3 bg-muted/40 rounded mb-2" />
                <div className="w-full h-10 bg-muted/30 rounded-2xl" />
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  const displayName = name || profile?.name || "Customer";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Profile Settings"
        subtitle="Manage your personal information and preferences."
      />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-10 max-w-3xl w-full mx-auto space-y-5">
        <form onSubmit={handleSave} className="space-y-5">

          {/* ── Avatar / Photo Card ─────────────────────────────────── */}
          <div className="bg-white dark:bg-card border border-stone-200/70 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xs">
            <h2 className="font-heading text-base font-bold text-foreground mb-5">
              Profile Photo
            </h2>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* Avatar */}
              <div className="relative shrink-0">
                {imagePreview ? (
                  <div className="relative size-20">
                    <Image
                      src={imagePreview}
                      alt={displayName}
                      fill
                      className="rounded-2xl object-cover border border-stone-200 dark:border-stone-700 shadow-xs"
                    />
                    {isUploadingImage && (
                      <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
                        <Loader2 className="size-6 text-white animate-spin" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="size-20 rounded-2xl bg-[image:var(--gradient-primary)] text-white font-bold text-2xl flex items-center justify-center shadow-xs">
                    {initial}
                  </div>
                )}
              </div>

              {/* Upload Controls */}
              <div className="flex flex-col gap-2.5">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={isUploadingImage}
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isUploadingImage ? (
                      <>
                        <Loader2 className="size-3.5 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Camera className="size-3.5" />
                        Change Photo
                      </>
                    )}
                  </button>
                  {imagePreview && (
                    <button
                      type="button"
                      disabled={isUploadingImage}
                      onClick={handleRemovePhoto}
                      className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full border border-stone-200 dark:border-stone-700 text-muted-foreground hover:text-destructive hover:border-destructive/40 transition-colors cursor-pointer disabled:opacity-40"
                    >
                      <X className="size-3.5" />
                      Remove
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground">
                  PNG, JPG, WEBP or GIF. Max 5MB. Uploaded to ImgBB.
                </p>
              </div>
            </div>
          </div>

          {/* ── Personal Info Card ───────────────────────────────────── */}
          <div className="bg-white dark:bg-card border border-stone-200/70 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
            <h2 className="font-heading text-base font-bold text-foreground">
              Personal Information
            </h2>

            {/* Alerts */}
            {saveError && (
              <div className="flex items-center gap-2 p-3 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-2xl animate-in fade-in duration-200">
                <AlertCircle className="size-4 shrink-0" />
                <span>{saveError}</span>
              </div>
            )}
            {saveSuccess && (
              <div className="flex items-center gap-2 p-3 text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl animate-in fade-in duration-200">
                <CheckCircle2 className="size-4 shrink-0" />
                <span>{saveSuccess}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <User className="size-3.5 text-muted-foreground" />
                  Full Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setSaveError(null); setSaveSuccess(null); }}
                  placeholder="Your full name"
                  required
                  className="bg-muted/40 dark:bg-muted border border-border rounded-2xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition"
                />
              </div>

              {/* Email (read-only) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Mail className="size-3.5 text-muted-foreground" />
                  Email
                </label>
                <input
                  type="email"
                  value={profile?.email ?? session?.user?.email ?? ""}
                  readOnly
                  className="bg-muted/20 dark:bg-stone-900/40 border border-border rounded-2xl px-4 py-2.5 text-sm text-muted-foreground outline-none cursor-not-allowed select-none"
                />
                <p className="text-[11px] text-muted-foreground pl-1">
                  Email cannot be changed here.
                </p>
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Phone className="size-3.5 text-muted-foreground" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); setSaveError(null); setSaveSuccess(null); }}
                  placeholder="+1 (555) 000-0000"
                  className="bg-muted/40 dark:bg-muted border border-border rounded-2xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition"
                />
              </div>

              {/* Delivery Address */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <MapPin className="size-3.5 text-muted-foreground" />
                  Delivery Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => { setAddress(e.target.value); setSaveError(null); setSaveSuccess(null); }}
                  placeholder="123 Main Street, City, Country"
                  className="bg-muted/40 dark:bg-muted border border-border rounded-2xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition"
                />
              </div>
            </div>
          </div>

          {/* ── Account Info (read-only) ─────────────────────────────── */}
          <div className="bg-white dark:bg-card border border-stone-200/70 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xs">
            <h2 className="font-heading text-base font-bold text-foreground mb-5">
              Account Info
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Role", value: "Customer" },
                {
                  label: "Member Since",
                  value: profile?.createdAt
                    ? new Date(profile.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })
                    : "—",
                },
              ].map(({ label, value }) => (
                <div key={label} className="p-3 bg-muted/30 dark:bg-muted/20 rounded-2xl">
                  <p className="text-[11px] text-muted-foreground font-medium">{label}</p>
                  <p className="text-sm font-semibold text-foreground mt-0.5">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Save Button ──────────────────────────────────────────── */}
          <div className="flex items-center justify-end gap-3 pb-2">
            {isDirty && (
              <p className="text-xs text-muted-foreground mr-auto">
                You have unsaved changes.
              </p>
            )}
            <button
              type="submit"
              disabled={isSaving || isUploadingImage || !isDirty}
              className="flex items-center gap-2 text-sm font-bold px-6 py-2.5 rounded-full bg-[#c22d2f] hover:bg-[#a82527] text-white shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="size-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>

        </form>
      </main>
    </div>
  );
}
