"use client";
import { useEffect, useState } from "react";
import TransactionRow from "./TransactionRow";
import TransactionCard from "./TransactionCard";
import TransactionDetailModal from "./TransactionDetailModal";

interface Transaction { id: string; transactionID: string; title: string; subtitle: string; amount: number; direction: "credit" | "debit"; status: string; createdAt: string; }
const money = (amount: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(Number(amount) || 0);
const selectClass = "mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/30";

export default function TransactionTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1 });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filters, setFilters] = useState({ period: "all", type: "", status: "", startDate: "", endDate: "" });
  const [revision, setRevision] = useState(0);
  const customReady = filters.period !== "custom" || Boolean(filters.startDate && filters.endDate && filters.startDate <= filters.endDate);
  const change = (key: keyof typeof filters, value: string) => {
    setFilters(previous => ({ ...previous, [key]: value }));
    setPage(1);
    setLoading(true);
    setError("");
  };
  useEffect(() => {
    if (!customReady) return;
    const controller = new AbortController();
    const params = new URLSearchParams({ page: String(page), limit: "10" });
    Object.entries(filters).forEach(([key, value]) => { if (value && (filters.period === "custom" || !["startDate", "endDate"].includes(key))) params.set(key, value); });
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/dashboard/transactions?${params}`, { credentials: "include", signal: controller.signal })
      .then(async response => { const payload = await response.json(); if (!response.ok) throw new Error(payload.message ?? "Unable to load transactions"); return payload; })
      .then(payload => { setTransactions(payload.data?.transactions ?? []); setMeta(payload.data?.meta ?? { total: 0, totalPages: 1 }); })
      .catch(reason => { if (!controller.signal.aborted) setError(reason.message); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [page, filters, customReady, revision]);
  const rowProps = (transaction: Transaction) => {
    const date = new Date(transaction.createdAt);
    return { ...transaction, onOpen: setSelectedId, date: date.toLocaleDateString("en-NG", { day: "2-digit", month: "short", year: "numeric" }), time: date.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" }), positive: transaction.direction === "credit", amount: `${transaction.direction === "credit" ? "+" : "−"}${money(transaction.amount)}` };
  };
  const resetFilters = () => {
    setFilters({ period: "all", type: "", status: "", startDate: "", endDate: "" });
    setPage(1);
    setLoading(true);
    setError("");
  };
  const retry = () => {
    setLoading(true);
    setError("");
    setRevision(value => value + 1);
  };
  const changePage = (nextPage: number) => {
    setLoading(true);
    setError("");
    setPage(nextPage);
  };
  return <section className="space-y-4">
    <div className="flex items-center justify-between gap-3"><div><h3 className="text-xl font-bold text-slate-900">Transaction history</h3><p className="mt-1 text-sm text-slate-500">Review your payments, returns and withdrawals.</p></div><button type="button" onClick={resetFilters} className="text-sm font-semibold text-primary hover:underline">Reset filters</button></div>
    <div className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-3">
      <label className="text-xs font-semibold text-slate-600">Period<select value={filters.period} onChange={e => change("period", e.target.value)} className={selectClass}><option value="all">All time</option><option value="today">Today (UTC)</option><option value="week">Last 7 days</option><option value="month">Last 30 days</option><option value="year">Last year</option><option value="custom">Custom dates</option></select></label>
      <label className="text-xs font-semibold text-slate-600">Transaction type<select value={filters.type} onChange={e => change("type", e.target.value)} className={selectClass}><option value="">All types</option><option value="investment-payment">Farm investment</option><option value="withdrawal">Withdrawal</option><option value="referral-reward">Referral reward</option><option value="harvest-return">Farm return</option></select></label>
      <label className="text-xs font-semibold text-slate-600">Transaction status<select value={filters.status} onChange={e => change("status", e.target.value)} className={selectClass}><option value="">All statuses</option>{["pending", "completed", "failed", "cancelled", "refunded"].map(status => <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>)}</select></label>
      {filters.period === "custom" && <><label className="text-xs font-semibold text-slate-600">From<input type="date" value={filters.startDate} max={filters.endDate || undefined} onChange={e => change("startDate", e.target.value)} className={selectClass} /></label><label className="text-xs font-semibold text-slate-600">To<input type="date" value={filters.endDate} min={filters.startDate || undefined} onChange={e => change("endDate", e.target.value)} className={selectClass} /></label></>}
    </div>
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm" aria-busy={loading}>
      {!customReady ? <p className="p-8 text-center text-sm text-slate-500">Choose a start and end date in chronological order.</p> : loading ? <p role="status" className="p-10 text-center text-sm text-slate-500">Loading transactions…</p> : error ? <div role="alert" className="p-8 text-center text-sm text-red-600">{error} <button onClick={retry} className="font-semibold underline">Retry</button></div> : !transactions.length ? <p className="p-10 text-center text-sm text-slate-500">No transactions match these filters.</p> : <>
        <table className="hidden w-full text-left lg:table"><thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="p-4">Transaction ID</th><th className="p-4">Transaction</th><th className="p-4">Date</th><th className="p-4">Status</th><th className="p-4 text-right">Amount</th></tr></thead><tbody>{transactions.map(transaction => <TransactionRow key={transaction.id} {...rowProps(transaction)} />)}</tbody></table>
        <div className="flex flex-col gap-3 p-3 lg:hidden">{transactions.map(transaction => <TransactionCard key={transaction.id} {...rowProps(transaction)} />)}</div>
      </>}
    </div>
    <div className="flex items-center justify-between gap-3 text-sm text-slate-500"><span>{!loading && customReady && !error ? `${meta.total} transactions · Page ${page} of ${meta.totalPages}` : ""}</span><div className="flex gap-2"><button disabled={page <= 1 || loading || !customReady} onClick={() => changePage(page - 1)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 disabled:opacity-40">Previous</button><button disabled={page >= meta.totalPages || loading || !customReady} onClick={() => changePage(page + 1)} className="rounded-lg bg-primary px-3 py-2 text-white disabled:opacity-40">Next</button></div></div>
    <TransactionDetailModal transactionId={selectedId} onClose={() => setSelectedId(null)} />
  </section>;
}
