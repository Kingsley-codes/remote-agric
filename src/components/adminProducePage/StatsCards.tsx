"use client";

import { LuTrendingUp, LuMinus } from "react-icons/lu";
import { useAdminDashboardStats } from "@/hooks/useAdminDashboardStats";

export default function StatsCards() {
  const { data, loading } = useAdminDashboardStats();
  const stats = [
    { title: "Active Opportunities", value: data?.opportunities.active.toLocaleString("en-NG") ?? "0", Icon: LuMinus },
    { title: "Total Farm Listings", value: `₦${(data?.opportunities.listingValue ?? 0).toLocaleString("en-NG")}`, Icon: LuTrendingUp },
    { title: "Most Popular Opportunity", value: data?.opportunities.mostPopular ?? "No investments yet", Icon: LuTrendingUp },
  ];

  return <div className="grid grid-cols-1 gap-6 md:grid-cols-3">{stats.map(({ title, value, Icon }) => <div key={title} className="relative flex h-40 flex-col justify-center rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"><div className="absolute right-4 top-4 rounded-lg bg-green-100 p-2 text-green-700"><Icon className="size-4" /></div><div className="px-7"><p className="text-sm font-medium text-slate-500">{title}</p><h3 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">{loading ? "—" : value}</h3></div></div>)}</div>;
}
