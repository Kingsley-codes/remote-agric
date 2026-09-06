"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import LearnSidebar from "@/components/agrilearn/LearnSidebar";
import { ArrowRight, BookOpen, Video } from "lucide-react";
import { getHeroImage, getYouTubeThumbnail, LearnPost } from "@/lib/agriLearn";

const formatDate = (date?: string) =>
  date
    ? new Intl.DateTimeFormat("en-NG", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(date))
    : "Recently";
const readTime = (content?: string) =>
  Math.max(1, Math.ceil((content?.trim().split(/\s+/).length ?? 0) / 220));
const postLabel = (post: LearnPost) => (post.postType === "podcast" ? "Watch episode" : `${readTime(post.content)} min read`);

function Cover({
  post,
  priority = false,
}: {
  post: LearnPost;
  priority?: boolean;
}) {
  const hero = getHeroImage(post);
  const thumbnail = getYouTubeThumbnail(post.videoUrl);
  return hero?.type === "image" ? (
    <Image
      src={hero.url}
      alt={post.title}
      fill
      unoptimized
      priority={priority}
      sizes="(min-width: 1024px) 60vw, 100vw"
      className="object-cover transition duration-500 group-hover:scale-[1.03]"
    />
  ) : thumbnail ? (
    <Image
      fill
      unoptimized
      priority={priority}
      sizes="(min-width: 1024px) 45vw, 100vw"
      src={thumbnail}
      alt={post.title}
      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
    />
  ) : (
    <div className="flex h-full items-center justify-center bg-[#e8eee7] text-primary">
      {post.postType === "podcast" ? <Video size={30} /> : <BookOpen size={30} />}
    </div>
  );
}

export default function AgriLearnPage() {
  const [posts, setPosts] = useState<LearnPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [tag, setTag] = useState("");
  const [query, setQuery] = useState("");
  const [error, setError] = useState(false);
  const [postType, setPostType] = useState<"all" | "blog" | "podcast">("all");
  useEffect(() => {
    const syncFilters = () => {
      const params = new URLSearchParams(window.location.search);
      setQuery(params.get("q") ?? "");
      setCategory(params.get("category") ?? "");
      setTag(params.get("tag")?.toLowerCase() ?? "");
      const type = params.get("type");
      setPostType(type === "podcast" || type === "blog" ? type : "all");
    };
    syncFilters();
    window.addEventListener("popstate", syncFilters);
    let active = true;
    axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/agri-learn`)
      .then(({ data }) => { if (active) setPosts(data.data.posts); })
      .catch(() => { if (active) setError(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; window.removeEventListener("popstate", syncFilters); };
  }, []);
  const updateUrlFilter = (name: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    if (value) params.set(name, value);
    else params.delete(name);
    const search = params.toString();
    window.history.replaceState(null, "", search ? `/agri-learn?${search}` : "/agri-learn");
  };
  const changeQuery = (value: string) => { setQuery(value); updateUrlFilter("q", value); };
  const changeCategory = (value: string) => { setCategory(value); updateUrlFilter("category", value); };
  const changeTag = (value: string) => { setTag(value); updateUrlFilter("tag", value); };
  const changePostType = (value: "all" | "blog" | "podcast") => { setPostType(value); updateUrlFilter("type", value === "all" ? "" : value); };
  const filtered = posts.filter((post) =>
    (postType === "all" || (post.postType ?? "blog") === postType) &&
    (!category || post.category === category) &&
    (!tag || post.tags?.some((item) => item.toLowerCase() === tag)) &&
    `${post.title} ${post.excerpt} ${post.category} ${(post.tags ?? []).join(" ")} ${post.content ?? ""}`.toLowerCase().includes(query.trim().toLowerCase())
  );
  const isFiltered = Boolean(query.trim() || category || tag || postType !== "all");
  const featured = !isFiltered ? filtered[0] : undefined;
  const articles = featured ? filtered.slice(1) : filtered;

  return (
    <main className="min-h-screen bg-[#f6f8f6] text-[#0f1a0b]">
      <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
        <header className="mb-10">
          <p className="text-xs uppercase tracking-[0.18em] text-primary">
            Knowledge base
          </p>
          <h1 className="mt-3 text-3xl font-medium tracking-tight md:text-4xl">
            Fresh ideas. Better farming.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#52604c]">Practical guides, expert insights, and conversations to help you grow your agricultural knowledge.</p>
        </header>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_300px] xl:gap-10 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0">
        <div className="mb-5 grid gap-3 sm:grid-cols-3 lg:hidden">
          <div><label htmlFor="mobile-learn-search" className="mb-2 block text-xs font-medium text-[#52604c]">Search Agri-Learn</label><input id="mobile-learn-search" type="search" value={query} onChange={(event) => changeQuery(event.target.value)} placeholder="Search articles" className="w-full rounded-xl border border-[#dfe7dc] bg-white px-4 py-3 text-sm focus:ring-2 focus:ring-primary" /></div>
          <div><label htmlFor="mobile-learn-category" className="mb-2 block text-xs font-medium text-[#52604c]">Browse categories</label><select id="mobile-learn-category" value={category} onChange={(event) => changeCategory(event.target.value)} className="w-full rounded-xl border border-[#dfe7dc] bg-white px-4 py-3 text-sm focus:ring-2 focus:ring-primary"><option value="">All topics</option>{Array.from(new Set(posts.map((post) => post.category))).sort().map((item) => <option key={item} value={item}>{item}</option>)}</select></div>
          <div><label htmlFor="mobile-learn-tag" className="mb-2 block text-xs font-medium text-[#52604c]">Filter by tag</label><select id="mobile-learn-tag" value={tag} onChange={(event) => changeTag(event.target.value)} className="w-full rounded-xl border border-[#dfe7dc] bg-white px-4 py-3 text-sm focus:ring-2 focus:ring-primary"><option value="">All tags</option>{Array.from(new Set(posts.flatMap((post) => post.tags ?? []))).sort().map((item) => <option key={item} value={item}>{item}</option>)}</select></div>
        </div>
        <nav className="mb-6 flex flex-wrap gap-2" aria-label="Post formats">
          {([["all", "All posts"], ["blog", "Articles"], ["podcast", "Podcasts"]] as const).map(([value, label]) => (
            <button key={value} onClick={() => changePostType(value)} aria-pressed={postType === value} className={`rounded-full px-5 py-2.5 text-sm transition ${postType === value ? "bg-[#0f1a0b] text-white" : "border border-[#dfe7dc] bg-white text-[#52604c] hover:bg-[#e8eee7]"}`}>{label}</button>
          ))}
        </nav>
        {loading ? (
          <div className="flex min-h-96 items-center justify-center">
            <span className="h-9 w-9 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
          </div>
        ) : error ? (
          <div role="alert" className="rounded-2xl border border-[#dfe7dc] bg-white p-10 text-center"><h2 className="text-xl font-medium">Unable to load the articles</h2><p className="mt-3 text-sm text-[#52604c]">Please try again in a moment.</p><button onClick={() => window.location.reload()} className="mt-5 rounded-full bg-primary px-5 py-2 text-sm text-white">Try again</button></div>
        ) : posts.length > 0 ? (
          <>
            {featured && <Link
              href={`/agri-learn/${featured.slug}`}
              className="group grid min-h-[360px] overflow-hidden rounded-[2rem] bg-[#e0e8df] shadow-[0_8px_30px_rgba(15,26,11,0.06)] xl:grid-cols-[1fr_1fr]"
            >
              <div className="relative min-h-80 overflow-hidden xl:min-h-[360px]">
                <Cover post={featured} priority />
                <div className="absolute left-6 top-6 flex flex-wrap gap-2">
                  <span className="rounded-full bg-primary px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] text-white">Featured insight</span>
                  <span className="rounded-full bg-white/90 px-3 py-1.5 text-[11px] text-[#0f1a0b] backdrop-blur">{postLabel(featured)}</span>
                </div>
              </div>
              <div className="flex flex-col justify-center p-7 sm:p-10 xl:p-8">
                <p className="text-xs uppercase tracking-[0.16em] text-primary">
                  {featured.category}
                </p>
                {featured.tags && featured.tags.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{featured.tags.slice(0, 3).map((item) => <span key={item} className="text-xs text-[#52604c]"># {item}</span>)}</div>}
                <h2 className="mt-4 text-2xl font-medium leading-tight md:text-3xl">
                  {featured.title}
                </h2>
                <p className="mt-5 text-sm leading-7 text-[#3d4b36]">
                  {featured.excerpt}
                </p>
                <div className="mt-8 flex items-center justify-between gap-4">
                  <div>
                    <p className="mt-1 text-xs text-[#3d4b36]/70">
                      {formatDate(featured.publishedAt ?? featured.createdAt)}
                    </p>
                  </div>
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white transition group-hover:translate-x-1">
                    <ArrowRight size={18} />
                  </span>
                </div>
              </div>
            </Link>}

            <div className="mb-6 mt-9 flex flex-wrap items-center justify-between gap-3 border-b border-[#dfe7dc] pb-5">
              <div><p className="text-xs uppercase tracking-[0.16em] text-primary">The learning journal</p><h2 className="mt-2 text-2xl font-medium">{isFiltered ? "Your search results" : "Latest articles & episodes"}</h2></div>
              <span className="text-sm text-[#52604c]">{filtered.length} {filtered.length === 1 ? "post" : "posts"}</span>
              {isFiltered && <button onClick={() => { setQuery(""); setCategory(""); setTag(""); setPostType("all"); window.history.replaceState(null, "", "/agri-learn"); }} className="text-sm font-medium text-primary underline underline-offset-4">Clear filters</button>}
            </div>

            {articles.length > 0 ? (
              <section className="grid gap-6 sm:grid-cols-2">
                {articles.map((post) => (
                  <Link
                    key={post._id}
                    href={`/agri-learn/${post.slug}`}
                    className="group overflow-hidden rounded-3xl bg-white shadow-[0_5px_24px_rgba(15,26,11,0.05)] transition hover:-translate-y-1"
                  >
                    <div className="relative h-56 overflow-hidden">
                      <Cover post={post} />
                      <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs backdrop-blur">
                        {postLabel(post)}
                      </span>
                    </div>
                    <div className="p-7">
                      <p className="text-xs uppercase tracking-[0.14em] text-primary">
                        {post.category}
                      </p>
                      <h2 className="mt-3 text-xl font-medium leading-snug">
                        {post.title}
                      </h2>
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#3d4b36]">
                        {post.excerpt}
                      </p>
                      {post.tags && post.tags.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{post.tags.slice(0, 3).map((item) => <span key={item} className="rounded-full bg-[#f0f4ee] px-2.5 py-1 text-[11px] text-[#52604c]"># {item}</span>)}</div>}
                      <div className="mt-6 flex items-center justify-between border-t border-primary/10 pt-5">
                        <span className="text-xs text-[#3d4b36]/70">
                          {post.postType === "podcast" ? "Podcast" : "Blog"}
                        </span>
                        <ArrowRight
                          size={18}
                          className="text-primary transition group-hover:translate-x-1"
                        />
                      </div>
                    </div>
                  </Link>
                ))}
              </section>
            ) : (
              <div className="mt-8 rounded-3xl bg-white px-6 py-16 text-center">
                <BookOpen className="mx-auto text-primary/40" />
                <h2 className="mt-4 text-xl font-medium">{isFiltered ? "No matching posts" : "You are all caught up"}</h2>
                <p className="mt-2 text-sm text-[#3d4b36]">{isFiltered ? "Try a different search, category, or format." : "Explore the featured insight above, or check back for more."}</p>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-3xl bg-white px-6 py-20 text-center">
            <BookOpen className="mx-auto text-primary/40" />
            <h2 className="mt-4 text-xl font-medium">
              Articles are on the way
            </h2>
            <p className="mt-2 text-sm text-[#3d4b36]">
              New agricultural insights will appear here when published.
            </p>
          </div>
        )}
        </div>
        <LearnSidebar posts={posts} query={query} category={category} tag={tag} onSearch={changeQuery} onCategory={changeCategory} onTag={changeTag} />
        </div>
      </div>
    </main>
  );
}
