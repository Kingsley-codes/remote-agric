// app/page.tsx
"use client";

import AdminOverview from "@/components/adminDashboard/AdminOverview";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { loading } = useAuth({ allowedRoles: ["admin", "super-admin"] });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary"></div>
      </div>
    );
  }

  return (
    <AdminOverview />
  );
}
