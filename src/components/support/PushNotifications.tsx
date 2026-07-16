"use client";
import axios from "axios";
import { Bell, BellRing, X } from "lucide-react";
import { useEffect, useState } from "react";
import { backendUrl } from "@/lib/tickets";

function decodeKey(value: string) {
  const padding = "=".repeat((4 - (value.length % 4)) % 4);
  const raw = atob((value + padding).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from([...raw].map((char) => char.charCodeAt(0)));
}

export default function PushNotifications({ admin = false }: { admin?: boolean }) {
  const [supported, setSupported] = useState(false), [enabled, setEnabled] = useState(false), [dismissed, setDismissed] = useState(false);
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window) || !publicKey) return;
    navigator.serviceWorker.register("/support-sw.js").then(async (registration) => {
      setSupported(true);
      setEnabled(Boolean(await registration.pushManager.getSubscription()));
    }).catch(console.error);
  }, [publicKey]);

  async function enable() {
    if (!publicKey || Notification.permission === "denied") return;
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return;
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: decodeKey(publicKey) });
    await axios.post(`${backendUrl}${admin ? "/api/admin/push" : "/api/push"}/subscribe`, subscription.toJSON(), { withCredentials: true });
    setEnabled(true);
  }

  if (!supported || enabled || dismissed) return null;
  return <div className="fixed bottom-5 right-5 z-[65] flex max-w-sm items-start gap-3 rounded-2xl bg-white p-4 shadow-xl ring-1 ring-green-900/10">
    <span className="rounded-xl bg-green-50 p-2.5 text-primary"><BellRing size={20}/></span><div className="flex-1"><p className="text-sm font-bold">Never miss a support reply</p><p className="mt-1 text-xs leading-5 text-gray-500">Enable notifications for ticket messages and status updates.</p><button onClick={enable} className="mt-3 flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-white hover:bg-primary-dark"><Bell size={14}/>Enable notifications</button></div><button onClick={() => setDismissed(true)} className="p-1 text-gray-400 hover:text-gray-700" aria-label="Dismiss"><X size={16}/></button>
  </div>;
}
