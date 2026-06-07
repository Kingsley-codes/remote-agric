"use client";
import { useState, useEffect } from "react";
import { UserData } from "@/components/dashboard/Sidebar";
import StatsGrid from "@/components/dashboard/StatsGrid";
import YieldChart from "@/components/dashboard/YieldChart";
import ActiveInvestments from "@/components/dashboard/ActiveInvestments";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardPage() {
  const { loading } = useAuth({ allowedRoles: ["user"] });
  const [user, setUser] = useState<UserData | null>(null);

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

  const firstName = user?.firstName ?? user?.name?.split(" ")[0] ?? "there";

  if (loading) {
    return (
      <div className="flex items-center bg-gray-100 justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 w-full overflow-hidden">
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:px-12 pb-20">
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
              <button className="flex items-center text-gray-600 gap-2 px-5 py-2.5 rounded-lg bg-white border border-gray-200 text-sm font-bold">
                Report
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-bold">
                Withdraw
              </button>
            </div>
          </div>

          <StatsGrid />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2 flex flex-col gap-8">
              <YieldChart />
              <ActiveInvestments />
            </div>
            <div />
          </div>
        </div>
      </main>
    </div>
  );
}
