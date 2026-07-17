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
  media: LearnMedia[];
  status: "draft" | "published";
  publishedAt?: string;
  createdAt: string;
  author?: { firstName?: string; lastName?: string; name?: string };
}
