import TicketChat from "@/components/support/TicketChat";
export default async function AdminTicketPage({ params }: { params: Promise<{ ticketId: string }> }) { const { ticketId } = await params; return <TicketChat ticketId={ticketId} admin/>; }
