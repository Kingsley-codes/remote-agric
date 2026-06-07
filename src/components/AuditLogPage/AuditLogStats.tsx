// components/admin/AuditLogStats.tsx
"use client";

import {
  MdHistory,
  MdToday,
  MdWeekend,
  MdCalendarMonth,
  MdCalendarToday,
} from "react-icons/md";
import { AuditLogStats } from "@/lib/auditLog";

interface AuditLogStatsProps {
  stats: AuditLogStats | null;
  loading?: boolean;
}

export default function AuditLogStatsCards({
  stats,
  loading = false,
}: AuditLogStatsProps) {
  const statCards = [
    {
      title: "Total Logs",
      value: stats?.totalLogs || 0,
      icon: MdHistory,
      color: "from-[#5e9a4c] to-[#2d4a1e]",
    },
    {
      title: "Today",
      value: stats?.todayLogs || 0,
      icon: MdToday,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "This Week",
      value: stats?.weekLogs || 0,
      icon: MdWeekend,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "This Month",
      value: stats?.monthLogs || 0,
      icon: MdCalendarMonth,
      color: "from-orange-500 to-orange-600",
    },
    {
      title: "This Year",
      value: stats?.yearLogs || 0,
      icon: MdCalendarToday,
      color: "from-pink-500 to-pink-600",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-sm border border-[#d5e7cf] p-4 animate-pulse"
          >
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {statCards.map((card) => (
        <div
          key={card.title}
          className="bg-white rounded-xl shadow-sm border border-[#d5e7cf] p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              {card.title}
            </span>
            <card.icon className={`text-lg text-${card.color.split(" ")[1]}`} />
          </div>
          <div className="text-2xl font-bold text-[#111b0d]">
            {card.value.toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}
