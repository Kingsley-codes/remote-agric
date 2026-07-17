"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, CalendarDays, Loader2, Play, Sparkles } from "lucide-react";
import { LearnPost } from "@/lib/agriLearn";

const formatDate = (date?: string) => date ? new Intl.DateTimeFormat("en-NG", { day: "numeric", month: "short", year: "numeric" }).format(new Date(date)) : "Recently published";

function Cover({ post }: { post: LearnPost }) {
  const media = post.media?.[0];
  if (media?.type === "image") return <Image src={media.url} alt={post.title} fill unoptimized sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-[1.025]"/>;
  if (media?.type === "video") return <><video src={media.url} muted playsInline className="h-full w-full object-cover opacity-85"/><span className="absolute inset-0 flex items-center justify-center"><span className="rounded-full bg-white/90 p-3 text-primary shadow-lg"><Play size={18} fill="currentColor"/></span></span></>;
  return <div className="flex h-full items-center justify-center bg-[#e6eee3] text-primary"><BookOpen size={32}/></div>;
}

export default function AgriLearnPage() {
  const [posts, setPosts] = useState<LearnPost[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/agri-learn`).then((response) => setPosts(response.data.data.posts)).finally(() => setLoading(false)); }, []);
  const [featured, ...latest] = posts;

  return <main className="min-h-screen bg-[#f7f8f6]">
    <section className="relative overflow-hidden bg-[#183d22] text-white">
      <div className="pointer-events-none absolute -left-36 -top-44 h-[430px] w-[430px] rounded-full bg-[#7fb069]/20 blur-3xl"/>
      <div className="pointer-events-none absolute bottom-0 right-[30%] h-72 w-72 rounded-full bg-[#d7a928]/10 blur-3xl"/>
      <div className="pointer-events-none absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "26px 26px" }}/>

      {loading ? <div className="relative flex min-h-[620px] items-center justify-center"><Loader2 className="animate-spin text-green-100"/></div> : featured ? <div className="relative mx-auto grid max-w-[1440px] lg:grid-cols-[minmax(0,.9fr)_minmax(500px,1.1fr)]">
        <div className="flex min-h-[540px] items-center px-6 py-14 md:px-12 lg:min-h-[650px] lg:px-16 xl:px-20">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-medium text-green-100/70"><Sparkles size={15}/><span className="uppercase tracking-[0.16em]">Agri-Learn journal</span></div>
            <span className="mt-8 inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-green-50 backdrop-blur-sm">Featured · {featured.category}</span>
            <h1 className="mt-6 text-4xl font-medium leading-[1.1] tracking-[-0.035em] md:text-5xl xl:text-[3.5rem]">{featured.title}</h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-green-50/70 md:text-lg">{featured.excerpt}</p>
            <div className="mt-8 flex flex-wrap items-center gap-5"><Link href={`/agri-learn/${featured.slug}`} className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-medium text-[#183d22] shadow-sm transition hover:bg-green-50">Read featured story <ArrowRight size={16}/></Link><span className="inline-flex items-center gap-2 text-xs text-green-50/55"><CalendarDays size={14}/>{formatDate(featured.publishedAt ?? featured.createdAt)}</span></div>
          </div>
        </div>
        <Link href={`/agri-learn/${featured.slug}`} className="group relative min-h-[400px] overflow-hidden lg:min-h-[650px]"><Cover post={featured}/><div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#183d22]/40 via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#183d22]/30 lg:to-transparent"/><div className="absolute bottom-5 left-5 rounded-lg bg-slate-950/45 px-3 py-2 text-[11px] text-white/75 backdrop-blur-md">Featured story · Remote Agric</div></Link>
      </div> : <div className="relative mx-auto flex min-h-[500px] max-w-7xl items-center px-6 py-20 lg:px-8"><div className="max-w-2xl"><p className="text-xs font-medium uppercase tracking-[0.17em] text-green-100/65">Remote Agric journal</p><h1 className="mt-5 text-4xl font-medium tracking-tight md:text-6xl">Agri-Learn</h1><p className="mt-6 text-lg leading-8 text-green-50/70">Useful ideas, field knowledge and investment perspectives for a growing agricultural community.</p></div></div>}
    </section>

    <section className="mx-auto max-w-7xl px-5 py-12 md:py-16 lg:px-8">
      <div className="flex flex-col justify-between gap-3 border-b border-slate-200 pb-6 sm:flex-row sm:items-end"><div><p className="text-xs font-medium uppercase tracking-[0.15em] text-primary">From the journal</p><h2 className="mt-2 text-2xl font-medium tracking-tight text-slate-800">Latest stories and insights</h2></div><p className="text-sm text-slate-400">Farming · Markets · Investment · Community</p></div>

      {!loading && latest.length === 0 ? <div className="rounded-2xl bg-white px-6 py-20 text-center shadow-sm ring-1 ring-slate-900/5"><BookOpen className="mx-auto text-slate-300" size={32}/><h3 className="mt-4 text-base font-medium text-slate-700">More stories are on the way</h3><p className="mt-2 text-sm text-slate-400">New articles will appear here as they are published.</p></div> : <div className="mt-8 grid gap-x-6 gap-y-9 md:grid-cols-2 lg:grid-cols-3">{latest.map((post) => <Link key={post._id} href={`/agri-learn/${post.slug}`} className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/5 transition hover:-translate-y-1 hover:shadow-lg">
        <div className="relative h-56 overflow-hidden"><Cover post={post}/><span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-medium text-primary shadow-sm backdrop-blur-md">{post.category}</span></div>
        <div className="p-6"><div className="flex items-center justify-between text-xs text-slate-400"><span>{formatDate(post.publishedAt ?? post.createdAt)}</span><span>Agri-Learn</span></div><h3 className="mt-3 text-xl font-medium leading-7 text-slate-800 transition group-hover:text-primary">{post.title}</h3><p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">{post.excerpt}</p><span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary">Read article <ArrowRight size={15} className="transition group-hover:translate-x-1"/></span></div>
      </Link>)}</div>}
    </section>
  </main>;
}
