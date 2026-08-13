"use client";

import { MdGroup, MdAttachMoney, MdHourglassEmpty } from "react-icons/md";
import { useAdminDashboardStats } from "@/hooks/useAdminDashboardStats";

export default function StatsCards() {
  const { data, loading } = useAdminDashboardStats();
  const stats = [
    { label: "Total Producers", value: data?.farmers.total ?? 0, icon: MdGroup },
    { label: "Active Producers", value: data?.farmers.active ?? 0, icon: MdAttachMoney },
    { label: "Funded Producers", value: data?.farmers.funded ?? 0, icon: MdHourglassEmpty },
  ];

  return <div className="mb-8 grid grid-cols-1 gap-6 px-4 md:grid-cols-3">{stats.map(({ label, value, icon: Icon }) => <div key={label} className="flex flex-col gap-1 rounded-xl border border-[#d5e7cf] bg-white p-5 shadow-sm"><div className="flex items-start justify-between"><p className="text-sm font-medium text-gray-500">{label}</p><span className="rounded-lg bg-[#eaf3e7] p-1.5 text-[#5e9a4c]"><Icon className="text-xl" /></span></div><p className="mt-2 text-3xl font-bold tracking-tight text-gray-800">{loading ? "—" : value.toLocaleString("en-NG")}</p></div>)}</div>;
}
