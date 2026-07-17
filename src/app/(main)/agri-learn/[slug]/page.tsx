"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Fraunces, JetBrains_Mono, Source_Serif_4 } from "next/font/google";
import { ArrowLeft, ArrowUpRight, Copy, Share2 } from "lucide-react";
import { LearnPost } from "@/lib/agriLearn";
import { toast } from "react-toastify";

// Three roles, three faces: a characterful display serif for headlines,
// a workhorse serif for long reading, and a mono face reserved for
// ledger-style metadata (author, date, read time, category).
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

const formatDate = (date?: string) =>
  date
    ? new Intl.DateTimeFormat("en-NG", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(date))
    : "Recently published";

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<LearnPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/agri-learn/${slug}`)
      .then((response) => setPost(response.data.data.post))
      .finally(() => setLoading(false));
  }, [slug]);

  const paragraphs = useMemo(
    () =>
      post?.content
        ?.split(/\n\s*\n/)
        .map((part) => part.trim())
        .filter(Boolean) ?? [],
    [post?.content],
  );
  const readingTime = Math.max(
    1,
    Math.ceil((post?.content?.trim().split(/\s+/).length ?? 0) / 220),
  );

  const share = () =>
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => toast.success("Article link copied"));

  const fontVars = `${display.variable} ${body.variable} ${mono.variable}`;

  if (loading) {
    return (
      <div
        className={`${fontVars} flex min-h-screen items-center justify-center bg-[#F6F0E4]`}
      >
        <div className="flex flex-col items-center gap-4">
          <span className="relative flex h-10 w-10 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C98A2C]/30" />
            <span className="relative inline-flex h-4 w-4 rounded-full bg-[#C98A2C]" />
          </span>
          <p
            style={{ fontFamily: "var(--font-mono)" }}
            className="text-[11px] uppercase tracking-[0.2em] text-[#6B6153]"
          >
            Retrieving field note
          </p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div
        className={`${fontVars} flex min-h-screen flex-col items-center justify-center bg-[#F6F0E4] px-6 text-center`}
      >
        <p
          style={{ fontFamily: "var(--font-mono)" }}
          className="text-[11px] uppercase tracking-[0.2em] text-[#A8462C]"
        >
          Entry not found
        </p>
        <h1
          style={{ fontFamily: "var(--font-display)" }}
          className="mt-4 text-3xl font-medium text-[#241C13]"
        >
          This page has left the field
        </h1>
        <p
          style={{ fontFamily: "var(--font-body)" }}
          className="mt-3 max-w-sm text-[15px] leading-7 text-[#6B6153]"
        >
          The article you're looking for may have been moved or unpublished.
        </p>
        <Link
          href="/agri-learn"
          className="mt-7 inline-flex items-center gap-2 border-b border-[#C98A2C] pb-0.5 text-sm font-medium text-[#241C13] transition hover:gap-3"
        >
          <ArrowLeft size={14} /> Return to Agri-Learn
        </Link>
      </div>
    );
  }

  const hero = post.media?.[0];
  const author =
    post.author?.name ||
    [post.author?.firstName, post.author?.lastName].filter(Boolean).join(" ") ||
    "Remote Agric Editorial";

  return (
    <main
      className={`${fontVars} min-h-screen bg-[#F6F0E4] text-[#241C13]`}
      style={{ fontFamily: "var(--font-body)" }}
    >
      {/* Top bar */}
      <div className="border-b border-[#241C13]/10">
        <div className="mx-auto flex max-w-[1320px] items-center justify-between px-5 py-4 lg:px-10">
          <Link
            href="/agri-learn"
            className="inline-flex items-center gap-2 text-[13px] font-medium text-[#241C13]/60 transition hover:text-[#241C13]"
          >
            <ArrowLeft size={15} /> Agri-Learn
          </Link>
          <button
              onClick={() => void share()}
            className="inline-flex items-center gap-2 rounded-full border border-[#241C13]/15 px-3.5 py-1.5 text-[13px] font-medium text-[#241C13]/70 transition hover:border-[#241C13]/30 hover:text-[#241C13] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C98A2C]"
          >
            <Share2 size={14} /> Share
          </button>
        </div>
      </div>

      {/* Hero / masthead */}
      <section className="relative mx-auto max-w-[1320px] px-5 pb-14 pt-12 lg:px-10 lg:pb-20 lg:pt-16">
        <div
          className={`grid gap-10 ${hero ? "lg:grid-cols-[minmax(0,1fr)_420px]" : ""}`}
        >
          {/* Left: eyebrow, title, meta ledger */}
          <div className="relative pl-6 lg:pl-10">
            {/* rotated category tab */}
            <span
              style={{ fontFamily: "var(--font-mono)" }}
              className="absolute -left-1 top-1 origin-top-left -rotate-90 whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.25em] text-[#526B4A] lg:top-2"
            >
              {post.category}
            </span>
            <div className="absolute left-3 top-0 h-full w-px bg-[#241C13]/10 lg:left-6" />

            <h1
              style={{ fontFamily: "var(--font-display)" }}
              className="max-w-2xl text-[2.6rem] font-medium leading-[1.05] tracking-[-0.02em] text-[#241C13] md:text-[3.4rem] md:leading-[1.03]"
            >
              {post.title}
            </h1>
            <p className="mt-6 max-w-xl text-[16px] leading-8 text-[#241C13]/65">
              {post.excerpt}
            </p>

            {/* ledger meta row */}
            <dl
              style={{ fontFamily: "var(--font-mono)" }}
              className="mt-9 grid max-w-md grid-cols-3 gap-6 border-y border-[#241C13]/15 py-4 text-[11px] uppercase tracking-[0.12em] text-[#241C13]/50"
            >
              <div>
                <dt>Written by</dt>
                <dd className="mt-1.5 normal-case tracking-normal text-[13px] font-medium text-[#241C13]">
                  {author}
                </dd>
              </div>
              <div>
                <dt>Published</dt>
                <dd className="mt-1.5 normal-case tracking-normal text-[13px] font-medium text-[#241C13]">
                  {formatDate(post.publishedAt ?? post.createdAt)}
                </dd>
              </div>
              <div>
                <dt>Read time</dt>
                <dd className="mt-1.5 normal-case tracking-normal text-[13px] font-medium text-[#241C13]">
                  {readingTime} min
                </dd>
              </div>
            </dl>
          </div>

          {/* Right: pinned photograph */}
          {hero && (
            <div className="relative lg:pt-2">
              <div className="relative rotate-1 border border-[#241C13]/15 bg-white p-2 shadow-[0_18px_40px_-20px_rgba(27,20,13,0.35)] transition duration-500 hover:rotate-0">
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  {hero.type === "image" ? (
                    <Image
                      src={hero.url}
                      alt={post.title}
                      fill
                      unoptimized
                      priority
                      sizes="(min-width: 1024px) 420px, 100vw"
                      className="object-cover"
                    />
                  ) : (
                    <video
                      src={hero.url}
                      controls
                      playsInline
                      className="h-full w-full bg-[#1B140D] object-cover"
                    />
                  )}
                </div>
              </div>
              <p
                style={{ fontFamily: "var(--font-mono)" }}
                className="mt-4 text-[10px] uppercase tracking-[0.18em] text-[#241C13]/40"
              >
                Field record — Remote Agric
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Body */}
      <div className="mx-auto grid max-w-[1320px] gap-14 px-5 pb-24 lg:grid-cols-[220px_minmax(0,680px)_1fr] lg:px-10">
        {/* Ledger rail */}
        <aside className="hidden lg:block">
          <div
            className="sticky top-10 space-y-8"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#241C13]/40">
                In this piece
              </p>
              <p
                className="mt-3 border-l-2 border-[#C98A2C] pl-3 text-[13px] normal-case leading-6 tracking-normal text-[#241C13]/65"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {post.excerpt}
              </p>
            </div>
            <div className="border-t border-[#241C13]/10 pt-5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#241C13]/40">
                Share this record
              </p>
              <button
            onClick={() => void share()}
                className="mt-3 inline-flex items-center gap-2 text-[13px] normal-case tracking-normal text-[#526B4A] transition hover:text-[#241C13] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C98A2C]"
              >
                <Copy size={14} /> Copy link
              </button>
            </div>
          </div>
        </aside>

        {/* Article copy */}
        <article className="min-w-0">
          <p className="text-[19px] leading-9 text-[#241C13]/85 [text-wrap:pretty]">
            <span
              style={{ fontFamily: "var(--font-display)" }}
              className="float-left mr-3 mt-1 flex h-14 w-14 items-center justify-center rounded-full bg-[#1B140D] text-3xl font-medium leading-none text-[#F6F0E4]"
            >
              {(paragraphs[0] ?? post.content ?? "").trim().charAt(0)}
            </span>
            {(paragraphs[0] ?? post.content ?? "").trim().slice(1)}
          </p>

          <div className="mt-9 space-y-7">
            {paragraphs.slice(1).map((paragraph, index) =>
              paragraph.length < 90 && !/[.!?]$/.test(paragraph) ? (
                <h2
                  key={index}
                  style={{ fontFamily: "var(--font-display)" }}
                  className="flex items-center gap-3 pt-6 text-[1.7rem] font-medium leading-8 tracking-tight text-[#241C13]"
                >
                  <span className="h-4 w-1 shrink-0 bg-[#C98A2C]" />
                  {paragraph}
                </h2>
              ) : (
                <p
                  key={index}
                  className="text-[16px] leading-8 text-[#241C13]/80"
                >
                  {paragraph}
                </p>
              ),
            )}
          </div>

          {post.media?.slice(1).map((media, index) => (
            <figure
              key={media.publicId}
              className="my-12 border border-[#241C13]/15 bg-white p-2"
            >
              {media.type === "image" ? (
                <Image
                  src={media.url}
                  alt={`${post.title} – image ${index + 2}`}
                  width={1200}
                  height={760}
                  unoptimized
                  className="w-full object-cover"
                />
              ) : (
                <video
                  src={media.url}
                  controls
                  playsInline
                  className="w-full bg-[#1B140D]"
                />
              )}
              <figcaption
                style={{ fontFamily: "var(--font-mono)" }}
                className="px-2 pb-1 pt-3 text-[10px] uppercase tracking-[0.18em] text-[#241C13]/40"
              >
                Supporting record, field {index + 2}
              </figcaption>
            </figure>
          ))}

          {/* Footer CTA */}
          <footer className="mt-16 border border-[#1B140D] bg-[#1B140D] p-8 text-[#F6F0E4] md:p-10">
            <p
              style={{ fontFamily: "var(--font-mono)" }}
              className="text-[10px] uppercase tracking-[0.2em] text-[#C98A2C]"
            >
              Keep learning
            </p>
            <h2
              style={{ fontFamily: "var(--font-display)" }}
              className="mt-3 text-2xl font-medium leading-snug"
            >
              More field notes on sustainable, practical agriculture.
            </h2>
            <p className="mt-2 max-w-md text-[14px] leading-6 text-[#F6F0E4]/60">
              Written for farmers, investors, and anyone building in agriculture
              across Nigeria.
            </p>
            <Link
              href="/agri-learn"
              className="mt-6 inline-flex items-center gap-2 border-b border-[#C98A2C] pb-0.5 text-sm font-medium text-[#F6F0E4] transition hover:gap-3"
            >
              Browse Agri-Learn <ArrowUpRight size={16} />
            </Link>
          </footer>
        </article>

        <div className="hidden lg:block" />
      </div>
    </main>
  );
}
