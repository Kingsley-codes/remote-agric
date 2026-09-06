"use client";
import { useCallback, useEffect, useState } from "react";
import { ArrowUpRight, RefreshCw, Search } from "lucide-react";
import axios from "axios";
import DetailDialog from "@/components/ui/DetailDialog";
import { stageLabel, investmentCountdown } from "@/lib/farmProgress";

interface Project { _id: string; title: string; produceName: string; category: string; }
interface Ownership {
  _id: string; orderID: string; title: string; units: number; totalPrice: number;
  orderStatus: string; status: string; stage: string; duration: number; ROI: number;
  orderDate: string; customerEmail?: string; transactionRef?: string; payment?: string;
  harvestChoice?: string | null; harvestFulfillmentStatus?: string; cashReturnAmount?: number;
  harvestChoiceDate?: string; harvestDeliveredAt?: string; cashReturnApprovedAt?: string;
  produce?: Project | null;
  investor?: { firstName: string; lastName: string; email: string; farmerID?: string } | null;
}
interface ResponseData { success: boolean; data: Ownership[]; projects: Project[]; pagination: { page: number; pages: number; total: number }; }
const base = process.env.NEXT_PUBLIC_BACKEND_URL;
const money = (value: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 2 }).format(Number(value) || 0);
const date = (value?: string) => value ? new Date(value).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : "Not recorded";
const name = (item: Ownership) => [item.investor?.firstName, item.investor?.lastName].filter(Boolean).join(" ") || "Unavailable farmer";
const statusLabel = (item: Ownership) => item.orderStatus === "confirmed" ? item.status : item.orderStatus;
const inputClass = "mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/30";

function Status({ value }: { value: string }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${["ongoing", "completed", "confirmed", "approved", "delivered"].includes(value) ? "bg-emerald-50 text-emerald-700" : value === "cancelled" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}>{stageLabel(value)}</span>;
}
function Detail({ label, value }: { label: string; value: string | number }) {
  return <div className="min-w-0"><dt className="text-xs font-medium text-slate-500">{label}</dt><dd className="mt-1 break-words text-sm font-semibold text-slate-900">{value}</dd></div>;
}

export default function InvestmentsTable() {
  const [data, setData] = useState<ResponseData>({ success: true, data: [], projects: [], pagination: { page: 1, pages: 1, total: 0 } });
  const [filters, setFilters] = useState({ search: "", status: "", project: "", category: "" });
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [actionSaving, setActionSaving] = useState(false);
  const [actionError, setActionError] = useState("");
  const selected = data.data.find(item => item._id === selectedId);
  useEffect(() => { const timer = setTimeout(() => { setLoading(true); setError(""); setQuery(filters.search); setPage(1); }, 300); return () => clearTimeout(timer); }, [filters.search]);
  useEffect(() => {
    const controller = new AbortController();
    const params = { page, search: query, status: filters.status || undefined, project: filters.project || undefined, category: filters.category || undefined };
    axios.get<ResponseData>(`${base}/api/admin/dashboard/investments`, { params, withCredentials: true, signal: controller.signal })
      .then(response => setData(response.data))
      .catch(reason => { if (!controller.signal.aborted) setError(axios.isAxiosError(reason) ? reason.response?.data?.message ?? "Unable to load farm ownerships" : "Unable to load farm ownerships"); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [page, query, filters.status, filters.project, filters.category, revision]);
  const change = (key: keyof typeof filters, value: string) => {
    setFilters(previous => ({ ...previous, [key]: value, ...(key === "category" ? { project: "" } : {}) })); setPage(1);
    if (key !== "search") { setLoading(true); setError(""); }
  };
  const close = useCallback(() => { setSelectedId(null); setActionError(""); }, []);
  const open = (id: string) => { setSelectedId(id); setActionError(""); };
  const act = async (action: "mark-delivered" | "approve-cash-return") => {
    if (!selected || actionSaving) return;
    setActionSaving(true); setActionError("");
    try {
      await axios.patch(`${base}/api/admin/dashboard/investments/${selected._id}/${action}`, {}, { withCredentials: true });
      // Update the modal immediately, then reload authoritative data.
      setData(previous => ({ ...previous, data: previous.data.map(item => item._id === selected._id ? { ...item, status: "completed", harvestFulfillmentStatus: action === "mark-delivered" ? "delivered" : "approved" } : item) }));
      setRevision(value => value + 1);
    } catch (reason) { setActionError(axios.isAxiosError(reason) ? reason.response?.data?.message ?? "Unable to complete this action" : "Unable to complete this action"); }
    finally { setActionSaving(false); }
  };
  const projects = data.projects.filter(project => !filters.category || project.category === filters.category);
  const dueDate = selected ? investmentCountdown(selected.orderDate, selected.duration)?.dueDate : undefined;
  const canFulfill = selected?.orderStatus === "confirmed" && selected.status === "ongoing" && ["harvesting", "ready-for-sale"].includes(selected.stage);
  return <section className="space-y-4">
    <div className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-2 xl:grid-cols-4">
      <label className="text-xs font-semibold text-slate-600">Search<div className="relative"><Search size={16} className="absolute left-3 top-5 text-slate-400" /><input value={filters.search} onChange={e => change("search", e.target.value)} placeholder="Farmer, project or order ID" className={`${inputClass} pl-9`} /></div></label>
      <label className="text-xs font-semibold text-slate-600">Project<select value={filters.project} onChange={e => change("project", e.target.value)} className={inputClass}><option value="">All projects</option>{projects.map(project => <option key={project._id} value={project._id}>{project.title}</option>)}</select></label>
      <label className="text-xs font-semibold text-slate-600">Category<select value={filters.category} onChange={e => change("category", e.target.value)} className={inputClass}><option value="">All categories</option><option value="crops">Crops</option><option value="livestock">Livestock</option><option value="aquaculture">Aquaculture</option></select></label>
      <label className="text-xs font-semibold text-slate-600">Status<select value={filters.status} onChange={e => change("status", e.target.value)} className={inputClass}><option value="">All statuses</option><option value="ongoing">Ongoing</option><option value="completed">Completed</option><option value="pending">Pending</option><option value="cancelled">Cancelled</option></select></label>
    </div>
    <div className="flex items-center justify-between text-sm"><span className="text-slate-500">{data.pagination.total} ownership records</span><div className="flex items-center gap-4"><button onClick={() => { setFilters({ search: "", status: "", project: "", category: "" }); setPage(1); setLoading(true); setError(""); }} className="font-semibold text-primary hover:underline">Reset filters</button><button disabled={loading} onClick={() => { setLoading(true); setError(""); setRevision(value => value + 1); }} aria-label="Refresh ownerships" className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 disabled:opacity-50"><RefreshCw size={16} /></button></div></div>
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm" aria-busy={loading}>
      {loading ? <p role="status" className="p-12 text-center text-sm text-slate-500">Loading farm ownerships…</p> : error ? <div role="alert" className="p-8 text-center text-sm text-red-600">{error} <button onClick={() => { setLoading(true); setError(""); setRevision(value => value + 1); }} className="font-semibold underline">Retry</button></div> : !data.data.length ? <p className="p-12 text-center text-sm text-slate-500">No farm ownerships match these filters.</p> : <>
        <table className="hidden w-full table-fixed text-left lg:table"><thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500"><tr><th className="w-[25%] px-4 py-4">Farmer</th><th className="w-[27%] px-4 py-4">Project</th><th className="w-[20%] px-4 py-4">Amount</th><th className="w-[15%] px-4 py-4">Status</th><th className="w-[13%] px-4 py-4 text-right">Details</th></tr></thead><tbody className="divide-y divide-slate-100">{data.data.map(item => <tr key={item._id} className="hover:bg-slate-50/70"><td className="break-words px-4 py-4"><p className="text-sm font-semibold text-slate-900">{name(item)}</p><p className="mt-1 text-xs text-slate-500">{item.orderID}</p></td><td className="break-words px-4 py-4"><p className="text-sm text-slate-800">{item.title}</p><p className="mt-1 text-xs capitalize text-slate-500">{item.produce?.category ?? "Uncategorized"}</p></td><td className="break-words px-4 py-4 text-sm font-semibold text-slate-900">{money(item.totalPrice)}</td><td className="px-4 py-4"><Status value={statusLabel(item)} /></td><td className="px-4 py-4 text-right"><button onClick={() => open(item._id)} aria-label={`View details for ${item.orderID}`} className="inline-flex items-center gap-1 rounded-lg px-2 py-2 text-sm font-semibold text-primary hover:bg-green-50">View<ArrowUpRight size={15} /></button></td></tr>)}</tbody></table>
        <div className="divide-y divide-slate-100 lg:hidden">{data.data.map(item => <article key={item._id} className="p-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><h3 className="break-words text-sm font-semibold text-slate-900">{name(item)}</h3><p className="mt-1 break-words text-sm text-slate-500">{item.title}</p></div><Status value={statusLabel(item)} /></div><div className="mt-4 flex items-center justify-between gap-3"><p className="text-sm font-bold text-slate-900">{money(item.totalPrice)}</p><button onClick={() => open(item._id)} className="rounded-lg border border-primary/20 px-3 py-2 text-xs font-semibold text-primary">View details</button></div></article>)}</div>
      </>}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-500"><span>Page {page} of {data.pagination.pages}</span><div className="flex gap-2"><button disabled={loading || page <= 1} onClick={() => { setLoading(true); setError(""); setPage(value => value - 1); }} className="rounded-lg border border-slate-200 bg-white px-3 py-2 disabled:opacity-40">Previous</button><button disabled={loading || page >= data.pagination.pages} onClick={() => { setLoading(true); setError(""); setPage(value => value + 1); }} className="rounded-lg border border-slate-200 bg-white px-3 py-2 disabled:opacity-40">Next</button></div></div>
    </div>
    {selected && <DetailDialog title="Farm ownership details" onClose={close}>
      <div className="mb-6 rounded-xl bg-green-50 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-primary">{selected.orderID}</p><h3 className="mt-1 text-xl font-bold">{selected.title}</h3><div className="mt-3 flex flex-wrap gap-2"><Status value={statusLabel(selected)} /><span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">{stageLabel(selected.stage)}</span></div></div>
      <h3 className="mb-3 text-sm font-bold">Farmer & project</h3><dl className="grid grid-cols-1 gap-4 sm:grid-cols-2"><Detail label="Farmer" value={name(selected)} /><Detail label="Email" value={selected.investor?.email ?? selected.customerEmail ?? "Unavailable"} /><Detail label="Farmer ID" value={selected.investor?.farmerID ?? "Unavailable"} /><Detail label="Category" value={stageLabel(selected.produce?.category ?? "Unavailable")} /><Detail label="Produce" value={selected.produce?.produceName ?? selected.title} /><Detail label="Order date" value={date(selected.orderDate)} /></dl>
      <h3 className="mb-3 mt-6 border-t border-slate-100 pt-5 text-sm font-bold">Investment</h3><dl className="grid grid-cols-1 gap-4 sm:grid-cols-2"><Detail label="Units" value={selected.units} /><Detail label="Amount invested" value={money(selected.totalPrice)} /><Detail label="ROI" value={`${selected.ROI}%`} /><Detail label="Duration" value={`${selected.duration} months`} /><Detail label="Expected total return" value={money(selected.totalPrice * (1 + Number(selected.ROI) / 100))} /><Detail label="Due date" value={date(dueDate?.toISOString())} /><Detail label="Payment reference" value={selected.transactionRef ?? selected.payment ?? "Unavailable"} /><Detail label="Order status" value={stageLabel(selected.orderStatus)} /></dl>
      <h3 className="mb-3 mt-6 border-t border-slate-100 pt-5 text-sm font-bold">Return & fulfillment</h3><dl className="grid grid-cols-1 gap-4 sm:grid-cols-2"><Detail label="Return choice" value={selected.harvestChoice ? stageLabel(selected.harvestChoice) : "Not selected"} /><Detail label="Fulfillment" value={stageLabel(selected.harvestFulfillmentStatus ?? "pending-selection")} /><Detail label="Choice date" value={date(selected.harvestChoiceDate)} /><Detail label="Delivery date" value={date(selected.harvestDeliveredAt)} /><Detail label="Cash approval date" value={date(selected.cashReturnApprovedAt)} /><Detail label="Cash return amount" value={selected.cashReturnAmount == null ? "Not credited" : money(selected.cashReturnAmount)} /></dl>
      {actionError && <p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-600">{actionError}</p>}
      {canFulfill && selected.harvestChoice === "physical-produce" && selected.harvestFulfillmentStatus === "pending-delivery" && <button disabled={actionSaving} onClick={() => act("mark-delivered")} className="mt-6 w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">{actionSaving ? "Saving…" : "Mark physical produce delivered"}</button>}
      {canFulfill && selected.harvestChoice === "cash-return" && selected.harvestFulfillmentStatus === "pending-approval" && <button disabled={actionSaving} onClick={() => act("approve-cash-return")} className="mt-6 w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">{actionSaving ? "Crediting wallet…" : "Approve cash return"}</button>}
    </DetailDialog>}
  </section>;
}
