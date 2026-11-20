import { Suspense } from "react";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import { ItemDetailsClient } from "@/components/menu/item-details-client";
import { MenuItem } from "@/components/shared/pizza-card";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function fetchMenuItem(id: string): Promise<MenuItem | null> {
  const serverUrl =
    process.env.NEXT_PUBLIC_SERVER_BASE_URL || "http://localhost:5000";

  try {
    const res = await fetch(`${serverUrl}/api/menu/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const item = await fetchMenuItem(id);

  if (!item) {
    return {
      title: "Menu Item Not Found — PizzaHub",
    };
  }

  return {
    title: `${item.itemName} — PizzaHub`,
    description:
      item.description ||
      `Order fresh ${item.itemName} from ${item.vendor?.businessName || item.vendor?.name || "PizzaHub"}.`,
  };
}

async function MenuItemContent({ params }: PageProps) {
  const { id } = await params;

  // Server-side route protection: verify authenticated session cookie
  const cookieStore = await cookies();
  const sessionToken =
    cookieStore.get("better-auth.session_token")?.value ||
    cookieStore.get("__Secure-better-auth.session_token")?.value;

  if (!sessionToken) {
    redirect(`/auth/signin?callbackUrl=/menu/${id}`);
  }

  const item = await fetchMenuItem(id);

  if (!item) {
    notFound();
  }

  return <ItemDetailsClient item={item} />;
}

export default function MenuItemDetailsPage(props: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="w-full flex-1 max-w-6xl mx-auto py-12 px-4 sm:px-6 animate-pulse">
          <div className="h-4 w-48 bg-muted rounded-full mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-7 aspect-[16/10] rounded-2xl bg-muted" />
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="h-6 w-24 bg-muted rounded-full" />
              <div className="h-8 w-3/4 bg-muted rounded-full" />
              <div className="h-7 w-32 bg-muted rounded-full" />
              <div className="h-20 w-full bg-muted rounded-2xl" />
            </div>
          </div>
        </div>
      }
    >
      <MenuItemContent {...props} />
    </Suspense>
  );
}
