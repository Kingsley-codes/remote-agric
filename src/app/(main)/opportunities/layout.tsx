import { canonicalMetadata } from "@/lib/seo";

export const metadata = canonicalMetadata("/opportunities");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
