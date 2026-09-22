"use client";

import { useMemo, useState } from "react";
import { FaMinus, FaPlus, FaMoneyBillWave } from "react-icons/fa";
import { useRouter } from "next/navigation";
import type { OpportunityTrack } from "@/lib";

const month = (value: number) => new Intl.DateTimeFormat("en", { month: "long", timeZone: "UTC" }).format(new Date(Date.UTC(2026, value - 1, 1)));
const isClosed = (track: OpportunityTrack) => track.startMonth < new Date().getMonth() + 1;

interface Props { produceId: string; status: string; unitPrice: number; fundedPercent: number; soldUnits: number; remainingUnits: number; minimumUnit: number; tracks: OpportunityTrack[]; rolloverInvestmentId?: string; }
export function InvestmentCard({ produceId, status, unitPrice, fundedPercent, soldUnits, remainingUnits, minimumUnit, tracks, rolloverInvestmentId }: Props) {
  const router = useRouter();
  const [units, setUnits] = useState(minimumUnit);
  const [trackId, setTrackId] = useState("");
  const [pendingTrack, setPendingTrack] = useState<OpportunityTrack | null>(null);
  const [acknowledged, setAcknowledged] = useState(false);
  const total = useMemo(() => units * unitPrice, [units, unitPrice]);
  const available = status === "active" && remainingUnits >= minimumUnit;
  const selectedTrack = tracks.find((track) => track._id === trackId);

  const chooseTrack = (id: string) => {
    const track = tracks.find((item) => item._id === id);
    setAcknowledged(false);
    if (!track) return setTrackId("");
    if (isClosed(track)) return setPendingTrack(track);
    setTrackId(id);
  };
  const continueNextYear = () => { if (pendingTrack) { setTrackId(pendingTrack._id); setAcknowledged(true); } setPendingTrack(null); };
  const checkout = () => {
    if (!trackId) return;
    const query = new URLSearchParams({ produceId, units: String(units), trackId });
    if (acknowledged) query.set("acknowledgeClosedTrack", "true");
    if (rolloverInvestmentId) query.set("rolloverInvestmentId", rolloverInvestmentId);
    router.push(`/checkout?${query}`);
  };

  return <><div className="flex flex-col gap-6 rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
    {rolloverInvestmentId && <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-800"><strong>Rollover offer</strong><p className="mt-1 text-xs">This purchase will use your wallet balance and the opportunity’s rollover profit.</p></div>}
    <div><div className="mb-2 flex justify-between"><span className="text-sm font-medium text-gray-500">Funding Progress</span><span className="text-sm font-bold text-primary">{fundedPercent}% Funded</span></div><div className="mb-4 h-2.5 w-full rounded-full bg-gray-200"><div className="h-2.5 rounded-full bg-primary" style={{width:`${fundedPercent}%`}} /></div><div className="flex justify-between text-xs text-gray-500"><span>{soldUnits.toLocaleString()} Units Sold</span><span>{remainingUnits.toLocaleString()} Left</span></div></div>
    <div className="flex flex-col items-center border-y border-gray-200 py-4"><span className="text-sm text-gray-500">Price per Unit</span><span className="text-4xl font-extrabold">₦{unitPrice.toLocaleString()}</span></div>
    <label className="text-sm font-bold">Farm track<select className="mt-2 w-full rounded-lg border border-gray-200 bg-white p-3 font-medium" value={trackId} onChange={(event)=>chooseTrack(event.target.value)}><option value="">Select a track</option>{tracks.map((track)=><option key={track._id} value={track._id}>{track.name} ({month(track.startMonth)}–{month(track.endMonth)}){isClosed(track)?" · starts next year":""}</option>)}</select></label>
    {selectedTrack && <p className="-mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">Your investment countdown starts on 1 {month(selectedTrack.startMonth)} {acknowledged ? "next year" : "this year"}.</p>}
    <div className="space-y-3"><label className="text-sm font-bold">How many units? (Min. {minimumUnit})</label><div className="flex items-center gap-3"><button onClick={()=>setUnits((u)=>Math.max(minimumUnit,u-1))} className="grid size-10 place-items-center rounded-lg border"><FaMinus /></button><input type="number" min={minimumUnit} max={remainingUnits} value={units} onChange={(e)=>setUnits(Math.min(remainingUnits,Math.max(minimumUnit,Number(e.target.value))))} className="h-10 flex-1 rounded-lg border text-center font-bold"/><button onClick={()=>setUnits((u)=>Math.min(remainingUnits,u+1))} className="grid size-10 place-items-center rounded-lg border"><FaPlus /></button></div><div className="flex justify-between rounded-lg bg-gray-50 p-3"><span className="text-sm text-gray-500">Total Payable</span><strong>₦{total.toLocaleString()}</strong></div></div>
    <button disabled={!available || !trackId} onClick={checkout} className="flex h-12 items-center justify-center gap-2 rounded-xl bg-primary font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300">{available ? (trackId ? "Own This Farm" : "Select a track") : "Currently unavailable"}<FaMoneyBillWave /></button>
  </div>
  {pendingTrack && <div className="fixed inset-0 z-[60] grid place-items-center bg-black/50 p-4"><div role="dialog" aria-modal="true" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"><h3 className="text-xl font-bold">This track is closed for the year</h3><p className="mt-3 text-sm leading-6 text-slate-600">The {pendingTrack.name} track began in {month(pendingTrack.startMonth)}, which has already passed. You can still select it, but your farm and countdown will not start until {month(pendingTrack.startMonth)} next year.</p><div className="mt-6 flex gap-3"><button onClick={()=>setPendingTrack(null)} className="flex-1 rounded-xl border py-3 font-bold">Choose another</button><button onClick={continueNextYear} className="flex-1 rounded-xl bg-primary py-3 font-bold text-white">Continue for next year</button></div></div></div>}
  </>;
}
