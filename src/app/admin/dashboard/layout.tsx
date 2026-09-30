"use client";

import AdminSidebar from "@/components/adminDashboard/Sidebar";
import { useCallback, useState } from "react";
import AdminDashboardNav from "@/components/adminDashboard/DashboardNav";
import PushNotifications from "@/components/support/PushNotifications";
import { useAuth } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { canAccessAdminPage } from "@/lib/adminAccess";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
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
        <div className="flex-1 min-h-0 overflow-y-auto">
          {canAccessAdminPage(user?.role, pathname) ? children : (
            <div role="alert" className="p-8">
              <h1 className="text-xl font-semibold">Access restricted</h1>
              <p className="mt-2 text-gray-600">Only super admins can access this page.</p>
              <Link href="/admin/dashboard" className="mt-4 inline-block text-primary underline">Back to dashboard</Link>
            </div>
          )}
        </div>
        <PushNotifications admin />
      </main>
    </div>
  );
}
