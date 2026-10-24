import { canonicalMetadata } from "@/lib/seo";

export const metadata = canonicalMetadata("/agro-blog");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
