"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

type Details = {
  user: { firstName?: string; lastName?: string; username?: string; email?: string; phone?: string };
  investments: { _id: string; title: string; orderID: string; units: number; totalPrice: number; stage: string; track?: { name?: string } }[];
};

export function MemberDetailsModal({ room, userId, onClose }: { room: string; userId: string; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [details, setDetails] = useState<Details | null>(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const element = dialog.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      element?.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/forum/rooms/${encodeURIComponent(room)}/members/${encodeURIComponent(userId)}`, {
      credentials: "include", cache: "no-store", signal: controller.signal,
    }).then(async (response) => {
      if (!response.headers.get("content-type")?.includes("application/json")) {
        throw new Error("Member details are temporarily unavailable. Please try again later.");
      }
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to load member details");
      if (!controller.signal.aborted) setDetails(data);
    }).catch((cause: unknown) => {
      if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : "Unable to load member details");
    });
    return () => controller.abort();
  }, [room, userId, attempt]);

  return (
    <dialog ref={dialog} aria-labelledby="member-details-title" onCancel={onClose}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
      className="fixed inset-0 m-auto max-h-[85dvh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-2xl bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/45">
      <div className="p-5 sm:p-6">
        <header className="flex items-center justify-between gap-4">
          <h2 id="member-details-title" className="text-xl font-bold">Member details</h2>
          <button type="button" autoFocus onClick={onClose} aria-label="Close member details" className="grid size-10 place-items-center rounded-xl text-slate-500 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-primary"><X size={20} /></button>
        </header>
        {error ? <div role="alert" className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
          <p>{error}</p>
          <button type="button" className="mt-3 font-bold underline" onClick={() => { setError(""); setAttempt((value) => value + 1); }}>Try again</button>
        </div> : !details ? <p role="status" className="py-10 text-center text-sm text-slate-500">Loading member details…</p> : <>
          <dl className="mt-5 grid gap-4 rounded-xl bg-slate-50 p-4 text-sm sm:grid-cols-2">
            {[
              ["Actual name", [details.user.firstName, details.user.lastName].filter(Boolean).join(" ")],
              ["Username", details.user.username ? `@${details.user.username}` : ""],
              ["Email", details.user.email],
              ["Phone number", details.user.phone],
            ].map(([label, value]) => <div key={label} className="min-w-0"><dt className="text-xs text-slate-500">{label}</dt><dd className="mt-1 break-words font-semibold">{value || "Not provided"}</dd></div>)}
          </dl>
          <h3 className="mb-3 mt-6 font-bold">Active investments ({details.investments.length})</h3>
          {details.investments.length === 0 ? <p className="rounded-xl border border-slate-200 p-4 text-sm text-slate-500">This member has no active investments.</p> : <ul className="space-y-3">
            {details.investments.map((investment) => <li key={investment._id} className="rounded-xl border border-slate-200 p-4 text-sm">
              <p className="font-bold">{investment.title}</p>
              <p className="mt-1 text-xs text-slate-500">{investment.orderID}{investment.track?.name ? ` · ${investment.track.name}` : ""}</p>
              <div className="mt-3 flex flex-wrap justify-between gap-2">
                <span>{investment.units} {investment.units === 1 ? "unit" : "units"}</span>
                <span className="font-semibold">{new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(investment.totalPrice)}</span>
              </div>
              <p className="mt-2 capitalize text-primary">{investment.stage.replaceAll("-", " ")}</p>
            </li>)}
          </ul>}
        </>}
      </div>
    </dialog>
  );
}
