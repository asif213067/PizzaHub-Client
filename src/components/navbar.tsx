"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Pizza, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Browse Menu", href: "/menu" },
  ];

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
            <div className="size-8 sm:size-9 rounded-full bg-(image:--gradient-primary) flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <Pizza className="size-4 sm:size-5" />
            </div>
            <span className="font-heading font-extrabold text-lg sm:text-xl tracking-tight text-foreground">
              PizzaHub
            </span>
          </Link>

          {/* Middle: Home and Browse navigation links (hidden on mobile, visible from md up) */}
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

          {/* Right side: Light/Dark mode toggle + Sign In + Sign Up (Desktop) */}
          <div className="hidden md:flex items-center gap-3 sm:gap-4">
            <ThemeToggle />
            <Link
              href="/auth/signin"
              className="text-sm font-medium text-foreground/85 hover:text-foreground transition-colors px-2.5 py-1"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="bg-(image:--gradient-primary) hover:brightness-105 active:brightness-95 text-white text-sm font-semibold px-5 py-2 rounded-full shadow-xs transition-all cursor-pointer"
            >
              Sign Up
            </Link>
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
            <div className="flex flex-col gap-2 pt-1">
              <Link
                href="/auth/signin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-sm font-medium text-foreground rounded-full border border-border hover:bg-muted transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-sm font-semibold text-white bg-(image:--gradient-primary) hover:brightness-105 rounded-full shadow-xs transition-all"
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
