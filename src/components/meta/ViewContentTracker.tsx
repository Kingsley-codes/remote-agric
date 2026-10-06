"use client";

import { useEffect } from "react";
import { trackMetaEvent } from "@/lib/metaPixel";

interface ViewContentTrackerProps {
  contentName: string;
  contentType: string;
  contentIds?: string[];
  value?: number;
}

export function ViewContentTracker({
  contentName,
  contentType,
  contentIds,
  value,
}: ViewContentTrackerProps) {
  useEffect(() => {
    trackMetaEvent("ViewContent", {
      content_name: contentName,
      content_type: contentType,
      ...(contentIds && { content_ids: contentIds }),
      ...(value !== undefined && {
        value,
        currency: "NGN",
      }),
    });
  }, [contentName, contentType, contentIds, value]);

  return null;
}
