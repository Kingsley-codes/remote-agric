"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowUpRight, CalendarDays, Clock3, Copy, Loader2, Share2 } from "lucide-react";
import { LearnPost } from "@/lib/agriLearn";
import { toast } from "react-toastify";

const formatDate = (date?: string) => date ? new Intl.DateTimeFormat("en-NG", { day: "numeric", month: "long", year: "numeric" }).format(new Date(date)) : "Recently published";

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<LearnPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/agri-learn/${slug}`)
      .then((response) => setPost(response.data.data.post))
      .finally(() => setLoading(false));
  }, [slug]);

  const paragraphs = useMemo(() => post?.content?.split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean) ?? [], [post?.content]);
  const readingTime = Math.max(1, Math.ceil((post?.content?.trim().split(/\s+/).length ?? 0) / 220));

  if (loading) return <div className="flex min-h-[70vh] items-center justify-center bg-[#f7f8f6]"><Loader2 className="animate-spin text-primary"/></div>;
  if (!post) return <div className="mx-auto max-w-3xl px-5 py-24 text-center"><h1 className="text-2xl font-medium">Article not found</h1><Link href="/agri-learn" className="mt-5 inline-block text-sm font-medium text-primary">Return to Agri-Learn</Link></div>;

  const hero = post.media?.[0];
  const author = post.author?.name || [post.author?.firstName, post.author?.lastName].filter(Boolean).join(" ") || "Remote Agric Editorial";
  const share = () => navigator.clipboard.writeText(window.location.href).then(() => toast.success("Article link copied"));

  return <main className="min-h-screen bg-[#f7f8f6] text-slate-800">
    <div className="border-b border-white/10 bg-[#183d22] text-white">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 lg:px-8">
        <Link href="/agri-learn" className="inline-flex items-center gap-2 text-sm text-green-50/70 transition hover:text-white"><ArrowLeft size={16}/>Agri-Learn</Link>
        <button onClick={share} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-green-50/70 transition hover:bg-white/10 hover:text-white"><Share2 size={16}/>Share article</button>
      </div>
    </div>

    <header className="relative overflow-hidden bg-[#183d22] text-white">
      <div className="pointer-events-none absolute -left-32 -top-40 h-96 w-96 rounded-full bg-[#7fb069]/20 blur-3xl"/>
      <div className="pointer-events-none absolute bottom-0 right-[35%] h-64 w-64 rounded-full bg-[#d7a928]/10 blur-3xl"/>
      <div className="pointer-events-none absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "26px 26px" }}/>
      <div className={`relative mx-auto grid max-w-[1440px] ${hero ? "lg:grid-cols-[minmax(0,0.92fr)_minmax(480px,1.08fr)]" : ""}`}>
        <div className="flex min-h-[500px] flex-col justify-center px-6 py-14 md:px-12 lg:min-h-[640px] lg:px-16 xl:px-20">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-green-100 backdrop-blur-sm">{post.category}</span>
            <h1 className="mt-7 text-4xl font-medium leading-[1.1] tracking-[-0.035em] text-white md:text-5xl xl:text-[3.65rem]">{post.title}</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-green-50/75 md:text-lg">{post.excerpt}</p>
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-white/15 pt-6">
              <div><p className="text-[11px] text-green-100/50">Written by</p><p className="mt-1 text-sm font-medium text-white">{author}</p></div>
              <span className="hidden h-8 w-px bg-white/15 sm:block"/>
              <span className="inline-flex items-center gap-2 text-xs text-green-50/65"><CalendarDays size={14}/>{formatDate(post.publishedAt ?? post.createdAt)}</span>
              <span className="inline-flex items-center gap-2 text-xs text-green-50/65"><Clock3 size={14}/>{readingTime} min read</span>
            </div>
          </div>
        </div>
        {hero && <div className="relative min-h-[360px] overflow-hidden lg:min-h-[640px]">
          {hero.type === "image" ? <Image src={hero.url} alt={post.title} fill unoptimized priority sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover"/> : <video src={hero.url} controls playsInline className="h-full min-h-[360px] w-full bg-slate-950 object-cover lg:min-h-[640px]"/>}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#183d22]/35 via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#183d22]/30 lg:to-transparent"/>
          <div className="absolute bottom-5 left-5 rounded-lg bg-slate-950/45 px-3 py-2 text-[11px] text-white/75 backdrop-blur-md">Featured story · Remote Agric</div>
        </div>}
      </div>
    </header>

    <div className="mx-auto grid max-w-6xl gap-12 px-5 py-14 lg:grid-cols-[190px_minmax(0,720px)] lg:px-8 lg:py-20">
      <aside className="hidden lg:block"><div className="sticky top-24"><p className="text-xs font-medium uppercase tracking-[0.15em] text-slate-400">In this article</p><div className="mt-4 border-l border-slate-200 pl-4"><p className="text-sm leading-6 text-slate-500">{post.excerpt}</p></div><div className="mt-8 border-t border-slate-200 pt-5"><p className="text-xs text-slate-400">Share this story</p><button onClick={share} className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary"><Copy size={15}/>Copy link</button></div></div></aside>
      <article>
        <div className="border-b border-slate-200 pb-9"><p className="text-xl leading-9 text-slate-600 first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-6xl first-letter:font-medium first-letter:leading-[0.8] first-letter:text-primary">{paragraphs[0] ?? post.content}</p></div>
        <div className="mt-9 space-y-7">{paragraphs.slice(1).map((paragraph, index) => paragraph.length < 90 && !/[.!?]$/.test(paragraph) ? <h2 key={index} className="pt-5 text-2xl font-medium leading-8 tracking-tight text-slate-900">{paragraph}</h2> : <p key={index} className="text-[16px] leading-8 text-slate-600">{paragraph}</p>)}</div>
        {post.media?.slice(1).map((media, index) => <figure key={media.publicId} className="my-11">{media.type === "image" ? <Image src={media.url} alt={`${post.title} – image ${index + 2}`} width={1200} height={760} unoptimized className="w-full rounded-xl object-cover"/> : <video src={media.url} controls playsInline className="w-full rounded-xl bg-slate-950"/>}<figcaption className="mt-3 text-xs text-slate-400">Supporting media for this article</figcaption></figure>)}
        <footer className="mt-14 rounded-2xl bg-[#eaf2e7] p-7 md:p-8"><p className="text-xs font-medium uppercase tracking-[0.15em] text-primary">Keep learning</p><h2 className="mt-3 text-xl font-medium text-slate-800">Explore more field knowledge and agricultural insights.</h2><p className="mt-2 text-sm leading-6 text-slate-500">Discover practical articles prepared for farmers, investors and everyone interested in sustainable agriculture.</p><Link href="/agri-learn" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary">Browse Agri-Learn <ArrowUpRight size={16}/></Link></footer>
      </article>
    </div>
  </main>;
}
