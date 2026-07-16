export type TicketStatus = "open" | "resolved" | "closed";
export interface TicketUser { firstName: string; lastName: string; email: string; phone?: string }
export interface TicketMessage { _id: string; senderType: "user" | "admin"; body: string; attachments: { url: string; publicId: string }[]; createdAt: string }
export interface Ticket {
  _id: string; ticketNumber: string; subject: string; category: string; priority: "low" | "medium" | "high";
  status: TicketStatus; user?: TicketUser; messages?: TicketMessage[]; lastMessageAt: string; createdAt: string; resolvedAt?: string;
}
export const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";
export const relativeTime = (date: string) => new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
  -Math.max(1, Math.floor((Date.now() - new Date(date).getTime()) / 86400000)), "day",
);
