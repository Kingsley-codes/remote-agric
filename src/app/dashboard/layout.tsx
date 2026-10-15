"use client";

import Link from "next/link";
import { Phone } from "lucide-react";
import DashboardNav from "@/components/dashboard/DashboardNav";
import Sidebar from "@/components/dashboard/Sidebar";
import { useCallback, useState } from "react";
import PushNotifications from "@/components/support/PushNotifications";
import NotificationBell from "@/components/notifications/NotificationBell";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading, user } = useAuth({ allowedRoles: ["user"] });
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth >= 768;
  });

  // Replace the inline arrow function:
  const handleSidebarToggle = useCallback(
    () => setSidebarOpen((prev) => !prev),
    [],
  );

  if (loading) return null;

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-gray-50">
      <Sidebar
        user={user}
        isOpen={sidebarOpen}
        onToggle={handleSidebarToggle}
      />
      <main className="relative flex h-full min-h-0 flex-1 flex-col overflow-hidden">
        <DashboardNav isOpen={sidebarOpen} onToggle={handleSidebarToggle} />
        <div className="min-h-0 flex-1 overflow-y-auto">
          {user && !user.phone?.trim() && (
            <section aria-label="Complete your profile" className="mx-4 mt-5 flex flex-col gap-4 rounded-xl border border-amber-200 bg-amber-50 p-4 sm:mx-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <Phone aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-amber-700" />
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">Complete your profile</h2>
                  <p className="mt-1 text-sm text-slate-600">Add your phone number to keep your contact details up to date and make the most of Remote Agric.</p>
                </div>
              </div>
              <Link href="/dashboard/settings#phone" className="shrink-0 rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">Add phone number</Link>
            </section>
          )}
          {children}
        </div>
        <NotificationBell />
        <PushNotifications />
      </main>
    </div>
  );
}
