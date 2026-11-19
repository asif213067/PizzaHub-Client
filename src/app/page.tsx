import { HeroBanner } from "@/components/landing-page/hero-banner";
import { PizzaCategories } from "@/components/landing-page/pizza-categories";
import { WhyChooseUs } from "@/components/landing-page/why-choose-us";

export default function Home() {
  return (
    <main className="w-full flex flex-col">
      <HeroBanner />
      <PizzaCategories />
      <WhyChooseUs />
    </main>
  );
}
