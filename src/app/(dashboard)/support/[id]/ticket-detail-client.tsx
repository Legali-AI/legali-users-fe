"use client";

import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FileAttachmentContainer } from "../../../../components/elements/attachments/file-attachment-container";
import { DeleteConfirmationDialog } from "../../../../components/elements/delete-confirmation-dialog";
import { H3, H5, P, Span } from "../../../../components/elements/typography";
import { Button } from "../../../../components/ui/button";
import {
  useSupportTicketMutation,
  useSupportTicketQuery,
} from "../../../../hooks/use-support";
import { cn } from "../../../../lib/utils";

const formatUrgency = (urgency: string) => {
  return urgency.charAt(0).toUpperCase() + urgency.slice(1);
};

const cardStyle =
  "flex items-center justify-center rounded-[10px] border border-white-500 bg-white px-3 py-2 lg:px-5 lg:py-2.5";

export function TicketDetailPageContent({ ticketId }: { ticketId: string }) {
  const router = useRouter();
  const {
    data: ticketResponse,
    isLoading,
    error,
  } = useSupportTicketQuery(ticketId);
  const { deleteWithToast } = useSupportTicketMutation();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  if (isLoading) {
    return (
      <main className="flex w-full flex-1 flex-col items-center justify-center gap-5 overflow-hidden">
        <H3 weight="semibold" level="h5" className="text-deep-navy">
          Loading ticket...
        </H3>
      </main>
    );
  }

  if (error || !ticketResponse?.data) {
    return (
      <main className="flex w-full flex-1 flex-col items-center justify-center gap-5 overflow-hidden">
        <H3 weight="semibold" level="h5" className="text-deep-navy">
          Ticket not found
        </H3>
        {/* Back to support */}
        <Link href="/support">
          <Button>Back to support</Button>
        </Link>
      </main>
    );
  }

  const ticket = ticketResponse.data;

  const handleDeleteTicket = () => {
    setShowDeleteDialog(true);
  };

  const confirmDeleteTicket = async () => {
    await deleteWithToast(ticketId, () => {
      router.push("/support");
    });
    setShowDeleteDialog(false);
  };

  return (
    <main className="flex w-full flex-1 flex-col gap-4 lg:gap-5">
      {/* Header Section */}
      <div className="flex w-full flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-2">
        <P level="label" className="text-slate-gray-400">
          Ticket Details
        </P>

        <div className="flex items-center gap-3">
          {/* Urgency Badge */}
          <div className={cn(cardStyle, "flex w-fit items-center gap-2")}>
            <H5
              level="title"
              className="flex w-fit items-center gap-2 text-slate-gray-400"
            >
              Urgency
            </H5>
            <Span level={"title"} weight={"semibold"} className="text-black">
              {formatUrgency(ticket.urgency || "low")}
            </Span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/support/${ticketId}/edit`)}
              className="text-blue-500 hover:bg-blue-50 hover:text-blue-600"
            >
              <Edit className="mr-1 h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDeleteTicket}
              className="text-red-500 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="mr-1 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Ticket Info Row */}
      <div className="flex w-full flex-col gap-3 md:flex-row md:items-start md:gap-5">
        {/* Issue */}
        <div className={cn(cardStyle, "flex w-fit items-center gap-2")}>
          <H5
            level="title"
            className="flex items-center gap-2 text-slate-gray-400"
          >
            Issue
            <Span level={"title"} weight={"semibold"} className="text-black">
              {ticket.issue_title}
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
      {ticket.attachments && ticket.attachments.length > 0 && (
        <div className={cn(cardStyle, "flex flex-col items-start gap-1")}>
          <H5 level="title" className="text-slate-gray-400">
            Attachments
          </H5>

          <FileAttachmentContainer
            isFileViewer
            attachments={ticket.attachments.map(att => ({
              url: att?.url || "",
              name: att?.attachment_id || "attachment",
            }))}
          />
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={confirmDeleteTicket}
        title="Delete Ticket"
        description="Are you sure you want to delete this support ticket? This action cannot be undone."
      />
    </main>
  );
}
