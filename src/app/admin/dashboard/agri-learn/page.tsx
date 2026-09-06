"use client";

import axios from "axios";
import Image from "next/image";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  FileImage,
  Loader2,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Tags,
  Trash2,
  UploadCloud,
  Video,
  X,
} from "lucide-react";
import { getBodyMedia, getHeroImage, getYouTubeThumbnail, LearnPost } from "@/lib/agriLearn";
import { toast } from "react-toastify";

const API = process.env.NEXT_PUBLIC_BACKEND_URL;
const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));

export default function ManageLearn() {
  const [posts, setPosts] = useState<LearnPost[]>([]);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [postType, setPostType] = useState<"blog" | "podcast">("blog");
  const [heroFile, setHeroFile] = useState<File>();
  const [bodyFile, setBodyFile] = useState<File>();
  const [tagEditor, setTagEditor] = useState<LearnPost | null>(null);
  const [tagDraft, setTagDraft] = useState("");
  const [tagSaving, setTagSaving] = useState(false);
  const [editingPost, setEditingPost] = useState<LearnPost | null>(null);
  const [heroPreview, setHeroPreview] = useState<string>();
  const [bodyPreview, setBodyPreview] = useState<string>();
  const heroPreviewRef = useRef<string>();
  const bodyPreviewRef = useRef<string>();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(
    () => () => {
      if (heroPreviewRef.current) URL.revokeObjectURL(heroPreviewRef.current);
      if (bodyPreviewRef.current) URL.revokeObjectURL(bodyPreviewRef.current);
    },
    [],
  );

  const load = useCallback(async () => {
    const response = await axios.get(`${API}/api/admin/agri-learn`, {
      withCredentials: true,
    });
    setPosts(response.data.data.posts);
  }, []);

  useEffect(() => {
    axios
      .get(`${API}/api/admin/agri-learn`, { withCredentials: true })
      .then((response) => setPosts(response.data.data.posts));
  }, []);

  function resetForm() {
    if (heroPreviewRef.current) URL.revokeObjectURL(heroPreviewRef.current);
    if (bodyPreviewRef.current) URL.revokeObjectURL(bodyPreviewRef.current);
    heroPreviewRef.current = undefined;
    bodyPreviewRef.current = undefined;
    setHeroPreview(undefined);
    setBodyPreview(undefined);
    setPostType("blog");
    setHeroFile(undefined);
    setBodyFile(undefined);
    setEditingPost(null);
    formRef.current?.reset();
  }

  function createNewPost() {
    resetForm();
    setOpen(true);
  }

  function editPost(post: LearnPost) {
    setEditingPost(post);
    setPostType(post.postType ?? "blog");
    setHeroFile(undefined);
    setBodyFile(undefined);
    setOpen(true);
  }

  function close() {
    if (saving) return;
    setOpen(false);
    resetForm();
  }

  function selectHeroImage(file?: File) {
    if (heroPreviewRef.current) URL.revokeObjectURL(heroPreviewRef.current);
    const preview = file ? URL.createObjectURL(file) : undefined;
    heroPreviewRef.current = preview;
    setHeroPreview(preview);
    setHeroFile(file);
  }

  function selectBodyMedia(file?: File) {
    if (bodyPreviewRef.current) URL.revokeObjectURL(bodyPreviewRef.current);
    const preview = file?.type.startsWith("image/")
      ? URL.createObjectURL(file)
      : undefined;
    bodyPreviewRef.current = preview;
    setBodyPreview(preview);
    setBodyFile(file);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    const form = new FormData(event.currentTarget);
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const status: "draft" | "published" = submitter?.value === "draft" ? "draft" : "published";
    form.set("status", status);
    form.set("postType", postType);

    try {
      if (editingPost) {
        await axios.patch(`${API}/api/admin/agri-learn/${editingPost._id}`, form, { withCredentials: true });
      } else {
        await axios.post(`${API}/api/admin/agri-learn`, form, { withCredentials: true });
      }
      toast.success(status === "published" ? (editingPost ? "Post updated and published" : "Post published") : (editingPost ? "Draft updated" : "Draft saved"));
      setOpen(false);
      resetForm();
      await load();
    } catch (error) {
      toast.error(
        axios.isAxiosError(error)
          ? error.response?.data?.message ?? "Unable to save post"
          : "Unable to save post",
      );
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this post permanently?")) return;
    await axios.delete(`${API}/api/admin/agri-learn/${id}`, { withCredentials: true });
    toast.success("Post deleted");
    await load();
  }

  function editTags(post: LearnPost) {
    setTagEditor(post);
    setTagDraft((post.tags ?? []).join(", "));
  }

  async function saveTags(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!tagEditor) return;
    setTagSaving(true);
    try {
      await axios.patch(
        `${API}/api/admin/agri-learn/${tagEditor._id}`,
        { tags: tagDraft },
        { withCredentials: true },
      );
      toast.success("Post tags updated");
      setTagEditor(null);
      await load();
    } catch (error) {
      toast.error(
        axios.isAxiosError(error)
          ? error.response?.data?.message ?? "Unable to update tags"
          : "Unable to update tags",
      );
    } finally {
      setTagSaving(false);
    }
  }

  const filtered = posts.filter((post) =>
    `${post.title} ${post.category} ${(post.tags ?? []).join(" ")} ${post.postType ?? "blog"}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  const currentHero = editingPost ? getHeroImage(editingPost) : undefined;
  const currentBodyMedia = editingPost ? getBodyMedia(editingPost) : undefined;
  const heroPreviewUrl =
    heroPreview ?? (currentHero?.type === "image" ? currentHero.url : undefined);
  const bodyPreviewUrl =
    bodyPreview ??
    (!bodyFile && currentBodyMedia?.type === "image"
      ? currentBodyMedia.url
      : undefined);

  return (
    <section className="min-h-full bg-slate-50 p-6 lg:p-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-primary">
              Content management
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
              Agri-Learn
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Create and manage educational stories for the Remote Agric community.
            </p>
          </div>
          <button
            onClick={createNewPost}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-primary-dark"
          >
            <Plus size={17} />
            Create post
          </button>
        </header>

        <div className="mt-8 rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/5">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-medium text-slate-800">Content library</h2>
              <p className="mt-1 text-xs text-slate-400">
                {posts.length} post{posts.length === 1 ? "" : "s"} in your library
              </p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={17} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search posts"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-primary focus:bg-white sm:w-64"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="px-6 py-20 text-center">
              <BookOpen className="mx-auto text-slate-300" size={32} />
              <h3 className="mt-4 text-base font-medium text-slate-700">
                {posts.length ? "No matching posts" : "Create your first post"}
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                {posts.length ? "Try a different search term." : "Share practical knowledge with your users."}
              </p>
            </div>
          ) : (
            <div>
              <div className="hidden grid-cols-[72px_1fr_90px_110px_100px_140px_50px] items-center gap-4 border-b border-slate-100 bg-slate-50/80 px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 md:grid">
                <span>Preview</span>
                <span>Post</span>
                <span>Type</span>
                <span>Category</span>
                <span>Status</span>
                <span>Published</span>
                <span className="sr-only">Actions</span>
              </div>
              <div className="divide-y divide-slate-100">
              {filtered.map((post) => {
                const cover = getHeroImage(post);
                const thumbnail = getYouTubeThumbnail(post.videoUrl);
                return (
                  <div
                    key={post._id}
                    className="grid items-center gap-4 p-5 transition hover:bg-slate-50/70 md:grid-cols-[72px_1fr_90px_110px_100px_140px_50px]"
                  >
                    <div className="h-14 w-[72px] overflow-hidden rounded-lg bg-[#e9f0e7]">
                      {cover?.type === "image" ? (
                        <Image
                          src={cover.url}
                          alt=""
                          width={144}
                          height={112}
                          unoptimized
                          className="h-full w-full object-cover"
                        />
                      ) : thumbnail ? (
                        <Image src={thumbnail} alt="" width={144} height={112} unoptimized className="h-full w-full object-cover" />
                      ) : (
                        <span className="flex h-full items-center justify-center text-primary">
                          {post.postType === "podcast" ? <Video size={20} /> : <BookOpen size={20} />}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-800">{post.title}</p>
                      <p className="mt-1 line-clamp-1 text-xs text-slate-400">{post.excerpt}</p>
                      {post.tags && post.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {post.tags.slice(0, 4).map((tag) => (
                            <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500"># {tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="w-fit rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium capitalize text-slate-600">
                      {post.postType ?? "blog"}
                    </span>
                    <span className="w-fit rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-primary">
                      {post.category}
                    </span>
                    <span className={`w-fit rounded-full px-2.5 py-1 text-xs font-medium capitalize ${post.status === "published" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
                      {post.status}
                    </span>
                    <span className="flex items-center gap-2 text-xs text-slate-400">
                      <CalendarDays size={14} />
                      {post.publishedAt ? formatDate(post.publishedAt) : "Not published"}
                    </span>
                    <div className="relative group">
                      <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                        <MoreHorizontal size={18} />
                      </button>
                      <div className="invisible absolute right-0 top-9 z-10 w-36 rounded-lg bg-white p-1 opacity-0 shadow-lg ring-1 ring-slate-900/10 transition group-focus-within:visible group-focus-within:opacity-100">
                        <button
                          onClick={() => editPost(post)}
                          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50"
                        >
                          <Pencil size={14} />
                          Edit post
                        </button>
                        <button
                          onClick={() => editTags(post)}
                          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50"
                        >
                          <Tags size={14} />
                          Edit tags
                        </button>
                        <button
                          onClick={() => remove(post._id)}
                          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              </div>
            </div>
          )}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[70] overflow-y-auto bg-slate-950/45 px-4 py-6 backdrop-blur-sm">
          <div className="flex min-h-full items-center justify-center">
            <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
              <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    {editingPost ? "Edit Agri-Learn post" : "Create an Agri-Learn post"}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {editingPost ? "Correct the post, change its format, or update its publication status." : "Add a clear title, useful summary and the right content format."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={close}
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Close"
                >
                  <X size={19} />
                </button>
              </div>

              <form
                key={editingPost?._id ?? "new-post"}
                ref={formRef}
                onSubmit={submit}
                className="max-h-[calc(100vh-150px)] overflow-y-auto"
              >
                <div className="space-y-7 px-6 py-6">
                  <fieldset>
                    <legend className="text-sm font-medium text-slate-800">Post details</legend>
                    <p className="mt-1 text-xs text-slate-400">
                      This information appears on the Agri-Learn listing page.
                    </p>
                    <div className="mt-4 space-y-4">
                      <div className="grid gap-3 sm:grid-cols-2">
                        {(["blog", "podcast"] as const).map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setPostType(type)}
                            className={`rounded-lg border px-4 py-3 text-left transition ${
                              postType === type
                                ? "border-primary bg-green-50 text-primary"
                                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            <span className="flex items-center gap-2 text-sm font-medium">
                              {type === "blog" ? <BookOpen size={16} /> : <Video size={16} />}
                              {type === "blog" ? "Blog" : "Podcast"}
                            </span>
                            <span className="mt-1 block text-xs text-slate-400">
                              {type === "blog"
                                ? "Full article with image media."
                                : "Summary plus YouTube video link."}
                            </span>
                          </button>
                        ))}
                      </div>

                      <label className="block">
                        <span className="text-sm text-slate-600">Title</span>
                        <input
                          name="title"
                          defaultValue={editingPost?.title}
                          required
                          maxLength={180}
                          placeholder="e.g. Preparing maize fields for the rainy season"
                          className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                        />
                      </label>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <label>
                          <span className="text-sm text-slate-600">Category</span>
                          <input
                            name="category"
                            defaultValue={editingPost?.category}
                            required
                            placeholder="Farming guide"
                            className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                          />
                        </label>
                        <label>
                          <span className="text-sm text-slate-600">Short introduction</span>
                          <span className="mt-1.5 block rounded-lg bg-slate-50 px-3.5 py-2.5 text-xs leading-5 text-slate-400">
                            Keep the summary concise and inviting.
                          </span>
                        </label>
                      </div>

                      <label className="block">
                        <span className="text-sm text-slate-600">Summary</span>
                        <textarea
                          name="excerpt"
                          defaultValue={editingPost?.excerpt}
                          required
                          rows={3}
                          maxLength={320}
                          placeholder="A short overview that helps readers understand what they will learn."
                          className="mt-1.5 w-full resize-none rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm leading-6 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                        />
                      </label>

                      <label className="block">
                        <span className="text-sm text-slate-600">Tags</span>
                        <input
                          name="tags"
                          defaultValue={(editingPost?.tags ?? []).join(", ")}
                          placeholder="maize, marketing, farm management"
                          className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                        />
                        <span className="mt-1.5 block text-xs text-slate-400">Separate tags with commas. Add up to 10 tags.</span>
                      </label>
                    </div>
                  </fieldset>

                  {postType === "blog" ? (
                    <>
                      <fieldset className="border-t border-slate-100 pt-6">
                        <legend className="text-sm font-medium text-slate-800">Article body</legend>
                        <p className="mt-1 text-xs text-slate-400">
                          Use short paragraphs and clear spacing to make the article easy to read.
                        </p>
                        <textarea
                          name="content"
                          defaultValue={editingPost?.content}
                          required
                          rows={11}
                          placeholder="Write the full article here..."
                          className="mt-4 w-full resize-y rounded-lg border border-slate-200 px-4 py-3 text-sm leading-7 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                        />
                      </fieldset>

                      <fieldset className="border-t border-slate-100 pt-6">
                        <legend className="text-sm font-medium text-slate-800">Media</legend>
                        <p className="mt-1 text-xs text-slate-400">
                          Every article needs one hero image. You may also add one image or video inside the article body.
                        </p>
                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-7 text-center transition hover:border-primary hover:bg-green-50/40">
                            {heroPreviewUrl ? (
                              <span className="relative h-32 w-full overflow-hidden rounded-lg bg-slate-100">
                                <Image
                                  src={heroPreviewUrl}
                                  alt="Hero image preview"
                                  fill
                                  unoptimized
                                  className="object-cover"
                                />
                                <span className="absolute bottom-2 left-2 rounded-md bg-slate-950/70 px-2 py-1 text-[10px] font-medium text-white">
                                  {heroFile ? "New image selected" : "Current image"}
                                </span>
                              </span>
                            ) : (
                              <UploadCloud className="text-primary" size={25} />
                            )}
                            <span className="mt-3 text-sm font-medium text-slate-700">Hero image *</span>
                            <span className="mt-1 max-w-full truncate text-xs text-slate-400">
                              {heroFile?.name ?? (editingPost && getHeroImage(editingPost) ? "Keep current image" : "JPG, PNG or WEBP")}
                            </span>
                            <input
                              name="heroImage"
                              required={!editingPost || !getHeroImage(editingPost)}
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              className="hidden"
                              onChange={(event) => selectHeroImage(event.target.files?.[0])}
                            />
                          </label>
                          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-7 text-center transition hover:border-primary hover:bg-green-50/40">
                            {bodyPreviewUrl ? (
                              <span className="relative h-32 w-full overflow-hidden rounded-lg bg-slate-100">
                                <Image
                                  src={bodyPreviewUrl}
                                  alt="Body image preview"
                                  fill
                                  unoptimized
                                  className="object-cover"
                                />
                                <span className="absolute bottom-2 left-2 rounded-md bg-slate-950/70 px-2 py-1 text-[10px] font-medium text-white">
                                  {bodyFile ? "New image selected" : "Current image"}
                                </span>
                              </span>
                            ) : bodyFile?.type.startsWith("video/") ||
                              (!bodyFile && currentBodyMedia?.type === "video") ? (
                              <Video className="text-primary" size={25} />
                            ) : (
                              <FileImage className="text-primary" size={25} />
                            )}
                            <span className="mt-3 text-sm font-medium text-slate-700">Body media (optional)</span>
                            <span className="mt-1 max-w-full truncate text-xs text-slate-400">
                              {bodyFile?.name ?? (editingPost && getBodyMedia(editingPost) ? "Keep current media" : "One image or video")}
                            </span>
                            <input
                              name="bodyMedia"
                              type="file"
                              accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
                              className="hidden"
                              onChange={(event) => selectBodyMedia(event.target.files?.[0])}
                            />
                          </label>
                        </div>
                      </fieldset>
                    </>
                  ) : (
                    <fieldset className="border-t border-slate-100 pt-6">
                      <legend className="text-sm font-medium text-slate-800">Podcast video</legend>
                      <p className="mt-1 text-xs text-slate-400">
                        Paste a public YouTube link. Users will watch it inside Agri-Learn.
                      </p>
                      <label className="mt-4 block">
                        <span className="text-sm text-slate-600">YouTube video link</span>
                        <input
                          name="videoUrl"
                          defaultValue={editingPost?.videoUrl}
                          required
                          type="url"
                          placeholder="https://www.youtube.com/watch?v=..."
                          className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                        />
                      </label>
                    </fieldset>
                  )}
                </div>

                <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-slate-100 bg-white px-6 py-4 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={close}
                    className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    value="draft"
                    disabled={saving}
                    className="rounded-lg border border-primary px-4 py-2.5 text-sm font-medium text-primary hover:bg-green-50"
                  >
                    {editingPost ? "Save draft" : "Save as draft"}
                  </button>
                  <button
                    type="submit"
                    value="published"
                    disabled={saving}
                    className="inline-flex min-w-32 items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50"
                  >
                    {saving ? <Loader2 size={17} className="animate-spin" /> : editingPost ? "Save & publish" : "Publish post"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {tagEditor && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm">
          <form onSubmit={saveTags} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-primary">Organize content</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-900">Edit post tags</h2>
                <p className="mt-1 line-clamp-1 text-sm text-slate-500">{tagEditor.title}</p>
              </div>
              <button type="button" onClick={() => setTagEditor(null)} disabled={tagSaving} aria-label="Close" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X size={18} /></button>
            </div>
            <label className="mt-6 block">
              <span className="text-sm text-slate-600">Tags</span>
              <input autoFocus value={tagDraft} onChange={(event) => setTagDraft(event.target.value)} placeholder="maize, marketing, farm management" className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />
              <span className="mt-2 block text-xs leading-5 text-slate-400">Separate tags with commas. Tags are saved in lowercase, with a maximum of 10.</span>
            </label>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setTagEditor(null)} disabled={tagSaving} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
              <button disabled={tagSaving} className="inline-flex min-w-28 items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50">{tagSaving ? <Loader2 size={17} className="animate-spin" /> : "Save tags"}</button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
