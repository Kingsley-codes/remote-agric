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
    <div className="border-b border-slate-200/70 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link href="/agri-learn" className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-primary"><ArrowLeft size={16}/>Agri-Learn</Link>
        <button onClick={share} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-500 transition hover:bg-green-50 hover:text-primary"><Share2 size={16}/>Share article</button>
      </div>
    </div>

    <header className="bg-white">
      <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
        <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="max-w-4xl">
            <span className="inline-flex rounded-full bg-[#edf5ea] px-3 py-1.5 text-xs font-medium text-primary">{post.category}</span>
            <h1 className="mt-6 text-4xl font-medium leading-[1.12] tracking-[-0.03em] text-slate-900 md:text-5xl lg:text-[3.5rem]">{post.title}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-500">{post.excerpt}</p>
          </div>
          <div className="border-l border-slate-200 pl-6">
            <p className="text-xs text-slate-400">Written by</p><p className="mt-1 text-sm font-medium text-slate-700">{author}</p>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-400"><span className="inline-flex items-center gap-1.5"><CalendarDays size={14}/>{formatDate(post.publishedAt ?? post.createdAt)}</span><span className="inline-flex items-center gap-1.5"><Clock3 size={14}/>{readingTime} min read</span></div>
          </div>
        </div>
      </div>
    </header>

    {hero && <section className="mx-auto max-w-[1440px] px-4 pt-8 md:px-6 lg:pt-10">{hero.type === "image" ? <Image src={hero.url} alt={post.title} width={1600} height={900} unoptimized priority className="h-[330px] w-full rounded-2xl object-cover shadow-sm md:h-[500px] lg:h-[620px]"/> : <video src={hero.url} controls playsInline className="h-auto max-h-[680px] w-full rounded-2xl bg-slate-950 shadow-sm"/>}<p className="mt-3 px-1 text-xs text-slate-400">Featured media · {post.title}</p></section>}

    <div className="mx-auto grid max-w-6xl gap-12 px-5 py-14 lg:grid-cols-[190px_minmax(0,720px)] lg:px-8 lg:py-20">
      <aside className="hidden lg:block">
        <div className="sticky top-24">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-slate-400">In this article</p>
          <div className="mt-4 border-l border-slate-200 pl-4"><p className="text-sm leading-6 text-slate-500">{post.excerpt}</p></div>
          <div className="mt-8 border-t border-slate-200 pt-5"><p className="text-xs text-slate-400">Share this story</p><button onClick={share} className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary"><Copy size={15}/>Copy link</button></div>
        </div>
      </aside>

      <article>
        <div className="border-b border-slate-200 pb-9"><p className="text-xl leading-9 text-slate-600 first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-6xl first-letter:font-medium first-letter:leading-[0.8] first-letter:text-primary">{paragraphs[0] ?? post.content}</p></div>
        <div className="mt-9 space-y-7">{paragraphs.slice(1).map((paragraph, index) => {
          const heading = paragraph.length < 90 && !/[.!?]$/.test(paragraph);
          return heading ? <h2 key={index} className="pt-5 text-2xl font-medium leading-8 tracking-tight text-slate-900">{paragraph}</h2> : <p key={index} className="text-[16px] leading-8 text-slate-600">{paragraph}</p>;
        })}</div>

        {post.media?.slice(1).map((media, index) => <figure key={media.publicId} className="my-11">{media.type === "image" ? <Image src={media.url} alt={`${post.title} – image ${index + 2}`} width={1200} height={760} unoptimized className="w-full rounded-xl object-cover"/> : <video src={media.url} controls playsInline className="w-full rounded-xl bg-slate-950"/>}<figcaption className="mt-3 text-xs text-slate-400">Supporting media for this article</figcaption></figure>)}

        <footer className="mt-14 rounded-2xl bg-[#eaf2e7] p-7 md:p-8"><p className="text-xs font-medium uppercase tracking-[0.15em] text-primary">Keep learning</p><h2 className="mt-3 text-xl font-medium text-slate-800">Explore more field knowledge and agricultural insights.</h2><p className="mt-2 text-sm leading-6 text-slate-500">Discover practical articles prepared for farmers, investors and everyone interested in sustainable agriculture.</p><Link href="/agri-learn" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary">Browse Agri-Learn <ArrowUpRight size={16}/></Link></footer>
      </article>
    </div>
  </main>;
}
