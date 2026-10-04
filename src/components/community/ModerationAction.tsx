"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ShieldCheck, X } from "lucide-react";

export async function forumRequest(path: string, init?: RequestInit) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/forum${path}`, {
    credentials: "include", ...init, headers: { "Content-Type": "application/json", ...init?.headers },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Unable to complete this action");
  return data;
}

type Props = {
  label: string; description: string; path: string; method: "POST" | "DELETE";
  payload?: { userId: string; kind: "ban" | "mute" }; onComplete: () => void;
  destructive?: boolean;
};

export function ModerationAction({ label, description, path, method, payload, onComplete, destructive }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  useEffect(() => { if (open) dialog.current?.showModal(); else dialog.current?.close(); }, [open]);

  const confirm = async () => {
    setBusy(true); setError("");
    try {
      await forumRequest(path, { method, ...(payload ? { body: JSON.stringify({ ...payload, reason }) } : {}) });
      setOpen(false); setReason(""); onComplete();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to complete this action"); }
    finally { setBusy(false); }
  };

  return <>
    <button type="button" onClick={() => { setError(""); setOpen(true); }} className={`rounded-lg px-2 py-1.5 text-xs font-semibold transition hover:bg-slate-100 ${destructive ? "text-red-600" : "text-primary"}`}>{label}</button>
    <dialog ref={dialog} onCancel={(event) => { if (busy) event.preventDefault(); else setOpen(false); }} className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl backdrop:bg-slate-950/40" aria-labelledby={titleId}>
      <div className="flex items-start justify-between"><span className="grid size-11 place-items-center rounded-xl bg-green-50 text-primary"><ShieldCheck size={23} /></span><button aria-label="Close confirmation" disabled={busy} onClick={() => setOpen(false)} className="rounded-lg p-2 text-slate-500"><X size={18} /></button></div>
      <h2 id={titleId} className="mt-4 text-xl font-bold text-slate-900">{label}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
      {payload && <label className="mt-4 block text-sm font-semibold text-slate-700">Reason <span className="font-normal text-slate-400">(optional)</span><textarea value={reason} onChange={(event) => setReason(event.target.value)} maxLength={500} rows={3} className="mt-2 w-full rounded-xl border border-slate-200 p-3 font-normal outline-none focus:border-primary" placeholder="Add context for your moderation team" /></label>}
      {error && <p role="alert" className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <div className="mt-6 flex justify-end gap-3"><button disabled={busy} onClick={() => setOpen(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold">Cancel</button><button disabled={busy} onClick={confirm} className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50 ${destructive ? "bg-red-600" : "bg-primary"}`}>{busy ? "Saving…" : label}</button></div>
    </dialog>
  </>;
}
