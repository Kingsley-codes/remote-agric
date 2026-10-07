export function trackMetaEvent(
  eventName: string,
  data?: Record<string, unknown>,
  options?: {
    eventID?: string;
  },
) {
  if (typeof window === "undefined") return;

  if (!window.fbq) return;

  window.fbq("track", eventName, data, options);
}
