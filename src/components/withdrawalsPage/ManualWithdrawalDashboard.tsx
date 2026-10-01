"use client";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Loader2, X } from "lucide-react";

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

function WithdrawalDetails({ id, onClose, onApproved }: { id: string; onClose: () => void; onApproved: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [item, setItem] = useState<Withdrawal | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const approving = useRef(false);
  useEffect(() => {
    const controller = new AbortController();
    dialog.current?.showModal();
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
  return <dialog ref={dialog} onCancel={(event) => { event.preventDefault(); if (!busy) onClose(); }}
    aria-labelledby="withdrawal-title" className="fixed inset-0 m-auto max-h-[90vh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-2xl bg-white p-6 text-gray-900 shadow-xl backdrop:bg-black/50">
    <div className="flex items-center justify-between gap-4">
      <h2 id="withdrawal-title" className="text-xl font-semibold">Withdrawal details</h2>
      <button onClick={onClose} disabled={busy} aria-label="Close withdrawal details" className="rounded-lg p-2 hover:bg-gray-100 disabled:opacity-50"><X size={20} /></button>
    </div>
    {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    {!item && !error && <p role="status" className="py-12 text-center">Loading details…</p>}
    {item && <>
      <p className="mt-5 text-3xl font-semibold">{money(item.amount)}</p>
      <p className="mt-1 text-sm capitalize text-gray-500">{item.status === "pending" ? "Requested" : item.status}</p>
      <dl className="mt-6 grid grid-cols-[110px_1fr] gap-x-4 gap-y-3 text-sm">
        <dt className="text-gray-500">Transaction ID</dt><dd className="break-all font-mono">{item.transactionID}</dd>
        <dt className="text-gray-500">User</dt><dd>{item.user ? `${item.user.firstName} ${item.user.lastName}` : "Unavailable"}</dd>
        <dt className="text-gray-500">Email</dt><dd className="break-all">{item.user?.email ?? "Unavailable"}</dd>
        <dt className="text-gray-500">Requested</dt><dd>{dateTime(item.createdAt)} WAT</dd>
        {item.approvedAt && <><dt className="text-gray-500">Completed</dt><dd>{dateTime(item.approvedAt)} WAT</dd></>}
        {item.approvedBy && <><dt className="text-gray-500">Approved by</dt><dd>{item.approvedBy.firstName} {item.approvedBy.lastName}</dd></>}
        {item.walletBalanceBefore !== undefined && <><dt className="text-gray-500">Balance before</dt><dd>{money(item.walletBalanceBefore)}</dd></>}
        {item.walletBalanceAfter !== undefined && <><dt className="text-gray-500">Balance after</dt><dd>{money(item.walletBalanceAfter)}</dd></>}
        {item.settlementNote && <><dt className="text-gray-500">Note</dt><dd>{item.settlementNote}</dd></>}
      </dl>
      <div className="mt-6 rounded-xl bg-gray-50 p-4"><h3 className="font-semibold">Bank account</h3>
        {bank ? <dl className="mt-3 grid grid-cols-[110px_1fr] gap-3 text-sm">
          <dt className="text-gray-500">Account name</dt><dd>{bank.accountName}</dd>
          <dt className="text-gray-500">Account number</dt><dd className="font-mono">{bank.accountNumber}</dd>
          <dt className="text-gray-500">Bank code</dt><dd>{bank.bankCode}</dd>
        </dl> : <p className="mt-2 text-sm text-gray-500">Bank details were not saved for this withdrawal.</p>}
      </div>
      {item.status === "pending" && (item.withdrawalFlow === "manual" ? <>
        <p className="mt-5 text-sm text-gray-600">Approve after completing the bank payment. Approval deducts {money(item.amount)} from the user’s wallet and marks this request completed.</p>
        <button onClick={approve} disabled={busy} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary p-3 font-semibold text-white disabled:opacity-50">
          {busy && <Loader2 className="animate-spin" size={18} />}{busy ? "Approving…" : "Approve withdrawal"}
        </button>
      </> : <p className="mt-5 text-sm text-amber-700">This request was submitted through the previous payment flow and cannot be manually approved.</p>)}
    </>}
  </dialog>;
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
  const change = (setter: (value: string) => void, value: string) => { setter(value); setPage(1); setLoading(true); };
  return <section className="space-y-6 p-4 sm:p-6 lg:p-10">
    <div><p className="text-xs font-medium uppercase tracking-wider text-primary">Finance operations</p><h1 className="mt-2 text-3xl font-semibold">Withdrawals</h1>
      <p className="mt-2 text-sm text-gray-500">Review requests and complete withdrawals within 24 hours.</p></div>
    {notice && <p role="status" className="rounded-xl bg-green-50 p-4 text-green-800">{notice}</p>}
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <div role="tablist" aria-label="Withdrawal status" className="flex gap-6 border-b px-5">
        {[["pending", "Requested withdrawals"], ["completed", "Completed withdrawals"]].map(([value, label]) =>
          <button key={value} role="tab" aria-selected={status === value} onClick={() => change(setStatus, value)} className={`border-b-2 py-4 text-sm font-semibold ${status === value ? "border-primary text-primary" : "border-transparent text-gray-500"}`}>{label}</button>)}
      </div>
      <div className="flex flex-wrap items-end gap-3 p-5">
        <label className="min-w-52 flex-1"><span className="sr-only">Search user or transaction ID</span><input value={query} onChange={(e) => change(setQuery, e.target.value)} placeholder="Search user or transaction ID" className="w-full rounded-xl bg-gray-50 p-3 text-sm" /></label>
        <label className="text-xs text-gray-500">Request period (WAT)<select value={period} onChange={(e) => change(setPeriod, e.target.value)} className="mt-1 block rounded-xl bg-gray-50 p-3 text-sm text-gray-800">
          {periods.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        {period === "custom" && <>
          <label className="text-xs text-gray-500">From<input aria-label="Start date" type="date" value={startDate} onChange={(e) => change(setStartDate, e.target.value)} className="mt-1 block rounded-xl bg-gray-50 p-3 text-sm" /></label>
          <label className="text-xs text-gray-500">To<input aria-label="End date" type="date" value={endDate} min={startDate} onChange={(e) => change(setEndDate, e.target.value)} className="mt-1 block rounded-xl bg-gray-50 p-3 text-sm" /></label>
        </>}
      </div>
      {error && <p role="alert" className="px-5 pb-4 text-sm text-red-700">{error} <button className="underline" onClick={() => setRevision((value) => value + 1)}>Retry</button></p>}
      {invalidRange ? <p className="p-10 text-center text-gray-500">Choose a valid start and end date.</p> : loading ? <div role="status" className="flex justify-center p-14"><Loader2 aria-label="Loading withdrawals" className="animate-spin text-primary" /></div> : <>
        <div className="overflow-x-auto"><table className="w-full min-w-[800px] text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr>{["Transaction ID", "User", "Amount", "Requested (WAT)", "Status"].map((label) => <th key={label} className="px-5 py-3">{label}</th>)}</tr></thead>
          <tbody>{items.map((item) => <tr key={item._id} onClick={() => setSelected(item._id)} className="cursor-pointer border-t border-gray-100 hover:bg-gray-50">
            <td className="max-w-64 px-5 py-4"><button onClick={(event) => { event.stopPropagation(); setSelected(item._id); }} className="break-all text-left font-mono text-xs text-primary underline underline-offset-4">{item.transactionID}</button></td>
            <td className="px-5 py-4"><p className="font-medium">{item.user ? `${item.user.firstName} ${item.user.lastName}` : "Unavailable"}</p><p className="text-xs text-gray-500">{item.user?.email}</p></td>
            <td className="whitespace-nowrap px-5 py-4 font-semibold">{money(item.amount)}</td><td className="px-5 py-4 text-gray-500">{dateTime(item.createdAt)}</td>
            <td className="px-5 py-4"><span className={`rounded-full px-3 py-1 text-xs ${item.status === "completed" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>{item.status === "pending" ? "Requested" : "Completed"}</span></td>
          </tr>)}</tbody>
        </table></div>
        {!items.length && !error && <p className="p-12 text-center text-gray-500">No withdrawals found.</p>}
        <div className="flex items-center justify-between gap-4 border-t p-5 text-sm"><span className="text-gray-500">{pagination.total} withdrawals · Page {page} of {Math.max(1, pagination.pages)}</span>
          <div className="flex gap-2"><button disabled={page <= 1} onClick={() => { setLoading(true); setPage(page - 1); }} className="rounded-lg border px-3 py-2 disabled:opacity-40">Previous</button><button disabled={page >= pagination.pages} onClick={() => { setLoading(true); setPage(page + 1); }} className="rounded-lg border px-3 py-2 disabled:opacity-40">Next</button></div>
        </div>
      </>}
    </div>
    {selected && <WithdrawalDetails key={selected} id={selected} onClose={() => setSelected(null)} onApproved={() => {
      setSelected(null); setNotice("Withdrawal approved. The wallet has been debited and the request is completed."); setPage(1); setLoading(true); setRevision((value) => value + 1);
    }} />}
  </section>;
}
