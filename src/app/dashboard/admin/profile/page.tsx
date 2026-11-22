"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  User,
  Phone,
  MapPin,
  Mail,
  Shield,
  ShieldCheck,
  Calendar,
  Lock,
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { api, syncAuthToken } from "@/lib/api-client";
import { useSession } from "@/lib/auth-client";

interface AdminProfile {
  _id?: string;
  name?: string;
  email?: string;
  image?: string;
  phone?: string;
  address?: string;
  role?: string;
  createdAt?: string;
}

export default function AdminProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.email) {
      syncAuthToken(session.user.email);
    }
  }, [session]);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await api.get<{ success: boolean; data: AdminProfile }>("/api/users/profile");
      if (res?.data) {
        setProfile(res.data);
      }
    } catch {
      // fallback to session info
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const displayName = profile?.name || session?.user?.name || "Administrator";
  const displayEmail = profile?.email || session?.user?.email || "admin@pizzahub.com";
  const displayImage = profile?.image || session?.user?.image || null;
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Admin Profile"
        subtitle="Platform administrator credentials and account oversight."
      />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-12 max-w-4xl w-full mx-auto space-y-6">
        {loading ? (
          <div className="bg-white dark:bg-card border border-stone-200/70 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xs animate-pulse space-y-4">
            <div className="flex items-center gap-4">
              <div className="size-20 rounded-2xl bg-muted/60" />
              <div className="space-y-2">
                <div className="w-40 h-5 bg-muted/60 rounded" />
                <div className="w-60 h-3.5 bg-muted/40 rounded" />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header / Identity Card */}
            <div className="bg-white dark:bg-card border border-stone-200/70 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div className="flex items-center gap-5">
                <div className="relative size-20 shrink-0">
                  {displayImage ? (
                    <Image
                      src={displayImage}
                      alt={displayName}
                      fill
                      className="rounded-2xl object-cover border border-stone-200 dark:border-stone-700 shadow-xs"
                    />
                  ) : (
                    <div className="size-20 rounded-2xl bg-[image:var(--gradient-primary)] text-white font-bold text-2xl flex items-center justify-center shadow-xs">
                      {initial}
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
                      {displayName}
                    </h2>
                    <span className="bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-900 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <Shield className="size-3" />
                      Administrator
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                    {displayEmail}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
                <ShieldCheck className="size-4 text-emerald-600" />
                <span>Active & Verified Governance</span>
              </div>
            </div>

            {/* Read-Only Details Grid */}
            <div className="bg-white dark:bg-card border border-stone-200/70 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
                <div>
                  <h3 className="font-heading text-base font-bold text-foreground">
                    Administrator Information
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Official platform credentials and security profile.
                  </p>
                </div>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/40 px-3 py-1 rounded-full border border-border/60">
                  <Lock className="size-3 text-muted-foreground" />
                  Read-only
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                <div className="p-4 rounded-2xl bg-muted/30 dark:bg-muted/20 border border-border/40 space-y-1">
                  <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
                    <User className="size-3.5 text-muted-foreground" />
                    Full Name
                  </span>
                  <p className="text-sm font-bold text-foreground">{displayName}</p>
                </div>

                <div className="p-4 rounded-2xl bg-muted/30 dark:bg-muted/20 border border-border/40 space-y-1">
                  <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
                    <Mail className="size-3.5 text-muted-foreground" />
                    Email Address
                  </span>
                  <p className="text-sm font-bold text-foreground">{displayEmail}</p>
                </div>

                <div className="p-4 rounded-2xl bg-muted/30 dark:bg-muted/20 border border-border/40 space-y-1">
                  <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
                    <Phone className="size-3.5 text-muted-foreground" />
                    Contact Phone
                  </span>
                  <p className="text-sm font-semibold text-foreground">
                    {profile?.phone || "—"}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-muted/30 dark:bg-muted/20 border border-border/40 space-y-1">
                  <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
                    <MapPin className="size-3.5 text-muted-foreground" />
                    Office / Headquarters
                  </span>
                  <p className="text-sm font-semibold text-foreground">
                    {profile?.address || "PizzaHub HQ"}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-muted/30 dark:bg-muted/20 border border-border/40 space-y-1">
                  <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
                    <Shield className="size-3.5 text-muted-foreground" />
                    Platform Role
                  </span>
                  <p className="text-sm font-bold text-purple-700 dark:text-purple-300">
                    Master Administrator
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-muted/30 dark:bg-muted/20 border border-border/40 space-y-1">
                  <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="size-3.5 text-muted-foreground" />
                    Account Created
                  </span>
                  <p className="text-sm font-semibold text-foreground">
                    {profile?.createdAt
                      ? new Date(profile.createdAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Official System Account"}
                  </p>
                </div>
              </div>

              {/* Informative Security Notice */}
              <div className="flex items-start gap-3 p-4 bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-900/50 rounded-2xl">
                <ShieldCheck className="size-4 text-purple-700 dark:text-purple-400 shrink-0 mt-0.5" />
                <p className="text-xs text-purple-900 dark:text-purple-300 leading-relaxed">
                  Administrator profiles are provisioned with system governance privileges. To protect operational integrity, account parameters are managed through master system configuration and cannot be edited directly from the web interface.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
