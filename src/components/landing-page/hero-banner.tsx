import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function HeroBanner() {
  return (
    <section className="w-full py-6 sm:py-8 md:py-10 lg:py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-center">
          {/* Left Column: Heading, description, CTA */}
          <div className="lg:col-span-7 flex flex-col items-start justify-center space-y-3 sm:space-y-4">
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-[#FEEBC8] dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-200/70 dark:border-amber-800/50">
              Local pizza shops, delivered
            </div>

            {/* Main Headline */}
            <h1 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl lg:text-[40px] xl:text-[44px] text-foreground tracking-tight leading-[1.2]">
              Hot &amp;{" "}
              <span className="relative inline-block">
                <span className="relative z-10">Fresh Pizza</span>
                <span
                  aria-hidden="true"
                  className="absolute left-0 bottom-1 w-full h-2.5 sm:h-3 bg-[#F2A541]/75 dark:bg-[#F2A541]/55 rounded-xs -z-0"
                />
              </span>
              <br className="hidden sm:inline" />
              Delivered to Your Door
            </h1>

            {/* Sub-headline description */}
            <p className="text-sm sm:text-base text-muted-foreground max-w-lg leading-relaxed">
              Discover handcrafted artisanal pizzas from the finest local pizzerias in town. Baked fresh with organic ingredients and delivered piping hot straight to your doorstep.
            </p>

            {/* CTA Button */}
            <div className="pt-1.5 sm:pt-2">
              <Link
                href="/menu"
                className="group inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-[image:var(--gradient-primary)] text-white text-sm sm:text-base font-semibold shadow-xs hover:brightness-105 active:brightness-95 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span>Explore Pizza Menu</span>
                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Column: Clean rectangular/square image - no borders, no decorative frames */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end items-center">
            <div className="relative w-full max-w-[280px] sm:max-w-[340px] md:max-w-[380px] lg:max-w-[420px] aspect-square rounded-2xl overflow-hidden shadow-xs">
              <Image
                src="/images/banner.jpg"
                alt="Hot and fresh artisanal pizza"
                fill
                priority
                sizes="(max-width: 640px) 280px, (max-width: 1024px) 380px, 420px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
