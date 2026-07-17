"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Loader2,
  Play,
  Sparkles,
  ChevronRight,
  Clock3,
  User,
  Tag,
  TrendingUp,
  MessageCircle,
} from "lucide-react";
import { LearnPost } from "@/lib/agriLearn";

const formatDate = (date?: string) =>
  date
    ? new Intl.DateTimeFormat("en-NG", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(date))
    : "Recently published";

function Cover({ post, className }: { post: LearnPost; className?: string }) {
  const media = post.media?.[0];
  if (media?.type === "image")
    return (
      <Image
        src={media.url}
        alt={post.title}
        fill
        unoptimized
        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        className={`object-cover transition duration-500 group-hover:scale-[1.025] ${className}`}
      />
    );
  if (media?.type === "video")
    return (
      <>
        <video
          src={media.url}
          muted
          playsInline
          className="h-full w-full object-cover opacity-85"
        />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="rounded-full bg-white/90 p-3 text-emerald-700 shadow-lg transition group-hover:scale-110">
            <Play size={18} fill="currentColor" />
          </span>
        </span>
      </>
    );
  return (
    <div className="flex h-full items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-700">
      <BookOpen size={32} />
    </div>
  );
}

export default function AgriLearnPage() {
  const [posts, setPosts] = useState<LearnPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/agri-learn`)
      .then((response) => setPosts(response.data.data.posts))
      .finally(() => setLoading(false));
  }, []);

  const [featured, ...latest] = posts;

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 text-white">
        {/* Decorative Elements */}
        <div className="pointer-events-none absolute -left-36 -top-44 h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-[20%] h-96 w-96 rounded-full bg-amber-500/5 blur-3xl" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "30px 30px",
          }}
        />

        {loading ? (
          <div className="relative flex min-h-[600px] items-center justify-center">
            <div className="text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-emerald-300" />
              <p className="mt-4 text-sm text-emerald-200/70">
                Loading articles...
              </p>
            </div>
          </div>
        ) : featured ? (
          <div className="relative mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
              {/* Featured Content */}
              <div className="flex flex-col justify-center order-2 lg:order-1">
                <div className="flex items-center gap-2 text-xs font-medium text-emerald-200/70">
                  <Sparkles size={15} />
                  <span className="uppercase tracking-[0.16em]">
                    Featured Story
                  </span>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-700/50 px-3 py-1 text-xs font-medium text-emerald-100 backdrop-blur-sm">
                    <Tag size={12} />
                    {featured.category}
                  </span>
                  <span className="text-emerald-300/40">•</span>
                  <span className="flex items-center gap-1.5 text-xs text-emerald-200/60">
                    <Clock3 size={13} />
                    {Math.max(
                      1,
                      Math.ceil(
                        (featured.content?.trim().split(/\s+/).length ?? 0) /
                          220,
                      ),
                    )}{" "}
                    min read
                  </span>
                </div>

                <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                  {featured.title}
                </h1>

                <p className="mt-4 max-w-xl text-base leading-relaxed text-emerald-100/70 sm:text-lg">
                  {featured.excerpt}
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link
                    href={`/agri-learn/${featured.slug}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-medium text-emerald-900 shadow-sm transition hover:bg-emerald-50 hover:shadow-md"
                  >
                    Read full story
                    <ArrowRight
                      size={16}
                      className="transition group-hover:translate-x-1"
                    />
                  </Link>
                  <span className="flex items-center gap-2 text-sm text-emerald-200/50">
                    <CalendarDays size={14} />
                    {formatDate(featured.publishedAt ?? featured.createdAt)}
                  </span>
                </div>
              </div>

              {/* Featured Media */}
              <Link
                href={`/agri-learn/${featured.slug}`}
                className="group relative order-1 lg:order-2"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-emerald-800/50 shadow-2xl">
                  <Cover post={featured} className="rounded-2xl" />
                  <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-emerald-900/40 via-transparent to-transparent" />
                </div>
                <div className="absolute bottom-4 left-4 rounded-lg bg-black/40 px-3 py-1.5 text-xs text-white/80 backdrop-blur-md">
                  Featured story
                </div>
              </Link>
            </div>
          </div>
        ) : (
          <div className="relative mx-auto max-w-7xl px-5 py-24 lg:px-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-200/70">
                <Sparkles size={15} />
                <span className="uppercase tracking-[0.16em]">
                  Remote Agric Journal
                </span>
              </div>
              <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Agri-Learn
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-emerald-100/70">
                Useful ideas, field knowledge, and investment perspectives for a
                growing agricultural community.
              </p>
              <p className="mt-4 text-sm text-emerald-200/40">
                New articles arriving soon
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Latest Articles Section */}
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
        <div className="flex flex-col justify-between gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-emerald-700">
              From the journal
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Latest stories & insights
            </h2>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <TrendingUp size={14} className="text-emerald-600" />
              Trending
            </span>
            <span className="h-4 w-px bg-gray-300" />
            <span>{posts.length} articles</span>
          </div>
        </div>

        {!loading && latest.length === 0 ? (
          <div className="mt-12 rounded-2xl bg-gray-50 px-6 py-20 text-center">
            <BookOpen className="mx-auto text-gray-300" size={40} />
            <h3 className="mt-4 text-lg font-medium text-gray-700">
              More stories are on the way
            </h3>
            <p className="mt-2 text-sm text-gray-400">
              New articles will appear here as they are published.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((post) => {
              const author =
                post.author?.name ||
                [post.author?.firstName, post.author?.lastName]
                  .filter(Boolean)
                  .join(" ") ||
                "Remote Agric";

              return (
                <Link
                  key={post._id}
                  href={`/agri-learn/${post.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-100/20"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                    <Cover post={post} />
                    <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-emerald-700 shadow-sm backdrop-blur-sm">
                      {post.category}
                    </span>
                    {post.media?.[0]?.type === "video" && (
                      <span className="absolute right-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
                        Video
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays size={13} />
                        {formatDate(post.publishedAt ?? post.createdAt)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock3 size={13} />
                        {Math.max(
                          1,
                          Math.ceil(
                            (post.content?.trim().split(/\s+/).length ?? 0) /
                              220,
                          ),
                        )}{" "}
                        min
                      </span>
                    </div>

                    <h3 className="mt-3 text-lg font-semibold leading-snug text-gray-900 transition group-hover:text-emerald-700">
                      {post.title}
                    </h3>

                    <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-gray-500">
                      {post.excerpt}
                    </p>

                    <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100">
                          <User size={13} className="text-emerald-700" />
                        </div>
                        <span className="truncate max-w-[100px]">{author}</span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-700 transition group-hover:gap-2">
                        Read
                        <ArrowRight
                          size={14}
                          className="transition group-hover:translate-x-1"
                        />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Newsletter CTA */}
        <div className="mt-16 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-8 text-center sm:p-12">
          <div className="mx-auto max-w-2xl">
            <h3 className="text-2xl font-bold text-gray-900">
              Stay updated with Agri-Learn
            </h3>
            <p className="mt-2 text-gray-600">
              Get the latest agricultural insights, market trends, and farming
              tips delivered to your inbox.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 sm:min-w-[280px]"
              />
              <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-800">
                Subscribe
                <ArrowRight size={16} />
              </button>
            </div>
            <p className="mt-3 text-xs text-gray-400">
              No spam, unsubscribe anytime.
            </p>
          </div>
        </div>

        {/* View All Link */}
        {!loading && latest.length > 0 && (
          <div className="mt-12 text-center">
            <Link
              href="/agri-learn/all"
              className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 transition hover:gap-3"
            >
              View all articles
              <ChevronRight size={16} />
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
