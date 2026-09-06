"use client";
import { type FormEvent, useEffect, useState } from "react";
import { Bell, CheckCircle2, Eye, Send, Users } from "lucide-react";
import { toast } from "react-toastify";

type Project = { _id: string; title: string; produceName: string; category: string; status: string };
const base = process.env.NEXT_PUBLIC_BACKEND_URL;
const inputClass = "mt-2 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm font-normal text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:bg-slate-50";

export default function AdminNotificationsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectId, setProjectId] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState("");
  const [revision, setRevision] = useState(0);
  const [success, setSuccess] = useState("");
  const project = projects.find(item => item._id === projectId);
  useEffect(() => {
    const controller = new AbortController();
    fetch(`${base}/api/admin/produce`, { credentials: "include", signal: controller.signal })
      .then(async response => { const payload = await response.json(); if (!response.ok) throw new Error(payload.message ?? "Unable to load projects"); return payload; })
      .then(payload => setProjects((payload.produce ?? []).filter((item: Project) => ["active", "closed", "sold out"].includes(item.status))))
      .catch(reason => { if (!controller.signal.aborted) setLoadError(reason.message); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [revision]);
  const retryProjects = () => {
    setLoading(true);
    setLoadError("");
    setRevision(value => value + 1);
  };
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving || !projectId || !title.trim() || !message.trim()) return;
    setSaving(true); setError(""); setSuccess("");
    try {
      const response = await fetch(`${base}/api/admin/notifications`, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ produceId: projectId, title: title.trim(), message: message.trim() }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message ?? "Unable to send notification");
      const recipients = payload.notification?.recipients?.length;
      const result = typeof recipients === "number" ? `Notification sent to ${recipients} farm owner${recipients === 1 ? "" : "s"}.` : "Notification sent successfully.";
      setSuccess(result); toast.success(result); setTitle(""); setMessage("");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to send notification"); }
    finally { setSaving(false); }
  }
  return <main className="mx-auto max-w-6xl space-y-7 px-4 py-6 sm:px-8 sm:py-8">
    <header className="flex items-start gap-4"><div className="rounded-2xl border border-green-100 bg-green-50 p-3 text-primary"><Bell size={25} /></div><div><p className="text-xs font-bold uppercase tracking-[0.15em] text-primary">Communications</p><h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Notifications</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Keep farm owners informed with clear, timely project updates.</p></div></header>
    {success && <div role="status" className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"><CheckCircle2 size={18} />{success}</div>}
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-100 px-6 py-5"><h2 className="text-lg font-bold text-slate-900">Compose an update</h2><p className="mt-1 text-sm text-slate-500">Choose a project and write your message.</p></div>
        <form onSubmit={submit} className="space-y-5 p-6">
          {loadError && <div role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{loadError} <button type="button" onClick={retryProjects} className="font-semibold underline">Retry</button></div>}
          <label className="block text-sm font-semibold text-slate-700">Project<select required disabled={loading || saving || !!loadError} value={projectId} onChange={e => setProjectId(e.target.value)} className={inputClass}><option value="">{loading ? "Loading projects…" : "Select a project"}</option>{projects.map(item => <option key={item._id} value={item._id}>{item.title} — {item.produceName}</option>)}</select></label>
          {!loading && !loadError && !projects.length && <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-500">No eligible projects are available yet.</p>}
          <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4 text-slate-500"><Users size={18} className="mt-0.5 shrink-0 text-primary" /><p className="text-xs leading-5">Sent to owners with confirmed, ongoing investments in the selected project. Closed investment periods remain eligible for updates.</p></div>
          <label className="block text-sm font-semibold text-slate-700">Title<input required disabled={saving} maxLength={120} value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Your farm’s monthly progress update" className={inputClass} /><span className="mt-1.5 block text-right text-xs font-normal text-slate-400">{title.length}/120</span></label>
          <label className="block text-sm font-semibold text-slate-700">Message<textarea required disabled={saving} maxLength={1000} value={message} onChange={e => setMessage(e.target.value)} placeholder="Share what has changed, the current progress and what owners can expect next." className={`${inputClass} min-h-44 resize-y leading-6`} /><span className="mt-1.5 block text-right text-xs font-normal text-slate-400">{message.length}/1,000</span></label>
          {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}
          <div className="border-t border-slate-100 pt-5"><button disabled={saving || loading || !!loadError || !projectId || !title.trim() || !message.trim()} className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40"><Send size={17} />{saving ? "Sending notification…" : "Send notification"}</button><p className="mt-3 text-center text-xs text-slate-400">This update will appear in the owners’ in-app notifications.</p></div>
        </form>
      </section>
      <aside className="space-y-5 xl:sticky xl:top-6"><section className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6"><div className="flex items-center gap-2 text-sm font-semibold text-slate-600"><Eye size={17} />Live preview</div><p className="mt-1 text-xs text-slate-400">How your update will read to a farm owner</p><article className="mt-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-4 flex items-center gap-3"><div className="rounded-full bg-green-50 p-2.5 text-primary"><Bell size={18} /></div><div><p className="text-xs font-bold text-slate-800">Project update</p><p className="mt-0.5 text-[11px] text-slate-400">Just now</p></div></div><p className="mb-2 break-words text-xs font-semibold text-primary">{project?.title ?? "Your selected project"}</p><h3 className="break-words text-base font-bold leading-6 text-slate-900">{title.trim() || "Your notification title"}</h3><p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-500">{message.trim() || "Your message will appear here as you write. Keep it clear, helpful and specific to this project."}</p></article></section><div className="rounded-xl border border-green-100 bg-green-50/60 p-5"><h3 className="text-sm font-bold text-green-900">A useful update answers</h3><ul className="mt-3 space-y-2 text-sm leading-5 text-green-800"><li>What progress has been made?</li><li>What happens next?</li><li>Do farm owners need to take any action?</li></ul></div></aside>
    </div>
  </main>;
}
