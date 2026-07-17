"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Fraunces, JetBrains_Mono, Source_Serif_4 } from "next/font/google";
import { ArrowRight, BookOpen, ChevronRight, Play } from "lucide-react";
import { LearnPost } from "@/lib/agriLearn";

// Same three-role type system as the article page: a characterful display
// serif for headlines, a workhorse serif for reading copy, and a mono face
// reserved for ledger-style metadata (category, date, read time).
const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
});
const body = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

const fontVars = `${display.variable} ${body.variable} ${mono.variable}`;

const formatDate = (date?: string) =>
  date
    ? new Intl.DateTimeFormat("en-NG", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(date))
    : "Recently published";

const readingTime = (content?: string) =>
  Math.max(1, Math.ceil((content?.trim().split(/\s+/).length ?? 0) / 220));

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
          <span className="rounded-full bg-[#F6F0E4] p-3 text-[#1B140D] shadow-lg transition group-hover:scale-110">
            <Play size={18} fill="currentColor" />
          </span>
        </span>
      </>
    );
  return (
    <div className="flex h-full items-center justify-center bg-[#EFE7D6] text-[#526B4A]">
      <BookOpen size={30} />
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
    <main
      className={`${fontVars} min-h-screen bg-[#F6F0E4] text-[#241C13]`}
      style={{ fontFamily: "var(--font-body)" }}
    >
      {/* Masthead */}
      <section className="border-b border-[#241C13]/10">
        {loading ? (
          <div className="flex min-h-[520px] items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <span className="relative flex h-10 w-10 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C98A2C]/30" />
                <span className="relative inline-flex h-4 w-4 rounded-full bg-[#C98A2C]" />
              </span>
              <p
                style={{ fontFamily: "var(--font-mono)" }}
                className="text-[11px] uppercase tracking-[0.2em] text-[#6B6153]"
              >
                Gathering field notes
              </p>
            </div>
          </div>
        ) : featured ? (
          <div className="mx-auto max-w-[1320px] px-5 py-12 lg:px-10 lg:py-16">
            <p
              style={{ fontFamily: "var(--font-mono)" }}
              className="text-[11px] uppercase tracking-[0.25em] text-[#526B4A]"
            >
              Remote Agric Journal
            </p>

            <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_420px]">
              {/* Featured text */}
              <div className="relative pl-6 lg:pl-10">
                <span
                  style={{ fontFamily: "var(--font-mono)" }}
                  className="absolute -left-1 top-1 origin-top-left -rotate-90 whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.25em] text-[#526B4A] lg:top-2"
                >
                  {featured.category}
                </span>
                <div className="absolute left-3 top-0 h-full w-px bg-[#241C13]/10 lg:left-6" />

                <h1
                  style={{ fontFamily: "var(--font-display)" }}
                  className="max-w-2xl text-[2.6rem] font-medium leading-[1.05] tracking-[-0.02em] text-[#241C13] md:text-[3.4rem] md:leading-[1.03]"
                >
                  {featured.title}
                </h1>
                <p className="mt-6 max-w-xl text-[16px] leading-8 text-[#241C13]/65">
                  {featured.excerpt}
                </p>

                <dl
                  style={{ fontFamily: "var(--font-mono)" }}
                  className="mt-9 grid max-w-md grid-cols-2 gap-6 border-y border-[#241C13]/15 py-4 text-[11px] uppercase tracking-[0.12em] text-[#241C13]/50"
                >
                  <div>
                    <dt>Published</dt>
                    <dd className="mt-1.5 normal-case tracking-normal text-[13px] font-medium text-[#241C13]">
                      {formatDate(featured.publishedAt ?? featured.createdAt)}
                    </dd>
                  </div>
                  <div>
                    <dt>Read time</dt>
                    <dd className="mt-1.5 normal-case tracking-normal text-[13px] font-medium text-[#241C13]">
                      {readingTime(featured.content)} min
                    </dd>
                  </div>
                </dl>

                <Link
                  href={`/agri-learn/${featured.slug}`}
                  className="mt-8 inline-flex items-center gap-2 bg-[#1B140D] px-6 py-3 text-sm font-medium text-[#F6F0E4] transition hover:gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C98A2C]"
                >
                  Read full story
                  <ArrowRight size={16} />
                </Link>
              </div>

              {/* Featured photograph, pinned like a specimen */}
              <Link
                href={`/agri-learn/${featured.slug}`}
                className="group relative lg:pt-2"
              >
                <div className="relative rotate-1 border border-[#241C13]/15 bg-white p-2 shadow-[0_18px_40px_-20px_rgba(27,20,13,0.35)] transition duration-500 hover:rotate-0">
                  <div className="relative aspect-[4/5] w-full overflow-hidden">
                    <Cover post={featured} />
                  </div>
                </div>
                <p
                  style={{ fontFamily: "var(--font-mono)" }}
                  className="mt-4 text-[10px] uppercase tracking-[0.18em] text-[#241C13]/40"
                >
                  Featured record — Remote Agric
                </p>
              </Link>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-[1320px] px-5 py-24 lg:px-10">
            <p
              style={{ fontFamily: "var(--font-mono)" }}
              className="text-[11px] uppercase tracking-[0.25em] text-[#526B4A]"
            >
              Remote Agric Journal
            </p>
            <h1
              style={{ fontFamily: "var(--font-display)" }}
              className="mt-6 max-w-2xl text-[3rem] font-medium leading-[1.05] tracking-[-0.02em] text-[#241C13] md:text-[3.6rem]"
            >
              Agri-Learn
            </h1>
            <p className="mt-6 max-w-xl text-[16px] leading-8 text-[#241C13]/65">
              Field knowledge and investment perspectives for a growing
              agricultural community.
            </p>
            <p
              style={{ fontFamily: "var(--font-mono)" }}
              className="mt-5 text-[11px] uppercase tracking-[0.18em] text-[#241C13]/35"
            >
              New records arriving soon
            </p>
          </div>
        )}
      </section>

      {/* Latest articles */}
      <section className="mx-auto max-w-[1320px] px-5 py-16 lg:px-10 lg:py-20">
        <div className="flex flex-col justify-between gap-4 border-b border-[#241C13]/15 pb-6 sm:flex-row sm:items-end">
          <div>
            <p
              style={{ fontFamily: "var(--font-mono)" }}
              className="text-[11px] uppercase tracking-[0.2em] text-[#526B4A]"
            >
              From the journal
            </p>
            <h2
              style={{ fontFamily: "var(--font-display)" }}
              className="mt-2 text-[1.9rem] font-medium tracking-tight text-[#241C13]"
            >
              Latest stories &amp; insights
            </h2>
          </div>
          <span
            style={{ fontFamily: "var(--font-mono)" }}
            className="text-[11px] uppercase tracking-[0.15em] text-[#241C13]/40"
          >
            {posts.length} {posts.length === 1 ? "record" : "records"}
          </span>
        </div>

        {!loading && latest.length === 0 ? (
          <div className="mt-12 border border-dashed border-[#241C13]/20 px-6 py-20 text-center">
            <BookOpen className="mx-auto text-[#241C13]/25" size={36} />
            <h3
              style={{ fontFamily: "var(--font-display)" }}
              className="mt-4 text-lg font-medium text-[#241C13]"
            >
              More stories are on the way
            </h3>
            <p className="mt-2 text-sm text-[#241C13]/45">
              New articles will appear here as they are published.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
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
                  className="group flex flex-col"
                >
                  <div className="relative border border-[#241C13]/15 bg-white p-1.5 transition group-hover:border-[#241C13]/30">
                    <div className="relative aspect-[16/11] w-full overflow-hidden bg-[#EFE7D6]">
                      <Cover post={post} />
                      {post.media?.[0]?.type === "video" && (
                        <span
                          style={{ fontFamily: "var(--font-mono)" }}
                          className="absolute right-2.5 top-2.5 bg-[#1B140D]/80 px-2 py-1 text-[10px] uppercase tracking-[0.1em] text-[#F6F0E4]"
                        >
                          Video
                        </span>
                      )}
                    </div>
                  </div>

                  <dl
                    style={{ fontFamily: "var(--font-mono)" }}
                    className="mt-4 flex items-center gap-3 text-[10px] uppercase tracking-[0.14em] text-[#241C13]/45"
                  >
                    <dd className="text-[#526B4A]">{post.category}</dd>
                    <span className="h-3 w-px bg-[#241C13]/15" />
                    <dd>{formatDate(post.publishedAt ?? post.createdAt)}</dd>
                    <span className="h-3 w-px bg-[#241C13]/15" />
                    <dd>{readingTime(post.content)} min</dd>
                  </dl>

                  <h3
                    style={{ fontFamily: "var(--font-display)" }}
                    className="mt-3 text-[1.35rem] font-medium leading-snug text-[#241C13] transition group-hover:text-[#526B4A]"
                  >
                    {post.title}
                  </h3>

                  <p className="mt-2.5 line-clamp-2 text-[14px] leading-6 text-[#241C13]/55">
                    {post.excerpt}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-[#241C13]/10 pt-4">
                    <span className="truncate text-[13px] text-[#241C13]/60">
                      {author}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[13px] font-medium text-[#241C13] transition group-hover:gap-2">
                      Read
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Newsletter */}
        <div className="mt-16 border border-[#1B140D] bg-[#1B140D] p-8 text-center text-[#F6F0E4] md:p-12">
          <div className="mx-auto max-w-xl">
            <p
              style={{ fontFamily: "var(--font-mono)" }}
              className="text-[10px] uppercase tracking-[0.2em] text-[#C98A2C]"
            >
              Stay in the field
            </p>
            <h3
              style={{ fontFamily: "var(--font-display)" }}
              className="mt-3 text-2xl font-medium leading-snug"
            >
              Get Agri-Learn in your inbox
            </h3>
            <p className="mt-2 text-[14px] leading-6 text-[#F6F0E4]/60">
              Field knowledge, market trends, and farming tips — delivered as
              new records are published.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="border border-[#F6F0E4]/25 bg-transparent px-4 py-2.5 text-sm text-[#F6F0E4] placeholder:text-[#F6F0E4]/40 focus:border-[#C98A2C] focus:outline-none sm:min-w-[280px]"
              />
              <button className="inline-flex items-center justify-center gap-2 bg-[#C98A2C] px-6 py-2.5 text-sm font-medium text-[#1B140D] transition hover:bg-[#dba04a]">
                Subscribe
                <ArrowRight size={16} />
              </button>
            </div>
            <p
              style={{ fontFamily: "var(--font-mono)" }}
              className="mt-3 text-[10px] uppercase tracking-[0.15em] text-[#F6F0E4]/35"
            >
              No spam, unsubscribe anytime
            </p>
          </div>
        </div>

        {!loading && latest.length > 0 && (
          <div className="mt-12 text-center">
            <Link
              href="/agri-learn/all"
              className="inline-flex items-center gap-2 border-b border-[#C98A2C] pb-0.5 text-sm font-medium text-[#241C13] transition hover:gap-3"
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
