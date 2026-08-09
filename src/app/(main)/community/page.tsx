"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, ChevronRight, Hash, LockKeyhole, MessageCircle, Search, Send, Sprout, Users, X } from "lucide-react";
import { io } from "socket.io-client";

type Author = { username?: string; firstName?: string; lastName?: string };
type Message = { _id: string; body: string; createdAt: string; author: Author; parent?: string | null; replies?: Message[]; pending?: boolean; failed?: boolean };
type Room = { id: string; title: string; subtitle?: string; type: "general" | "produce"; stage?: string; image?: string };
const base = process.env.NEXT_PUBLIC_BACKEND_URL;

const initials = (author: Author) => (author.username?.slice(0, 2) || `${author.firstName?.[0] ?? "U"}${author.lastName?.[0] ?? ""}`).toUpperCase();
const displayName = (author: Author) => author.username ? `@${author.username}` : `${author.firstName ?? "Community"} ${author.lastName ?? "member"}`;
const stageLabel = (stage?: string) => stage?.split("-").map((word) => word[0]?.toUpperCase() + word.slice(1)).join(" ");

export default function CommunityPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [room, setRoom] = useState("general");
  const [messages, setMessages] = useState<Message[]>([]);
  const [canPost, setCanPost] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState<string>();
  const [body, setBody] = useState("");
  const [threadId, setThreadId] = useState<string>();
  const [threadBody, setThreadBody] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [mobileRoomsOpen, setMobileRoomsOpen] = useState(true);

  useEffect(() => {
    fetch(`${base}/api/forum/rooms`, { credentials: "include" }).then((response) => response.json()).then((data) => {
      const nextRooms: Room[] = data.rooms ?? [];
      setRooms(nextRooms);
      const requested = new URLSearchParams(window.location.search).get("room");
      if (requested && nextRooms.some((item) => item.id === requested)) {
        setRoom(requested);
        setMobileRoomsOpen(false);
      } else if (requested) {
        setRoom("general");
        window.history.replaceState(null, "", "/community?room=general");
      }
    });
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${base}/api/forum/rooms/${room}/messages`, { credentials: "include" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message ?? "Unable to open this room");
      setMessages(data.messages ?? []);
      setAuthenticated(Boolean(data.authenticated));
      setCanPost(Boolean(data.canPost));
      setUsername(data.username);
    } catch (cause) {
      setMessages([]);
      setError(cause instanceof Error ? cause.message : "Unable to open this room");
      if (room !== "general") {
        setRoom("general");
        window.history.replaceState(null, "", "/community?room=general");
      }
    } finally { setLoading(false); }
  }, [room]);
  // The selected room is an external data source; reload whenever it changes.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  const receiveMessage = useCallback((incoming: Message) => {
    setMessages((current) => {
      if (incoming.parent) return current.map((message) => message._id === String(incoming.parent)
        ? { ...message, replies: (message.replies ?? []).some((reply) => reply._id === incoming._id) ? message.replies : [...(message.replies ?? []), incoming] }
        : message);
      return current.some((message) => message._id === incoming._id) ? current : [...current, incoming];
    });
  }, []);

  useEffect(() => {
    const socket = io(base!, { withCredentials: true });
    socket.emit("forum:join", room);
    socket.on("forum:message", receiveMessage);
    return () => { socket.emit("forum:leave", room); socket.disconnect(); };
  }, [room, receiveMessage]);

  const selectedRoom = rooms.find((item) => item.id === room);
  const filteredRooms = useMemo(() => rooms.filter((item) => `${item.title} ${item.subtitle ?? ""}`.toLowerCase().includes(search.toLowerCase())), [rooms, search]);
  const activeThread = messages.find((message) => message._id === threadId);
  const chooseRoom = (id: string) => { setRoom(id); setThreadId(undefined); setError(""); setMobileRoomsOpen(false); window.history.replaceState(null, "", `/community?room=${id}`); };

  const submit = async (event: FormEvent) => {
    event.preventDefault(); if (!body.trim() || posting) return; setError(""); setPosting(true);
    const text = body.trim();
    const temporaryId = `pending-${Date.now()}`;
    setMessages((current) => [...current, { _id: temporaryId, body: text, createdAt: new Date().toISOString(), author: { username }, replies: [], pending: true }]);
    setBody("");
    try {
      const response = await fetch(`${base}/api/forum/rooms/${room}/messages`, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ body: text }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.message);
      setMessages((current) => current.filter((message) => message._id !== temporaryId)); receiveMessage(data.message);
    } catch (cause) { setMessages((current) => current.map((message) => message._id === temporaryId ? { ...message, pending: false, failed: true } : message)); setError(cause instanceof Error ? cause.message : "Unable to post your message"); }
    finally { setPosting(false); }
  };

  const submitReply = async (event: FormEvent) => {
    event.preventDefault(); if (!threadBody.trim() || !threadId || posting) return; setError(""); setPosting(true);
    const text = threadBody.trim();
    const temporaryId = `pending-${Date.now()}`;
    const optimistic: Message = { _id: temporaryId, body: text, createdAt: new Date().toISOString(), author: { username }, parent: threadId, pending: true };
    receiveMessage(optimistic); setThreadBody("");
    try {
      const response = await fetch(`${base}/api/forum/rooms/${room}/messages`, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ body: text, parentId: threadId }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.message);
      setMessages((current) => current.map((message) => message._id === threadId ? { ...message, replies: (message.replies ?? []).filter((reply) => reply._id !== temporaryId) } : message)); receiveMessage(data.message);
    } catch (cause) { setMessages((current) => current.map((message) => message._id === threadId ? { ...message, replies: (message.replies ?? []).map((reply) => reply._id === temporaryId ? { ...reply, pending: false, failed: true } : reply) } : message)); setError(cause instanceof Error ? cause.message : "Unable to post your reply"); }
    finally { setPosting(false); }
  };

  const saveUsername = async (event: FormEvent) => {
    event.preventDefault(); setError(""); setPosting(true);
    try {
      const response = await fetch(`${base}/api/forum/username`, { method: "PATCH", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: nameInput }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.message); setUsername(data.username); await load();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to save username"); }
    finally { setPosting(false); }
  };

  return (
    <main className="min-h-[calc(100dvh-5rem)] bg-[#f3f6f1] px-3 py-4 sm:px-6 sm:py-7">
      <div className="mx-auto max-w-[1440px] overflow-hidden rounded-[26px] border border-[#dfe8dc] bg-white shadow-[0_18px_60px_rgba(25,55,20,0.09)]">
        <div className="grid min-h-[78dvh] lg:grid-cols-[310px_minmax(0,1fr)]">
          <aside className={`${mobileRoomsOpen ? "flex" : "hidden"} flex-col border-r border-[#e6ece3] bg-[#f8faf7] lg:flex`}>
            <div className="border-b border-[#e6ece3] px-5 py-6">
              <div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Remote Agric</p><h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Community</h1></div><div className="grid size-11 place-items-center rounded-2xl bg-primary text-white shadow-md shadow-green-900/15"><Users size={21} /></div></div>
              <p className="mt-3 text-sm leading-6 text-slate-500">Connect with remote farmers and follow every farm cycle.</p>
              <div className="relative mt-5"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search communities" className="h-11 w-full rounded-xl border border-[#dfe7dc] bg-white pl-10 pr-3 text-sm text-slate-800 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10" /></div>
            </div>
            <div className="flex-1 overflow-y-auto p-3"><p className="px-3 pb-2 pt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Channels</p><div className="space-y-1.5">{filteredRooms.map((item) => {
              const active = room === item.id; return <button key={item.id} onClick={() => chooseRoom(item.id)} className={`group flex w-full items-center gap-3 rounded-xl p-3 text-left transition ${active ? "bg-primary text-white shadow-md shadow-green-900/15" : "text-slate-700 hover:bg-white hover:shadow-sm"}`}>
                <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${active ? "bg-white/15" : item.type === "general" ? "bg-emerald-100 text-primary" : "bg-amber-100 text-amber-700"}`}>{item.type === "general" ? <Hash size={19} /> : <Sprout size={19} />}</span>
                <span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold">{item.title}</span><span className={`block truncate text-xs ${active ? "text-white/70" : "text-slate-400"}`}>{item.type === "general" ? "Open discussion" : stageLabel(item.stage) || item.subtitle}</span></span><ChevronRight size={16} className={active ? "text-white/70" : "text-slate-300 opacity-0 group-hover:opacity-100"} />
              </button>;
            })}</div></div>
            <div className="m-4 rounded-2xl bg-[#eaf4e7] p-4"><div className="flex items-center gap-2 font-bold text-primary"><MessageCircle size={17} /> Community guidelines</div><p className="mt-2 text-xs leading-5 text-slate-600">Keep conversations useful, respectful, and focused on shared growth.</p></div>
          </aside>

          <section className={`${mobileRoomsOpen ? "hidden" : "flex"} min-w-0 flex-col lg:flex`}>
            <header className="flex min-h-24 items-center gap-4 border-b border-[#e6ece3] px-4 py-4 sm:px-7">
              <button onClick={() => setMobileRoomsOpen(true)} className="grid size-10 shrink-0 place-items-center rounded-xl border text-slate-600 lg:hidden"><ArrowLeft size={19} /></button>
              <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#eaf4e7] text-primary">{selectedRoom?.type === "produce" ? <Sprout size={23} /> : <Hash size={23} />}</div>
              <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="truncate text-lg font-bold text-slate-900 sm:text-xl">{selectedRoom?.title ?? "General"}</h2>{selectedRoom?.stage && <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-700">{stageLabel(selectedRoom.stage)}</span>}</div><p className="mt-0.5 truncate text-sm text-slate-500">{selectedRoom?.type === "produce" ? selectedRoom.subtitle : "Share insights, questions and opportunities with everyone"}</p></div>
              <div className="hidden items-center gap-2 rounded-full border border-[#e1e9de] px-3 py-2 text-xs font-semibold text-slate-500 sm:flex"><span className="size-2 rounded-full bg-emerald-500" /> Public room</div>
            </header>

            <div className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top_right,rgba(69,125,52,0.055),transparent_34%)] px-4 py-6 sm:px-8">
              {loading ? <div className="grid h-full min-h-80 place-items-center"><div className="text-center"><div className="mx-auto size-9 animate-spin rounded-full border-2 border-primary/20 border-t-primary" /><p className="mt-3 text-sm text-slate-500">Loading conversation…</p></div></div> : messages.length === 0 ? <div className="grid h-full min-h-80 place-items-center"><div className="max-w-sm text-center"><div className="mx-auto grid size-16 place-items-center rounded-2xl bg-[#eaf4e7] text-primary"><MessageCircle size={28} /></div><h3 className="mt-5 text-xl font-bold text-slate-900">Start the conversation</h3><p className="mt-2 text-sm leading-6 text-slate-500">Be the first to share an update, ask a thoughtful question, or introduce yourself.</p></div></div> : <div className="mx-auto max-w-4xl space-y-5">{messages.map((message) => <article key={message._id} className="group flex gap-3 sm:gap-4">
                <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-xs font-bold text-white shadow-sm sm:size-11">{initials(message.author)}</div>
                <div className={`min-w-0 flex-1 ${message.pending ? "opacity-65" : ""}`}><div className="flex flex-wrap items-baseline gap-x-2"><strong className="text-sm text-slate-900">{displayName(message.author)}</strong><time className="text-[11px] text-slate-400">{message.pending ? "Sending…" : message.failed ? "Not sent" : new Date(message.createdAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</time></div><div className={`mt-1.5 rounded-2xl rounded-tl-md border bg-white px-4 py-3.5 shadow-[0_2px_10px_rgba(20,45,16,0.035)] ${message.failed ? "border-red-200" : "border-[#e2e9df]"}`}><p className="whitespace-pre-wrap break-words text-[15px] leading-6 text-slate-700">{message.body}</p>{!message.pending && !message.failed && <button onClick={() => setThreadId(message._id)} className="mt-3 inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-bold text-primary transition hover:bg-[#edf5ea]"><MessageCircle size={14} /> {message.replies?.length ? `View thread · ${message.replies.length} ${message.replies.length === 1 ? "reply" : "replies"}` : canPost && username ? "Reply in thread" : "View thread"}</button>}</div>
                </div></article>)}</div>}
            </div>

            {activeThread && <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/35 backdrop-blur-[2px]" onMouseDown={(event) => { if (event.target === event.currentTarget) setThreadId(undefined); }}><aside className="flex h-full w-full flex-col bg-white shadow-2xl sm:max-w-xl">
              <header className="flex items-center gap-3 border-b border-[#e2e9df] px-5 py-4"><button onClick={() => setThreadId(undefined)} className="grid size-10 place-items-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50" aria-label="Close thread"><ArrowLeft size={19} /></button><div className="flex-1"><h3 className="font-bold text-slate-900">Thread</h3><p className="text-xs text-slate-500">{activeThread.replies?.length ?? 0} {(activeThread.replies?.length ?? 0) === 1 ? "reply" : "replies"} in {selectedRoom?.title}</p></div><button onClick={() => setThreadId(undefined)} className="hidden size-9 place-items-center rounded-full text-slate-500 hover:bg-slate-100 sm:grid"><X size={18} /></button></header>
              <div className="flex-1 overflow-y-auto bg-[#f7f9f6] p-5"><div className="rounded-2xl border border-[#dce6d9] bg-white p-4 shadow-sm"><div className="flex items-center gap-3"><div className="grid size-10 place-items-center rounded-xl bg-primary text-xs font-bold text-white">{initials(activeThread.author)}</div><div><strong className="text-sm text-slate-900">{displayName(activeThread.author)}</strong><p className="text-[11px] text-slate-400">{new Date(activeThread.createdAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</p></div></div><p className="mt-4 whitespace-pre-wrap break-words text-[15px] leading-6 text-slate-700">{activeThread.body}</p></div>
                <div className="my-5 flex items-center gap-3"><span className="h-px flex-1 bg-slate-200" /><span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Replies</span><span className="h-px flex-1 bg-slate-200" /></div>
                <div className="space-y-4">{activeThread.replies?.length ? activeThread.replies.map((reply) => <article key={reply._id} className={`flex gap-3 ${reply.pending ? "opacity-65" : ""}`}><div className="grid size-9 shrink-0 place-items-center rounded-lg bg-slate-200 text-[10px] font-bold text-slate-600">{initials(reply.author)}</div><div className={`min-w-0 flex-1 rounded-2xl rounded-tl-md border bg-white px-4 py-3 ${reply.failed ? "border-red-200" : "border-slate-200"}`}><div className="flex flex-wrap items-baseline gap-2"><strong className="text-xs text-slate-800">{displayName(reply.author)}</strong><time className="text-[10px] text-slate-400">{reply.pending ? "Sending…" : reply.failed ? "Not sent" : new Date(reply.createdAt).toLocaleString()}</time></div><p className="mt-1.5 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">{reply.body}</p></div></article>) : <div className="py-10 text-center"><MessageCircle className="mx-auto text-slate-300" size={28} /><p className="mt-3 text-sm font-semibold text-slate-600">No replies yet</p><p className="mt-1 text-xs text-slate-400">Start a focused discussion about this message.</p></div>}</div></div>
              <footer className="border-t border-[#e2e9df] bg-white p-4">{canPost && username ? <form onSubmit={submitReply}><div className="flex items-end gap-2 rounded-2xl border border-[#dce5d9] bg-[#fafcf9] p-2 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10"><textarea value={threadBody} onChange={(event) => setThreadBody(event.target.value)} rows={2} maxLength={2000} placeholder="Write a reply…" className="max-h-32 min-h-12 flex-1 resize-none bg-transparent px-3 py-2 text-sm outline-none" /><button disabled={posting || !threadBody.trim()} className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary text-white disabled:opacity-40" aria-label="Send reply"><Send size={18} /></button></div></form> : <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3"><LockKeyhole size={17} className="text-slate-400" /><p className="text-xs text-slate-500">You can read this thread, but posting requires access to this room.</p></div>}</footer>
            </aside></div>}

            <footer className="border-t border-[#e1e9de] bg-white p-4 sm:px-7 sm:py-5">{error && <div className="mb-3 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</div>}
              {authenticated && !username ? <form onSubmit={saveUsername} className="mx-auto max-w-3xl rounded-2xl border border-primary/20 bg-[#f4f9f2] p-4"><div className="flex items-start gap-3"><div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-white"><Users size={18} /></div><div><h3 className="font-bold text-slate-900">Choose your community username</h3><p className="mt-0.5 text-xs leading-5 text-slate-500">This is how other remote farmers will recognize and mention you.</p></div></div><div className="mt-4 flex flex-col gap-2 sm:flex-row"><div className="flex h-11 flex-1 items-center rounded-xl border bg-white px-3 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10"><span className="text-slate-400">@</span><input value={nameInput} onChange={(event) => setNameInput(event.target.value.toLowerCase())} className="min-w-0 flex-1 border-0 px-1 outline-none" placeholder="your_username" /></div><button disabled={posting} className="h-11 rounded-xl bg-primary px-5 text-sm font-bold text-white disabled:opacity-60">Create username</button></div></form>
              : canPost ? <form onSubmit={submit} className="mx-auto max-w-4xl"><div className="flex items-end gap-2 rounded-2xl border border-[#dce5d9] bg-[#fafcf9] p-2 transition focus-within:border-primary focus-within:bg-white focus-within:ring-4 focus-within:ring-primary/10"><textarea value={body} onChange={(event) => setBody(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} rows={1} maxLength={2000} placeholder={`Message ${selectedRoom?.title ?? "the community"}…`} className="max-h-36 min-h-11 flex-1 resize-none bg-transparent px-3 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400" /><button disabled={posting || !body.trim()} className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary text-white shadow-sm transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40" aria-label="Send message"><Send size={18} /></button></div><div className="mt-2 flex justify-between px-1 text-[11px] text-slate-400"><span>Use @username to mention someone · Shift + Enter for a new line</span><span>{body.length}/2000</span></div></form>
              : <div className="mx-auto flex max-w-4xl items-center gap-3 rounded-2xl border border-[#e2e8df] bg-[#f8faf7] p-4"><div className="grid size-10 shrink-0 place-items-center rounded-xl bg-slate-200 text-slate-500"><LockKeyhole size={18} /></div><div className="flex-1"><p className="text-sm font-bold text-slate-800">{authenticated ? "Remote-farmer conversation" : "Join the conversation"}</p><p className="mt-0.5 text-xs text-slate-500">{authenticated ? "An active farm for this produce is required to access its private room." : "The General community is public to read. Sign in to share a message or reply."}</p></div>{!authenticated && <Link href="/login" className="shrink-0 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white">Sign in</Link>}</div>}
            </footer>
          </section>
        </div>
      </div>
    </main>
  );
}
