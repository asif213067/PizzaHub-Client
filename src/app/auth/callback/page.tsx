"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { syncAuthToken } from "@/lib/api-client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.replace("/auth/signin");
      return;
    }

    async function handleSyncAndRedirect() {
      if (session?.user?.email) {
        await syncAuthToken(session.user.email);
      }

      // Check if a callbackUrl was stored before the Google OAuth redirect
      const storedCallback =
        typeof window !== "undefined"
          ? sessionStorage.getItem("auth_callback_url")
          : null;

      if (storedCallback) {
        sessionStorage.removeItem("auth_callback_url");
        router.replace(storedCallback);
        return;
      }

      const user = session?.user as { role?: string } | undefined;
      const role = user?.role;

      if (role === "admin") {
        router.replace("/dashboard/admin");
      } else if (role === "vendor") {
        router.replace("/dashboard/vendor");
      } else {
        router.replace("/dashboard/customer");
      }
    }

    handleSyncAndRedirect();
  }, [session, isPending, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-muted-foreground text-sm font-medium">Signing you in…</p>
    </div>
  );
}
