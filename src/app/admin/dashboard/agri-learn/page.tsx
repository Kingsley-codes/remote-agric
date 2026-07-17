"use client";

import axios from "axios";
import Image from "next/image";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { BookOpen, CalendarDays, FileImage, Loader2, MoreHorizontal, Plus, Search, Trash2, UploadCloud, Video, X } from "lucide-react";
import { LearnPost } from "@/lib/agriLearn";
import { toast } from "react-toastify";

const API = process.env.NEXT_PUBLIC_BACKEND_URL;
const formatDate = (date: string) => new Intl.DateTimeFormat("en-NG", { day: "numeric", month: "short", year: "numeric" }).format(new Date(date));

export default function ManageLearn() {
  const [posts, setPosts] = useState<LearnPost[]>([]);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [submitStatus, setSubmitStatus] = useState<"draft" | "published">("published");
  const formRef = useRef<HTMLFormElement>(null);
  const load = useCallback(async () => { const response = await axios.get(`${API}/api/admin/agri-learn`, { withCredentials: true }); setPosts(response.data.data.posts); }, []);
  useEffect(() => { void load(); }, [load]);

  function close() { if (saving) return; setOpen(false); setFiles([]); formRef.current?.reset(); }
  async function submit(event: FormEvent<HTMLFormElement>, status: "draft" | "published") {
    event.preventDefault(); setSaving(true);
    const form = new FormData(event.currentTarget); form.set("status", status);
    try { await axios.post(`${API}/api/admin/agri-learn`, form, { withCredentials: true }); toast.success(status === "published" ? "Article published" : "Draft saved"); close(); await load(); }
    catch (error) { toast.error(axios.isAxiosError(error) ? error.response?.data?.message ?? "Unable to save article" : "Unable to save article"); }
    finally { setSaving(false); }
  }
  async function remove(id: string) { if (!window.confirm("Delete this article permanently?")) return; await axios.delete(`${API}/api/admin/agri-learn/${id}`, { withCredentials: true }); toast.success("Article deleted"); await load(); }
  const filtered = posts.filter((post) => `${post.title} ${post.category}`.toLowerCase().includes(query.toLowerCase()));

  return <section className="min-h-full bg-slate-50 p-6 lg:p-10">
    <div className="mx-auto max-w-7xl">
      <header className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div><p className="text-xs font-medium uppercase tracking-[0.16em] text-primary">Content management</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Agri-Learn</h1><p className="mt-2 text-sm leading-6 text-slate-500">Create and manage educational stories for the Remote Agric community.</p></div>
        <button onClick={() => setOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-primary-dark"><Plus size={17}/>Create article</button>
      </header>

      <div className="mt-8 rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/5">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-base font-medium text-slate-800">Published content</h2><p className="mt-1 text-xs text-slate-400">{posts.length} article{posts.length === 1 ? "" : "s"} in your library</p></div><div className="relative"><Search className="absolute left-3 top-2.5 text-slate-400" size={17}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search articles" className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-primary focus:bg-white sm:w-64"/></div></div>
        {filtered.length === 0 ? <div className="px-6 py-20 text-center"><BookOpen className="mx-auto text-slate-300" size={32}/><h3 className="mt-4 text-base font-medium text-slate-700">{posts.length ? "No matching articles" : "Create your first article"}</h3><p className="mt-2 text-sm text-slate-400">{posts.length ? "Try a different search term." : "Share practical knowledge with your users."}</p></div> : <div className="divide-y divide-slate-100">{filtered.map((post) => {
          const cover = post.media?.[0]; return <div key={post._id} className="grid items-center gap-4 p-5 transition hover:bg-slate-50/70 md:grid-cols-[72px_1fr_130px_150px_50px]">
            <div className="h-14 w-[72px] overflow-hidden rounded-lg bg-[#e9f0e7]">{cover?.type === "image" ? <Image src={cover.url} alt="" width={144} height={112} unoptimized className="h-full w-full object-cover"/> : cover?.type === "video" ? <span className="flex h-full items-center justify-center text-primary"><Video size={20}/></span> : <span className="flex h-full items-center justify-center text-primary"><BookOpen size={20}/></span>}</div>
            <div className="min-w-0"><p className="truncate text-sm font-medium text-slate-800">{post.title}</p><p className="mt-1 line-clamp-1 text-xs text-slate-400">{post.excerpt}</p></div>
            <span className="w-fit rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-primary">{post.category}</span>
            <span className="flex items-center gap-2 text-xs text-slate-400"><CalendarDays size={14}/>{formatDate(post.publishedAt ?? post.createdAt)}</span>
            <div className="relative group"><button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><MoreHorizontal size={18}/></button><div className="invisible absolute right-0 top-9 z-10 w-32 rounded-lg bg-white p-1 opacity-0 shadow-lg ring-1 ring-slate-900/10 transition group-focus-within:visible group-focus-within:opacity-100"><button onClick={() => remove(post._id)} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50"><Trash2 size={14}/>Delete</button></div></div>
          </div>; })}</div>}
      </div>
    </div>

    {open && <div className="fixed inset-0 z-[70] overflow-y-auto bg-slate-950/45 px-4 py-6 backdrop-blur-sm"><div className="flex min-h-full items-center justify-center"><div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
      <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5"><div><h2 className="text-xl font-semibold text-slate-900">Create an Agri-Learn article</h2><p className="mt-1 text-sm text-slate-500">Add a clear title, useful content and supporting media.</p></div><button type="button" onClick={close} className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" aria-label="Close"><X size={19}/></button></div>
      <form ref={formRef} onSubmit={(event) => submit(event, submitStatus)} className="max-h-[calc(100vh-150px)] overflow-y-auto">
        <div className="space-y-7 px-6 py-6">
          <fieldset><legend className="text-sm font-medium text-slate-800">Article details</legend><p className="mt-1 text-xs text-slate-400">This information appears on the journal listing page.</p><div className="mt-4 space-y-4">
            <label className="block"><span className="text-sm text-slate-600">Title</span><input name="title" required maxLength={180} placeholder="e.g. Preparing maize fields for the rainy season" className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"/></label>
            <div className="grid gap-4 sm:grid-cols-2"><label><span className="text-sm text-slate-600">Category</span><input name="category" required placeholder="Farming guide" className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"/></label><label><span className="text-sm text-slate-600">Short introduction</span><span className="mt-1.5 block rounded-lg bg-slate-50 px-3.5 py-2.5 text-xs leading-5 text-slate-400">Keep the summary concise and inviting.</span></label></div>
            <label className="block"><span className="text-sm text-slate-600">Summary</span><textarea name="excerpt" required rows={3} maxLength={320} placeholder="A short overview that helps readers understand what they will learn." className="mt-1.5 w-full resize-none rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm leading-6 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"/></label>
          </div></fieldset>
          <fieldset className="border-t border-slate-100 pt-6"><legend className="text-sm font-medium text-slate-800">Article body</legend><p className="mt-1 text-xs text-slate-400">Use short paragraphs and clear spacing to make the article easy to read.</p><textarea name="content" required rows={11} placeholder="Write the full article here…" className="mt-4 w-full resize-y rounded-lg border border-slate-200 px-4 py-3 text-sm leading-7 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"/></fieldset>
          <fieldset className="border-t border-slate-100 pt-6"><legend className="text-sm font-medium text-slate-800">Media</legend><p className="mt-1 text-xs text-slate-400">The first file becomes the cover. Upload up to six images or videos.</p><label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center transition hover:border-primary hover:bg-green-50/40"><UploadCloud className="text-primary" size={25}/><span className="mt-3 text-sm font-medium text-slate-700">Choose images or videos</span><span className="mt-1 text-xs text-slate-400">JPG, PNG, WEBP, MP4, WEBM or MOV</span><input name="media" type="file" multiple accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime" className="hidden" onChange={(event) => setFiles(Array.from(event.target.files ?? []).slice(0, 6))}/></label>{files.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{files.map((file) => <span key={`${file.name}-${file.size}`} className="inline-flex max-w-full items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-600">{file.type.startsWith("image/") ? <FileImage size={14}/> : <Video size={14}/>}<span className="max-w-48 truncate">{file.name}</span></span>)}</div>}</fieldset>
        </div>
        <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-slate-100 bg-white px-6 py-4 sm:flex-row sm:justify-end"><button type="button" onClick={close} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button><button type="button" disabled={saving} onClick={() => { setSubmitStatus("draft"); window.setTimeout(() => formRef.current?.requestSubmit(), 0); }} className="rounded-lg border border-primary px-4 py-2.5 text-sm font-medium text-primary hover:bg-green-50">Save as draft</button><button disabled={saving} onClick={() => setSubmitStatus("published")} className="inline-flex min-w-32 items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50">{saving ? <Loader2 size={17} className="animate-spin"/> : "Publish article"}</button></div>
      </form>
    </div></div></div>}
  </section>;
}
