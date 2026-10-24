import { canonicalMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return canonicalMetadata(`/agro-blog/${encodeURIComponent(slug)}`);
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
