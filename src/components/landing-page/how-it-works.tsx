interface StepItem {
  step: number;
  title: string;
  description: string;
}

const STEPS: StepItem[] = [
  {
    step: 1,
    title: "Browse the menu",
    description:
      "Explore handcrafted pizzas from top-rated local shops with transparent prices and verified reviews.",
  },
  {
    step: 2,
    title: "Place your order",
    description:
      "Customize your pizza, select a delivery date and address, and submit your order seamlessly.",
  },
  {
    step: 3,
    title: "Vendor accepts",
    description:
      "The pizzeria receives your order, accepts it promptly, and bakes your pizza fresh to perfection.",
  },
  {
    step: 4,
    title: "Enjoy your pizza",
    description:
      "Your piping-hot pizza arrives fresh at your doorstep ready to satisfy every craving.",
  },
];

export function HowItWorks() {
  return (
    <section className="w-full py-6 sm:py-8 md:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section Heading matching the reference design */}
        <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-foreground tracking-tight mb-6 sm:mb-8">
          How PizzaHub Works
        </h2>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {STEPS.map((item) => (
            <div
              key={item.step}
              className="h-full min-h-55 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#28241E] border border-border/70 p-4 sm:p-6 flex flex-col items-start shadow-xs hover:shadow-md transition-shadow duration-200"
            >
              {/* Step Number */}
              <div className="size-9 shrink-0 rounded-full bg-(image:--gradient-primary) text-white font-heading font-bold text-sm flex items-center justify-center shadow-xs">
                {item.step}
              </div>

              {/* Title & Description */}
              <div className="mt-3 space-y-1">
                <h3 className="font-heading font-bold text-base sm:text-lg text-foreground tracking-tight min-h-12 flex items-center">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
