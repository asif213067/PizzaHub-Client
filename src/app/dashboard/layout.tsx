import { Metadata } from "next";
import { DashboardProvider } from "@/components/dashboard/dashboard-context";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";

export const metadata: Metadata = {
  title: "Dashboard - PizzaHub",
  description: "PizzaHub Dashboard - Manage and track your pizzas and orders",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardProvider>
      <div className="min-h-screen bg-[#faf6ee] dark:bg-[#181512] flex transition-colors text-foreground">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
          {children}
        </div>
      </div>
    </DashboardProvider>
  );
}
