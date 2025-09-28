import type { Metadata } from "next";
import { FileAttachmentContainer } from "../../../../components/elements/attachments/file-attachment-container";
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
  "flex items-center justify-center rounded-[10px] border border-white-500 bg-white px-3 py-2 lg:px-5 lg:py-2.5";

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ticket = getTicketById(id);

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
    <main className="flex w-full flex-1 flex-col gap-4 lg:gap-5">
      {/* Header Section */}
      <div className="flex w-full flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-2">
        <P level="label" className="text-slate-gray-400">
          Ticket Details
        </P>

        {/* Urgency Badge */}
        <div className={cn(cardStyle, "flex w-fit items-center gap-2")}>
          <H5
            level="title"
            className="flex w-fit items-center gap-2 text-slate-gray-400"
          >
            Urgency
          </H5>
          <Span level={"title"} weight={"semibold"} className="text-black">
            {formatUrgency(ticket.urgency)}
          </Span>
        </div>
      </div>

      {/* Ticket Info Row */}
      <div className="flex w-full flex-col gap-3 md:flex-row md:items-start md:gap-5">
        {/* Sender */}
        <div className={cn(cardStyle, "flex w-fit items-center gap-2")}>
          <H5
            level="title"
            className="flex w-fit items-center gap-2 text-slate-gray-400"
          >
            Sender
            <Span level={"title"} weight={"semibold"} className="text-black">
              {ticket.sender}
            </Span>
          </H5>
        </div>

        {/* Issue */}
        <div className={cn(cardStyle, "flex w-fit items-center gap-2")}>
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
        <Span
          level={"title"}
          weight={"medium"}
          className="break-words text-black"
        >
          {ticket.description}
        </Span>
      </div>

      {/* Attachments */}
      <div className={cn(cardStyle, "flex flex-col items-start gap-1")}>
        <H5 level="title" className="text-slate-gray-400">
          Attachments
        </H5>

        <FileAttachmentContainer
          attachments={ticket.attachments.map((att) => att.name)}
          maxVisible={5}
          showRemaining={true}
        />
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
            <P level="body" className="break-words text-deep-navy">
              {ticket.responses.message}
            </P>
          </div>
        )}
      </div>
    </main>
  );
}
