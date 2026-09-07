export interface LearnMedia {
  type: "image" | "video";
  url: string;
  publicId: string;
}
export interface LearnPost {
  _id: string;
  title: string;
  slug: string;
  postType?: "blog" | "podcast";
  excerpt: string;
  content?: string;
  videoUrl?: string;
  category: string;
  tags?: string[];
  heroImage?: LearnMedia;
  bodyMedia?: LearnMedia;
  /** Legacy media, used only for articles published before the media update. */
  media?: LearnMedia[];
  status: "draft" | "published";
  publishedAt?: string;
  createdAt: string;
}

export interface LearnCommentAuthor {
  _id: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  profilePhoto?: {
    url?: string;
  };
}

export interface LearnComment {
  _id: string;
  post: string;
  author: LearnCommentAuthor;
  body: string;
  isMine?: boolean;
  createdAt: string;
  updatedAt: string;
}

export const getHeroImage = (post: LearnPost) => post.heroImage ?? post.media?.[0];
export const getBodyMedia = (post: LearnPost) => post.bodyMedia ?? post.media?.[1];

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

/** Converts legacy plain-text articles to the HTML format used by the editor. */
export const articleContentToHtml = (content?: string) => {
  const value = content?.trim() ?? "";
  if (!value) return "";
  if (/<\/?(?:p|h[1-6]|ul|ol|li|blockquote|pre|hr)\b/i.test(value)) return value;
  return value
    .split(/\n\s*\n/)
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph.trim()).replaceAll("\n", "<br>")}</p>`)
    .join("");
};

export const articleContentToText = (content?: string) =>
  (content ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();

export const getYouTubeId = (url?: string) => {
  if (!url) return undefined;
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    if (host === "youtu.be") return parsed.pathname.split("/").filter(Boolean)[0];
    if (host.endsWith("youtube.com") || host === "youtube-nocookie.com") {
      if (parsed.pathname.startsWith("/shorts/") || parsed.pathname.startsWith("/embed/")) {
        return parsed.pathname.split("/").filter(Boolean)[1];
      }
      return parsed.searchParams.get("v") ?? undefined;
    }
  } catch {
    return undefined;
  }
  return undefined;
};

export const getYouTubeEmbedUrl = (url?: string) => {
  const id = getYouTubeId(url);
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : undefined;
};

export const getYouTubeThumbnail = (url?: string) => {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : undefined;
};
