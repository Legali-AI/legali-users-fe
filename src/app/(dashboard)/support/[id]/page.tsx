import { QueryProvider } from "../../../../lib/query-client";
import { TicketDetailPageContent } from "./ticket-detail-client";

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <QueryProvider>
      <TicketDetailPageContent ticketId={id} />
    </QueryProvider>
  );
}
