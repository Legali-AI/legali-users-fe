import { Paperclip } from "lucide-react";
import type { Metadata } from "next";
import { H3, H5, P, Span } from "../../../../components/elements/typography";
import { getTicketById } from "../../../../data/support.data";
import { cn } from "../../../../lib/utils";

export const metadata: Metadata = {
  title: "Support Ticket Details",
  description:
    "View detailed information about your support ticket including status, description, attachments, and responses from our support team.",
  keywords: [
    "support ticket details",
    "ticket status",
    "support response",
    "ticket information",
  ],
  openGraph: {
    title: "Support Ticket Details",
    description:
      "View detailed information about your support ticket including status, description, attachments, and responses from our support team.",
  },
};

// Helper function to format urgency
const formatUrgency = (urgency: string) => {
  return urgency.charAt(0).toUpperCase() + urgency.slice(1);
};

const cardStyle =
  "flex items-center justify-center rounded-[10px] border border-white-500 bg-white px-5 py-2.5";

export default function TicketDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const ticket = getTicketById(params.id);

  if (!ticket) {
    return (
      <main className="flex w-full flex-1 flex-col gap-5 overflow-hidden">
        <div className="flex w-full max-w-[1042px] items-center justify-center rounded-[20px] border border-white-400 bg-gradient-to-b from-white to-sky-blue-100 p-10">
          <H3 weight="semibold" level="h5" className="text-deep-navy">
            Ticket not found
          </H3>
        </div>
      </main>
    );
  }

  return (
    <main className="flex w-full flex-1 flex-col gap-5 overflow-hidden">
      {/* Header Section */}
      <div className="flex w-full items-center justify-between gap-2">
        <P level="label" className="text-slate-gray-400">
          Ticket Details
        </P>

        {/* Urgency Badge */}
        <div className={cardStyle}>
          <H5
            level="title"
            className="flex items-center gap-2 text-slate-gray-400"
          >
            Urgency
            <Span level={"title"} weight={"semibold"} className="text-black">
              {formatUrgency(ticket.urgency)}
            </Span>
          </H5>
        </div>
      </div>

      {/* Ticket Info Row */}
      <div className="flex w-full items-start gap-5">
        {/* Sender */}
        <div className={cardStyle}>
          <H5
            level="title"
            className="flex items-center gap-2 text-slate-gray-400"
          >
            Sender
            <Span level={"title"} weight={"semibold"} className="text-black">
              {ticket.sender}
            </Span>
          </H5>
        </div>

        {/* Issue */}
        <div className={cardStyle}>
          <H5
            level="title"
            className="flex items-center gap-2 text-slate-gray-400"
          >
            Issue
            <Span level={"title"} weight={"semibold"} className="text-black">
              {ticket.issue}
            </Span>
          </H5>
        </div>
      </div>

      {/* Description */}
      <div className={cn(cardStyle, "flex flex-col items-start gap-1")}>
        <H5 level="title" className="text-slate-gray-400">
          Description
        </H5>
        <Span level={"title"} weight={"medium"} className="text-black">
          {ticket.description}
        </Span>
      </div>

      {/* Attachments */}
      <div className={cn(cardStyle, "flex flex-col items-start gap-1")}>
        <H5 level="title" className="text-slate-gray-400">
          Attachments
        </H5>

        <div className="flex flex-wrap gap-2">
          {ticket.attachments.map((attachment) => (
            <div
              key={attachment.id}
              className={cn(cardStyle, "flex items-center gap-2")}
            >
              <Paperclip size={18} className="text-slate-gray-400" />
              <P level="title" className="text-deep-navy">
                {attachment.name}
              </P>
            </div>
          ))}
        </div>
      </div>

      {/* Response Section */}
      <div
        className={cn(
          cardStyle,
          "flex flex-col items-start gap-1",
          "border-dashed"
        )}
      >
        <H3 weight="semibold" level="h5" className="mb-2 text-deep-navy">
          Response
        </H3>

        {ticket.responses && (
          <div
            key={ticket.responses.id}
            className={cn(cardStyle, "flex flex-col items-start gap-1")}
          >
            <P level="body" className="text-deep-navy">
              {ticket.responses.message}
            </P>
          </div>
        )}
      </div>
    </main>
  );
}
