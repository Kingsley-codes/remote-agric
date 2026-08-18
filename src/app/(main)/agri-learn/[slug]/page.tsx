"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Share2, Video } from "lucide-react";
import {
  getBodyMedia,
  getHeroImage,
  getYouTubeEmbedUrl,
  getYouTubeThumbnail,
  LearnPost,
} from "@/lib/agriLearn";
import { toast } from "react-toastify";

const formatDate = (date?: string) =>
  date
    ? new Intl.DateTimeFormat("en-NG", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(date))
    : "Recently published";
const readTime = (content?: string) =>
  Math.max(1, Math.ceil((content?.trim().split(/\s+/).length ?? 0) / 220));
const postLabel = (post: LearnPost) =>
  post.postType === "podcast" ? "Podcast" : `${readTime(post.content)} min read`;

export default function BlogDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<LearnPost | null>(null);
  const [related, setRelated] = useState<LearnPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/agri-learn/${slug}`)
      .then(({ data }) => {
        setPost(data.data.post);
        setRelated(data.data.relatedPosts ?? []);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const paragraphs = useMemo(
    () => post?.content?.split(/\n\s*\n/).map((text) => text.trim()).filter(Boolean) ?? [],
    [post?.content],
  );

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#f6f8f6]">
        <span className="h-9 w-9 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[#f6f8f6] px-5 text-center">
        <h1 className="text-2xl font-medium">Post not found</h1>
        <Link href="/agri-learn" className="mt-5 inline-flex items-center gap-2 text-sm text-primary">
          <ArrowLeft size={16} />
          Back to Agri-Learn
        </Link>
      </div>
    );
  }

  const hero = getHeroImage(post);
  const thumbnail = getYouTubeThumbnail(post.videoUrl);
  const bodyMedia = getBodyMedia(post);
  const embedUrl = getYouTubeEmbedUrl(post.videoUrl);
  const mediaPosition = Math.max(1, Math.ceil(paragraphs.length / 2));
  const share = () =>
    navigator.clipboard.writeText(window.location.href).then(() => toast.success("Post link copied"));

  return (
    <main className="min-h-screen bg-[#f6f8f6] text-[#0f1a0b]">
      <article>
        <header className="relative min-h-[520px] overflow-hidden bg-[#244808] sm:min-h-[600px]">
          {hero?.type === "image" ? (
            <Image
              src={hero.url}
              alt={post.title}
              fill
              unoptimized
              priority
              sizes="100vw"
              className="object-cover"
            />
          ) : thumbnail ? (
            <img src={thumbnail} alt={post.title} className="absolute inset-0 h-full w-full object-cover" />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/20" />
          <div className="relative z-10 mx-auto flex min-h-[520px] max-w-6xl flex-col justify-between px-5 py-7 sm:min-h-[600px] sm:px-8 sm:py-10">
            <div className="flex items-center justify-between gap-4">
              <Link
                href="/agri-learn"
                className="inline-flex items-center gap-2 rounded-full bg-black/30 px-4 py-2 text-sm text-white backdrop-blur-md transition hover:bg-black/45"
              >
                <ArrowLeft size={16} />
                Back to Agri-Learn
              </Link>
              <button
                onClick={share}
                className="inline-flex items-center gap-2 rounded-full bg-black/30 px-4 py-2 text-sm text-white backdrop-blur-md transition hover:bg-black/45"
                aria-label="Copy post link"
              >
                <Share2 size={16} />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>
            <div className="max-w-4xl pb-4 sm:pb-8">
              <span className="inline-flex rounded-full bg-primary px-3 py-1.5 text-xs uppercase tracking-[0.16em] text-white">
                {post.category}
              </span>
              <h1 className="mt-5 text-3xl font-medium leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
                {post.title}
              </h1>
              <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-white/80">
                <span>By Remote Agric team</span>
                <span aria-hidden>/</span>
                <time>{formatDate(post.publishedAt ?? post.createdAt)}</time>
                <span aria-hidden>/</span>
                <span>{postLabel(post)}</span>
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 lg:py-16">
          <p className="mb-9 text-xl leading-9 text-[#3d4b36]">{post.excerpt}</p>

          {post.postType === "podcast" ? (
            embedUrl ? (
              <div className="overflow-hidden rounded-2xl bg-[#0f1a0b] shadow-[0_8px_30px_rgba(15,26,11,0.12)]">
                <iframe
                  src={embedUrl}
                  title={post.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="aspect-video w-full"
                />
              </div>
            ) : (
              <div className="rounded-2xl bg-white px-6 py-12 text-center">
                <Video className="mx-auto text-primary/50" size={32} />
                <p className="mt-3 text-sm text-[#3d4b36]">This video is currently unavailable.</p>
              </div>
            )
          ) : (
            <div className="space-y-7 text-[17px] leading-8 text-[#263322]">
              {paragraphs.map((paragraph, index) => (
                <div key={index}>
                  <p>{paragraph}</p>
                  {bodyMedia && index + 1 === mediaPosition && (
                    <figure className="my-10 overflow-hidden rounded-2xl bg-[#e0e8df]">
                      {bodyMedia.type === "image" ? (
                        <Image
                          src={bodyMedia.url}
                          alt={`Supporting visual for ${post.title}`}
                          width={1400}
                          height={900}
                          unoptimized
                          className="h-auto w-full object-cover"
                        />
                      ) : (
                        <video src={bodyMedia.url} controls playsInline className="w-full" />
                      )}
                      <figcaption className="px-5 py-3 text-xs text-[#3d4b36]/70">
                        Supporting media - Remote Agric
                      </figcaption>
                    </figure>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </article>

      {related.length > 0 && (
        <section className="bg-[#e8eee7] px-5 py-14 sm:px-8 lg:py-16">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-end justify-between gap-5">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-primary">Keep exploring</p>
                <h2 className="mt-2 text-2xl font-medium">Related posts</h2>
              </div>
              <Link href="/agri-learn" className="hidden items-center gap-2 text-sm text-primary sm:inline-flex">
                View all
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {related.map((item) => {
                const cover = getHeroImage(item);
                const itemThumbnail = getYouTubeThumbnail(item.videoUrl);
                return (
                  <Link
                    key={item._id}
                    href={`/agri-learn/${item.slug}`}
                    className="group overflow-hidden rounded-2xl bg-white"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-[#d8e2d7]">
                      {cover?.type === "image" ? (
                        <Image
                          src={cover.url}
                          alt={item.title}
                          fill
                          unoptimized
                          sizes="(min-width: 768px) 33vw, 100vw"
                          className="object-cover transition duration-500 group-hover:scale-[1.03]"
                        />
                      ) : itemThumbnail ? (
                        <img src={itemThumbnail} alt={item.title} className="h-full w-full object-cover" />
                      ) : null}
                    </div>
                    <div className="p-5">
                      <p className="text-xs uppercase tracking-[0.12em] text-primary">{item.category}</p>
                      <h3 className="mt-2 text-lg font-medium leading-snug">{item.title}</h3>
                      <span className="mt-4 inline-flex items-center gap-2 text-sm text-[#3d4b36]">
                        {item.postType === "podcast" ? "Watch episode" : "Read article"}
                        <ArrowRight size={15} className="transition group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
