import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen bg-[image:var(--gradient-page)] flex flex-col items-center justify-center p-6 sm:p-12">
      <div className="w-full max-w-xl flex flex-col items-center text-center space-y-6">
        <div className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold text-stone-900 bg-[image:var(--gradient-gold)] shadow-sm">
          Premium
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground font-heading">
          Handcrafted Pizza Perfection
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground max-w-lg leading-relaxed">
          Fresh artisanal pizzas baked to order with premium organic ingredients and slow-fermented dough.
        </p>

        <div className="pt-2">
          <Button size="default">
            Order Now
          </Button>
        </div>

        <div className="w-full h-2.5 rounded-full bg-[image:var(--gradient-forest)] shadow-sm" />

        <div className="w-full bg-white border border-border rounded-xl p-6 text-left shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-foreground font-heading">
              Truffle Mushroom Pizza
            </h2>
            <span className="text-sm font-bold text-primary">
              $21.50
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Wild forest mushrooms, roasted garlic cream, fresh fior di latte mozzarella, thyme, and black truffle drizzle.
          </p>
        </div>
      </div>
    </main>
  );
}
