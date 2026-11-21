"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart2,
  ShoppingBag,
  Settings,
  Home,
  LogOut,
  Pizza,
  X,
  PackagePlus,
  UtensilsCrossed,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { useSession, signOut } from "@/lib/auth-client";
import { clearStoredToken } from "@/lib/api-client";
import { useDashboard } from "./dashboard-context";

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const { isCollapsed, isMobileOpen, closeMobileSidebar } = useDashboard();

  const user = session?.user as { role?: string; name?: string } | undefined;
  const role = user?.role || "customer";

  async function handleLogout() {
    try {
      await signOut();
      clearStoredToken();
      toast.success("Signed out successfully");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Failed to sign out. Please try again.");
    }
  }

  // Role-aware primary navigation links
  const customerLinks = [
    {
      name: "Overview",
      href: "/dashboard/customer",
      icon: BarChart2,
      active: pathname === "/dashboard/customer",
    },
    {
      name: "My Orders",
      href: "/dashboard/customer/orders",
      icon: ShoppingBag,
      active: pathname.startsWith("/dashboard/customer/orders"),
    },
    {
      name: "Profile Settings",
      href: "/dashboard/customer/profile",
      icon: Settings,
      active: pathname.startsWith("/dashboard/customer/profile"),
    },
  ];

  const vendorLinks = [
    {
      name: "Overview",
      href: "/dashboard/vendor",
      icon: BarChart2,
      active: pathname === "/dashboard/vendor",
    },
    {
      name: "My Items",
      href: "/dashboard/vendor/items",
      icon: UtensilsCrossed,
      active: pathname.startsWith("/dashboard/vendor/items"),
    },
    {
      name: "Add Item",
      href: "/dashboard/vendor/add-item",
      icon: PackagePlus,
      active: pathname.startsWith("/dashboard/vendor/add-item"),
    },
    {
      name: "Orders",
      href: "/dashboard/vendor/orders",
      icon: ShoppingBag,
      active: pathname.startsWith("/dashboard/vendor/orders"),
    },
    {
      name: "Profile Settings",
      href: "/dashboard/vendor/profile",
      icon: Settings,
      active: pathname.startsWith("/dashboard/vendor/profile"),
    },
  ];

  const adminLinks = [
    {
      name: "Overview",
      href: "/dashboard/admin",
      icon: BarChart2,
      active: pathname === "/dashboard/admin",
    },
    {
      name: "Users",
      href: "/dashboard/admin/users",
      icon: Users,
      active: pathname.startsWith("/dashboard/admin/users"),
    },
    {
      name: "Items",
      href: "/dashboard/admin/items",
      icon: UtensilsCrossed,
      active: pathname.startsWith("/dashboard/admin/items"),
    },
    {
      name: "Profile Settings",
      href: "/dashboard/admin/profile",
      icon: Settings,
      active: pathname.startsWith("/dashboard/admin/profile"),
    },
  ];

  const navLinks =
    role === "vendor"
      ? vendorLinks
      : role === "admin"
      ? adminLinks
      : customerLinks;

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between p-4 sm:p-5 select-none">
      {/* Top: Logo & Nav */}
      <div className="flex flex-col gap-6">
        {/* PizzaHub Logo */}
        <div className={`flex items-center gap-3 ${isCollapsed ? "justify-center" : "px-2"}`}>
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-full"
            title="PizzaHub"
          >
            <div className="size-9 rounded-full bg-[image:var(--gradient-primary)] flex items-center justify-center text-white shadow-sm shrink-0 group-hover:scale-105 transition-transform">
              <Pizza className="size-5" />
            </div>
            {!isCollapsed && (
              <span className="font-heading font-extrabold text-xl tracking-tight text-white whitespace-nowrap">
                PizzaHub
              </span>
            )}
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1.5" aria-label="Dashboard Navigation">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={closeMobileSidebar}
                title={isCollapsed ? link.name : undefined}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all font-medium text-sm ${
                  link.active
                    ? "bg-white/15 text-white shadow-xs font-semibold backdrop-blur-xs"
                    : "text-white/75 hover:text-white hover:bg-white/10"
                } ${isCollapsed ? "justify-center px-0" : ""}`}
              >
                <Icon className="size-5 shrink-0" />
                {!isCollapsed && <span className="truncate">{link.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions: Home & Logout */}
      <div className="flex flex-col gap-2 pt-4 border-t border-white/10">
        {/* Home */}
        <Link
          href="/"
          onClick={closeMobileSidebar}
          title={isCollapsed ? "Home" : undefined}
          className={`flex items-center gap-2.5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition-all shadow-xs ${
            isCollapsed ? "justify-center size-10 mx-auto p-0" : "px-4 justify-center"
          }`}
        >
          <Home className="size-4 shrink-0" />
          {!isCollapsed && <span>Home</span>}
        </Link>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          title={isCollapsed ? "Logout" : undefined}
          className={`flex items-center gap-2.5 py-2 text-white/75 hover:text-white transition-colors text-sm cursor-pointer ${
            isCollapsed ? "justify-center size-10 mx-auto p-0" : "px-4 justify-center"
          }`}
        >
          <LogOut className="size-4 shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Floating Dark Green Container matching design reference) */}
      <aside
        className={`hidden lg:flex flex-col shrink-0 my-3 ml-3 rounded-3xl bg-[#17482f] dark:bg-[#123925] text-white shadow-lg transition-all duration-300 z-30 sticky top-3 h-[calc(100vh-1.5rem)] ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={closeMobileSidebar}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer (Slide-out) */}
      <aside
        className={`lg:hidden fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#17482f] dark:bg-[#123925] text-white shadow-2xl transition-transform duration-300 ease-in-out p-3 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="relative h-full flex flex-col">
          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={closeMobileSidebar}
            className="absolute top-4 right-4 p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X className="size-5" />
          </button>
          {sidebarContent}
        </div>
      </aside>
    </>
  );
}
