"use client";

import { useMemo, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { IoIosClose } from "react-icons/io";
import { MdDriveFolderUpload } from "react-icons/md";
import { toast } from "react-toastify";

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
type TrackDraft = { startMonth: number; endMonth: number };
const span = (track: TrackDraft) => ((track.endMonth - track.startMonth + 12) % 12) + 1;
const emptyForm = { title: "", produceName: "", description: "", profit: "", rolloverProfit: "", price: "", minimumUnit: "", totalUnit: "", duration: "", category: "", images: [] as File[] };

export default function NewOpportunityModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState(emptyForm);
  const [tracks, setTracks] = useState<TrackDraft[]>([{ startMonth: 1, endMonth: 1 }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const duration = Number(formData.duration);
  const invalidTracks = useMemo(() => !Number.isInteger(duration) || duration < 1 || duration > 12 || tracks.some((track) => span(track) !== duration), [duration, tracks]);
  if (!isOpen) return null;

  const update = (key: keyof typeof emptyForm, value: string | File[]) => setFormData((current) => ({ ...current, [key]: value }));
  const updateTrack = (index: number, key: keyof TrackDraft, value: number) => setTracks((current) => current.map((track, i) => i === index ? { ...track, [key]: value } : track));
  const handleImage = (index: number, file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) return toast.error("Use an image smaller than 5MB");
    const images = [...formData.images]; images[index] = file; update("images", images);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    if (invalidTracks) return setError(`Every track must span exactly ${duration || 0} month${duration === 1 ? "" : "s"}.`);
    if (formData.images.filter(Boolean).length !== 3) return setError("Exactly three images are required.");
    setLoading(true);
    try {
      const body = new FormData();
      Object.entries(formData).forEach(([key, value]) => { if (key !== "images") body.append(key, String(value)); });
      body.append("tracks", JSON.stringify(tracks));
      formData.images.forEach((image, index) => body.append(`image${index + 1}`, image));
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/produce`, body, { withCredentials: true });
      toast.success(response.data.message ?? "Opportunity created");
      setFormData(emptyForm); setTracks([{ startMonth: 1, endMonth: 1 }]); onClose();
    } catch (failure) {
      const message = axios.isAxiosError(failure) ? failure.response?.data?.message ?? failure.response?.data?.error : "Unable to create opportunity";
      setError(message); toast.error(message);
    } finally { setLoading(false); }
  };

  const inputClass = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-primary/30";
  return <div className="fixed inset-0 z-50 overflow-y-auto"><div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} /><div className="flex min-h-full items-center justify-center p-4"><div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-xl">
    <div className="flex items-start justify-between border-b p-6"><div><h2 className="text-xl font-bold">New opportunity</h2><p className="mt-1 text-sm text-slate-500">Set the economics and at least one farm track.</p></div><button type="button" onClick={onClose}><IoIosClose className="size-8 rounded-md bg-red-600 text-white" /></button></div>
    <form onSubmit={submit} className="max-h-[82vh] space-y-6 overflow-y-auto p-6">
      {error && <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <section><h3 className="mb-3 font-bold">Basic information</h3><div className="grid gap-4 md:grid-cols-2"><label className="text-sm">Project name<input required className={inputClass} value={formData.title} onChange={(e)=>update("title",e.target.value)} /></label><label className="text-sm">Produce name<input required className={inputClass} value={formData.produceName} onChange={(e)=>update("produceName",e.target.value)} /></label></div><label className="mt-4 block text-sm">Description<textarea required rows={5} className={inputClass} value={formData.description} onChange={(e)=>update("description",e.target.value)} /></label></section>
      <section><h3 className="mb-3 font-bold">Investment details</h3><div className="grid gap-4 md:grid-cols-2">{([
        ["price","Price per unit (₦)",1],["minimumUnit","Minimum units",1],["totalUnit","Total units",1],["duration","Duration (months)",1],["profit","Standard profit (%)",0],["rolloverProfit","Rollover profit (%)",0]
      ] as const).map(([key,label,min])=><label key={key} className="text-sm">{label}<input required type="number" min={min} max={key === "duration" ? 12 : undefined} step={key.includes("Profit") || key === "profit" ? .1 : 1} className={inputClass} value={formData[key]} onChange={(e)=>update(key,e.target.value)} /></label>)}<label className="text-sm">Category<select required className={inputClass} value={formData.category} onChange={(e)=>update("category",e.target.value)}><option value="">Select category</option><option value="crops">Crops</option><option value="livestock">Livestock</option><option value="aquaculture">Aquaculture</option></select></label></div></section>
      <section><div className="flex items-center justify-between"><div><h3 className="font-bold">Tracks</h3><p className="text-xs text-slate-500">Each selected range must equal the opportunity duration.</p></div><button type="button" onClick={()=>setTracks((value)=>[...value,{startMonth:1,endMonth:1}])} className="rounded-lg border border-primary px-3 py-2 text-sm font-bold text-primary">Add track</button></div><div className="mt-3 space-y-3">{tracks.map((track,index)=><div key={index} className="grid items-end gap-3 rounded-xl bg-slate-50 p-4 md:grid-cols-[1fr_1fr_auto]"><label className="text-sm">Starts<select className={inputClass} value={track.startMonth} onChange={(e)=>updateTrack(index,"startMonth",Number(e.target.value))}>{months.map((month,i)=><option key={month} value={i+1}>{month}</option>)}</select></label><label className="text-sm">Ends<select className={inputClass} value={track.endMonth} onChange={(e)=>updateTrack(index,"endMonth",Number(e.target.value))}>{months.map((month,i)=><option key={month} value={i+1}>{month}</option>)}</select></label><button type="button" disabled={tracks.length===1} onClick={()=>setTracks((value)=>value.filter((_,i)=>i!==index))} className="rounded-lg px-3 py-2 text-sm font-bold text-red-600 disabled:opacity-30">Remove</button><p className={`text-xs md:col-span-3 ${duration && span(track)!==duration ? "text-red-600" : "text-slate-500"}`}>{months[track.startMonth-1]}–{months[track.endMonth-1]} · {span(track)} month{span(track)===1?"":"s"}</p></div>)}</div></section>
      <section><h3 className="mb-3 font-bold">Images</h3><div className="grid grid-cols-3 gap-4">{[0,1,2].map((index)=><label key={index} className="cursor-pointer"><div className="relative grid aspect-square place-items-center overflow-hidden rounded-xl border-2 border-dashed">{formData.images[index]?<Image fill unoptimized className="object-cover" src={URL.createObjectURL(formData.images[index])} alt={`Upload ${index+1}`} />:<MdDriveFolderUpload className="size-10 text-slate-400" />}</div><input hidden type="file" accept="image/*" onChange={(e)=>handleImage(index,e.target.files?.[0])} /></label>)}</div></section>
      <div className="flex justify-end gap-3 border-t pt-5"><button type="button" onClick={onClose} className="rounded-lg border px-5 py-2">Cancel</button><button disabled={loading || invalidTracks} className="rounded-lg bg-primary px-5 py-2 font-bold text-white disabled:opacity-50">{loading?"Creating…":"Create opportunity"}</button></div>
    </form>
  </div></div></div>;
}
