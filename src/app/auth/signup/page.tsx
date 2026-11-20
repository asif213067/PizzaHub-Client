import type { Metadata } from "next";
import { SignUpForm } from "@/components/auth";

export const metadata: Metadata = {
  title: "Create Account - PizzaHub",
  description: "Join PizzaHub as a customer to order artisanal pizza, or as a restaurant vendor.",
};

export default function SignUpPage() {
  return <SignUpForm />;
}
