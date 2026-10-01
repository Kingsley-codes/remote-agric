"use client";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Building2, CheckCircle2, ChevronLeft, ChevronRight, Clock3, Loader2, RefreshCw, Search, Wallet } from "lucide-react";
import DetailDialog from "@/components/ui/DetailDialog";

type Withdrawal = {
  _id: string; transactionID: string; amount: number; status: string; createdAt: string; approvedAt?: string;
  withdrawalFlow?: string; settlementNote?: string; walletBalanceBefore?: number; walletBalanceAfter?: number;
  approvedBy?: { firstName: string; lastName: string };
  user?: { firstName: string; lastName: string; email: string; farmerID?: string };
  withdrawalBankAccount?: { accountName: string; accountNumber: string; bankCode: string };
};
const endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/dashboard/withdrawals`;
const money = (value: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(value);
const dateTime = (value: string) => new Date(value).toLocaleString("en-NG", { timeZone: "Africa/Lagos" });
const errorMessage = (error: unknown): string => axios.isAxiosError(error)
  ? error.response?.data?.message || "Unable to complete the request. Please try again."
  : "Unable to complete the request. Please try again.";
const periods = [["all", "All time"], ["today", "Today"], ["yesterday", "Yesterday"],
  ["this-week", "This week"], ["last-week", "Last week"], ["this-month", "This month"],
  ["last-month", "Last month"], ["custom", "Custom range"]];

const inputClass = "mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/30";
const userName = (item: Withdrawal) => [item.user?.firstName, item.user?.lastName].filter(Boolean).join(" ") || "Unavailable user";
const shortDate = (value: string) => new Date(value).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric", timeZone: "Africa/Lagos" });
function StatusBadge({ status }: { status: string }) {
  return <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${status === "completed" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
    <span className={`size-1.5 rounded-full ${status === "completed" ? "bg-emerald-500" : "bg-amber-500"}`} />
    {status === "pending" ? "Requested" : status === "completed" ? "Completed" : status}
  </span>;
}
function Detail({ label, value }: { label: string; value: string }) {
  return <div className="min-w-0"><dt className="text-xs font-medium text-slate-500">{label}</dt><dd className="mt-1 break-words text-sm font-semibold text-slate-900">{value}</dd></div>;
}
function UserIdentity({ item }: { item: Withdrawal }) {
  const initials = [item.user?.firstName?.[0], item.user?.lastName?.[0]].filter(Boolean).join("") || "?";
  return <div className="flex min-w-0 items-center gap-3">
    <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">{initials}</span>
    <div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-900" title={userName(item)}>{userName(item)}</p><p className="mt-0.5 truncate text-xs text-slate-500" title={item.user?.email}>{item.user?.email || "Email unavailable"}</p></div>
  </div>;
}
function WithdrawalDetails({ id, onClose, onApproved }: { id: string; onClose: () => void; onApproved: () => void }) {

  const [item, setItem] = useState<Withdrawal | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const approving = useRef(false);
  useEffect(() => {
    const controller = new AbortController();

    void axios.get(`${endpoint}/${id}`, { withCredentials: true, signal: controller.signal })
      .then((response) => setItem(response.data.data))
      .catch((error) => { if (!controller.signal.aborted) setError(errorMessage(error)); });
    return () => controller.abort();
  }, [id]);
  async function approve() {
    if (approving.current) return;
    approving.current = true; setBusy(true); setError("");
    try {
      await axios.post(`${endpoint}/${id}/approve`, {}, { withCredentials: true });
      onApproved();
    } catch (error) { setError(errorMessage(error)); }
    finally { approving.current = false; setBusy(false); }
  }
  const bank = item?.withdrawalBankAccount;
  return <DetailDialog title="Withdrawal details" onClose={onClose} dismissible={!busy}>
    {error && <p role="alert" className="mb-5 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    {!item && !error && <div role="status" className="flex items-center justify-center gap-2 py-12 text-sm text-slate-500"><Loader2 size={18} className="animate-spin" />Loading withdrawal details...</div>}
    {item && <>
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-5">
        <div><p className="text-xs font-medium text-slate-500">Withdrawal amount</p><p className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">{money(item.amount)}</p></div>
        <StatusBadge status={item.status} />
      </div>
      <h3 className="mb-4 mt-6 text-sm font-bold text-slate-900">Request information</h3>
      <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2"><Detail label="Transaction ID" value={item.transactionID} /></div>
        <Detail label="User" value={userName(item)} /><Detail label="Email address" value={item.user?.email || "Unavailable"} />
        <Detail label="Requested on (WAT)" value={dateTime(item.createdAt)} /><Detail label="User ID" value={item.user?.farmerID || "Unavailable"} />
        {item.approvedAt && <Detail label="Completed on (WAT)" value={dateTime(item.approvedAt)} />}
        {item.approvedBy && <Detail label="Approved by" value={`${item.approvedBy.firstName} ${item.approvedBy.lastName}`} />}
      </dl>
      <div className="mt-6 border-t border-slate-100 pt-5">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-900"><Building2 size={17} className="text-slate-400" />Bank account</h3>
        {bank ? <dl className="grid grid-cols-1 gap-5 rounded-xl border border-slate-200 p-4 sm:grid-cols-2">
          <Detail label="Account name" value={bank.accountName} /><Detail label="Account number" value={bank.accountNumber} /><Detail label="Bank code" value={bank.bankCode} />
        </dl> : <p className="text-sm text-slate-500">Bank details were not saved for this withdrawal.</p>}
      </div>
      {(item.walletBalanceBefore !== undefined || item.settlementNote) && <div className="mt-6 border-t border-slate-100 pt-5">
        <h3 className="mb-4 text-sm font-bold">Settlement information</h3>
        <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {item.walletBalanceBefore !== undefined && <Detail label="Balance before" value={money(item.walletBalanceBefore)} />}
          {item.walletBalanceAfter !== undefined && <Detail label="Balance after" value={money(item.walletBalanceAfter)} />}
          {item.settlementNote && <div className="sm:col-span-2"><Detail label="Note" value={item.settlementNote} /></div>}
        </dl>
      </div>}
      {item.status === "pending" && item.withdrawalFlow !== "manual" && <p className="mt-6 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">This request uses the previous payment flow and cannot be manually approved.</p>}
      <div className="mt-6 border-t border-slate-100 pt-5">
        {item.status === "pending" && item.withdrawalFlow === "manual" && <p className="mb-4 text-sm leading-relaxed text-slate-500">Confirm the bank payment before approving. Approval deducts {money(item.amount)} from the user's wallet and completes this request.</p>}
        <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
          <button type="button" onClick={onClose} disabled={busy} className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50">Close</button>
          {item.status === "pending" && item.withdrawalFlow === "manual" && <button type="button" onClick={approve} disabled={busy} className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50">
            {busy ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}{busy ? "Approving..." : "Approve withdrawal"}
          </button>}
        </div>
      </div>
    </>}
  </DetailDialog>;
}
export default function ManualWithdrawalDashboard() {
  const [items, setItems] = useState<Withdrawal[]>([]);
  const [status, setStatus] = useState("pending");
  const [period, setPeriod] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);
  const invalidRange = period === "custom" && (!startDate || !endDate || startDate > endDate);
  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      if (invalidRange) { setItems([]); setLoading(false); return; }
      setLoading(true); setError("");
      try {
        const response = await axios.get(endpoint, { params: { status, date: period, startDate, endDate, q: query, page }, withCredentials: true, signal: controller.signal });
        setItems(response.data.data); setPagination(response.data.pagination);
      } catch (error) { if (!controller.signal.aborted) { setError(errorMessage(error)); setItems([]); } }
      finally { if (!controller.signal.aborted) setLoading(false); }
    }, 200);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [status, period, startDate, endDate, query, page, revision, invalidRange]);
  const change = (setter: (value: string) => void, value: string) => {
    setter(value); setPage(1); setLoading(true); setError("");
  };
  const refresh = () => { setLoading(true); setError(""); setRevision(value => value + 1); };
  const reset = () => { setQuery(""); setPeriod("all"); setStartDate(""); setEndDate(""); setPage(1); refresh(); };
  const filtersActive = Boolean(query || period !== "all");
  const firstRecord = (page - 1) * 10 + 1;
  const detailsButton = (item: Withdrawal) => <button onClick={() => setSelected(item._id)} aria-label={`View withdrawal ${item.transactionID}`} className="inline-flex items-center gap-1 rounded-lg px-2 py-2 text-sm font-semibold text-primary hover:bg-green-50 focus-visible:outline-2 focus-visible:outline-primary">View <ArrowUpRight size={16} /></button>;
  return <main className="mx-auto w-full max-w-7xl min-w-0 p-4 sm:p-6 lg:p-8">
    <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
      <div><h1 className="pb-2 text-3xl font-semibold tracking-tight text-gray-800">Withdrawals</h1><p className="text-sm text-slate-500">Review withdrawal requests and manage completed payments.</p></div>
      <span className="inline-flex items-center gap-2 rounded-lg border border-primary/10 bg-primary/5 px-3 py-2 text-xs font-medium text-primary"><Clock3 size={15} />24-hour processing</span>
    </header>
    {notice && <div role="status" className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-800"><CheckCircle2 size={18} className="mt-0.5 shrink-0" /><p>{notice}</p></div>}
    <section className="space-y-4" aria-label="Withdrawal records">
      <div className="flex gap-6 border-b border-slate-200" aria-label="Withdrawal status">
        {[["pending", "Requested", Clock3], ["completed", "Completed", CheckCircle2]].map(([value, label, Icon]) => {
          const TabIcon = Icon as typeof Clock3;
          return <button key={String(value)} type="button" aria-pressed={status === value} onClick={() => change(setStatus, String(value))} className={`-mb-px inline-flex items-center gap-2 border-b-2 px-1 pb-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-primary ${status === value ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-800"}`}><TabIcon size={16} />{String(label)}</button>;
        })}
      </div>
      <div className={`grid gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-2 ${period === "custom" ? "xl:grid-cols-4" : ""}`}>
        <label className="text-xs font-semibold text-slate-600">Search<div className="relative"><Search size={16} className="pointer-events-none absolute left-3 top-5 text-slate-400" /><input value={query} onChange={event => change(setQuery, event.target.value)} placeholder="User, email or transaction ID" className={`${inputClass} pl-9`} /></div></label>
        <label className="text-xs font-semibold text-slate-600">Request period<select value={period} onChange={event => change(setPeriod, event.target.value)} className={inputClass}>{periods.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        {period === "custom" && <>
          <label className="text-xs font-semibold text-slate-600">Start date<input type="date" value={startDate} max={endDate || undefined} onChange={event => change(setStartDate, event.target.value)} className={inputClass} /></label>
          <label className="text-xs font-semibold text-slate-600">End date<input type="date" value={endDate} min={startDate || undefined} onChange={event => change(setEndDate, event.target.value)} className={inputClass} /></label>
        </>}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <p className="text-slate-500">{loading || invalidRange || error ? "Withdrawal records" : `${pagination.total.toLocaleString()} ${status === "pending" ? "requested" : "completed"} withdrawals`}<span className="ml-2 hidden text-xs text-slate-400 sm:inline">All dates in WAT</span></p>
        <div className="flex items-center gap-4"><button onClick={reset} disabled={!filtersActive} className="text-sm font-semibold text-primary hover:underline disabled:cursor-default disabled:text-slate-400 disabled:no-underline">Reset filters</button><button disabled={loading} onClick={refresh} aria-label="Refresh withdrawals" className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-50"><RefreshCw size={16} className={loading ? "animate-spin" : ""} /></button></div>
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm" aria-busy={loading}>
        {invalidRange ? <div className="p-12 text-center"><Clock3 size={24} className="mx-auto mb-3 text-slate-300" /><p className="text-sm font-semibold text-slate-700">Choose a date range</p><p className="mt-1 text-sm text-slate-500">Select valid start and end dates to view withdrawals.</p></div>
          : loading ? <div role="status" className="flex items-center justify-center gap-2 p-16 text-sm text-slate-500"><Loader2 size={18} className="animate-spin" />Loading withdrawals...</div>
          : error ? <div role="alert" className="p-12 text-center text-sm text-red-600"><p>{error}</p><button onClick={refresh} className="mt-3 font-semibold underline">Try again</button></div>
          : !items.length ? <div className="px-6 py-16 text-center"><span className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-slate-50"><Wallet size={22} className="text-slate-400" /></span><h2 className="text-sm font-semibold text-slate-900">No {status === "pending" ? "requested" : "completed"} withdrawals</h2><p className="mt-1 text-sm text-slate-500">{filtersActive ? "Try another search or adjust your date filters." : status === "pending" ? "New withdrawal requests will appear here." : "Approved withdrawals will appear here."}</p>{filtersActive && <button onClick={reset} className="mt-4 text-sm font-semibold text-primary hover:underline">Clear filters</button>}</div>
          : <>
            <table className="hidden w-full table-fixed text-left xl:table">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500"><tr>
                <th className="w-[25%] px-4 py-4">User</th><th className="w-[23%] px-4 py-4">Transaction ID</th><th className="w-[16%] px-4 py-4 text-right">Amount</th><th className="w-[14%] px-4 py-4">Requested</th><th className="w-[13%] px-4 py-4">Status</th><th className="w-[9%] px-4 py-4 text-right">Details</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-100">{items.map(item => <tr key={item._id} onClick={() => setSelected(item._id)} className="cursor-pointer transition-colors hover:bg-slate-50/70">
                <td className="px-4 py-5"><UserIdentity item={item} /></td>
                <td className="px-4 py-5"><span className="block truncate font-mono text-xs text-slate-600" title={item.transactionID}>{item.transactionID}</span></td>
                <td className="break-words px-4 py-5 text-right text-sm font-semibold tabular-nums text-slate-900">{money(item.amount)}</td>
                <td className="px-4 py-5 text-xs text-slate-500">{shortDate(item.createdAt)}</td><td className="px-4 py-5"><StatusBadge status={item.status} /></td><td className="px-3 py-5 text-right">{detailsButton(item)}</td>
              </tr>)}</tbody>
            </table>
            <div className="divide-y divide-slate-100 xl:hidden">{items.map(item => <article key={item._id} className="p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3"><UserIdentity item={item} /><StatusBadge status={item.status} /></div>
              <div className="mt-4 flex items-end justify-between gap-4"><div><p className="text-xs text-slate-500">Amount</p><p className="mt-1 text-lg font-semibold tabular-nums text-slate-900">{money(item.amount)}</p></div><p className="text-xs text-slate-500">{shortDate(item.createdAt)}</p></div>
              <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3"><p className="min-w-0 truncate font-mono text-xs text-slate-500" title={item.transactionID}>{item.transactionID}</p><span className="shrink-0">{detailsButton(item)}</span></div>
            </article>)}</div>
          </>}
        {!loading && !invalidRange && !error && pagination.total > 0 && <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-4 py-4 sm:px-5">
          <p className="text-xs text-slate-500">Showing <span className="font-semibold text-slate-700">{items.length ? firstRecord : 0}–{items.length ? firstRecord + items.length - 1 : 0}</span> of <span className="font-semibold text-slate-700">{pagination.total}</span> withdrawals</p>
          <div className="flex items-center gap-3"><span className="text-xs text-slate-500">Page {page} of {Math.max(1, pagination.pages)}</span><button disabled={page <= 1} onClick={() => { setLoading(true); setPage(page - 1); }} aria-label="Previous page" className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft size={16} /></button><button disabled={page >= pagination.pages} onClick={() => { setLoading(true); setPage(page + 1); }} aria-label="Next page" className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"><ChevronRight size={16} /></button></div>
        </footer>}
      </div>
    </section>
    {selected && <WithdrawalDetails key={selected} id={selected} onClose={() => setSelected(null)} onApproved={() => {
      setSelected(null); setNotice("Withdrawal approved. The wallet has been debited and the request is completed."); setPage(1); refresh();
    }} />}
  </main>;
}
