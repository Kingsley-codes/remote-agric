"use client";

import { useState } from "react";
import ManualWithdrawalDashboard from "./ManualWithdrawalDashboard";
import AllTransactions from "./AllTransactions";

export default function TransactionsDashboard() {
  const [tab, setTab] = useState("all");
  return <main className="mx-auto w-full max-w-7xl min-w-0 p-4 sm:p-6 lg:p-8">
    <header className="mb-8"><h1 className="pb-2 text-3xl font-semibold tracking-tight text-gray-800">Transactions</h1><p className="text-sm text-slate-500">Review payments, harvest returns, referral rewards and withdrawals.</p></header>
    <div className="mb-6 flex gap-6 border-b border-slate-200" aria-label="Transaction views">
      {[["all", "All transactions"], ["withdrawals", "Withdrawals"]].map(([value, label]) => <button key={value} type="button" aria-pressed={tab === value} onClick={() => setTab(value)} className={`-mb-px border-b-2 px-1 pb-3 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-primary ${tab === value ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-800"}`}>{label}</button>)}
    </div>
    {tab === "all" ? <AllTransactions /> : <ManualWithdrawalDashboard embedded />}
  </main>;
}
