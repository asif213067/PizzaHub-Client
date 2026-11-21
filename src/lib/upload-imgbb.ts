/**
 * Uploads an image file to ImgBB and returns the public direct image URL.
 */
export async function uploadToImgBB(file: File): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY

  if (!apiKey) {
    throw new Error(
      "ImgBB API key is missing. Please set NEXT_PUBLIC_IMGBB_API_KEY in your environment."
    );
  }

  // Validate file type
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files (PNG, JPG, WEBP) are supported.");
  }

  // Max 10MB for ImgBB free upload
  if (file.size > 10 * 1024 * 1024) {
    throw new Error("Image file size must be less than 32MB.");
  }

  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
  });

  const json = await res.json().catch(() => null);

  if (!res.ok || !json?.success) {
    throw new Error(
      json?.error?.message || `ImgBB upload failed with status ${res.status}`
    );
  }

  return json.data.url;
}
