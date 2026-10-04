"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Search, ShieldCheck, UserRoundX, VolumeX } from "lucide-react";
import { forumRequest, ModerationAction } from "@/components/community/ModerationAction";

type Restriction = { _id: string; room: string; roomTitle: string; email: string; displayName: string; kind: "ban" | "mute"; reason?: string; createdAt: string };
type Member = { _id: string; email: string; username?: string; firstName: string; lastName: string };
type Room = { id: string; title: string };

export default function CommunityModerationPage() {
  const [restrictions, setRestrictions] = useState<Restriction[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [room, setRoom] = useState("general");
  const [members, setMembers] = useState<Member[]>([]);
  const [memberSearch, setMemberSearch] = useState("");
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"ban" | "mute">("ban");
  const [loading, setLoading] = useState(true);
  const [membersLoading, setMembersLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try { const data = await forumRequest("/moderation"); setRestrictions(data.restrictions); setError(""); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to load restrictions"); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => {
    // Synchronize this screen with server-owned moderation records on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
    forumRequest("/rooms").then((data) => {
      setRooms(data.rooms);
      const requested = new URLSearchParams(window.location.search).get("room");
      if (requested && data.rooms.some((item: Room) => item.id === requested)) setRoom(requested);
    }).catch(() => setError("Unable to load rooms"));
  }, [load]);
  useEffect(() => {
    const abort = new AbortController();
    const timer = setTimeout(async () => {
      setMembersLoading(true);
      try { const data = await forumRequest(`/rooms/${room}/members?search=${encodeURIComponent(memberSearch)}`, { signal: abort.signal }); if (!abort.signal.aborted) setMembers(data.users); }
      catch (cause) { if (!abort.signal.aborted) { setMembers([]); setError(cause instanceof Error ? cause.message : "Unable to load members"); } }
      finally { if (!abort.signal.aborted) setMembersLoading(false); }
    }, 250);
    return () => { clearTimeout(timer); abort.abort(); };
  }, [room, memberSearch]);
  const visible = restrictions.filter((item) => item.kind === tab && `${item.email} ${item.displayName} ${item.roomTitle}`.toLowerCase().includes(search.toLowerCase()));

  return <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-8">
    <Link href={`/admin/dashboard/community?room=${room}`} className="inline-flex items-center gap-2 text-sm font-semibold text-primary"><ArrowLeft size={16} /> Back to community</Link>
    <header className="flex items-start gap-4"><div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-green-100 text-primary"><ShieldCheck size={26} /></div><div><p className="text-xs font-bold uppercase tracking-widest text-primary">Community administration</p><h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">Members & moderation</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Keep conversations welcoming. Manage access to General and posting permissions in private farm rooms.</p></div></header>
    {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}<button onClick={load} className="ml-3 font-bold underline">Retry</button></div>}
    <div className="grid gap-4 sm:grid-cols-2">{([{ kind: "ban", label: "Removed & banned", Icon: UserRoundX, detail: "Email-based restrictions in General" }, { kind: "mute", label: "Muted members", Icon: VolumeX, detail: "Read-only access to private farm rooms" }] as const).map(({ kind, label, Icon, detail }) => <button key={kind} onClick={() => setTab(kind)} className={`flex items-center gap-4 rounded-2xl border bg-white p-5 text-left shadow-sm transition ${tab === kind ? "border-primary ring-2 ring-primary/10" : "border-slate-200 hover:border-green-300"}`}><span className={`grid size-12 place-items-center rounded-xl ${kind === "ban" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"}`}><Icon size={23} /></span><span className="flex-1"><span className="block text-sm font-bold text-slate-800">{label}</span><span className="mt-1 block text-xs text-slate-500">{detail}</span></span><strong className="text-3xl text-slate-900">{loading ? "—" : restrictions.filter((item) => item.kind === kind).length}</strong></button>)}</div>
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center"><div><h2 className="font-bold text-slate-900">{tab === "ban" ? "Removed & banned users" : "Muted users"}</h2><p className="mt-1 text-xs text-slate-500">{tab === "ban" ? "Bans stay attached to the email, even if the account is deleted." : "Unmuting restores posting if the member still has active ownership."}</p></div><label className="relative"><Search size={16} className="absolute left-3 top-3 text-slate-400" /><input aria-label="Search restrictions" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, email or room" className="h-10 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-primary sm:w-64" /></label></div>
      {loading ? <p className="p-10 text-center text-sm text-slate-500">Loading restrictions…</p> : !visible.length ? <div className="p-12 text-center"><ShieldCheck size={32} className="mx-auto text-green-600" /><h3 className="mt-3 font-semibold text-slate-800">{search ? "No matching restrictions" : `No ${tab === "ban" ? "banned" : "muted"} users`}</h3><p className="mt-1 text-sm text-slate-500">{search ? "Try another name, email or room." : "Any new restrictions will appear here."}</p></div> : <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr>{["Member", "Room", "Reason", "Restricted on", "Action"].map((label) => <th key={label} className="px-5 py-3 font-semibold">{label}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{visible.map((item) => <tr key={item._id}><td className="px-5 py-4"><p className="font-semibold text-slate-800">{item.displayName}</p><p className="mt-1 text-xs text-slate-500">{item.email}</p></td><td className="px-5 py-4"><span className="rounded-lg bg-green-50 px-2.5 py-1 text-xs font-semibold text-primary">{item.roomTitle}</span></td><td className="max-w-xs break-words px-5 py-4 text-slate-500">{item.reason || "No reason provided"}</td><td className="whitespace-nowrap px-5 py-4 text-xs text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</td><td className="px-5 py-4"><ModerationAction label={item.kind === "ban" ? "Unban" : "Unmute"} description={`Restore ${item.kind === "ban" ? "access to General" : "posting permission in this room"} for ${item.email}.`} path={`/moderation/${item._id}`} method="DELETE" onComplete={() => { void load(); }} /></td></tr>)}</tbody></table></div>}
    </section>
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="font-bold text-slate-900">Manage a room member</h2><p className="mt-1 text-sm text-slate-500">Search by name, username or email. General members can be removed and banned; farm-room members can only be muted.</p>
      <div className="my-5 grid gap-3 sm:grid-cols-2"><label className="text-xs font-semibold text-slate-600">Room<select value={room} onChange={(event) => { setRoom(event.target.value); setMembers([]); setMembersLoading(true); }} className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm">{rooms.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label><label className="text-xs font-semibold text-slate-600">Find a member<input value={memberSearch} onChange={(event) => { setMemberSearch(event.target.value); setMembersLoading(true); }} placeholder="Name, username or email" className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-primary" /></label></div>
      <div className="divide-y divide-slate-100">{membersLoading ? <p className="py-6 text-center text-sm text-slate-500">Loading members…</p> : members.length ? members.map((member) => {
        const restricted = restrictions.some((item) => item.room === room && item.email === member.email.toLowerCase());
        return <div key={member._id} className="flex flex-wrap items-center justify-between gap-3 py-3"><div className="min-w-0"><p className="text-sm font-semibold text-slate-800">{member.firstName} {member.lastName} {member.username && <span className="font-normal text-slate-400">@{member.username}</span>}</p><p className="mt-1 break-all text-xs text-slate-500">{member.email}</p></div>{restricted ? <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">Already {room === "general" ? "banned" : "muted"}</span> : <ModerationAction label={room === "general" ? "Remove & ban" : "Mute member"} description={room === "general" ? `Ban ${member.email} from General until an admin unbans them, including after account re-registration.` : `Prevent ${member.email} from posting messages and replies in this room. They will still be able to read it.`} path={`/rooms/${room}/restrictions`} method="POST" payload={{ userId: member._id, kind: room === "general" ? "ban" : "mute" }} destructive={room === "general"} onComplete={() => { setTab(room === "general" ? "ban" : "mute"); void load(); }} />}</div>;
      }) : <p className="py-6 text-center text-sm text-slate-500">No matching members in this room.</p>}</div>
      <p className="mt-4 text-xs text-slate-400">Showing up to 50 matches. Refine your search to find a specific member.</p>
    </section>
  </div>;
}
