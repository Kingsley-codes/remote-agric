"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { UserData } from "@/components/dashboard/Sidebar";
import StatsGrid from "@/components/dashboard/StatsGrid";
import YieldChart from "@/components/dashboard/YieldChart";
import ActiveInvestments from "@/components/dashboard/ActiveInvestments";
import { useAuth } from "@/hooks/useAuth";
import type { ActiveInvestment } from "@/components/dashboard/ActiveInvestments";

interface DashboardData {
  userInvestments: (ActiveInvestment & { status: string; orderDate: string })[];
  totalInvestedAmount: number;
  totalActiveInvestments: number;
  totalProjectedROI: number;
}

export default function DashboardPage() {
  const { loading } = useAuth({ allowedRoles: ["user"] });
  const [user, setUser] = useState<UserData | null>(null);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);

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

  useEffect(() => {
    if (loading) return;
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/dashboard/overview`, { credentials: "include" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load dashboard data");
        return response.json();
      })
      .then((payload) => setDashboard(payload.data))
      .catch(() => setDashboard(null))
      .finally(() => setDashboardLoading(false));
  }, [loading]);

  const firstName = user?.firstName ?? user?.name?.split(" ")[0] ?? "there";

  if (loading || dashboardLoading) {
    return (
      <div className="flex items-center bg-gray-100 justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 lg:px-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl text-gray-800 font-semibold mb-2">
                Welcome back, {firstName}
              </h2>
              <p className="text-gray-500">
                Here is an overview of your agricultural portfolio.
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/dashboard/investments" className="flex items-center text-gray-600 gap-2 px-5 py-2.5 rounded-lg bg-white border border-gray-200 text-sm font-bold">View farms</Link>
              <Link href="/dashboard/wallet" className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-bold">Withdraw</Link>
            </div>
          </div>

          <StatsGrid totalFarmValue={dashboard?.totalInvestedAmount ?? 0} activeProjects={dashboard?.totalActiveInvestments ?? 0} projectedRoi={dashboard?.totalProjectedROI ?? 0} nextPayout={dashboard?.totalActiveInvestments ? "At harvest" : "No upcoming payout"} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2 flex flex-col gap-8">
              <YieldChart projectedRoi={dashboard?.totalProjectedROI ?? 0} activeProjects={dashboard?.totalActiveInvestments ?? 0} />
              <ActiveInvestments investments={(dashboard?.userInvestments ?? []).filter((investment) => investment.status === "ongoing").slice(0, 3)} />
            </div>
            <div />
          </div>
    </div>
  );
}
