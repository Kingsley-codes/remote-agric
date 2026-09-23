'use client';

import { useEffect, useMemo, useState } from 'react';
import { FaMinus, FaPlus, FaMoneyBillWave } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import type { OpportunityTrack } from '@/lib';

const month = (value: number) => new Intl.DateTimeFormat('en', { month: 'long', timeZone: 'UTC' }).format(new Date(Date.UTC(2026, value - 1, 1)));

interface Props { checkOwnership?: boolean; produceId: string; unitPrice: number; fundedPercent: number; soldUnits: number; remainingUnits: number; minimumUnit: number; maximumUnit: number; referralBonus: number; tracks: OpportunityTrack[]; rolloverInvestmentId?: string; }

export function InvestmentCard({ checkOwnership = false, produceId, unitPrice, fundedPercent, soldUnits, remainingUnits, minimumUnit, maximumUnit, referralBonus, tracks, rolloverInvestmentId }: Props) {
  const router = useRouter();
  const [units, setUnits] = useState(minimumUnit);
  const [trackId, setTrackId] = useState('');
  const [ownedTracks, setOwnedTracks] = useState<string[]>([]);
  useEffect(() => {
    if (!checkOwnership) return;
    let cancelled = false;
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/dashboard/investments`, { credentials: 'include' })
      .then(response => response.ok ? response.json() : null)
      .then(data => {
        if (cancelled || !data) return;
        const investments: Array<{ produce?: { _id: string } | string; track?: { id: string }; orderStatus: string }> = data.data?.userInvestments ?? [];
        setOwnedTracks(investments.filter(item => (typeof item.produce === 'string' ? item.produce : item.produce?._id) === produceId && item.orderStatus !== 'cancelled').map(item => item.track?.id ?? ''));
      }).catch(() => {});
    return () => { cancelled = true; };
  }, [checkOwnership, produceId]);
  const total = useMemo(() => units * unitPrice, [units, unitPrice]);
  const availableTracks = tracks.filter((track) => track.status !== 'closed' && !ownedTracks.includes(track._id));
  const unitLimit = Math.min(remainingUnits, maximumUnit);
  const validUnits = Number.isSafeInteger(units) && units >= minimumUnit && units <= unitLimit;
  const available = remainingUnits >= minimumUnit && availableTracks.length > 0;
  const selectedTrack = availableTracks.find((track) => track._id === trackId);

  const checkout = () => {
    if (!selectedTrack || !validUnits) return;
    const query = new URLSearchParams({ produceId, units: String(units), trackId });
    if (rolloverInvestmentId) query.set('rolloverInvestmentId', rolloverInvestmentId);
    router.push(`/checkout?${query}`);
  };

  return <div className='flex flex-col gap-6 rounded-xl border border-gray-200 bg-white p-6 shadow-lg'>
    {rolloverInvestmentId && <div className='rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-800'><strong>Rollover offer</strong><p className='mt-1 text-xs'>This purchase will use your wallet balance and the opportunity&apos;s rollover profit.</p></div>}
    <div><div className='mb-2 flex justify-between'><span className='text-sm font-medium text-gray-500'>Funding Progress</span><span className='text-sm font-bold text-primary'>{fundedPercent}% Funded</span></div><div className='mb-4 h-2.5 w-full rounded-full bg-gray-200'><div className='h-2.5 rounded-full bg-primary' style={{width:`${fundedPercent}%`}} /></div><div className='flex justify-between text-xs text-gray-500'><span>{soldUnits.toLocaleString()} Units Sold</span><span>{remainingUnits.toLocaleString()} Left</span></div></div>
    <div className='flex flex-col items-center border-y border-gray-200 py-4'><span className='text-sm text-gray-500'>Price per Unit</span><span className='text-4xl font-extrabold'>₦{unitPrice.toLocaleString()}</span></div>
    <div className='rounded-xl bg-green-50 p-4 text-sm text-green-900'><strong>Earn NGN {referralBonus.toLocaleString("en-NG")} per referred unit</strong><p className='mt-1 text-xs'>Earn this produce&apos;s referral bonus when your referred friends invest within one year of their registration. Rates may change for future investments.</p></div>
    {ownedTracks.length > 0 && <p className='rounded-lg bg-slate-50 p-3 text-xs text-slate-600'>Tracks you already own are excluded. Select another available track to invest again.</p>}
    <p className='text-xs text-slate-500'>One investment per track, up to {maximumUnit} units. You can invest in other tracks too.</p>
    <label className='text-sm font-bold'>Farm track<select className='mt-2 w-full rounded-lg border border-gray-200 bg-white p-3 font-medium' value={trackId} onChange={(event) => setTrackId(event.target.value)}><option value=''>Select a track</option>{availableTracks.map((track)=><option key={track._id} value={track._id}>{track.name} ({month(track.startMonth)}–{month(track.endMonth)})</option>)}</select></label>
    {selectedTrack && <p className='-mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-600'>Your investment countdown starts on 1 {month(selectedTrack.startMonth)}.</p>}
    <div className='space-y-3'><label className='text-sm font-bold'>How many units? (Min. {minimumUnit}, max. {unitLimit})</label><div className='flex items-center gap-3'><button onClick={()=>setUnits((value)=>Math.max(minimumUnit,value-1))} className='grid size-10 place-items-center rounded-lg border'><FaMinus /></button><input type='number' min={minimumUnit} max={unitLimit} step="1" value={units} onChange={(event)=>setUnits(Math.min(unitLimit,Math.max(minimumUnit,Number(event.target.value))))} className='h-10 flex-1 rounded-lg border text-center font-bold'/><button onClick={()=>setUnits((value)=>Math.min(unitLimit,value+1))} className='grid size-10 place-items-center rounded-lg border'><FaPlus /></button></div><div className='flex justify-between rounded-lg bg-gray-50 p-3'><span className='text-sm text-gray-500'>Total Payable</span><strong>₦{total.toLocaleString()}</strong></div></div>
    <button disabled={!available || !selectedTrack || !validUnits} onClick={checkout} className='flex h-12 items-center justify-center gap-2 rounded-xl bg-primary font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300'>{available ? (trackId ? 'Own This Farm' : 'Select a track') : 'Currently unavailable'}<FaMoneyBillWave /></button>
  </div>;
}
