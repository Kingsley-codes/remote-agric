"use client";

import { useCallback, useEffect, useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { FaArrowUp, FaBuildingColumns, FaPen, FaTrash } from "react-icons/fa6";
import AddAccountModal from "./Addaccountmodal";
import WithdrawFundsModal from "./Withdrawfundsmodal";

type BankAccount = { accountName: string; accountNumber: string; bankCode: string };
const base = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function WalletActions() {
  const [account, setAccount] = useState<BankAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showRemoval, setShowRemoval] = useState(false);
  const [password, setPassword] = useState("");
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState("");

  const loadAccount = useCallback(async () => {
    try {
      const response = await fetch(`${base}/api/user/dashboard/bank-account`, { credentials: "include" });
      const payload = await response.json();
      setAccount(response.ok ? payload.data ?? null : null);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { void loadAccount(); }, [loadAccount]);

  const removeAccount = async () => {
    if (!password) return;
    setRemoving(true); setError("");
    try {
      const response = await fetch(`${base}/api/user/dashboard/bank-account`, { method: "DELETE", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
      const payload = await response.json();
      if (!response.ok || !payload.success) { setError(payload.message ?? "Unable to remove this account."); return; }
      setAccount(null); setPassword(""); setShowRemoval(false);
    } catch { setError("Unable to remove this account. Please try again."); }
    finally { setRemoving(false); }
  };

  const maskedNumber = account ? `•••• ${account.accountNumber.slice(-4)}` : "";

  return <>
    <div className="flex flex-col gap-4">
      {loading ? <div className="h-20 animate-pulse rounded-xl bg-white" /> : account ? <div className="flex flex-col gap-4 rounded-xl border border-[#d5e7cf] bg-white p-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-xl bg-[#eaf2e8] text-primary"><FaBuildingColumns /></span><div><p className="font-semibold text-gray-800">{account.accountName}</p><p className="mt-0.5 text-sm text-gray-500">Linked withdrawal account · {maskedNumber}</p></div></div><div className="flex gap-2"><button onClick={() => setShowAccountModal(true)} className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#d5e7cf] px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-[#f6f8f6]"><FaPen size={13} />Update</button><button onClick={() => setShowRemoval(true)} className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"><FaTrash size={13} />Remove</button></div></div> : <button onClick={() => setShowAccountModal(true)} className="flex h-14 items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-white transition hover:bg-primary-dark"><FaPlusCircle />Add withdrawal account</button>}
      <button onClick={() => setShowWithdraw(true)} disabled={!account || loading} className="flex h-14 items-center justify-center gap-2 rounded-xl border border-[#d5e7cf] bg-white font-semibold text-gray-700 transition hover:bg-[#f6f8f6] disabled:cursor-not-allowed disabled:opacity-50"><FaArrowUp />Withdraw Funds</button>
      {!loading && !account && <p className="text-center text-xs text-gray-500">Add a withdrawal account before requesting a payout.</p>}
    </div>

    {showAccountModal && <AddAccountModal account={account} onSaved={() => void loadAccount()} onClose={() => setShowAccountModal(false)} />}
    {showWithdraw && <WithdrawFundsModal onClose={() => setShowWithdraw(false)} />}
    {showRemoval && <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/20 p-4" onMouseDown={() => setShowRemoval(false)}><div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl" onMouseDown={(event) => event.stopPropagation()}><h2 className="text-lg font-semibold text-gray-800">Remove withdrawal account?</h2><p className="mt-2 text-sm leading-6 text-gray-500">Enter your password to remove this account. You can add a different account afterwards.</p><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Your password" className="mt-4 w-full rounded-xl border border-[#d5e7cf] px-4 py-3 text-sm outline-none focus:border-primary" />{error && <p className="mt-2 text-xs text-red-600">{error}</p>}<div className="mt-5 flex gap-3"><button onClick={() => setShowRemoval(false)} className="flex-1 rounded-xl border border-[#d5e7cf] py-2.5 text-sm font-semibold text-gray-600">Cancel</button><button disabled={!password || removing} onClick={() => void removeAccount()} className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{removing ? "Removing…" : "Remove"}</button></div></div></div>}
  </>;
}
