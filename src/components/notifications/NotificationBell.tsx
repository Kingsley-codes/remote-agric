"use client";
import { useCallback, useEffect, useState } from "react";
import { FiBell, FiX } from "react-icons/fi";

type Notice = { _id: string; title: string; message: string; createdAt: string; read?: boolean; produce?: { produceName?: string } };
const base = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function NotificationBell() {
  const [items, setItems] = useState<Notice[]>([]);
  const [open, setOpen] = useState(false);
  const load = useCallback(async () => {
    const response = await fetch(`${base}/api/notifications`, { credentials: "include" });
    if (response.ok) setItems((await response.json()).notifications);
  }, []);
  useEffect(() => {
    load();
    const source = new EventSource(`${base}/api/notifications/stream`, { withCredentials: true });
    source.addEventListener("notification", (event) => setItems((current) => [{ ...JSON.parse((event as MessageEvent).data), read: false }, ...current]));
    return () => source.close();
  }, [load]);
  const markRead = async (item: Notice) => {
    if (item.read) return;
    await fetch(`${base}/api/notifications/${item._id}/read`, { method: "PATCH", credentials: "include" });
    setItems((current) => current.map((notice) => notice._id === item._id ? { ...notice, read: true } : notice));
  };
  const unread = items.filter((item) => !item.read).length;
  return <div className="fixed right-5 top-5 z-40">
    <button onClick={() => setOpen(!open)} className="relative grid size-11 place-items-center rounded-full bg-white text-primary shadow-lg border border-gray-200" aria-label="Notifications">
      <FiBell size={20} />{unread > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">{unread > 99 ? "99+" : unread}</span>}
    </button>
    {open && <div className="absolute right-0 mt-2 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border bg-white shadow-2xl">
      <div className="flex items-center justify-between border-b p-4"><h2 className="font-bold text-gray-900">Notifications</h2><button onClick={() => setOpen(false)}><FiX /></button></div>
      <div className="max-h-[70vh] overflow-y-auto">{items.length ? items.map((item) => <button key={item._id} onClick={() => markRead(item)} className={`block w-full border-b p-4 text-left hover:bg-gray-50 ${item.read ? "bg-white" : "bg-green-50"}`}>
        <div className="flex justify-between gap-3"><p className="text-sm font-bold text-gray-900">{item.title}</p>{!item.read && <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />}</div>
        <p className="mt-1 text-sm text-gray-600">{item.message}</p><p className="mt-2 text-xs text-gray-400">{new Date(item.createdAt).toLocaleString()}</p>
      </button>) : <p className="p-8 text-center text-sm text-gray-500">No notifications yet.</p>}</div>
    </div>}
  </div>;
}
