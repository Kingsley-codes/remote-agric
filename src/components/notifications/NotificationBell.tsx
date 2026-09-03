"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FiBell, FiCheck, FiCheckCircle, FiTrash2, FiX } from "react-icons/fi";

type Notice = { _id: string; title: string; message: string; createdAt: string; read?: boolean };

const base = process.env.NEXT_PUBLIC_BACKEND_URL;
const RETENTION_MS = 60 * 24 * 60 * 60 * 1000;

function isWithinRetentionPeriod(createdAt: string) {
  const timestamp = new Date(createdAt).getTime();
  return Number.isFinite(timestamp) && Date.now() - timestamp < RETENTION_MS;
}

export default function NotificationBell() {
  const [items, setItems] = useState<Notice[]>([]);
  const [open, setOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const keepRecent = useCallback((notices: Notice[]) => notices.filter((notice) => isWithinRetentionPeriod(notice.createdAt)), []);
  const load = useCallback(async () => {
    const response = await fetch(`${base}/api/notifications`, { credentials: "include" });
    if (response.ok) {
      const payload = await response.json();
      setItems(keepRecent(Array.isArray(payload.notifications) ? payload.notifications : []));
    }
  }, [keepRecent]);

  useEffect(() => {
    void load();
    const source = new EventSource(`${base}/api/notifications/stream`, { withCredentials: true });
    source.addEventListener("notification", (event) => {
      const notice = { ...JSON.parse((event as MessageEvent).data), read: false } as Notice;
      if (isWithinRetentionPeriod(notice.createdAt)) setItems((current) => [notice, ...current]);
    });
    return () => source.close();
  }, [load]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, []);

  const markRead = async (item: Notice) => {
    if (item.read) return;
    const response = await fetch(`${base}/api/notifications/${item._id}/read`, { method: "PATCH", credentials: "include" });
    if (response.ok) setItems((current) => current.map((notice) => notice._id === item._id ? { ...notice, read: true } : notice));
  };

  const markAllRead = async () => {
    const unreadItems = items.filter((item) => !item.read);
    if (!unreadItems.length) return;
    setUpdating(true);
    try {
      const responses = await Promise.all(
        unreadItems.map(async (item) => ({
          id: item._id,
          response: await fetch(`${base}/api/notifications/${item._id}/read`, {
            method: "PATCH",
            credentials: "include",
          }),
        })),
      );
      const markedIds = new Set(
        responses.filter(({ response }) => response.ok).map(({ id }) => id),
      );
      setItems((current) => current.map((item) => markedIds.has(item._id) ? { ...item, read: true } : item));
    } finally { setUpdating(false); }
  };

  const clearAll = async () => {
    if (!items.length) return;
    setUpdating(true);
    try {
      const response = await fetch(`${base}/api/notifications`, { method: "DELETE", credentials: "include" });
      if (response.ok) setItems([]);
    } finally { setUpdating(false); }
  };

  const unread = useMemo(() => items.filter((item) => !item.read).length, [items]);

  return <div className="fixed right-5 top-5 z-40">
    <button onClick={() => setOpen((current) => !current)} className="relative grid size-11 place-items-center rounded-full border border-primary/10 bg-white text-primary shadow-md shadow-green-900/10 transition hover:bg-primary/5" aria-label="Open notifications" aria-expanded={open}>
      <FiBell size={20} />
      {unread > 0 && <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-primary px-1.5 py-0.5 text-center text-[10px] font-semibold text-white">{unread > 99 ? "99+" : unread}</span>}
    </button>
    {open && <div className="fixed inset-0 z-50 bg-slate-900/15 backdrop-blur-[1px]" onMouseDown={() => setOpen(false)} role="presentation">
      <section className="absolute right-4 top-4 w-[min(25rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-[#dce8d7] bg-white shadow-[0_20px_55px_rgba(34,56,29,0.16)]" onMouseDown={(event) => event.stopPropagation()} aria-label="Notifications">
        <header className="flex items-center justify-between px-5 py-4"><div><h2 className="text-lg font-semibold text-slate-800">Notifications</h2><p className="mt-0.5 text-xs text-slate-500">{unread ? `${unread} unread` : "You’re all caught up"}</p></div><button onClick={() => setOpen(false)} className="grid size-9 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" aria-label="Close notifications"><FiX size={18} /></button></header>
        {items.length > 0 && <div className="flex items-center gap-2 border-y border-[#edf2eb] bg-[#fbfdf9] px-5 py-2.5"><button disabled={updating || !unread} onClick={() => void markAllRead()} className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary disabled:cursor-not-allowed disabled:opacity-40"><FiCheckCircle size={15} />Mark all read</button><span className="h-4 w-px bg-[#dce8d7]" /><button disabled={updating} onClick={() => void clearAll()} className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"><FiTrash2 size={14} />Clear all</button></div>}
        <div className="max-h-[min(65vh,34rem)] overflow-y-auto p-2">
          {items.length ? items.map((item) => <button key={item._id} onClick={() => void markRead(item)} className={`mb-1 block w-full rounded-xl px-3 py-3 text-left transition hover:bg-[#f4f8f1] ${item.read ? "bg-white" : "bg-[#f0f7ec]"}`}><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="text-sm font-semibold text-slate-800">{item.title}</p><p className="mt-1 text-sm leading-5 text-slate-500">{item.message}</p></div>{item.read ? <FiCheck className="mt-1 shrink-0 text-slate-300" size={16} /> : <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />}</div><p className="mt-2 text-xs text-slate-400">{new Date(item.createdAt).toLocaleString()}</p></button>) : <div className="px-6 py-12 text-center"><span className="mx-auto grid size-11 place-items-center rounded-full bg-[#eff6eb] text-primary"><FiBell size={19} /></span><p className="mt-3 text-sm font-semibold text-slate-700">No notifications yet</p><p className="mt-1 text-xs text-slate-500">Updates about your farms will appear here.</p></div>}
        </div>
      </section>
    </div>}
  </div>;
}
