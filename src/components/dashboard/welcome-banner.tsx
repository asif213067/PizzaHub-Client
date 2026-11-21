"use client";

import Link from "next/link";
import { useSession } from "@/lib/auth-client";

export function WelcomeBanner() {
  const { data: session } = useSession();
  const userName = session?.user?.name || "Pizza Lover";

  return (
    <div className="relative overflow-hidden rounded-3xl p-6 sm:p-7 bg-gradient-to-r from-[#f7a93b] via-[#f7b74e] to-[#f9cd6c] text-stone-900 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      {/* Left text */}
      <div className="max-w-xl">
        <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
          Welcome back, {userName}
        </h2>
        <p className="text-xs sm:text-sm text-stone-800/90 font-medium mt-1">
          Track your pizza orders and discover new menu items.
        </p>
      </div>

      {/* Right button */}
      <Link
        href="/menu"
        className="shrink-0 bg-[#c22d2f] hover:bg-[#a82527] active:scale-95 text-white font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all text-center"
      >
        Browse Menu
      </Link>
    </div>
  );
}
