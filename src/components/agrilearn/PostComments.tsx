"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { LogIn, MessageCircle, Send, Trash2 } from "lucide-react";
import { LearnComment } from "@/lib/agriLearn";
import { toast } from "react-toastify";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const displayName = (comment: LearnComment) =>
  comment.author.username
    ? `@${comment.author.username}`
    : [comment.author.firstName, comment.author.lastName].filter(Boolean).join(" ") ||
      "Remote Agric member";

const initials = (comment: LearnComment) => {
  const name = displayName(comment).replace(/^@/, "");
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const formatCommentDate = (date: string) =>
  new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));

export default function PostComments({ slug }: { slug: string }) {
  const [comments, setComments] = useState<LearnComment[]>([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [body, setBody] = useState("");
  const [loadError, setLoadError] = useState(false);

  const loadComments = () => {
    setLoading(true);
    setLoadError(false);
    axios
      .get(`${backendUrl}/api/agri-learn/${slug}/comments`, {
        withCredentials: true,
      })
      .then(({ data }) => {
        setComments(data.data.comments ?? []);
        setAuthenticated(Boolean(data.data.authenticated));
      })
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    let active = true;
    axios
      .get(`${backendUrl}/api/agri-learn/${slug}/comments`, {
        withCredentials: true,
      })
      .then(({ data }) => {
        if (!active) return;
        setComments(data.data.comments ?? []);
        setAuthenticated(Boolean(data.data.authenticated));
      })
      .catch(() => {
        if (active) setLoadError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [slug]);

  const submitComment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const commentBody = body.trim();
    if (!commentBody) return;

    setSubmitting(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/agri-learn/${slug}/comments`,
        { body: commentBody },
        { withCredentials: true },
      );
      setComments((current) => [data.data.comment, ...current]);
      setBody("");
      setAuthenticated(true);
      toast.success("Your comment has been posted");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setAuthenticated(false);
        toast.info("Please sign in to comment");
      } else {
        toast.error(
          axios.isAxiosError(error)
            ? error.response?.data?.message || "Unable to post your comment"
            : "Unable to post your comment",
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const deleteComment = async (commentId: string) => {
    if (!window.confirm("Remove this comment?")) return;
    setDeletingId(commentId);
    try {
      await axios.delete(
        `${backendUrl}/api/agri-learn/${slug}/comments/${commentId}`,
        { withCredentials: true },
      );
      setComments((current) => current.filter((comment) => comment._id !== commentId));
      toast.success("Comment removed");
    } catch {
      toast.error("Unable to remove your comment");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section id="comments" className="mt-10 scroll-mt-28 border-t border-[#e8eee7] pt-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            Join the conversation
          </p>
          <h2 className="mt-2 text-2xl font-semibold">
            Comments {comments.length > 0 && `(${comments.length})`}
          </h2>
        </div>
        <MessageCircle className="text-primary/40" size={30} aria-hidden />
      </div>

      {!loading && authenticated ? (
        <form onSubmit={submitComment} className="mt-6 rounded-xl bg-[#f6f8f6] p-4 sm:p-5">
          <label htmlFor="post-comment" className="mb-2 block text-sm font-medium">
            Add your comment
          </label>
          <textarea
            id="post-comment"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            maxLength={1500}
            rows={4}
            placeholder="Share your thoughts or experience…"
            className="w-full resize-y rounded-xl border border-[#dfe7dc] bg-white px-4 py-3 text-sm leading-6 outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="mt-3 flex items-center justify-between gap-4">
            <span className="text-xs text-[#6b7766]">{body.length}/1500</span>
            <button
              type="submit"
              disabled={submitting || !body.trim()}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send size={15} />
              {submitting ? "Posting…" : "Post comment"}
            </button>
          </div>
        </form>
      ) : !loading ? (
        <div className="mt-6 flex flex-col items-start gap-4 rounded-xl bg-[#f6f8f6] p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-6 text-[#52604c]">Sign in to share your thoughts on this post.</p>
          <Link href="/login" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white">
            <LogIn size={15} /> Sign in to comment
          </Link>
        </div>
      ) : null}

      <div className="mt-8">
        {loading ? (
          <div className="flex justify-center py-10">
            <span className="h-7 w-7 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
          </div>
        ) : loadError ? (
          <div className="rounded-xl border border-[#dfe7dc] p-6 text-center">
            <p className="text-sm text-[#52604c]">Comments could not be loaded.</p>
            <button onClick={loadComments} className="mt-3 text-sm font-medium text-primary underline underline-offset-4">Try again</button>
          </div>
        ) : comments.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#cbd8c6] px-5 py-9 text-center">
            <p className="font-medium">No comments yet</p>
            <p className="mt-2 text-sm text-[#52604c]">Be the first to join the conversation.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#e8eee7]">
            {comments.map((comment) => (
              <article key={comment._id} className="flex gap-4 py-6 first:pt-0">
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#e5eee1] text-xs font-semibold text-primary">
                  {comment.author.profilePhoto?.url ? (
                    <Image src={comment.author.profilePhoto.url} alt="" fill unoptimized sizes="40px" className="object-cover" />
                  ) : initials(comment)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-sm font-semibold">{displayName(comment)}</h3>
                    <div className="flex items-center gap-3">
                      <time className="text-xs text-[#778271]" dateTime={comment.createdAt}>{formatCommentDate(comment.createdAt)}</time>
                      {comment.isMine && (
                        <button
                          type="button"
                          onClick={() => deleteComment(comment._id)}
                          disabled={deletingId === comment._id}
                          aria-label="Delete your comment"
                          className="text-[#778271] transition hover:text-red-600 disabled:opacity-50"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="mt-2 whitespace-pre-line break-words text-[15px] leading-7 text-[#3d4b36]">{comment.body}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
