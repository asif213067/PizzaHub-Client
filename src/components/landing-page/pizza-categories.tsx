import Link from "next/link";
import { Pizza, Leaf, Beef, Sparkles, UtensilsCrossed, CupSoda } from "lucide-react";

interface CategoryItem {
  id: string;
  name: string;
  icon: typeof Pizza;
  color: string;
  bgColor: string;
  slug: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: "classic",
    name: "Classic Pizza",
    icon: Pizza,
    color: "text-amber-400",
    bgColor: "bg-amber-400/20",
    slug: "classic",
  },
  {
    id: "vegetarian",
    name: "Vegetarian Pizza",
    icon: Leaf,
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/20",
    slug: "vegetarian",
  },
  {
    id: "meat-lovers",
    name: "Meat Lovers",
    icon: Beef,
    color: "text-rose-400",
    bgColor: "bg-rose-400/20",
    slug: "meat-lovers",
  },
  {
    id: "gourmet",
    name: "Gourmet Pizza",
    icon: Sparkles,
    color: "text-amber-300",
    bgColor: "bg-amber-300/20",
    slug: "gourmet",
  },
  {
    id: "sides",
    name: "Sides & Appetizers",
    icon: UtensilsCrossed,
    color: "text-orange-400",
    bgColor: "bg-orange-400/20",
    slug: "sides",
  },
  {
    id: "beverages",
    name: "Beverages & Desserts",
    icon: CupSoda,
    color: "text-sky-300",
    bgColor: "bg-sky-300/20",
    slug: "beverages",
  },
];

export function PizzaCategories() {
  return (
    <section className="w-full py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Deep forest green container matching the reference design */}
        <div className="w-full rounded-2xl sm:rounded-3xl bg-[#1F4D3A] dark:bg-[#16382A] py-8 sm:py-10 md:py-12 px-4 sm:px-6 md:px-8 shadow-sm">
          {/* Section Heading */}
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white text-center mb-6 sm:mb-8 md:mb-10 tracking-tight">
            Pizza Categories
          </h2>

          {/* 6 Circular Category Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5 lg:gap-4 justify-items-center items-center">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.id}
                  href={`/menu?category=${cat.slug}`}
                  className="group flex flex-col items-center justify-center size-26 sm:size-28 md:size-32 rounded-full bg-white/10 hover:bg-white/18 active:scale-95 border border-white/15 backdrop-blur-xs transition-all duration-200 cursor-pointer p-2.5 text-center shadow-2xs hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
                >
                  {/* Icon */}
                  <div
                    className={`size-8 sm:size-9 md:size-10 rounded-full ${cat.bgColor} flex items-center justify-center ${cat.color} group-hover:scale-110 transition-transform duration-200 shrink-0`}
                  >
                    <Icon className="size-4 sm:size-5 md:size-5.5" />
                  </div>

                  {/* Category Label */}
                  <span className="font-heading font-medium text-[11px] sm:text-xs md:text-[12.5px] text-white/90 group-hover:text-white leading-tight mt-1.5 sm:mt-2 px-1 text-center line-clamp-2">
                    {cat.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
