"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Loader2, RefreshCw, Search, Wallet } from "lucide-react";
import DetailDialog from "@/components/ui/DetailDialog";

type Produce = { _id: string; produceName?: string; title?: string };
type Transaction = {
  _id: string; transactionID: string; transactionType: string; amount: number; currency: string;
  status: string; createdAt: string; paymentMethod?: string; userEmail?: string;
  user?: { firstName?: string; lastName?: string; email?: string };
  produce?: Produce; referralRewardInvestment?: { produce?: Produce };
};
const endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/dashboard/transactions`;
const types = [["investment-payment", "Investment payment"], ["withdrawal", "Withdrawal"], ["referral-reward", "Referral reward"], ["harvest-return", "Harvest return"]];
const periods = [["today", "Today"], ["yesterday", "Yesterday"], ["this-week", "This week"], ["last-week", "Last week"], ["this-month", "This month"], ["last-month", "Last month"], ["custom", "Custom range"]];
const initialFilters = { q: "", transactionType: "all", produce: "all", status: "all", period: "all", paymentMethod: "all", startDate: "", endDate: "" };
const inputClass = "mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/30";
const label = (value: string) => types.find(([key]) => key === value)?.[1] || value.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[-_]/g, " ").replace(/^./, char => char.toUpperCase());
const money = (value: number, currency = "NGN") => new Intl.NumberFormat("en-NG", { style: "currency", currency }).format(value);
const date = (value: string) => new Date(value).toLocaleString("en-NG", { timeZone: "Africa/Lagos" });
const errorMessage = (error: unknown) => axios.isAxiosError(error) ? error.response?.data?.message || "Unable to load transactions. Please try again." : "Unable to load transactions. Please try again.";
const userName = (item: Transaction) => [item.user?.firstName, item.user?.lastName].filter(Boolean).join(" ") || "Unavailable user";
const produceName = (item: Transaction) => {
  const produce = item.produce || item.referralRewardInvestment?.produce;
  return produce?.produceName || produce?.title || "—";
};
function Status({ value }: { value: string }) {
  const colors: Record<string, string> = { completed: "bg-emerald-50 text-emerald-700", pending: "bg-amber-50 text-amber-700", failed: "bg-red-50 text-red-700", cancelled: "bg-slate-100 text-slate-600", refunded: "bg-blue-50 text-blue-700" };
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${colors[value] || colors.cancelled}`}>{label(value)}</span>;
}

// Render all returned business fields, including optional and historical fields.
// Nested related records remain grouped instead of being flattened into raw JSON.
function Details({ data, currency }: { data: Record<string, unknown>; currency: string }) {
  const names: Record<string, string> = { _id: "Record ID", transactionID: "Transaction ID", paymentID: "Payment ID", transactionRef: "Reference", referralBonus: "Referral reward per unit", investment: "Farm ownership", referralRewardInvestment: "Qualifying farm ownership", rolloverInvestment: "Rollover farm ownership", produce: "Produce", date: "Transaction date (WAT)", createdAt: "Created (WAT)", updatedAt: "Last updated (WAT)", profit: "Profit (%)", duration: "Duration (months)" };
  return <dl className="grid gap-5 sm:grid-cols-2">{Object.entries(data).filter(([key, value]) => value !== null && value !== undefined && value !== "" && !["__v", "publicId", "tracks"].includes(key)).map(([key, value]) => {
    const title = names[key] || label(key);
    if (typeof value === "object") return <div key={key} className="min-w-0 rounded-xl border border-slate-200 p-4 sm:col-span-2"><dt className="mb-4 text-sm font-bold text-slate-900">{title}</dt><dd><Details data={value as Record<string, unknown>} currency={currency} /></dd></div>;
    let display = String(value);
    if (typeof value === "boolean") display = value ? "Yes" : "No";
    if (typeof value === "number" && /^(amount|totalPrice|cashReturnAmount|referralBonus|walletBalanceBefore|walletBalanceAfter)$/.test(key)) display = money(value, currency);
    if (typeof value === "string" && /^(date|.*At|orderDate|harvestChoiceDate)$/.test(key) && Number.isFinite(Date.parse(value))) display = date(value);
    if (["transactionType", "status", "paymentMethod", "withdrawalFlow", "harvestChoice", "harvestFulfillmentStatus", "orderStatus", "stage"].includes(key)) display = label(display);
    return <div key={key} className="min-w-0"><dt className="text-xs font-medium text-slate-500">{title}</dt><dd className="mt-1 whitespace-pre-wrap break-words text-sm font-semibold text-slate-900">{key === "url" && /^https?:\/\//.test(display) ? <a className="text-primary underline" href={display} target="_blank" rel="noopener noreferrer">View payment receipt</a> : display}</dd></div>;
  })}</dl>;
}

function TransactionDetails({ id, onClose }: { id: string; onClose: () => void }) {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    axios.get(`${endpoint}/${id}`, { withCredentials: true, signal: controller.signal }).then(response => setData(response.data.data)).catch(error => { if (!controller.signal.aborted) setError(errorMessage(error)); });
    return () => controller.abort();
  }, [id, revision]);
  return <DetailDialog title="Transaction details" onClose={onClose}>
    {error ? <div role="alert" className="text-sm text-red-600">{error}<button className="ml-3 underline" onClick={() => { setError(""); setRevision(value => value + 1); }}>Try again</button></div> : !data ? <p role="status" className="flex items-center justify-center gap-2 py-12 text-sm text-slate-500"><Loader2 className="animate-spin" size={18} />Loading transaction details...</p> : <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-5"><div><p className="text-xs text-slate-500">{label(String(data.transactionType))}</p><p className="mt-1 text-3xl font-semibold">{money(Number(data.amount), String(data.currency || "NGN"))}</p></div><Status value={String(data.status)} /></div>
      <p className="mb-4 text-xs text-slate-500">All dates in WAT. Details reflect the information saved for this transaction.</p>
      {data.initiatedByAdmin && data.transactionType === "withdrawal" ? <p className="mb-5 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">Admin-initiated wallet deduction. No bank transfer was initiated.</p> : null}
      <Details data={data} currency={String(data.currency || "NGN")} />
    </>}
  </DetailDialog>;
}

export default function AllTransactions() {
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<Transaction[]>([]);
  const [produces, setProduces] = useState<Produce[]>([]);
  const [pagination, setPagination] = useState({ total: 0, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const invalidRange = filters.period === "custom" && (!filters.startDate || !filters.endDate || filters.startDate > filters.endDate);
  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      if (invalidRange) { setLoading(false); return; }
      try {
        const response = await axios.get(endpoint, { params: { ...filters, page }, withCredentials: true, signal: controller.signal });
        if (controller.signal.aborted) return;
        setItems(response.data.data); setProduces(response.data.produces); setPagination(response.data.pagination);
        if (page > Math.max(1, response.data.pagination.pages)) { setPage(Math.max(1, response.data.pagination.pages)); return; }
      } catch (error) { if (!controller.signal.aborted) setError(errorMessage(error)); }
      finally { if (!controller.signal.aborted) setLoading(false); }
    }, 250);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [filters, page, revision, invalidRange]);
  const change = (key: keyof typeof initialFilters, value: string) => { setFilters(current => ({ ...current, [key]: value })); setPage(1); setLoading(true); setError(""); };
  const refresh = () => { setLoading(true); setError(""); setRevision(value => value + 1); };
  const reset = () => { setFilters(initialFilters); setPage(1); refresh(); };
  const select = (key: keyof typeof initialFilters, title: string, options: string[][]) => <label className="text-xs font-semibold text-slate-600">{title}<select className={inputClass} value={filters[key]} onChange={event => change(key, event.target.value)}><option value="all">{key === "period" ? "All time" : `All ${title.toLowerCase()}`}</option>{options.map(([value, title]) => <option key={value} value={value}>{title}</option>)}</select></label>;
  const view = (item: Transaction) => <button onClick={() => setSelected(item._id)} aria-label={`View transaction ${item.transactionID}`} className="inline-flex items-center gap-1 rounded-lg p-2 text-sm font-semibold text-primary hover:bg-green-50 focus-visible:outline-2 focus-visible:outline-primary">View<ArrowUpRight size={16} /></button>;
  return <section className="space-y-4" aria-label="All transaction records">
    <div className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-2 xl:grid-cols-3">
      <label className="text-xs font-semibold text-slate-600">Search<div className="relative"><Search size={16} className="pointer-events-none absolute left-3 top-5 text-slate-400" /><input className={`${inputClass} pl-9`} value={filters.q} onChange={event => change("q", event.target.value)} placeholder="User, email, transaction ID or reference" /></div></label>
      {select("transactionType", "Transaction types", types)}{select("produce", "Produce", produces.map(item => [item._id, item.produceName || item.title || item._id]))}
      {select("status", "Statuses", ["pending", "completed", "refunded", "cancelled", "failed"].map(value => [value, label(value)]))}{select("period", "Period", periods)}{select("paymentMethod", "Payment methods", ["card", "bank", "wallet"].map(value => [value, label(value)]))}
      {filters.period === "custom" && <><label className="text-xs font-semibold text-slate-600">Start date<input type="date" className={inputClass} value={filters.startDate} max={filters.endDate || undefined} onChange={event => change("startDate", event.target.value)} /></label><label className="text-xs font-semibold text-slate-600">End date<input type="date" className={inputClass} value={filters.endDate} min={filters.startDate || undefined} onChange={event => change("endDate", event.target.value)} /></label></>}
    </div>
    <div className="flex flex-wrap items-center justify-between gap-3 text-sm"><p className="text-slate-500">{loading || error || invalidRange ? "Transaction records" : `${pagination.total.toLocaleString()} transactions`}<span className="ml-2 text-xs text-slate-400">All dates in WAT</span></p><div className="flex items-center gap-4"><button onClick={reset} className="font-semibold text-primary hover:underline">Reset filters</button><button onClick={refresh} disabled={loading} aria-label="Refresh transactions" className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 disabled:opacity-50"><RefreshCw size={16} className={loading ? "animate-spin" : ""} /></button></div></div>
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm" aria-busy={loading}>
      {invalidRange ? <p className="p-12 text-center text-sm text-slate-500">Choose valid start and end dates to view transactions.</p> : loading ? <p role="status" className="flex items-center justify-center gap-2 p-16 text-sm text-slate-500"><Loader2 size={18} className="animate-spin" />Loading transactions...</p> : error ? <div role="alert" className="p-12 text-center text-sm text-red-600">{error}<button onClick={refresh} className="ml-3 underline">Try again</button></div> : !items.length ? <div className="p-16 text-center"><Wallet size={24} className="mx-auto mb-3 text-slate-400" /><p className="text-sm font-semibold">No transactions found</p><p className="mt-1 text-sm text-slate-500">Try another search or adjust your filters.</p></div> : <>
        <div className="hidden overflow-x-auto xl:block"><table className="w-full text-left"><thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500"><tr>{["User / Transaction ID", "Type / Produce", "Amount", "Date", "Status", "Details"].map(title => <th key={title} className="px-4 py-4">{title}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{items.map(item => <tr key={item._id} onClick={() => setSelected(item._id)} className="cursor-pointer hover:bg-slate-50/70"><td className="max-w-64 px-4 py-5"><p className="truncate text-sm font-semibold">{userName(item)}</p><p className="truncate text-xs text-slate-500">{item.user?.email || item.userEmail || "Email unavailable"}</p><p className="mt-1 break-all font-mono text-xs text-slate-500">{item.transactionID}</p></td><td className="px-4 py-5 text-sm"><p className="font-medium">{label(item.transactionType)}</p><p className="mt-1 text-xs text-slate-500">{produceName(item)}</p></td><td className="px-4 py-5 text-sm font-semibold tabular-nums">{money(item.amount, item.currency)}</td><td className="px-4 py-5 text-xs text-slate-500">{date(item.createdAt)}</td><td className="px-4 py-5"><Status value={item.status} /></td><td className="px-4 py-5">{view(item)}</td></tr>)}</tbody></table></div>
        <div className="divide-y divide-slate-100 xl:hidden">{items.map(item => <article key={item._id} onClick={() => setSelected(item._id)} className="cursor-pointer p-4 sm:p-5"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate text-sm font-semibold">{userName(item)}</p><p className="break-all text-xs text-slate-500">{item.user?.email || item.userEmail}</p></div><Status value={item.status} /></div><div className="mt-4 flex flex-wrap justify-between gap-3"><div><p className="text-sm">{label(item.transactionType)}</p><p className="mt-1 text-xs text-slate-500">{produceName(item)}</p></div><p className="text-lg font-semibold">{money(item.amount, item.currency)}</p></div><p className="mt-3 text-xs text-slate-500">{date(item.createdAt)}</p><div className="mt-3 flex items-center justify-between gap-3 border-t border-slate-100 pt-3"><p className="min-w-0 break-all font-mono text-xs text-slate-500">{item.transactionID}</p>{view(item)}</div></article>)}</div>
        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-4 py-4"><p className="text-xs text-slate-500">Showing {(page - 1) * 10 + 1}–{(page - 1) * 10 + items.length} of {pagination.total} transactions</p><div className="flex items-center gap-3"><span className="text-xs text-slate-500">Page {page} of {pagination.pages}</span><button disabled={page <= 1} onClick={() => { setLoading(true); setPage(page - 1); }} aria-label="Previous page" className="rounded-lg border border-slate-200 p-2 disabled:opacity-40"><ChevronLeft size={16} /></button><button disabled={page >= pagination.pages} onClick={() => { setLoading(true); setPage(page + 1); }} aria-label="Next page" className="rounded-lg border border-slate-200 p-2 disabled:opacity-40"><ChevronRight size={16} /></button></div></footer>
      </>}
    </div>
    {selected && <TransactionDetails key={selected} id={selected} onClose={() => setSelected(null)} />}
  </section>;
}
