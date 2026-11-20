import { HeroBanner } from "@/components/landing-page/hero-banner";
import { FeaturedMenu } from "@/components/landing-page/featured-menu";
import { PizzaCategories } from "@/components/landing-page/pizza-categories";
import { WhyChooseUs } from "@/components/landing-page/why-choose-us";
import { HowItWorks } from "@/components/landing-page/how-it-works";

export default function Home() {
  return (
    <main className="w-full flex flex-col">
      <HeroBanner />
      <PizzaCategories />
      <FeaturedMenu />
      <WhyChooseUs />
      <HowItWorks />
    </main>
  );
}
