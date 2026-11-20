"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Pizza,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  User,
  LogOut,
  ShoppingBag,
  Store,
  ShieldCheck,
} from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { useSession, signOut } from "@/lib/auth-client";
import { clearStoredToken } from "@/lib/api-client";
import { toast } from "sonner";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle Logout
  async function handleLogout() {
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
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

  const user = session?.user as
    | { name?: string; email?: string; image?: string; role?: string }
    | undefined;

  const role = user?.role || "customer";

  // Dashboard link based on role
  const dashboardHref =
    role === "admin"
      ? "/dashboard/admin"
      : role === "vendor"
      ? "/dashboard/vendor"
      : "/dashboard/customer";

  // Build callbackUrl — only for non-auth, non-dashboard pages
  const isAuthOrDashboard =
    pathname.startsWith("/auth") || pathname.startsWith("/dashboard");
  const encodedCallback = isAuthOrDashboard
    ? ""
    : `?callbackUrl=${encodeURIComponent(pathname)}`;

  // Base navigation links
  const navLinks: { name: string; href: string; icon?: typeof Pizza }[] = [
    { name: "Home", href: "/" },
    { name: "Browse Menu", href: "/menu" },
  ];

  // Role-specific quick link for logged-in users
  if (user) {
    if (role === "customer") {
      navLinks.push({
        name: "My Orders",
        href: "/dashboard/customer/orders",
        icon: ShoppingBag,
      });
    } else if (role === "vendor") {
      navLinks.push({
        name: "My Menu",
        href: "/dashboard/vendor/items",
        icon: Store,
      });
    } else if (role === "admin") {
      navLinks.push({
        name: "Manage Users",
        href: "/dashboard/admin/users",
        icon: ShieldCheck,
      });
    }
  }

  // Get user initials for avatar fallback
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  return (
    <header className="w-full pt-4 px-4 sm:px-6 lg:px-8 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto">
        <nav
          aria-label="Main Navigation"
          className="w-full bg-white/95 dark:bg-[#28241E]/95 backdrop-blur-md rounded-full border border-border/70 px-5 sm:px-6 py-2.5 sm:py-3 shadow-xs flex items-center justify-between transition-all"
        >
          {/* Left side: Website Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full"
          >
            <div className="size-8 sm:size-9 rounded-full bg-[image:var(--gradient-primary)] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <Pizza className="size-4 sm:size-5" />
            </div>
            <span className="font-heading font-extrabold text-lg sm:text-xl tracking-tight text-foreground">
              PizzaHub
            </span>
          </Link>

          {/* Middle: Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive
                      ? "text-primary font-semibold"
                      : "text-foreground/80 hover:text-foreground"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right side: Desktop Controls */}
          <div className="hidden md:flex items-center gap-3 sm:gap-4">
            <ThemeToggle />

            {isPending ? (
              // Loading Skeleton
              <div className="w-20 h-9 rounded-full bg-muted/60 animate-pulse" />
            ) : user ? (
              // Logged In: Profile Dropdown
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  aria-expanded={profileDropdownOpen}
                  aria-label="User menu"
                  className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full border border-border/70 hover:border-primary/40 bg-muted/40 hover:bg-muted/70 transition-all cursor-pointer"
                >
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || "User"}
                      width={32}
                      height={32}
                      className="size-7 sm:size-8 rounded-full object-cover border border-border/60"
                    />
                  ) : (
                    <div className="size-7 sm:size-8 rounded-full bg-primary/15 text-primary font-semibold text-xs flex items-center justify-center border border-primary/25">
                      {initials}
                    </div>
                  )}
                  <span className="text-xs sm:text-sm font-semibold text-foreground max-w-[100px] truncate">
                    {user.name || "My Account"}
                  </span>
                  <ChevronDown
                    className={`size-3.5 text-muted-foreground transition-transform duration-200 ${
                      profileDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#28241E] border border-border/80 shadow-xl py-2 z-50 animate-in fade-in-50 zoom-in-95 duration-150">
                    {/* User Header Info */}
                    <div className="px-4 py-2.5 border-b border-border/60">
                      <p className="text-sm font-bold text-card-foreground truncate">
                        {user.name || "User"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email || ""}
                      </p>
                      <span className="inline-block mt-1.5 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                        {role === "admin"
                          ? "Administrator"
                          : role === "vendor"
                          ? "Restaurant Vendor"
                          : "Customer"}
                      </span>
                    </div>

                    {/* Links */}
                    <div className="py-1">
                      <Link
                        href={dashboardHref}
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs sm:text-sm font-medium text-card-foreground hover:bg-muted/70 transition-colors"
                      >
                        <LayoutDashboard className="size-4 text-muted-foreground" />
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        href="/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs sm:text-sm font-medium text-card-foreground hover:bg-muted/70 transition-colors"
                      >
                        <User className="size-4 text-muted-foreground" />
                        <span>Profile Settings</span>
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-border/60 pt-1">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs sm:text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                      >
                        <LogOut className="size-4" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Logged Out: Sign In & Sign Up
              <>
                <Link
                  href={`/auth/signin${encodedCallback}`}
                  className="text-sm font-medium text-foreground/85 hover:text-foreground transition-colors px-2.5 py-1"
                >
                  Sign In
                </Link>
                <Link
                  href={`/auth/signup${encodedCallback}`}
                  className="bg-[image:var(--gradient-primary)] hover:brightness-105 active:brightness-95 text-white text-sm font-semibold px-5 py-2 rounded-full shadow-xs transition-all cursor-pointer"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Right side: Theme toggle + Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              className="p-1.5 rounded-full text-foreground/80 hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 rounded-2xl bg-white/95 dark:bg-[#28241E]/95 backdrop-blur-md border border-border/80 p-4 shadow-lg flex flex-col gap-3 animate-in slide-in-from-top-2 duration-150">
            {/* User Profile on Mobile if logged in */}
            {user && (
              <div className="flex items-center gap-3 pb-3 border-b border-border/60">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || "User"}
                    width={40}
                    height={40}
                    className="size-10 rounded-full object-cover border border-border/60"
                  />
                ) : (
                  <div className="size-10 rounded-full bg-primary/15 text-primary font-bold text-sm flex items-center justify-center border border-primary/25">
                    {initials}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                  <span className="inline-block mt-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    {role}
                  </span>
                </div>
              </div>
            )}

            {/* Navigation Links */}
            <div className="flex flex-col gap-1 pb-3 border-b border-border/60">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? "text-primary font-semibold bg-primary/10"
                        : "text-foreground/80 hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 pt-1">
              {user ? (
                <>
                  <Link
                    href={dashboardHref}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 py-2 text-sm font-semibold text-white bg-[image:var(--gradient-primary)] hover:brightness-105 rounded-full shadow-xs transition-all"
                  >
                    <LayoutDashboard className="size-4" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-foreground rounded-full border border-border hover:bg-muted transition-colors"
                  >
                    <User className="size-4" />
                    <span>Profile Settings</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-destructive rounded-full border border-destructive/20 hover:bg-destructive/10 transition-colors cursor-pointer"
                  >
                    <LogOut className="size-4" />
                    <span>Log Out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href={`/auth/signin${encodedCallback}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2 text-sm font-medium text-foreground rounded-full border border-border hover:bg-muted transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href={`/auth/signup${encodedCallback}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2 text-sm font-semibold text-white bg-[image:var(--gradient-primary)] hover:brightness-105 rounded-full shadow-xs transition-all"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
