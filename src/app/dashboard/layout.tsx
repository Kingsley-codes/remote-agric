"use client";

import DashboardNav from "@/components/dashboard/DashboardNav";
import Sidebar, { UserData } from "@/components/dashboard/Sidebar";
import { useEffect, useCallback, useState } from "react";
import PushNotifications from "@/components/support/PushNotifications";
import NotificationBell from "@/components/notifications/NotificationBell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<UserData | null>(null);
  // Keep the server and first browser render identical to avoid hydration errors.
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(window.innerWidth >= 768);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const stored = localStorage.getItem("user");
        if (stored) setUser(JSON.parse(stored));
      } catch {
        // ignore parse errors
      }
    };

    fetchUser();
  }, []);

  // Replace the inline arrow function:
  const handleSidebarToggle = useCallback(
    () => setSidebarOpen((prev) => !prev),
    [],
  );

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
