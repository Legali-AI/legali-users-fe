"use client";

import { ChevronRight, Plus } from "lucide-react";
import Link from "next/link";
import { H3, P, Span } from "../../../components/elements/typography";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { useSupportTicketsQuery } from "../../../hooks/use-support";
import { QueryProvider } from "../../../lib/query-client";

function SupportPageContent() {
  const { data: ticketsResponse, isLoading, error } = useSupportTicketsQuery();

  const tickets = ticketsResponse?.data || [];
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
              <Link
                key={ticket.ticket_id}
                href={`/support/${ticket.ticket_id}`}
                className="block"
              >
                <div
                  className="flex cursor-pointer flex-col gap-3 rounded-lg border border-sky-blue-700 px-3 py-2.5 transition-colors hover:bg-sky-blue-100 sm:flex-row sm:items-center sm:justify-between sm:gap-4 md:px-4 md:py-3 lg:px-6"
                  style={{
                    background:
                      "linear-gradient(89deg, #EDFAFF 0%, #FCFEFF 39.26%)",
                  }}
                >
                  <H3
                    level="title"
                    weight={"semibold"}
                    className="flex-1 text-sky-blue-900"
                  >
                    {ticket.issue_title}
                  </H3>
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
                    <Button
                      level="body"
                      className="flex items-center gap-2 self-end sm:self-auto"
                      asChild
                    >
                      <span>
                        See Details
                        <ChevronRight size={16} />
                      </span>
                    </Button>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
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
