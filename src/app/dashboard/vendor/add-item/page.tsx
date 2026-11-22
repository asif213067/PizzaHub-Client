"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Camera, X, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { VendorUpgradeLimitModal } from "@/components/dashboard/vendor/vendor-upgrade-limit-modal";
import { api, syncAuthToken } from "@/lib/api-client";
import { useSession } from "@/lib/auth-client";
import { uploadToImgBB } from "@/lib/upload-imgbb";
import { VendorMenuItem } from "@/types/vendor";

const CATEGORIES = [
  "Classic Pizzas",
  "Vegetarian Pizzas",
  "Meat Lovers",
  "Gourmet Pizzas",
  "Sides & Appetizers",
  "Beverages & Desserts",
];

export default function VendorAddItemPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form Fields
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("Classic Pizzas");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [images, setImages] = useState<string[]>([]);

  // UI & Loading States
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Free Tier Limits State
  const [plan, setPlan] = useState<"free" | "premium">("free");
  const [activeOrPendingCount, setActiveOrPendingCount] = useState(0);
  const [checkingLimit, setCheckingLimit] = useState(true);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  // Sync auth token
  useEffect(() => {
    if (session?.user?.email) {
      syncAuthToken(session.user.email);
    }
  }, [session]);

  // Check vendor's tier and existing items count
  useEffect(() => {
    let isMounted = true;

    async function checkLimits() {
      try {
        const [profileRes, itemsRes] = await Promise.allSettled([
          api.get<{ success?: boolean; data?: { subscriptionPlan?: string } }>(
            "/api/users/profile"
          ),
          api.get<{ success?: boolean; data?: VendorMenuItem[] }>(
            "/api/menu/vendor/my-items"
          ),
        ]);

        if (!isMounted) return;

        if (profileRes.status === "fulfilled" && profileRes.value) {
          const profileData = profileRes.value.data;
          if (profileData?.subscriptionPlan === "premium") {
            setPlan("premium");
          } else {
            setPlan("free");
          }
        }

        if (itemsRes.status === "fulfilled" && itemsRes.value) {
          const list = itemsRes.value.data || [];
          const count = list.filter(
            (i) => i.status === "approved" || i.status === "pending"
          ).length;
          setActiveOrPendingCount(count);
        }
      } catch {
        // Silently continue; backend also validates limit
      } finally {
        if (isMounted) setCheckingLimit(false);
      }
    }

    checkLimits();

    return () => {
      isMounted = false;
    };
  }, []);

  const isFreeTierAtLimit = plan === "free" && activeOrPendingCount >= 3;

  // Handle Image Selection and Upload to ImgBB
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = 4 - images.length;
    if (remainingSlots <= 0) {
      toast.error("You can upload a maximum of 4 images.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);

    try {
      setUploadingImages(true);
      setError(null);
      const uploadedUrls: string[] = [];

      for (let i = 0; i < filesToUpload.length; i++) {
        const file = filesToUpload[i];
        setUploadProgress(
          `Uploading image ${i + 1} of ${filesToUpload.length} to ImgBB...`
        );
        const directUrl = await uploadToImgBB(file);
        uploadedUrls.push(directUrl);
      }

      setImages((prev) => [...prev, ...uploadedUrls]);
      toast.success(
        `${uploadedUrls.length} image${
          uploadedUrls.length > 1 ? "s" : ""
        } uploaded to ImgBB!`
      );
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to upload image. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setUploadingImages(false);
      setUploadProgress("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const resetForm = () => {
    setItemName("");
    setCategory("Classic Pizzas");
    setDescription("");
    setPrice("");
    setLocation("");
    setImages([]);
    setError(null);
    setUploadingImages(false);
    setUploadProgress("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!itemName.trim()) {
      setError("Item name is required.");
      return;
    }

    if (!category.trim()) {
      setError("Please select a category.");
      return;
    }

    if (!description.trim()) {
      setError("Description is required.");
      return;
    }

    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      setError("Please enter a valid positive price (e.g. 14.99).");
      return;
    }

    if (!location.trim()) {
      setError("Location (area, city) is required.");
      return;
    }

    if (images.length === 0) {
      setError("At least one image uploaded via ImgBB is required.");
      return;
    }

    // Free tier enforcement check
    if (isFreeTierAtLimit) {
      setUpgradeModalOpen(true);
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        itemName: itemName.trim(),
        category: category.trim(),
        description: description.trim(),
        price: numPrice,
        location: location.trim(),
        images,
      };

      const res = await api.post<{
        success: boolean;
        message?: string;
        data?: VendorMenuItem;
      }>("/api/menu", payload);

      if (res?.success) {
        resetForm();
        toast.success(
          "Menu item submitted! It is now pending admin approval."
        );
        router.refresh();
        router.push("/dashboard/vendor/items");
      } else {
        throw new Error(res?.message || "Failed to create menu item.");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to create menu item.";

      if (
        message.toLowerCase().includes("free tier limit") ||
        message.toLowerCase().includes("upgrade to premium")
      ) {
        setUpgradeModalOpen(true);
      } else {
        setError(message);
        toast.error(message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Add Menu Item"
        subtitle="Publish a new pizza, side, or drink."
      />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-12 max-w-4xl w-full mx-auto">
        {/* Free Tier Limit Notification Banner */}
        {!checkingLimit && isFreeTierAtLimit && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-start sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <AlertCircle className="size-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
              <div>
                <p className="text-xs sm:text-sm font-semibold text-amber-900 dark:text-amber-200">
                  Free tier limit reached ({activeOrPendingCount} of 3 items used)
                </p>
                <p className="text-[11px] sm:text-xs text-amber-700 dark:text-amber-300">
                  Upgrade to Premium for unlimited active menu items and priority
                  listing.
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/vendor/subscription"
              className="text-xs font-bold text-amber-800 dark:text-amber-200 hover:underline shrink-0"
            >
              Upgrade &rarr;
            </Link>
          </div>
        )}

        {/* Main Form Card matching reference design */}
        <div className="bg-white dark:bg-card border border-stone-200/70 dark:border-stone-800 rounded-3xl p-6 sm:p-8 md:p-10 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {/* Error Message Alert */}
            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center gap-2.5 text-xs text-rose-700 dark:text-rose-300">
                <AlertCircle className="size-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Item Name */}
            <div>
              <label
                htmlFor="itemName"
                className="block text-xs sm:text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1.5"
              >
                Item name
              </label>
              <input
                id="itemName"
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="[Item name]"
                required
                className="w-full px-4 py-3 rounded-2xl bg-[#fcf8f0] dark:bg-stone-900/70 border border-stone-200/80 dark:border-stone-800 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs sm:text-sm transition-all"
              />
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="block text-xs sm:text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1.5"
              >
                Category
              </label>
              <div className="relative">
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#fcf8f0] dark:bg-stone-900/70 border border-stone-200/80 dark:border-stone-800 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs sm:text-sm transition-all cursor-pointer appearance-none"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground">
                  <svg
                    className="size-4 fill-current"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-xs sm:text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1.5"
              >
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="[Item description]"
                rows={4}
                required
                className="w-full px-4 py-3 rounded-2xl bg-[#fcf8f0] dark:bg-stone-900/70 border border-stone-200/80 dark:border-stone-800 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs sm:text-sm transition-all resize-y min-h-[100px]"
              />
            </div>

            {/* Price & Location (Two Columns) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Price */}
              <div>
                <label
                  htmlFor="price"
                  className="block text-xs sm:text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1.5"
                >
                  Price
                </label>
                <input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="[Price]"
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-[#fcf8f0] dark:bg-stone-900/70 border border-stone-200/80 dark:border-stone-800 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs sm:text-sm transition-all"
                />
              </div>

              {/* Location */}
              <div>
                <label
                  htmlFor="location"
                  className="block text-xs sm:text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1.5"
                >
                  Location (area, city)
                </label>
                <input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="[Area, City]"
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-[#fcf8f0] dark:bg-stone-900/70 border border-stone-200/80 dark:border-stone-800 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs sm:text-sm transition-all"
                />
              </div>
            </div>

            {/* Item Images Dropzone */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                Item images (required, up to 4)
              </label>

              {/* Dropzone Container */}
              <div
                onClick={() => {
                  if (!uploadingImages && images.length < 4) {
                    fileInputRef.current?.click();
                  }
                }}
                className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
                  images.length >= 4
                    ? "opacity-60 cursor-not-allowed border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/30"
                    : "border-stone-300/80 dark:border-stone-700 bg-[#fcf8f0]/40 dark:bg-stone-900/30 hover:border-primary/50 hover:bg-[#fcf8f0]/70"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  multiple
                  onChange={handleFileChange}
                  disabled={uploadingImages || images.length >= 4}
                  className="hidden"
                />

                {/* Camera Icon */}
                <div className="size-11 sm:size-12 rounded-xl bg-stone-900 dark:bg-stone-800 text-white flex items-center justify-center shadow-xs mb-3">
                  {uploadingImages ? (
                    <Loader2 className="size-5 animate-spin text-white" />
                  ) : (
                    <Camera className="size-5" />
                  )}
                </div>

                <p className="font-heading font-bold text-xs sm:text-sm text-foreground">
                  {uploadingImages ? uploadProgress : "Click to upload images"}
                </p>
                <p className="text-[11px] sm:text-xs text-muted-foreground mt-1">
                  PNG or JPG. The first image is the cover.
                </p>
              </div>

              {/* Uploaded Images Preview Row */}
              {images.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  {images.map((url, idx) => (
                    <div
                      key={url}
                      className="group relative size-16 sm:size-20 rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-[#fcf8f0] dark:bg-stone-900 shadow-2xs"
                    >
                      <Image
                        src={url}
                        alt={`Item preview ${idx + 1}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />

                      {/* Cover label on first image */}
                      {idx === 0 && (
                        <div className="absolute top-1 left-1 bg-black/70 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                          Cover
                        </div>
                      )}

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 right-1 size-5 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-90 group-hover:opacity-100 hover:scale-110 transition-all cursor-pointer shadow-xs"
                        title="Remove image"
                      >
                        <X className="size-3" />
                      </button>

                      {/* Img label at bottom */}
                      <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] font-medium px-1 rounded">
                        Img {idx + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting || uploadingImages}
                className="w-full bg-[#c22d2f] hover:bg-[#a82527] text-white font-bold py-3.5 sm:py-4 rounded-full shadow-lg shadow-red-900/10 hover:shadow-xl transition-all text-xs sm:text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Publishing Menu Item...</span>
                  </>
                ) : (
                  <span>Add Menu Item</span>
                )}
              </button>

              <p className="text-[11px] sm:text-xs text-muted-foreground mt-2.5 text-center sm:text-left">
                New items start as Pending until an admin approves them.
              </p>
            </div>
          </form>
        </div>
      </main>

      {/* Upgrade Limit Modal */}
      <VendorUpgradeLimitModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
      />
    </div>
  );
}
