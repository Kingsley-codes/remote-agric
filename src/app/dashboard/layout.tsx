"use client";

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
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
        <NotificationBell />
        <PushNotifications />
      </main>
    </div>
  );
}
