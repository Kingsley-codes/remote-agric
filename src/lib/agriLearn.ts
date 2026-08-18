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
  heroImage?: LearnMedia;
  bodyMedia?: LearnMedia;
  /** Legacy media, used only for articles published before the media update. */
  media?: LearnMedia[];
  status: "draft" | "published";
  publishedAt?: string;
  createdAt: string;
}

export const getHeroImage = (post: LearnPost) => post.heroImage ?? post.media?.[0];
export const getBodyMedia = (post: LearnPost) => post.bodyMedia ?? post.media?.[1];

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
