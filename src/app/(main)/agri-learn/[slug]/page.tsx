"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, CalendarDays, Loader2, Share2 } from "lucide-react";
import { LearnPost } from "@/lib/agriLearn";
import { toast } from "react-toastify";

const formatDate = (date?: string) => date ? new Intl.DateTimeFormat("en-NG", { day: "numeric", month: "long", year: "numeric" }).format(new Date(date)) : "Recently published";

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<LearnPost | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/agri-learn/${slug}`).then((response) => setPost(response.data.data.post)).finally(() => setLoading(false)); }, [slug]);
  if (loading) return <div className="flex min-h-[65vh] items-center justify-center"><Loader2 className="animate-spin text-primary"/></div>;
  if (!post) return <div className="mx-auto max-w-3xl px-5 py-24 text-center"><h1 className="text-2xl font-medium">Article not found</h1><Link href="/agri-learn" className="mt-5 inline-block text-sm font-medium text-primary">Return to Agri-Learn</Link></div>;
  const hero = post.media?.[0];

  return <main className="min-h-screen bg-[#f6f8f6] pb-16">
    <header className="bg-white">
      <div className="mx-auto max-w-4xl px-5 pb-10 pt-8 md:pb-12 md:pt-12">
        <div className="flex items-center justify-between"><Link href="/agri-learn" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-primary"><ArrowLeft size={16}/>Back to Agri-Learn</Link><button onClick={() => navigator.clipboard.writeText(window.location.href).then(() => toast.success("Article link copied"))} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-500 transition hover:bg-green-50 hover:text-primary"><Share2 size={16}/>Share</button></div>
        <div className="mt-10 text-center"><span className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-medium text-primary">{post.category}</span><h1 className="mx-auto mt-5 max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-slate-900 md:text-5xl">{post.title}</h1><p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-500 md:text-lg">{post.excerpt}</p><p className="mt-6 inline-flex items-center gap-2 text-xs text-slate-400"><CalendarDays size={14}/>{formatDate(post.publishedAt ?? post.createdAt)}</p></div>
      </div>
    </header>

    {hero && <div className="mx-auto max-w-6xl px-5 pt-8">{hero.type === "image" ? <Image src={hero.url} alt={post.title} width={1400} height={780} unoptimized priority className="max-h-[620px] w-full rounded-2xl object-cover shadow-sm"/> : <video src={hero.url} controls playsInline className="max-h-[620px] w-full rounded-2xl bg-slate-900 shadow-sm"/>}</div>}

    <article className="mx-auto mt-10 max-w-3xl rounded-2xl bg-white px-6 py-9 shadow-sm ring-1 ring-slate-900/5 md:px-12 md:py-12">
      <div className="whitespace-pre-wrap text-[15px] leading-8 text-slate-700 md:text-base">{post.content}</div>
      {post.media?.slice(1).map((media) => <div key={media.publicId} className="mt-9">{media.type === "image" ? <Image src={media.url} alt={post.title} width={1100} height={700} unoptimized className="w-full rounded-xl object-cover"/> : <video src={media.url} controls playsInline className="w-full rounded-xl bg-slate-900"/>}</div>)}
      <div className="mt-12 border-t border-slate-100 pt-7"><p className="text-sm text-slate-500">More practical insights and field stories are available in the Agri-Learn journal.</p><Link href="/agri-learn" className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary"><ArrowLeft size={15}/>Explore more articles</Link></div>
    </article>
  </main>;
}
