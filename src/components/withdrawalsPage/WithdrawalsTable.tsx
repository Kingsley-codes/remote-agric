"use client";
import { useState } from "react";
import {
  MdAccountBalance,
  MdWallet,
  MdVisibility,
  MdChevronLeft,
  MdChevronRight,
  MdFilterList,
} from "react-icons/md";

type Status = "Pending" | "Processing" | "Completed" | "Cancelled";

interface Withdrawal {
  initials: string;
  name: string;
  amount: string;
  method: "Bank Transfer" | "Wallet Withdrawal" | "Wallet";
  date: string;
  status: Status;
}

const withdrawals: Withdrawal[] = [
  {
    initials: "EA",
    name: "Emmanuel Adebayo",
    amount: "₦145,000",
    method: "Bank Transfer",
    date: "Oct 24, 2023 · 14:32",
    status: "Pending",
  },
  {
    initials: "CO",
    name: "Chinwe Okafor",
    amount: "₦52,800",
    method: "Wallet Withdrawal",
    date: "Oct 24, 2023 · 12:15",
    status: "Processing",
  },
  {
    initials: "JM",
    name: "John Mensah",
    amount: "₦280,000",
    method: "Bank Transfer",
    date: "Oct 23, 2023 · 09:10",
    status: "Completed",
  },
  {
    initials: "SA",
    name: "Sarah Aliyu",
    amount: "₦12,500",
    method: "Wallet",
    date: "Oct 22, 2023 · 18:45",
    status: "Cancelled",
  },
  {
    initials: "BK",
    name: "Babatunde Kolawole",
    amount: "₦750,000",
    method: "Bank Transfer",
    date: "Oct 22, 2023 · 11:20",
    status: "Pending",
  },
];

const tabs = ["All", "Pending", "Processing", "Completed", "Cancelled"];

const statusStyles: Record<Status, string> = {
  Pending: "bg-orange-100 text-orange-700",
  Processing: "bg-blue-100 text-blue-700",
  Completed: "bg-primary/20 text-emerald-800",
  Cancelled: "bg-slate-100 text-slate-500",
};

function MethodIcon({ method }: { method: Withdrawal["method"] }) {
  return method === "Bank Transfer" ? (
    <MdAccountBalance size={16} className="text-slate-400" />
  ) : (
    <MdWallet size={16} className="text-slate-400" />
  );
}

function ActionButtons({ status }: { status: Status }) {
  if (status === "Pending") {
    return (
      <>
        <button className="bg-primary/10 hover:bg-primary/20 text-primary text-[11px] font-black uppercase tracking-tight px-3 py-1.5 rounded-lg transition-colors">
          Approve
        </button>
        <button className="bg-red-50 hover:bg-red-100 text-red-600 text-[11px] font-black uppercase tracking-tight px-3 py-1.5 rounded-lg transition-colors">
          Decline
        </button>
      </>
    );
  }
  if (status === "Processing") {
    return (
      <>
        <button className="bg-primary/10 hover:bg-primary/20 text-primary text-[11px] font-black uppercase tracking-tight px-3 py-1.5 rounded-lg transition-colors">
          Finalize
        </button>
        <button className="bg-red-50 hover:bg-red-100 text-red-600 text-[11px] font-black uppercase tracking-tight px-3 py-1.5 rounded-lg transition-colors">
          Decline
        </button>
      </>
    );
  }
  if (status === "Completed") {
    return (
      <button className="opacity-50 cursor-not-allowed text-slate-400 text-[11px] font-black uppercase tracking-tight px-3 py-1.5 rounded-lg">
        Processed
      </button>
    );
  }
  if (status === "Cancelled") {
    return (
      <button className="text-primary text-[11px] font-black uppercase tracking-tight px-3 py-1.5 rounded-lg border border-primary/20 transition-colors">
        Re-activate
      </button>
    );
  }
  return null;
}

// ─── Mobile Card ────────────────────────────────────────────────────────────
function MobileCard({ row }: { row: Withdrawal }) {
  return (
    <div className="p-4 border-b border-slate-100 last:border-b-0">
      {/* Top row: avatar + name + status */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs shrink-0">
            {row.initials}
          </div>
          <div>
            <p className="font-bold text-sm text-slate-900 leading-tight">
              {row.name}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">{row.date}</p>
          </div>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 ${
            statusStyles[row.status]
          }`}
        >
          {row.status}
        </span>
      </div>

      {/* Middle row: amount + method */}
      <div className="flex items-center justify-between mb-3 pl-12">
        <p className="font-black text-base text-slate-900">{row.amount}</p>
        <div className="flex items-center gap-1.5 text-slate-500">
          <MethodIcon method={row.method} />
          <span className="text-xs font-medium">{row.method}</span>
        </div>
      </div>

      {/* Bottom row: action buttons */}
      <div className="flex items-center gap-2 pl-12">
        <ActionButtons status={row.status} />
        <button className="ml-auto text-slate-400 hover:text-slate-600 p-1.5 rounded-lg">
          <MdVisibility size={18} />
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function WithdrawalsTable() {
  const [activeTab, setActiveTab] = useState("All");

  const filtered =
    activeTab === "All"
      ? withdrawals
      : withdrawals.filter((w) => w.status === activeTab);

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Tabs */}
      <div className="border-b border-slate-200 px-4 sm:px-6 pt-4 flex items-center justify-between">
        {/* Scrollable tab strip on mobile */}
        <div className="flex gap-4 sm:gap-8 overflow-x-auto scrollbar-none -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm whitespace-nowrap font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-primary text-slate-900 font-bold"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="pb-4 ml-4 shrink-0">
          <button className="flex items-center gap-1.5 text-sm font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
            <MdFilterList size={16} />
            <span className="hidden sm:inline">Filter</span>
          </button>
        </div>
      </div>

      {/* Mobile cards (hidden on md+) */}
      <div className="md:hidden divide-y divide-slate-100">
        {filtered.map((row) => (
          <MobileCard key={row.name} row={row} />
        ))}
      </div>

      {/* Desktop table (hidden below md) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold tracking-widest">
              <th className="px-6 py-4">User Name</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Payment Method</th>
              <th className="px-6 py-4">Request Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((row) => (
              <tr
                key={row.name}
                className="hover:bg-slate-50/80 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs">
                      {row.initials}
                    </div>
                    <span className="font-bold text-sm text-slate-900">
                      {row.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-sm">{row.amount}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <MethodIcon method={row.method} />
                    <span className="text-sm text-slate-600">{row.method}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{row.date}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      statusStyles[row.status]
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <ActionButtons status={row.status} />
                  <button className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg inline-flex">
                    <MdVisibility size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 sm:px-6 py-4 border-t border-slate-200 flex items-center justify-between">
        <p className="text-xs font-medium text-slate-500 tracking-tight">
          Showing {filtered.length} of 42 requests
        </p>
        <div className="flex gap-1.5 sm:gap-2">
          <button
            disabled
            className="size-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 disabled:opacity-50"
          >
            <MdChevronLeft size={18} />
          </button>
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              className={`size-8 flex items-center justify-center rounded-lg text-xs font-bold ${
                page === 1
                  ? "bg-primary text-background-dark"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {page}
            </button>
          ))}
          <button className="size-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400">
            <MdChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
