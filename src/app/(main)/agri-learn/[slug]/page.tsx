"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Copy,
  Loader2,
  Share2,
  BookOpen,
  User,
  Tag,
  ChevronRight,
} from "lucide-react";
import { LearnPost } from "@/lib/agriLearn";
import { toast } from "react-toastify";

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

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Article link copied to clipboard");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-emerald-700" />
          <p className="mt-3 text-sm text-gray-500">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center">
        <div className="rounded-2xl bg-gray-50 p-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h1 className="mt-4 text-2xl font-medium text-gray-900">
            Article not found
          </h1>
          <p className="mt-2 text-gray-500">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/agri-learn"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-800"
          >
            Return to Agri-Learn
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  const hero = post.media?.[0];
  const author =
    post.author?.name ||
    [post.author?.firstName, post.author?.lastName].filter(Boolean).join(" ") ||
    "Remote Agric Editorial";

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 lg:px-8">
          <Link
            href="/agri-learn"
            className="inline-flex items-center gap-2 text-sm text-gray-600 transition hover:text-emerald-700"
          >
            <ArrowLeft size={16} />
            Back to Agri-Learn
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-gray-600 transition hover:bg-gray-100"
            >
              <Share2 size={16} />
              Share
            </button>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 transition hover:bg-gray-50"
            >
              <Copy size={16} />
              Copy link
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="border-b border-gray-100 bg-linear-to-b from-emerald-50/50 to-white">
        <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:gap-12">
            {/* Content */}
            <div className="flex flex-col justify-center order-2 lg:order-1">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
                  <Tag size={12} />
                  {post.category}
                </span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500">
                  {readingTime} min read
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
                {post.title}
              </h1>

              <p className="mt-4 text-base leading-relaxed text-gray-600 sm:text-lg">
                {post.excerpt}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-gray-100 pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                    <User size={18} className="text-emerald-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {author}
                    </p>
                    <p className="text-xs text-gray-500">Author</p>
                  </div>
                </div>
                <span className="hidden h-6 w-px bg-gray-200 sm:block" />
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays size={14} />
                    {formatDate(post.publishedAt ?? post.createdAt)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock3 size={14} />
                    {readingTime} min read
                  </span>
                </div>
              </div>
            </div>

            {/* Media */}
            {hero && (
              <div className="order-1 lg:order-2">
                <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-gray-100">
                  {hero.type === "image" ? (
                    <Image
                      src={hero.url}
                      alt={post.title}
                      fill
                      unoptimized
                      priority
                      className="object-cover transition duration-300 hover:scale-105"
                    />
                  ) : (
                    <video
                      src={hero.url}
                      controls
                      playsInline
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="mx-auto max-w-3xl px-5 py-12 lg:px-8 lg:py-16">
        <div className="prose prose-lg prose-emerald max-w-none">
          {/* First paragraph with drop cap */}
          {paragraphs[0] && (
            <p className="text-lg leading-relaxed text-gray-700 first-letter:float-left first-letter:mr-3 first-letter:text-6xl first-letter:font-bold first-letter:text-emerald-700 first-letter:leading-[0.8]">
              {paragraphs[0]}
            </p>
          )}

          {/* Remaining content */}
          <div className="mt-8 space-y-6">
            {paragraphs.slice(1).map((paragraph, index) => {
              // Check if paragraph looks like a heading (short, no ending punctuation)
              const isHeading =
                paragraph.length < 80 && !/[.!?]$/.test(paragraph);

              if (isHeading) {
                return (
                  <h2
                    key={index}
                    className="mt-10 text-2xl font-bold tracking-tight text-gray-900 first:mt-0"
                  >
                    {paragraph}
                  </h2>
                );
              }

              return (
                <p
                  key={index}
                  className="text-lg leading-relaxed text-gray-700"
                >
                  {paragraph}
                </p>
              );
            })}
          </div>
        </div>

        {/* Additional Media */}
        {post.media?.slice(1).map((media, index) => (
          <figure
            key={media.publicId}
            className="mt-12 overflow-hidden rounded-2xl bg-gray-50"
          >
            <div className="relative aspect-video">
              {media.type === "image" ? (
                <Image
                  src={media.url}
                  alt={`${post.title} – image ${index + 2}`}
                  fill
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <video
                  src={media.url}
                  controls
                  playsInline
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <figcaption className="px-6 py-3 text-sm text-gray-500">
              Supporting media for this article
            </figcaption>
          </figure>
        ))}

        {/* Article Footer / CTA */}
        <div className="mt-16 rounded-2xl bg-linear-to-br from-emerald-50 to-emerald-100/50 p-8">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Continue learning with Agri-Learn
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Explore more articles, guides, and insights for modern
                agriculture.
              </p>
            </div>
            <Link
              href="/agri-learn"
              className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-emerald-700 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-800"
            >
              Browse all articles
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>

        {/* Share Section Mobile */}
        <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6 lg:hidden">
          <p className="text-sm text-gray-500">Share this article</p>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <Copy size={16} />
            Copy link
          </button>
        </div>
      </div>
    </main>
  );
}
