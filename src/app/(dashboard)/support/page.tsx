"use client";

import { ChevronRight, Edit, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { DeleteConfirmationDialog } from "../../../components/elements/delete-confirmation-dialog";
import { H3, P, Span } from "../../../components/elements/typography";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../../components/ui/pagination";
import {
  useSupportTicketMutation,
  useSupportTicketsQuery,
} from "../../../hooks/use-support";
import { QueryProvider } from "../../../lib/query-client";

const ITEMS_PER_PAGE = 10;

function SupportPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Pagination state
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const {
    data: ticketsResponse,
    isLoading,
    error,
  } = useSupportTicketsQuery({
    limit: ITEMS_PER_PAGE,
    currentPage: currentPage,
  });
  const { deleteWithToast } = useSupportTicketMutation();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<string | null>(null);

  const tickets = ticketsResponse?.data || [];
  const totalPages =
    ticketsResponse?.meta && "total_page" in ticketsResponse.meta
      ? (ticketsResponse.meta.total_page as number)
      : 1;

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/support?${params.toString()}`);
  };

  const handleDeleteTicket = (ticketId: string) => {
    setTicketToDelete(ticketId);
    setShowDeleteDialog(true);
  };

  const confirmDeleteTicket = async () => {
    if (ticketToDelete) {
      await deleteWithToast(ticketToDelete);
    }
    setShowDeleteDialog(false);
    setTicketToDelete(null);
  };
  return (
    <main className="flex w-full flex-1 flex-col gap-6 lg:gap-10">
      <Link href="/support/submit" className="w-full">
        <Button
          variant={"outline"}
          size={"lg"}
          className="ring-none w-full rounded-md border-dashed border-brand-slate"
        >
          <Span
            level={"title"}
            className="flex items-center gap-2 text-brand-slate"
          >
            <Plus size={16} />
            Submit Ticket
          </Span>
        </Button>
      </Link>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <H3 level="label">Your Tickets</H3>
        </div>
        <div className="flex flex-col gap-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <P level="body" className="text-brand-slate">
                Loading support tickets...
              </P>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-8">
              <P level="body" className="text-red-600">
                Failed to load support tickets. Please try again.
              </P>
            </div>
          ) : tickets.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <P level="body" className="text-brand-slate">
                No support tickets found.
              </P>
            </div>
          ) : (
            tickets.map(ticket => (
              <div
                key={ticket.ticket_id}
                className="flex flex-col gap-3 rounded-lg border border-sky-blue-700 px-3 py-2.5 transition-colors hover:bg-sky-blue-100 sm:flex-row sm:items-center sm:justify-between sm:gap-4 md:px-4 md:py-3 lg:px-6"
                style={{
                  background:
                    "linear-gradient(89deg, #EDFAFF 0%, #FCFEFF 39.26%)",
                }}
              >
                <Link href={`/support/${ticket.ticket_id}`} className="flex-1">
                  <H3
                    level="title"
                    weight={"semibold"}
                    className="text-sky-blue-900"
                  >
                    {ticket.issue_title}
                  </H3>
                </Link>
                <div className="flex justify-end gap-2 sm:items-center sm:gap-2">
                  <Badge
                    size={"md"}
                    variant={ticket.status === "new" ? "gray" : "emerald"}
                    level="body"
                    className="self-end sm:self-auto"
                  >
                    {ticket.status.charAt(0).toUpperCase() +
                      ticket.status.slice(1)}
                  </Badge>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        router.push(`/support/${ticket.ticket_id}/edit`)
                      }
                      className="text-blue-500 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTicket(ticket.ticket_id)}
                      className="text-red-500 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      level="body"
                      className="flex h-fit w-fit items-center gap-2 self-end sm:self-auto"
                      asChild
                    >
                      <Link
                        href={`/support/${ticket.ticket_id}`}
                        className="flex h-fit w-fit"
                      >
                        See Details
                        <ChevronRight size={16} />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={e => {
                      e.preventDefault();
                      if (currentPage > 1) {
                        handlePageChange(currentPage - 1);
                      }
                    }}
                    className={
                      currentPage <= 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  page => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={e => {
                          e.preventDefault();
                          handlePageChange(page);
                        }}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={e => {
                      e.preventDefault();
                      if (currentPage < totalPages) {
                        handlePageChange(currentPage + 1);
                      }
                    }}
                    className={
                      currentPage >= totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </section>

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
export default function SupportPage() {
  return (
    <QueryProvider>
      <SupportPageContent />
    </QueryProvider>
  );
}
