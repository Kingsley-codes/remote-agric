import type { Metadata } from "next";

export const SITE_URL = "https://remoteagricng.com";

// Keep the sitemap aligned with the preferred URLs declared by public pages.
export const PUBLIC_PATHS = [
  "/",
  "/about",
  "/opportunities",
  "/agro-blog",
  "/community",
  "/contact",
  "/faqs",
  "/terms",
  "/privacy",
  "/risk-disclosure",
  "/cookie-policy",
] as const;

export function canonicalMetadata(path: string): Metadata {
  return { alternates: { canonical: new URL(path, SITE_URL).href } };
}
