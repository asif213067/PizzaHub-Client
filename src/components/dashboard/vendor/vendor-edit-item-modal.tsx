"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { X, Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import { uploadToImgBB } from "@/lib/upload-imgbb";
import { VendorMenuItem } from "@/types/vendor";

interface VendorEditItemModalProps {
  item: VendorMenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onItemUpdated: (updatedItem: VendorMenuItem) => void;
}

const CATEGORIES = [
  "Classic",
  "Vegetarian",
  "Meat Lovers",
  "Specialty / Gourmet",
  "Sides & Appetizers",
  "Beverages & Desserts",
];

export function VendorEditItemModal({
  item,
  isOpen,
  onClose,
  onItemUpdated,
}: VendorEditItemModalProps) {
  if (!isOpen || !item) return null;

  return (
    <VendorEditItemForm
      key={item._id}
      item={item}
      onClose={onClose}
      onItemUpdated={onItemUpdated}
    />
  );
}

function VendorEditItemForm({
  item,
  onClose,
  onItemUpdated,
}: {
  item: VendorMenuItem;
  onClose: () => void;
  onItemUpdated: (updatedItem: VendorMenuItem) => void;
}) {
  const [itemName, setItemName] = useState(item.itemName || "");
  const [category, setCategory] = useState(item.category || "Classic");
  const [price, setPrice] = useState(String(item.price ?? ""));
  const [location, setLocation] = useState(item.location || "");
  const [description, setDescription] = useState(item.description || "");
  const [images, setImages] = useState<string[]>(() => {
    return Array.isArray(item.images) && item.images.length > 0
      ? item.images
      : typeof (item as unknown as { image?: string }).image === "string" &&
        (item as unknown as { image?: string }).image
      ? [(item as unknown as { image?: string }).image!]
      : [];
  });
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !submitting && !uploadingImages) onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [submitting, uploadingImages, onClose]);

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!itemName.trim()) {
      setError("Item name is required.");
      return;
    }

    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      setError("Please enter a valid positive price.");
      return;
    }

    if (!location.trim()) {
      setError("Location is required.");
      return;
    }

    if (images.length === 0) {
      setError("At least one image is required.");
      return;
    }

    if (!item) return;

    try {
      setSubmitting(true);

      const res = await api.put<{ success: boolean; data: VendorMenuItem }>(
        `/api/menu/${item._id}`,
        {
          itemName: itemName.trim(),
          category,
          price: numPrice,
          location: location.trim(),
          description: description.trim(),
          images,
        }
      );

      if (res?.success && res.data) {
        toast.success("Menu item updated successfully!");
        onItemUpdated(res.data);
        onClose();
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update item.";
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-lg bg-card text-card-foreground border border-border/80 rounded-3xl shadow-2xl p-5 sm:p-6 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-item-modal-title"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={submitting || uploadingImages}
          className="absolute top-4 right-4 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer disabled:opacity-50"
          aria-label="Close dialog"
        >
          <X className="size-4" />
        </button>

        {/* Modal Header */}
        <div className="mb-4 pr-7">
          <h2
            id="edit-item-modal-title"
            className="font-heading text-lg sm:text-xl font-bold tracking-tight text-foreground"
          >
            Edit Menu Item
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Update pricing, category, and details for this pizza
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-destructive/10 text-destructive border border-destructive/20 text-xs">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* Item Name */}
          <div className="space-y-1">
            <label
              htmlFor="edit-item-name"
              className="font-semibold text-foreground"
            >
              Item Name *
            </label>
            <input
              id="edit-item-name"
              type="text"
              required
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full bg-muted/40 dark:bg-muted/30 border border-border rounded-xl px-3.5 py-2 text-sm text-foreground outline-hidden focus:ring-2 focus:ring-primary/25 focus:border-primary transition"
            />
          </div>

          {/* Category & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label
                htmlFor="edit-item-category"
                className="font-semibold text-foreground"
              >
                Category *
              </label>
              <select
                id="edit-item-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-muted/40 dark:bg-muted/30 border border-border rounded-xl px-3.5 py-2 text-sm text-foreground outline-hidden focus:ring-2 focus:ring-primary/25 focus:border-primary transition cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="edit-item-price"
                className="font-semibold text-foreground"
              >
                Price ($) *
              </label>
              <input
                id="edit-item-price"
                type="number"
                step="0.01"
                min="0.5"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-muted/40 dark:bg-muted/30 border border-border rounded-xl px-3.5 py-2 text-sm text-foreground outline-hidden focus:ring-2 focus:ring-primary/25 focus:border-primary transition"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-1">
            <label
              htmlFor="edit-item-location"
              className="font-semibold text-foreground"
            >
              Location (Area, City) *
            </label>
            <input
              id="edit-item-location"
              type="text"
              required
              placeholder="e.g. Downtown, Pabna"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-muted/40 dark:bg-muted/30 border border-border rounded-xl px-3.5 py-2 text-sm text-foreground outline-hidden focus:ring-2 focus:ring-primary/25 focus:border-primary transition"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label
              htmlFor="edit-item-description"
              className="font-semibold text-foreground"
            >
              Description
            </label>
            <textarea
              id="edit-item-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the crust, toppings, cheese, and special preparation..."
              className="w-full bg-muted/40 dark:bg-muted/30 border border-border rounded-xl px-3.5 py-2 text-sm text-foreground outline-hidden focus:ring-2 focus:ring-primary/25 focus:border-primary transition resize-none"
            />
          </div>

          {/* Item Images Dropzone (required, up to 4) */}
          <div className="space-y-1.5 pt-1">
            <label className="font-semibold text-foreground block">
              Item images (required, up to 4)
            </label>

            {/* Dropzone Container */}
            <div
              onClick={() => {
                if (!uploadingImages && images.length < 4) {
                  fileInputRef.current?.click();
                }
              }}
              className={`border-2 border-dashed rounded-2xl p-6 sm:p-7 text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
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
              <div className="mt-3 flex flex-wrap items-center gap-3">
                {images.map((url, idx) => (
                  <div
                    key={`${url}-${idx}`}
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
                      disabled={uploadingImages || submitting}
                      className="absolute top-1 right-1 size-5 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-90 group-hover:opacity-100 hover:scale-110 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                      title="Remove image"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-border/70 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting || uploadingImages}
              className="px-5 py-2 rounded-full border border-border text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting || uploadingImages}
              className="px-6 py-2 rounded-full bg-[#c22d2f] hover:bg-[#a82527] active:scale-95 text-white font-semibold text-xs transition-all shadow-xs disabled:opacity-60 cursor-pointer"
            >
              {submitting ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
