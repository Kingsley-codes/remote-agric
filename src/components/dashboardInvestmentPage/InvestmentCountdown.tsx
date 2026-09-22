"use client";
import { useEffect, useState } from "react";
import { CalendarClock } from "lucide-react";

export default function InvestmentCountdown({ startsAt, endsAt, status, orderStatus }: { startsAt: string; endsAt: string; status: string; orderStatus: string }) {
  const [now,setNow]=useState(()=>new Date());
  useEffect(()=>{const timer=setInterval(()=>setNow(new Date()),60000);return()=>clearInterval(timer)},[]);
  const start=new Date(startsAt); const end=new Date(endsAt); const target=now<start?start:end; const ms=Math.max(0,target.getTime()-now.getTime());
  const days=Math.floor(ms/86400000); const hours=Math.floor((ms%86400000)/3600000);
  const label=status==="completed"?"Investment completed":orderStatus!=="confirmed"?(orderStatus==="cancelled"?"Investment cancelled":"Awaiting confirmation"):now<start?`${days}d ${hours}h until your track starts`:ms>0?`${days}d ${hours}h remaining`:"Track term complete";
  return <div className="mb-4 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4"><CalendarClock className="shrink-0 text-primary" size={24}/><div><p className="text-xs font-semibold uppercase tracking-wide text-green-700">Track timeline</p><p className="mt-1 text-xl font-bold text-slate-900">{label}</p>{Number.isFinite(target.getTime())&&orderStatus==="confirmed"&&<p className="mt-1 text-xs text-slate-600">{now<start?"Starts":"Ends"} {target.toLocaleDateString("en-NG",{day:"numeric",month:"long",year:"numeric"})}</p>}</div></div>;
}
