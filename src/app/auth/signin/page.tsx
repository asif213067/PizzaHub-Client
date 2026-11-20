import type { Metadata } from "next";
import { SignInForm } from "@/components/auth";

export const metadata: Metadata = {
  title: "Sign In - PizzaHub",
  description: "Sign in to order pizza or manage your restaurant on PizzaHub.",
};

export default function SignInPage() {
  return <SignInForm />;
}
