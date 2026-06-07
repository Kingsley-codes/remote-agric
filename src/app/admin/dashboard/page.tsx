// app/page.tsx
"use client";

import Header from "@/components/adminDashboard/Header";
import StatsCards from "@/components/adminDashboard/StatsCards";
import InvestmentChart from "@/components/adminDashboard/InvestmentChart";
import PortfolioMix from "@/components/adminDashboard/PortfolioMix";
import RecentTransactions from "@/components/adminDashboard/RecentTransactions";
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
    <div className="flex w-full flex-col min-h-0">
      <Header />

      <div className="p-6 lg:p-10 space-y-8">
        <StatsCards />
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <InvestmentChart />
          <PortfolioMix />
        </div>
        <RecentTransactions />
        <div className="pb-10"></div> {/* Bottom spacer */}
      </div>
    </div>
  );
}
