"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, Search, Sprout } from "lucide-react";
import { getHeroImage, getYouTubeThumbnail, LearnPost } from "@/lib/agriLearn";

interface Props {
  posts: LearnPost[];
  currentSlug?: string;
  query?: string;
  category?: string;
  onSearch?: (query: string) => void;
  onCategory?: (category: string) => void;
}

const panel = "rounded-2xl border border-[#dfe7dc] bg-white p-6";
const heading = "mb-5 text-base font-semibold tracking-tight text-[#0f1a0b]";

export default function LearnSidebar({ posts, currentSlug, query = "", category = "", onSearch, onCategory }: Props) {
  const categories = Array.from(new Set(posts.map((post) => post.category).filter(Boolean))).sort();
  const recent = [...posts]
    .filter((post) => post.slug !== currentSlug)
    .sort((a, b) => new Date(b.publishedAt ?? b.createdAt).getTime() - new Date(a.publishedAt ?? a.createdAt).getTime())
    .slice(0, 4);

  return (
    <aside aria-label="Explore Agri-Learn" className="min-w-0 space-y-6">
      <section className={panel}>
        <h2 className={heading}>Find your next insight</h2>
        <form action="/agri-learn" role="search" onSubmit={onSearch ? (event) => event.preventDefault() : undefined}>
          <label htmlFor="learn-search" className="sr-only">Search Agri-Learn</label>
          <div className="flex overflow-hidden rounded-xl border border-[#dfe7dc] bg-[#f6f8f6] focus-within:ring-2 focus-within:ring-primary">
            <input id="learn-search" name="q" type="search" placeholder="Search articles…" {...(onSearch ? { value: query, onChange: (event: React.ChangeEvent<HTMLInputElement>) => onSearch(event.target.value) } : { defaultValue: query })} className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm outline-none" />
            <button type="submit" aria-label="Search articles" className="px-3 text-primary transition hover:bg-[#e8eee7]"><Search size={18} /></button>
          </div>
        </form>
      </section>

      <section className={panel}>
        <h2 className={heading}>Browse categories</h2>
        <nav aria-label="Article categories" className="space-y-1">
          {["", ...categories].map((item) => {
            const count = item ? posts.filter((post) => post.category === item).length : posts.length;
            const styles = `flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${category === item ? "bg-[#edf3e9] font-medium text-primary" : "text-[#52604c] hover:bg-[#f6f8f6]"}`;
            const content = <><span>{item || "All topics"}</span><span className="rounded-md bg-[#f0f4ee] px-2 py-0.5 text-xs tabular-nums">{count}</span></>;
            return onCategory ? <button key={item} onClick={() => onCategory(item)} aria-pressed={category === item} className={styles}>{content}</button> : <Link key={item} href={item ? `/agri-learn?category=${encodeURIComponent(item)}` : "/agri-learn"} className={styles}>{content}</Link>;
          })}
        </nav>
      </section>

      {recent.length > 0 && <section className={panel}>
        <h2 className={heading}>Recent posts</h2>
        <div className="divide-y divide-[#e8eee7]">
          {recent.map((post) => {
            const hero = getHeroImage(post);
            const cover = hero?.type === "image" ? hero.url : getYouTubeThumbnail(post.videoUrl);
            return <Link key={post._id} href={`/agri-learn/${post.slug}`} className="group flex gap-3 py-4 first:pt-0 last:pb-0">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#e8eee7]">
                {cover ? <Image src={cover} alt="" fill unoptimized sizes="64px" className="object-cover transition group-hover:scale-105" /> : <BookOpen className="m-5 text-primary" size={24} />}
              </div>
              <div className="min-w-0"><p className="text-[10px] font-medium uppercase tracking-wider text-primary">{post.category}</p><h3 className="mt-1 line-clamp-3 text-sm font-medium leading-5 group-hover:text-primary">{post.title}</h3></div>
            </Link>;
          })}
        </div>
      </section>}

      <section className="relative overflow-hidden rounded-2xl bg-[#244808] p-6 text-white">
        <Sprout size={32} className="mb-6 text-[#c4e29e]" />
        <p className="text-xs uppercase tracking-[0.16em] text-[#c4e29e]">From learning to growing</p>
        <h2 className="mt-3 text-xl font-medium leading-snug">Put your knowledge to work.</h2>
        <p className="mt-3 text-sm leading-6 text-white/80">Explore farming opportunities and take your next step with Remote Agric.</p>
        <Link href="/opportunities" className="mt-6 inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4">Explore Remote Agric <ArrowRight size={16} /></Link>
      </section>
    </aside>
  );
}
