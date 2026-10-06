"use client";

import { useState } from "react";
import ManualWithdrawalDashboard from "./ManualWithdrawalDashboard";
import AllTransactions from "./AllTransactions";

export default function TransactionsDashboard() {
  const [tab, setTab] = useState("all");
  return <main className="mx-auto w-full max-w-7xl min-w-0 p-4 sm:p-6 lg:p-8">
    <header className="mb-8"><h1 className="pb-2 text-3xl font-semibold tracking-tight text-gray-800">Transactions</h1><p className="text-sm text-slate-500">Review payments, harvest returns, referral rewards and withdrawals.</p></header>
    <div className="mb-6 grid w-full grid-cols-2 gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1.5 shadow-sm" role="group" aria-label="Transaction views">
      {[["all", "All transactions"], ["withdrawals", "Withdrawals"]].map(([value, label]) => (
        <button
          key={value}
          type="button"
          aria-pressed={tab === value}
          onClick={() => setTab(value)}
          className={`min-h-12 min-w-0 cursor-pointer rounded-lg px-3 py-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:min-h-14 sm:px-6 sm:text-base ${tab === value ? "bg-primary text-white shadow-sm" : "text-slate-600 hover:bg-white hover:text-slate-900"}`}
        >
          {label}
        </button>
      ))}
    </div>
    {tab === "all" ? <AllTransactions /> : <ManualWithdrawalDashboard embedded />}
  </main>;
}
