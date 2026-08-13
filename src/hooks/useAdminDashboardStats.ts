"use client";

import { useEffect, useState } from "react";

export interface AdminDashboardStats {
  users: { total: number; active: number };
  farmers: { total: number; active: number; funded: number };
  opportunities: { active: number; listingValue: number; mostPopular: string };
}

export function useAdminDashboardStats() {
  const [data, setData] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/dashboard/stats`, {
      credentials: "include",
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load dashboard stats");
        return response.json();
      })
      .then((payload) => setData(payload.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}
