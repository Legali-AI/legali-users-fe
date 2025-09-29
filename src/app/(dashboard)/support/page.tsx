import { ChevronRight, Filter, Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { H3, P, Span } from "../../../components/elements/typography";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { STATUS_OPTIONS, SUPPORT_TICKETS } from "../../../data/support.data";

export const metadata: Metadata = {
  title: "Support Tickets",
  description:
    "Manage your support tickets and get help with your legal matters. Track ticket status, submit new requests, and communicate with our support team.",
  keywords: ["support tickets", "customer support", "legal help", "ticket management", "support system"],
  openGraph: {
    title: "Support Tickets",
    description:
      "Manage your support tickets and get help with your legal matters. Track ticket status, submit new requests, and communicate with our support team.",
  },
};

// Use imported data from support.data.ts
const TICKETS = SUPPORT_TICKETS.map(ticket => ({
  id: ticket.id,
  title: ticket.title,
  status: ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1).replace("-", " "),
  urgency: ticket.urgency,
  createdAt: ticket.createdAt,
}));

export default function SupportPage() {
  return (
    <main className="flex w-full flex-1 flex-col gap-6 lg:gap-10">
      <Link href="/support/submit" className="w-full">
        <Button
          variant={"outline"}
          size={"lg"}
          className="ring-none w-full rounded-md border-dashed border-brand-slate">
          <Span level={"title"} className="flex items-center gap-2 text-brand-slate">
            <Plus size={16} />
            Submit Ticket
          </Span>
        </Button>
      </Link>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <H3 level="label">Your Tickets</H3>

          {/* Filter */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-2">
            <div className="flex items-center gap-2">
              <Filter size={14} />
              <P level="label" className="text-brand-slate">
                Filter By
              </P>
            </div>
            {/* By pending and completed */}
            <Select>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {TICKETS.map(ticket => (
            <Link key={ticket.id} href={`/support/${ticket.id}`} className="block">
              <div
                className="flex cursor-pointer flex-col gap-3 rounded-lg border border-sky-blue-700 px-3 py-2.5 transition-colors hover:bg-sky-blue-100 sm:flex-row sm:items-center sm:justify-between sm:gap-4 md:px-4 md:py-3 lg:px-6"
                style={{
                  background: "linear-gradient(89deg, #EDFAFF 0%, #FCFEFF 39.26%)",
                }}>
                <H3 level="title" weight={"semibold"} className="flex-1 text-sky-blue-900">
                  {ticket.title}
                </H3>
                <div className="flex justify-end gap-2 sm:items-center sm:gap-2">
                  <Badge
                    size={"md"}
                    variant={ticket.status === "Pending" ? "gray" : "emerald"}
                    level="body"
                    className="self-end sm:self-auto">
                    {ticket.status}
                  </Badge>
                  <Button level="body" className="flex items-center gap-2 self-end sm:self-auto" asChild>
                    <span>
                      See Details
                      <ChevronRight size={16} />
                    </span>
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
