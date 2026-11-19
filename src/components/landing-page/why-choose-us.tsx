import { Store, ShoppingBag, MapPin, ShieldCheck } from "lucide-react";

interface BenefitItem {
  id: string;
  title: string;
  description: string;
  icon: typeof Store;
}

const BENEFITS: BenefitItem[] = [
  {
    id: "local-shops",
    title: "Local shops",
    description: "Support your favorite neighborhood pizzerias baking handcrafted artisanal pizzas daily.",
    icon: Store,
  },
  {
    id: "easy-ordering",
    title: "Easy ordering",
    description: "Browse rich menus, customize toppings, and complete your order in just a few taps.",
    icon: ShoppingBag,
  },
  {
    id: "order-tracking",
    title: "Order tracking",
    description: "Stay updated at every step as vendors confirm, prepare, and deliver piping hot to your door.",
    icon: MapPin,
  },
  {
    id: "trusted-vendors",
    title: "Trusted vendors",
    description: "Every kitchen is verified with customer reviews and ratings for quality and hygiene.",
    icon: ShieldCheck,
  },
];

export function WhyChooseUs() {
  return (
    <section className="w-full py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Warm golden gradient container matching reference design */}
        <div className="w-full rounded-2xl sm:rounded-3xl bg-linear-to-r from-[#F2A541] via-[#F5B558] to-[#F8CB7A] dark:from-amber-600/90 dark:via-amber-500/80 dark:to-amber-400/80 p-6 sm:p-8 md:p-10 shadow-sm">
          {/* Section Heading */}
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-stone-900 tracking-tight mb-5 sm:mb-6 md:mb-8">
            Why Choose PizzaHub?
          </h2>

          {/* 4 Benefit Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-4.5 lg:gap-5">
            {BENEFITS.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={benefit.id}
                  className="rounded-2xl sm:rounded-2xl bg-[#FFF5E5] dark:bg-stone-900/90 backdrop-blur-xs p-5 sm:p-5.5 flex flex-col justify-between space-y-2.5 shadow-2xs hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded-full bg-amber-400/25 dark:bg-amber-400/20 flex items-center justify-center text-amber-800 dark:text-amber-300 shrink-0">
                      <Icon className="size-4" />
                    </div>
                    <h3 className="font-heading font-bold text-base sm:text-lg text-stone-900 dark:text-stone-100 tracking-tight">
                      {benefit.title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-[13px] text-stone-700 dark:text-stone-300 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
