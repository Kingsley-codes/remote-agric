"use client";
import { useEffect, useState } from "react";
import { CalendarClock } from "lucide-react";
import { investmentCountdown } from "@/lib/farmProgress";

export default function InvestmentCountdown({ orderDate, duration, status, orderStatus }: { orderDate: string; duration: number; status: string; orderStatus: string }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);
  const countdown = investmentCountdown(orderDate, duration, now);
  const label = status === "completed" ? "Investment completed" : orderStatus !== "confirmed" ? (orderStatus === "cancelled" ? "Investment cancelled" : "Awaiting confirmation") : countdown?.label ?? "Due date unavailable";
  return <div className="mb-4 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
    <CalendarClock className="shrink-0 text-primary" size={24} />
    <div><p className="text-xs font-semibold uppercase tracking-wide text-green-700">Investment timeline</p><p className="mt-1 text-xl font-bold text-slate-900">{label}</p>
      {countdown && orderStatus === "confirmed" && <p className="mt-1 text-xs text-slate-600">Due {countdown.dueDate.toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}</p>}
    </div>
  </div>;
}
