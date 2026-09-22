"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiArrowRight, FiLock } from "react-icons/fi";

type ProduceType = { _id: string; title: string; price: number; image1: { url: string }; profit: number; rolloverProfit: number; tracks: Array<{ _id: string; name: string }> };
type BillingData = { firstName: string; lastName: string; email: string; address: string };
type Props = { produce: ProduceType | null; units: number; billingData: BillingData; paymentMethod: "card" | "wallet"; isAuthenticated: boolean; trackId: string; acknowledgeClosedTrack: boolean; rolloverInvestmentId?: string };
const STORAGE_KEY = "remote-agric-payment-intent";
function paymentKey(fingerprint: string) { try { const raw=sessionStorage.getItem(STORAGE_KEY); if(raw){const stored=JSON.parse(raw); if(stored.fingerprint===fingerprint&&stored.key)return stored.key;} } catch {} const key=crypto.randomUUID(); try{sessionStorage.setItem(STORAGE_KEY,JSON.stringify({fingerprint,key}));}catch{} return key; }
function clearKey(){try{sessionStorage.removeItem(STORAGE_KEY);}catch{}}

export default function OrderSummary({ produce, units, billingData, paymentMethod, isAuthenticated, trackId, acknowledgeClosedTrack, rolloverInvestmentId }: Props) {
  const router=useRouter();
  const [agreed,setAgreed]=useState(false);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState<string|null>(null);
  const [warning,setWarning]=useState<string|null>(null);
  if(!produce) return <div className="rounded-xl border bg-white p-6">Loading order summary…</div>;
  const total=produce.price*units;
  const track=produce.tracks.find((item)=>item._id===trackId);

  const pay=async(forceAcknowledgement=false)=>{
    if(!trackId){setError("Please return to the opportunity and select a track.");return;}
    if(!agreed){setError("Please agree to the Farm Ownership Terms to continue.");return;}
    if(paymentMethod==="wallet"&&!isAuthenticated){setError("Please sign in to pay with your Agro Wallet.");return;}
    if(rolloverInvestmentId&&paymentMethod!=="wallet"){setError("Rollover investments must use your Agro Wallet.");return;}
    setLoading(true);setError(null);
    try{
      const payload={produceId:produce._id,units,amount:total,paymentMethod,trackId,acknowledgeClosedTrack:forceAcknowledgement||acknowledgeClosedTrack,rolloverInvestmentId,...billingData};
      const key=paymentKey(JSON.stringify(payload));
      const response=await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment/paystack/payment`,{method:"POST",credentials:"include",headers:{"Content-Type":"application/json","Idempotency-Key":key},body:JSON.stringify(payload)});
      const data=await response.json();
      if(!response.ok){if(data.code==="TRACK_CLOSED_FOR_YEAR"){setWarning(data.message);return;}if(data.retryableWithNewKey)clearKey();throw new Error(data.message||"Payment failed");}
      clearKey();
      if(paymentMethod==="wallet"&&data.success)router.push("/dashboard/investments");else if(data.data?.authorization_url)window.location.href=data.data.authorization_url;else throw new Error("No payment URL received");
    }catch(failure){setError(failure instanceof Error?failure.message:"Something went wrong. Please try again.");}finally{setLoading(false);}
  };

  return <><div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow"><div className="border-b bg-linear-to-br from-white to-background-light p-6"><h3 className="mb-4 text-lg font-bold">Farm Ownership Summary</h3><div className="flex gap-4"><div className="size-20 rounded-lg bg-cover bg-center" style={{backgroundImage:`url(${produce.image1.url})`}}/><div><p className="font-bold text-primary">{produce.title}</p><p className="text-xs text-gray-500">{rolloverInvestmentId?"Rollover":"Standard"} profit: {rolloverInvestmentId?produce.rolloverProfit:produce.profit}%</p><p className="text-xs text-gray-500">Track: {track?.name??"Not selected"}</p></div></div></div><div className="space-y-4 p-6 text-sm"><Row label="Unit price" value={`₦${produce.price.toLocaleString()}`}/><Row label="Quantity" value={`${units} units`}/><div className="flex justify-between border-t pt-4 text-base font-bold"><span>Total to pay</span><span className="text-2xl">₦{total.toLocaleString()}</span></div><label className="flex items-start gap-3 text-xs text-gray-500"><input type="checkbox" className="mt-1" checked={agreed} onChange={(event)=>setAgreed(event.target.checked)}/><span>I agree to Remote Agric’s <Link className="text-primary underline" href="/terms">Farm Ownership Terms</Link>, Privacy Policy, and Risk Disclosure.</span></label>{error&&<p className="rounded-lg bg-red-50 p-3 text-xs text-red-600">{error}</p>}<button onClick={()=>void pay()} disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 font-bold text-white disabled:opacity-60">{loading?"Processing…":`Confirm & Pay ₦${total.toLocaleString()}`} {!loading&&<FiArrowRight/>}</button><p className="flex items-center justify-center gap-1 text-xs text-gray-400"><FiLock/> Payments are secure and encrypted</p></div></div>
  {warning&&<div className="fixed inset-0 z-[70] grid place-items-center bg-black/50 p-4"><div className="w-full max-w-md rounded-2xl bg-white p-6"><h3 className="text-xl font-bold">Track closed for this year</h3><p className="mt-3 text-sm leading-6 text-slate-600">{warning}</p><div className="mt-6 flex gap-3"><button onClick={()=>setWarning(null)} className="flex-1 rounded-xl border py-3 font-bold">Cancel</button><button onClick={()=>{setWarning(null);void pay(true);}} className="flex-1 rounded-xl bg-primary py-3 font-bold text-white">Start next year</button></div></div></div>}</>;
}
function Row({label,value}:{label:string;value:string}){return <div className="flex justify-between text-gray-600"><span>{label}</span><strong>{value}</strong></div>}
