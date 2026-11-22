"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/shared/footer";

export function AuthFooter() {
  const pathname = usePathname();

  // Remove footer on Sign Up page as requested
  if (pathname?.includes("/signup")) {
    return null;
  }

  return <Footer />;
}
