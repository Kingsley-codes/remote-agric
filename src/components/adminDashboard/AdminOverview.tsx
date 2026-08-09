"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { Leaf, Loader2, TrendingUp, Users, WalletCards } from "lucide-react";

type Data = {
  stats: { totalInvestments: number; investmentCount: number; totalUsers: number; activeOpportunities: number; pendingWithdrawalAmount: number; pendingWithdrawalCount: number };
  inflow: { _id: { year: number; month: number }; amount: number }[];
  portfolio: { _id: string; amount: number }[];
  recent: { _id: string; orderID: string; title: string; totalPrice: number; orderStatus: string; createdAt: string; user?: { firstName: string; lastName: string } }[];
};

export default function AdminOverview() {
  const [data, setData] = useState<Data | null>(null);
  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/dashboard/overview`, { withCredentials: true }).then((response) => setData(response.data.data));
  }, []);
  if (!data) return <div className="flex justify-center p-24"><Loader2 className="animate-spin text-primary" /></div>;

  const money = (amount: number) => `₦${amount.toLocaleString("en-NG")}`;
  const cards = [
    ["Total farm ownerships", money(data.stats.totalInvestments), TrendingUp],
    ["Total remote farmers", data.stats.totalUsers, Users],
    ["Active farm opportunities", data.stats.activeOpportunities, Leaf],
    ["Pending withdrawals", money(data.stats.pendingWithdrawalAmount), WalletCards],
  ] as const;
  const max = Math.max(...data.inflow.map((item) => item.amount), 1);
  const total = data.portfolio.reduce((sum, item) => sum + item.amount, 0) || 1;

  return <div className="space-y-7 p-6 lg:p-10">
    <div><p className="text-sm text-gray-500">Live platform performance</p><h1 className="text-3xl font-semibold">Dashboard overview</h1></div>
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{cards.map(([label, value, Icon]) => <div key={label} className="rounded-2xl bg-white p-6 shadow-sm"><Icon className="text-primary" /><p className="mt-5 text-sm text-gray-500">{label}</p><p className="mt-1 text-2xl font-semibold">{value}</p></div>)}</div>
    <div className="grid gap-6 xl:grid-cols-3">
      <div className="rounded-2xl bg-white p-6 shadow-sm xl:col-span-2"><h2 className="font-semibold">Farm ownership inflow</h2><div className="mt-8 flex h-56 items-end gap-4">{data.inflow.map((item) => <div key={`${item._id.year}-${item._id.month}`} className="flex flex-1 flex-col items-center gap-2"><div title={money(item.amount)} className="w-full rounded-t-lg bg-primary" style={{ height: `${Math.max(6, item.amount / max * 180)}px` }} /><span className="text-[10px] font-medium text-gray-400">{new Date(item._id.year, item._id.month - 1).toLocaleString("en", { month: "short" })}</span></div>)}</div></div>
      <div className="rounded-2xl bg-white p-6 shadow-sm"><h2 className="font-semibold">Farm portfolio mix</h2><div className="mt-6 space-y-5">{data.portfolio.map((item) => <div key={item._id}><div className="flex justify-between text-sm"><span className="font-medium">{item._id}</span><span>{Math.round(item.amount / total * 100)}%</span></div><div className="mt-2 h-2 rounded-full bg-gray-100"><div className="h-full rounded-full bg-primary" style={{ width: `${item.amount / total * 100}%` }} /></div></div>)}</div></div>
    </div>
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm"><div className="p-5 font-semibold">Recent farm ownerships</div>{data.recent.map((item) => <div key={item._id} className="grid gap-2 border-t border-gray-100 p-5 md:grid-cols-[1fr_1fr_150px_120px]"><div><p className="font-medium">{item.user?.firstName} {item.user?.lastName}</p><p className="text-xs text-gray-400">{item.orderID}</p></div><p className="text-sm">{item.title}</p><p className="font-medium">{money(item.totalPrice)}</p><span className="text-xs font-medium capitalize text-primary">{item.orderStatus}</span></div>)}</div>
  </div>;
}
