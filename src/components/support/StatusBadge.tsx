import { TicketStatus } from "@/lib/tickets";
export default function StatusBadge({ status }: { status: TicketStatus }) {
  const styles = status === "open" ? "bg-amber-50 text-amber-700" : status === "resolved" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600";
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold capitalize ${styles}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{status}</span>;
}
