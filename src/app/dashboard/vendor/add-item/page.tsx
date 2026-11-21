import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";

export default function VendorAddItemPage() {
  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Add Menu Item"
        subtitle="Add a new delicious pizza to your catalog."
      />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-8 max-w-7xl">
        <div className="bg-white dark:bg-card border border-stone-200/70 dark:border-stone-800 rounded-3xl p-8 sm:p-12 shadow-xs text-center flex flex-col items-center justify-center">
          <div className="size-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
            <Plus className="size-7" />
          </div>
          <h2 className="font-heading text-xl font-bold text-foreground">
            Add Menu Item
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-md">
            New item form with ImgBB upload will be implemented in the next step.
          </p>
          <Link
            href="/dashboard/vendor"
            className="mt-6 inline-flex items-center gap-2 text-xs font-semibold px-5 py-2.5 rounded-full bg-primary text-white hover:brightness-105 transition-all shadow-xs"
          >
            <ArrowLeft className="size-4" /> Back to Overview
          </Link>
        </div>
      </main>
    </div>
  );
}
