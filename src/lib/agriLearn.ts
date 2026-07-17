export interface LearnMedia {
  type: "image" | "video";
  url: string;
  publicId: string;
}
export interface LearnPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
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
