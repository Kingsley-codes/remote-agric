"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { MdArrowUpward, MdTrendingUp } from "react-icons/md";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";

interface InvestmentStats {
  totalActiveInvestments: number;
  totalAmountInvested: number;
  investmentChangePercentage: number;
  mostPopularProduce: string;
  totalInvestorsForPopularProduce: number;
  investmentsThisMonth: number;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

export default function SummaryBar() {
  const [stats, setStats] = useState<InvestmentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data } = await axios.get(
          `${BACKEND_URL}/api/admin/dashboard/investmets-stats`,
          { withCredentials: true },
        );

        if (data.success) {
          setStats(data.stats);
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message ??
              `Request failed with status ${err.response?.status}`,
          );
        } else {
          setError(err instanceof Error ? err.message : "Failed to load stats");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white border border-primary/10 p-6 rounded-xl shadow-sm animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-3 flex-1">
                <div className="h-3 bg-slate-200 rounded w-2/3" />
                <div className="h-8 bg-slate-200 rounded w-1/2" />
                <div className="h-3 bg-slate-200 rounded w-3/4" />
              </div>
              <div className="h-16 w-16 bg-slate-200 rounded-full ml-4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
        Failed to load investment stats: {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Total Active Investments */}
      <div className="bg-white border border-primary/10 p-6 rounded-xl flex items-center justify-between shadow-sm">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Total Active Investments
          </p>
          <h3 className="lg:text-3xl text-2xl font-bold mt-1 text-slate-900">
            {stats?.totalActiveInvestments ?? 0}
          </h3>
          <div className="flex items-center gap-1 mt-2 text-primary font-bold text-sm">
            <MdArrowUpward size={14} />
            <span>
              {stats?.investmentsThisMonth ?? 0} new investments this month
            </span>
          </div>
        </div>
      </div>

      {/* Total Amount Invested */}
      <div className="bg-white border border-primary/10 p-6 rounded-xl flex items-center justify-between shadow-sm">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Total Amount Invested
          </p>
          <h3 className="lg:text-3xl text-2xl font-bold mt-1 text-slate-900">
            {formatCurrency(stats?.totalAmountInvested ?? 0)}
          </h3>
          <div className="flex items-center gap-1 mt-2 text-primary font-bold text-sm">
            <MdArrowUpward size={14} />
            <span>
              {stats?.investmentChangePercentage ?? 0}% increase this month
            </span>
          </div>
        </div>
      </div>

      {/* Most Popular Project */}
      <div className="bg-white border border-primary/10 p-6 rounded-xl flex items-center justify-between shadow-sm">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Most Popular Project
          </p>
          <h3 className="lg:text-3xl text-2xl font-bold mt-1 text-slate-900">
            {stats?.mostPopularProduce ?? "—"}
          </h3>
          <div className="flex items-center gap-1 mt-2 text-primary font-bold text-sm">
            <MdTrendingUp size={14} />
            <span>
              {stats?.totalInvestorsForPopularProduce ?? 0} Active Investors
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
