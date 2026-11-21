import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";

export default function CustomerOrdersPage() {
  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="My Orders"
        subtitle="Manage and track all your pizza orders."
      />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-8 max-w-7xl">
        <div className="bg-white dark:bg-card border border-stone-200/70 dark:border-stone-800 rounded-3xl p-8 sm:p-12 shadow-xs text-center flex flex-col items-center justify-center">
          <div className="size-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
            <Clock className="size-7" />
          </div>
          <h2 className="font-heading text-xl font-bold text-foreground">
            My Orders
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-md">
            Full orders management view will be activated in the next step.
          </p>
          <Link
            href="/dashboard/customer"
            className="mt-6 inline-flex items-center gap-2 text-xs font-semibold px-5 py-2.5 rounded-full bg-primary text-white hover:brightness-105 transition-all shadow-xs"
          >
            <ArrowLeft className="size-4" /> Back to Overview
          </Link>
        </div>
      </main>
    </div>
  );
}
