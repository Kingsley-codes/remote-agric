"use client";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, CheckCircle2, ImagePlus, Loader2, RotateCcw, Send, X } from "lucide-react";
import { backendUrl, Ticket, TicketMessage } from "@/lib/tickets";
import StatusBadge from "./StatusBadge";
import { io } from "socket.io-client";
import { toast } from "react-toastify";

export default function TicketChat({ ticketId, admin = false }: { ticketId: string; admin?: boolean }) {
  const [ticket, setTicket] = useState<Ticket | null>(null), [message, setMessage] = useState("");
  const [images, setImages] = useState<File[]>([]), [loading, setLoading] = useState(true), [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const base = admin ? "/api/admin/tickets" : "/api/tickets";
  const listUrl = admin ? "/admin/dashboard/support" : "/dashboard/support";
  const load = useCallback(async () => {
    try { const { data } = await axios.get(`${backendUrl}${base}/${ticketId}`, { withCredentials: true }); setTicket(data.data.ticket); }
    finally { setLoading(false); }
  }, [base, ticketId]);
  useEffect(() => {
    void load();
  }, [load]);
  useEffect(() => {
    const socket = io(backendUrl, { withCredentials: true, transports: ["websocket", "polling"] });
    const joinTicket = (): void => {
      socket.emit("ticket:join", ticketId);
    };
    const refresh = (): void => {
      void load();
    };
    socket.on("connect", joinTicket);
    socket.on("ticket:message", refresh);
    socket.on("ticket:status", refresh);
    return (): void => {
      socket.off("connect", joinTicket);
      socket.off("ticket:message", refresh);
      socket.off("ticket:status", refresh);
      socket.emit("ticket:leave", ticketId);
      socket.disconnect();
    };
  }, [load, ticketId]);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ticket?.messages?.length]);
  async function send(e: FormEvent) {
    e.preventDefault(); if ((!message.trim() && !images.length) || sending) return;
    const pendingBody = message;
    const pendingImages = [...images];
    const temporaryId = `local-${crypto.randomUUID()}`;
    const previewUrls = pendingImages.map((file) => URL.createObjectURL(file));
    const optimisticMessage: TicketMessage = {
      _id: temporaryId,
      senderType: admin ? "admin" : "user",
      body: pendingBody,
      createdAt: new Date().toISOString(),
      attachments: previewUrls.map((url, index) => ({ url, publicId: `local-${index}` })),
    };

    setTicket((current) => current ? { ...current, messages: [...(current.messages ?? []), optimisticMessage] } : current);
    setMessage("");
    setImages([]);
    setSending(true);

    const form = new FormData();
    form.append("message", pendingBody);
    pendingImages.forEach((file) => form.append("images", file));
    try {
      await axios.post(`${backendUrl}${base}/${ticketId}/messages`, form, { withCredentials: true });
      await load();
    } catch (error) {
      setTicket((current) => current ? { ...current, messages: current.messages?.filter((item) => item._id !== temporaryId) } : current);
      setMessage(pendingBody);
      setImages(pendingImages);
      toast.error(axios.isAxiosError(error) ? error.response?.data?.message ?? "Unable to send message" : "Unable to send message");
    } finally {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
      setSending(false);
    }
  }
  async function setStatus(status: "open" | "resolved") { await axios.patch(`${backendUrl}/api/admin/tickets/${ticketId}/status`, { status }, { withCredentials: true }); await load(); }
  if (loading) return <div className="flex flex-1 items-center justify-center p-20"><Loader2 className="animate-spin text-primary" /></div>;
  if (!ticket) return <div className="p-10">Ticket not found.</div>;
  const writable = ticket.status === "open";
  return <section className="flex min-h-0 flex-1 flex-col bg-[#f6f8f6] p-4 md:p-7">
    <div className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col overflow-hidden rounded-2xl bg-white shadow-sm">
      <header className="flex flex-wrap items-center gap-4 bg-white/90 px-5 py-4 backdrop-blur-md md:px-7">
        <Link href={listUrl} className="rounded-xl p-2 text-gray-500 transition hover:bg-green-50 hover:text-primary"><ArrowLeft size={20} /></Link>
        <div className="min-w-0 flex-1"><div className="flex items-center gap-2"><h1 className="truncate text-base font-bold md:text-lg">{ticket.subject}</h1><StatusBadge status={ticket.status} /></div><p className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-gray-500">#{ticket.ticketNumber} · {ticket.category.replace("-", " ")}</p></div>
        {admin && ticket.status !== "closed" && <button onClick={() => setStatus(ticket.status === "open" ? "resolved" : "open")} className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white transition hover:bg-primary-dark">{ticket.status === "open" ? <CheckCircle2 size={16}/> : <RotateCcw size={16}/>} {ticket.status === "open" ? "Mark resolved" : "Reopen"}</button>}
      </header>
      <div className="flex-1 overflow-y-auto bg-[#f7faf7] px-4 py-6 md:px-8">
        <div className="mx-auto max-w-3xl space-y-5">{ticket.messages?.map((item) => { const mine = admin ? item.senderType === "admin" : item.senderType === "user"; return <div key={item._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}><div className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${mine ? "rounded-tr-sm bg-primary text-white" : "rounded-tl-sm bg-white text-gray-800"}`}>
          <p className={`mb-1 text-[9px] font-extrabold uppercase tracking-widest ${mine ? "text-green-100" : "text-primary"}`}>{item.senderType === "admin" ? "Support team" : ticket.user ? `${ticket.user.firstName} ${ticket.user.lastName}` : "You"}</p>
          {item.body && <p className="whitespace-pre-wrap text-sm leading-6">{item.body}</p>}
          {!!item.attachments?.length && <div className="mt-2 grid grid-cols-2 gap-2">{item.attachments.filter((a) => a?.url).map((a) => <a key={a.publicId || a.url} href={a.url} target="_blank" rel="noreferrer"><Image src={a.url} alt="Ticket attachment" width={420} height={280} className="max-h-56 w-full rounded-xl object-cover" unoptimized /></a>)}</div>}
          <p className={`mt-2 text-right text-[9px] font-bold uppercase tracking-wider ${mine ? "text-green-100" : "text-gray-400"}`}>{item._id.startsWith("local-") ? "Sending…" : item.createdAt && !Number.isNaN(new Date(item.createdAt).getTime()) ? new Date(item.createdAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) : "Just now"}</p>
        </div></div> })}<div ref={endRef}/></div>
      </div>
      {writable ? <form onSubmit={send} className="bg-white p-4 md:p-5"><div className="mx-auto max-w-3xl rounded-2xl bg-gray-50 p-2 shadow-lg shadow-green-900/5 ring-1 ring-green-700/10">
        {!!images.length && <div className="flex gap-2 overflow-x-auto px-2 py-2">{images.map((file, i) => <span key={`${file.name}-${i}`} className="flex items-center gap-1 rounded-lg bg-green-100 px-2 py-1 text-xs text-primary">{file.name}<button type="button" onClick={() => setImages(images.filter((_, n) => n !== i))}><X size={13}/></button></span>)}</div>}
        <div className="flex items-end gap-2"><label className="cursor-pointer rounded-xl p-3 text-gray-500 hover:bg-green-50 hover:text-primary"><ImagePlus size={20}/><input className="hidden" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(e) => setImages(Array.from(e.target.files ?? []).slice(0, 4))}/></label><textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={1} placeholder="Write a message…" className="max-h-32 min-h-11 flex-1 resize-none bg-transparent px-2 py-3 text-sm outline-none"/><button disabled={sending} className="rounded-xl bg-primary p-3 text-white transition hover:bg-primary-dark disabled:opacity-50">{sending ? <Loader2 size={20} className="animate-spin"/> : <Send size={20}/>}</button></div>
      </div></form> : <div className="bg-white p-5 text-center text-sm text-gray-500">This ticket is {ticket.status}. {ticket.status === "resolved" && admin ? "Reopen it to continue the conversation." : "No more messages can be sent."}</div>}
    </div>
  </section>;
}
