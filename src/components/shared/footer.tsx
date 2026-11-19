"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { Pizza, Globe } from "lucide-react";

const emptySubscribe = () => () => {};

export function Footer() {
  const currentYear = useSyncExternalStore(
    emptySubscribe,
    () => new Date().getFullYear(),
    () => 2026
  );

  return (
    <footer className="w-full mt-12 sm:mt-16">
      {/* Deep green rounded-top container matching the reference design */}
      <div className="w-full bg-[#1F4D3A] dark:bg-[#16382A] text-white/90 rounded-t-[32px] sm:rounded-t-[44px] lg:rounded-t-[52px] pt-10 sm:pt-14 pb-8 px-6 sm:px-10 lg:px-16 shadow-lg">
        <div className="max-w-6xl mx-auto">
          {/* Main 4-column footer content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-8 pb-10 sm:pb-12 border-b border-white/15">
            {/* 1. Left Side: Brand Logo & Description */}
            <div className="lg:col-span-4 space-y-3 sm:space-y-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-full"
              >
                <div className="size-8 sm:size-9 rounded-full bg-(image:--gradient-primary) flex items-center justify-center text-white shadow-xs">
                  <Pizza className="size-4 sm:size-5" />
                </div>
                <span className="font-heading font-extrabold text-xl sm:text-2xl text-white tracking-tight">
                  PizzaHub
                </span>
              </Link>
              <p className="text-xs sm:text-sm text-white/80 max-w-sm leading-relaxed">
                Artisanal pizza handcrafted daily with premium organic ingredients, baked to perfection, and delivered piping hot straight to your door.
              </p>
            </div>

            {/* 2. Quick Links */}
            <div className="lg:col-span-2 space-y-3">
              <h3 className="font-heading font-bold text-sm sm:text-base text-white tracking-tight">
                Links
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-white/80">
                <li>
                  <Link
                    href="/"
                    className="hover:text-white hover:underline transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/menu"
                    className="hover:text-white hover:underline transition-colors"
                  >
                    Browse Menu
                  </Link>
                </li>
                <li>
                  <Link
                    href="/auth/signin"
                    className="hover:text-white hover:underline transition-colors"
                  >
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link
                    href="/auth/signup"
                    className="hover:text-white hover:underline transition-colors"
                  >
                    Sign Up
                  </Link>
                </li>
              </ul>
            </div>

            {/* 3. Contact Information */}
            <div className="lg:col-span-3 space-y-3">
              <h3 className="font-heading font-bold text-sm sm:text-base text-white tracking-tight">
                Contact
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-white/80">
                <li>
                  <a
                    href="mailto:support@pizzahub.com"
                    className="hover:text-white transition-colors"
                  >
                    support@pizzahub.com
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+15552345678"
                    className="hover:text-white transition-colors"
                  >
                    +1 (555) 234-5678
                  </a>
                </li>
                <li className="leading-snug">
                  123 Artisanal Way, Food District
                </li>
              </ul>
            </div>

            {/* 4. Follow Us - 4 icons in exact order: LinkedIn, GitHub, X, Portfolio */}
            <div className="lg:col-span-3 space-y-3">
              <h3 className="font-heading font-bold text-sm sm:text-base text-white tracking-tight">
                Follow us
              </h3>
              <div className="flex items-center gap-2.5 sm:gap-3">
                {/* 1. LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/asif-hosen"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Profile"
                  className="size-9 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border border-white/15 flex items-center justify-center text-white transition-all shadow-2xs hover:shadow-sm cursor-pointer"
                >
                  <svg className="size-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.76v8.37H6.46v-8.37M7.84 6.2a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2" />
                  </svg>
                </a>

                {/* 2. GitHub */}
                <a
                  href="https://github.com/asif213067"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub Profile"
                  className="size-9 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border border-white/15 flex items-center justify-center text-white transition-all shadow-2xs hover:shadow-sm cursor-pointer"
                >
                  <svg className="size-4 fill-current" viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    />
                  </svg>
                </a>

                {/* 3. X (Twitter) */}
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X (Twitter) Profile"
                  className="size-9 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border border-white/15 flex items-center justify-center text-white transition-all shadow-2xs hover:shadow-sm cursor-pointer"
                >
                  <svg className="size-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>

                {/* 4. Portfolio */}
                <a
                  href="https://asif-hosen.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Portfolio Website"
                  className="size-9 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border border-white/15 flex items-center justify-center text-white transition-all shadow-2xs hover:shadow-sm cursor-pointer"
                >
                  <Globe className="size-4" />
                </a>
              </div>
            </div>
          </div>

          {/* 5. Copyright Notice (Dynamic Year) */}
          <div className="pt-6 sm:pt-8 text-center text-xs sm:text-[13px] text-white/70">
            <p>© {currentYear} PizzaHub. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
