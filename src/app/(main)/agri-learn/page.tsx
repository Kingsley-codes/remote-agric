"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, CalendarDays, Loader2, Play } from "lucide-react";
import { LearnPost } from "@/lib/agriLearn";

const formatDate = (date?: string) => date ? new Intl.DateTimeFormat("en-NG", { day: "numeric", month: "short", year: "numeric" }).format(new Date(date)) : "Recently published";

function PostMedia({ post, featured = false }: { post: LearnPost; featured?: boolean }) {
  const media = post.media?.[0];
  const height = featured ? "h-72 lg:h-full lg:min-h-[390px]" : "h-48";
  if (media?.type === "image") return <Image src={media.url} alt={post.title} width={1000} height={650} unoptimized className={`${height} w-full object-cover`} />;
  if (media?.type === "video") return <div className={`relative ${height} overflow-hidden bg-slate-800`}><video src={media.url} muted playsInline className="h-full w-full object-cover opacity-80"/><span className="absolute inset-0 flex items-center justify-center"><span className="rounded-full bg-white/90 p-3 text-primary shadow-lg"><Play size={20} fill="currentColor"/></span></span></div>;
  return <div className={`${height} flex items-center justify-center bg-[#e7efe4] text-primary`}><BookOpen size={36}/></div>;
}

export default function AgriLearnPage() {
  const [posts, setPosts] = useState<LearnPost[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/agri-learn`).then((response) => setPosts(response.data.data.posts)).finally(() => setLoading(false)); }, []);
  const [featured, ...rest] = posts;

  return <main className="min-h-screen bg-[#f6f8f6]">
    <section className="border-b border-green-900/10 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-12 md:py-16">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-primary">Remote Agric journal</span>
        <div className="mt-3 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div><h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">Agri-Learn</h1><p className="mt-3 max-w-2xl text-base leading-7 text-slate-500">Useful ideas, field knowledge and investment perspectives for a growing agricultural community.</p></div>
          <p className="text-sm text-slate-400">Stories from farms, markets and people</p>
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-5 py-10 md:py-14">
      {loading ? <div className="flex min-h-72 items-center justify-center"><Loader2 className="animate-spin text-primary"/></div> : !featured ? <div className="rounded-2xl bg-white px-6 py-20 text-center shadow-sm"><BookOpen className="mx-auto text-slate-300" size={34}/><h2 className="mt-4 text-lg font-medium text-slate-700">The journal is being prepared</h2><p className="mt-2 text-sm text-slate-500">Please check back for new farming and investment stories.</p></div> : <>
        <Link href={`/agri-learn/${featured.slug}`} className="group grid overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/5 transition hover:-translate-y-0.5 hover:shadow-md lg:grid-cols-[1.15fr_.85fr]">
          <PostMedia post={featured} featured/>
          <div className="flex flex-col justify-center p-7 md:p-10">
            <span className="w-fit rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-primary">Featured · {featured.category}</span>
            <h2 className="mt-5 text-2xl font-semibold leading-snug text-slate-900 md:text-3xl">{featured.title}</h2>
            <p className="mt-4 line-clamp-4 text-sm leading-7 text-slate-500">{featured.excerpt}</p>
            <div className="mt-7 flex items-center justify-between border-t border-slate-100 pt-5"><span className="flex items-center gap-2 text-xs text-slate-400"><CalendarDays size={14}/>{formatDate(featured.publishedAt ?? featured.createdAt)}</span><span className="flex items-center gap-2 text-sm font-medium text-primary">Read story <ArrowRight size={16} className="transition group-hover:translate-x-1"/></span></div>
          </div>
        </Link>

        {rest.length > 0 && <div className="mt-12"><div className="mb-6 flex items-center justify-between"><h2 className="text-xl font-medium text-slate-800">Latest stories</h2><span className="text-sm text-slate-400">{rest.length} article{rest.length === 1 ? "" : "s"}</span></div><div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{rest.map((post) => <Link key={post._id} href={`/agri-learn/${post.slug}`} className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/5 transition hover:-translate-y-0.5 hover:shadow-md"><PostMedia post={post}/><div className="p-6"><div className="flex items-center justify-between text-xs"><span className="font-medium text-primary">{post.category}</span><span className="text-slate-400">{formatDate(post.publishedAt ?? post.createdAt)}</span></div><h3 className="mt-3 text-lg font-medium leading-7 text-slate-800 transition group-hover:text-primary">{post.title}</h3><p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">{post.excerpt}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary">Continue reading <ArrowRight size={15}/></span></div></Link>)}</div></div>}
      </>}
    </section>
  </main>;
}
