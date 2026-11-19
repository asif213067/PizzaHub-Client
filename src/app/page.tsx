import { HeroBanner } from "@/components/landing-page/hero-banner";
import { PizzaCategories } from "@/components/landing-page/pizza-categories";

export default function Home() {
  return (
    <main className="w-full flex flex-col">
      <HeroBanner />
      <PizzaCategories />
    </main>
  );
}
