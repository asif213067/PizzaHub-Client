import { MenuPageClient } from "@/components/menu/menu-page-client";

export const metadata = {
  title: "Browse Menu — PizzaHub",
  description:
    "Search and browse all approved, active pizza and food items from local pizza shops on PizzaHub.",
};

export default function MenuPage() {
  return <MenuPageClient />;
}
