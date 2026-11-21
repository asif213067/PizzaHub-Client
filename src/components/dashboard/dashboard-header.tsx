"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, ChevronDown, User, ShoppingBag, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useSession, signOut } from "@/lib/auth-client";
import { clearStoredToken } from "@/lib/api-client";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { useDashboard } from "./dashboard-context";

interface DashboardHeaderProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function DashboardHeader({
  title = "Overview",
  subtitle = "Your orders at a glance.",
  action,
}: DashboardHeaderProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const { toggleSidebar, toggleMobileSidebar } = useDashboard();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const user = session?.user as
    | { name?: string; email?: string; image?: string; role?: string }
    | undefined;

  const displayName = user?.name || "Customer";
  const userInitial = displayName.charAt(0).toUpperCase() || "A";

  async function handleLogout() {
    try {
      await signOut();
      clearStoredToken();
      toast.success("Signed out successfully");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Failed to sign out. Please try again.");
    }
  }

  function handleMenuClick() {
    // If screen is lg (>= 1024), toggle desktop collapse; otherwise open mobile drawer
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  }

  return (
    <header className="flex items-center justify-between gap-4 py-4 px-4 sm:px-6 lg:px-8">
      {/* Left: Menu Toggle + Title & Subtitle */}
      <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
        <button
          type="button"
          onClick={handleMenuClick}
          className="size-9 rounded-full bg-[#fce8cc] dark:bg-stone-800 text-stone-800 dark:text-stone-200 flex items-center justify-center shadow-2xs hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
          aria-label="Toggle sidebar"
          title="Toggle sidebar"
        >
          <Menu className="size-4" />
        </button>

        <div className="min-w-0">
          <h1 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-foreground truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Right: Action Button + Theme Toggle + Profile Dropdown */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        {action && <div>{action}</div>}
        <ThemeToggle />

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            aria-expanded={profileDropdownOpen}
            aria-label="User profile menu"
            className="flex items-center gap-2 py-1 pl-1 pr-2.5 sm:pr-3 rounded-full bg-white dark:bg-card border border-stone-200/80 dark:border-stone-800 shadow-xs hover:border-primary/40 hover:bg-stone-50 dark:hover:bg-stone-800/80 transition-all cursor-pointer"
          >
            {user?.image ? (
              <Image
                src={user.image}
                alt={displayName}
                width={28}
                height={28}
                className="size-7 rounded-full object-cover"
              />
            ) : (
              <div className="size-7 rounded-full bg-[image:var(--gradient-primary)] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                {userInitial}
              </div>
            )}
            <span className="text-xs font-semibold text-foreground max-w-[110px] truncate hidden sm:inline-block">
              {displayName}
            </span>
            <ChevronDown
              className={`size-3 text-muted-foreground transition-transform duration-200 ${
                profileDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#23201d] border border-border/80 shadow-xl py-2 z-50 animate-in fade-in-50 zoom-in-95 duration-150">
              <div className="px-4 py-2 border-b border-border/60">
                <p className="text-xs font-bold text-foreground truncate">
                  {displayName}
                </p>
                <p className="text-[11px] text-muted-foreground truncate">
                  {user?.email || ""}
                </p>
              </div>

              <div className="py-1">
                {user?.role === "vendor" ? (
                  <>
                    <Link
                      href="/dashboard/vendor/orders"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-foreground hover:bg-muted/70 transition-colors"
                    >
                      <ShoppingBag className="size-3.5 text-muted-foreground" />
                      <span>Customer Orders</span>
                    </Link>
                    <Link
                      href="/dashboard/vendor/items"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-foreground hover:bg-muted/70 transition-colors"
                    >
                      <User className="size-3.5 text-muted-foreground" />
                      <span>My Menu Items</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/dashboard/customer/orders"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-foreground hover:bg-muted/70 transition-colors"
                    >
                      <ShoppingBag className="size-3.5 text-muted-foreground" />
                      <span>My Orders</span>
                    </Link>
                    <Link
                      href="/dashboard/customer/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-foreground hover:bg-muted/70 transition-colors"
                    >
                      <User className="size-3.5 text-muted-foreground" />
                      <span>Profile Settings</span>
                    </Link>
                  </>
                )}
              </div>

              <div className="border-t border-border/60 pt-1">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                >
                  <LogOut className="size-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
