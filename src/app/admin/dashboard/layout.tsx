"use client";

import AdminSidebar from "@/components/adminDashboard/Sidebar";
import { useCallback, useState } from "react";
import AdminDashboardNav from "@/components/adminDashboard/DashboardNav";
import PushNotifications from "@/components/support/PushNotifications";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading, user } = useAuth({
    allowedRoles: ["admin", "super-admin"],
  });
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth >= 768; // open by default on md+, closed on mobile
  });

  // Replace the inline arrow function:
  const handleSidebarToggle = useCallback(
    () => setSidebarOpen((prev) => !prev),
    [],
  );

  if (loading) return null;

  return (
    <div className="flex h-dvh bg-gray-50 w-full overflow-hidden">
      <AdminSidebar
        user={user}
        isOpen={sidebarOpen}
        onToggle={handleSidebarToggle}
      />
      <main className="flex-1 flex flex-col h-full min-h-0 overflow-hidden relative">
        <AdminDashboardNav
          isOpen={sidebarOpen}
          onToggle={handleSidebarToggle}
        />
        <div className="flex-1 min-h-0 overflow-y-auto">{children}</div>
        <PushNotifications admin />
      </main>
    </div>
  );
}
