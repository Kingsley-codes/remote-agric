"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, PlayCircle } from "lucide-react";
import { getYouTubeThumbnail, LearnPost } from "@/lib/agriLearn";

export default function FeaturedPosts() {
  const [posts, setPosts] = useState<LearnPost[]>([]);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/agri-learn`, {
        params: { postType: "podcast", limit: 3 },
      })
      .then(({ data }) => setPosts(data.data.posts ?? []))
      .catch(() => setPosts([]));
  }, []);

  if (posts.length === 0) return null;

  return (
    <section className="bg-[#f6f8f6] px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-primary">Featured posts</p>
            <h2 className="mt-3 text-3xl font-medium tracking-tight text-[#0f1a0b]">
              Latest Agri-Learn videos
            </h2>
          </div>
          <Link
            href="/agri-learn?type=podcast"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary"
          >
            View more posts
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-9 grid gap-6 md:grid-cols-3">
          {posts.map((post) => {
            const thumbnail = getYouTubeThumbnail(post.videoUrl);
            return (
              <Link
                key={post._id}
                href={`/agri-learn/${post.slug}`}
                className="group overflow-hidden rounded-2xl bg-white shadow-[0_5px_24px_rgba(15,26,11,0.05)] transition hover:-translate-y-1"
              >
                <div className="relative aspect-video overflow-hidden bg-[#dfe8dd]">
                  {thumbnail ? (
                    <img
                      src={thumbnail}
                      alt={post.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                  ) : null}
                  <span className="absolute inset-0 flex items-center justify-center bg-black/15 text-white transition group-hover:bg-black/25">
                    <PlayCircle size={46} strokeWidth={1.8} />
                  </span>
                </div>
                <div className="p-6">
                  <p className="text-xs uppercase tracking-[0.14em] text-primary">{post.category}</p>
                  <h3 className="mt-3 line-clamp-2 text-xl font-medium leading-snug text-[#0f1a0b]">
                    {post.title}
                  </h3>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#3d4b36]">{post.excerpt}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
