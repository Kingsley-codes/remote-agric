"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BookOpen } from "lucide-react";
import { getHeroImage, LearnPost } from "@/lib/agriLearn";

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

function Cover({
  post,
  priority = false,
}: {
  post: LearnPost;
  priority?: boolean;
}) {
  const hero = getHeroImage(post);
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
  ) : (
    <div className="flex h-full items-center justify-center bg-[#e8eee7] text-primary">
      <BookOpen size={30} />
    </div>
  );
}

export default function AgriLearnPage() {
  const [posts, setPosts] = useState<LearnPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All articles");
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/agri-learn`)
      .then(({ data }) => setPosts(data.data.posts))
      .finally(() => setLoading(false));
  }, []);
  const categories = useMemo(
    () => [
      "All articles",
      ...Array.from(new Set(posts.map((post) => post.category))),
    ],
    [posts],
  );
  const featured = posts[0];
  const articles =
    category === "All articles"
      ? posts.slice(1)
      : posts.slice(1).filter((post) => post.category === category);

  return (
    <main className="min-h-screen bg-[#f6f8f6] text-[#0f1a0b]">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
        <header className="mb-10">
          <p className="text-xs uppercase tracking-[0.18em] text-primary">
            Knowledge base
          </p>
          <h1 className="mt-3 text-3xl font-medium tracking-tight md:text-4xl">
            Agri-Learn Blog Hub
          </h1>
        </header>

        {loading ? (
          <div className="flex min-h-96 items-center justify-center">
            <span className="h-9 w-9 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
          </div>
        ) : featured ? (
          <>
            <Link
              href={`/agri-learn/${featured.slug}`}
              className="group grid min-h-[480px] overflow-hidden rounded-[2rem] bg-[#e0e8df] shadow-[0_8px_30px_rgba(15,26,11,0.06)] lg:grid-cols-[3fr_2fr]"
            >
              <div className="relative min-h-80 overflow-hidden lg:min-h-[480px]">
                <Cover post={featured} priority />
                <div className="absolute left-6 top-6 flex flex-wrap gap-2">
                  <span className="rounded-full bg-primary px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] text-white">Featured insight</span>
                  <span className="rounded-full bg-white/90 px-3 py-1.5 text-[11px] text-[#0f1a0b] backdrop-blur">{readTime(featured.content)} min read</span>
                </div>
              </div>
              <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
                <p className="text-xs uppercase tracking-[0.16em] text-primary">
                  {featured.category}
                </p>
                <h2 className="mt-4 text-2xl font-medium leading-tight md:text-3xl">
                  {featured.title}
                </h2>
                <p className="mt-5 text-sm leading-7 text-[#3d4b36]">
                  {featured.excerpt}
                </p>
                <div className="mt-8 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-[#0f1a0b]">Remote Agric team</p>
                    <p className="mt-1 text-xs text-[#3d4b36]/70">
                      {formatDate(featured.publishedAt ?? featured.createdAt)}
                    </p>
                  </div>
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white transition group-hover:translate-x-1">
                    <ArrowRight size={18} />
                  </span>
                </div>
              </div>
            </Link>

            <nav
              className="mt-12 flex gap-2 overflow-x-auto pb-2"
              aria-label="Article categories"
            >
              {categories.map((item) => (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className={`shrink-0 rounded-full px-5 py-2.5 text-xs transition ${category === item ? "bg-[#0f1a0b] text-white" : "bg-[#e0e8df] text-[#3d4b36] hover:bg-[#d8e2d7]"}`}
                >
                  {item}
                </button>
              ))}
            </nav>

            {articles.length > 0 ? (
              <section className="mt-8 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
                {articles.map((post) => (
                  <Link
                    key={post._id}
                    href={`/agri-learn/${post.slug}`}
                    className="group overflow-hidden rounded-3xl bg-white shadow-[0_5px_24px_rgba(15,26,11,0.05)] transition hover:-translate-y-1"
                  >
                    <div className="relative h-56 overflow-hidden">
                      <Cover post={post} />
                      <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs backdrop-blur">
                        {readTime(post.content)} min read
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
                      <div className="mt-6 flex items-center justify-between border-t border-primary/10 pt-5">
                        <span className="text-xs text-[#3d4b36]/70">
                          Remote Agric team
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
                <h2 className="mt-4 text-xl font-medium">No more articles in this category</h2>
                <p className="mt-2 text-sm text-[#3d4b36]">Try another category to continue exploring.</p>
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
    </main>
  );
}
