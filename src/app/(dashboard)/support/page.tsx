import { ChevronRight, Filter, Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { H3, P, Span } from "../../../components/elements/typography";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  getSupportStats,
  STATUS_OPTIONS,
  SUPPORT_TICKETS,
} from "../../../data/support.data";

export const metadata: Metadata = {
  title: "Support Tickets",
  description:
    "Manage your support tickets and get help with your legal matters. Track ticket status, submit new requests, and communicate with our support team.",
  keywords: [
    "support tickets",
    "customer support",
    "legal help",
    "ticket management",
    "support system",
  ],
  openGraph: {
    title: "Support Tickets",
    description:
      "Manage your support tickets and get help with your legal matters. Track ticket status, submit new requests, and communicate with our support team.",
  },
};

// Use imported data from support.data.ts
const TICKETS = SUPPORT_TICKETS.map((ticket) => ({
  id: ticket.id,
  title: ticket.title,
  status:
    ticket.status.charAt(0).toUpperCase() +
    ticket.status.slice(1).replace("-", " "),
  urgency: ticket.urgency,
  createdAt: ticket.createdAt,
}));

export default function SupportPage() {
  const stats = getSupportStats();

  return (
    <main className="flex w-full flex-1 flex-col gap-10 overflow-hidden">
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

      {/* Statistics Section */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-white-400 bg-white p-4">
          <H3 weight="semibold" level="h5" className="text-deep-navy">
            Total Tickets
          </H3>
          <P level="h5" className="text-slate-gray-400">
            {stats.total}
          </P>
        </div>
        <div className="rounded-lg border border-white-400 bg-white p-4">
          <H3 weight="semibold" level="h5" className="text-deep-navy">
            Pending
          </H3>
          <P level="h5" className="text-slate-gray-400">
            {stats.byStatus.pending}
          </P>
        </div>
        <div className="rounded-lg border border-white-400 bg-white p-4">
          <H3 weight="semibold" level="h5" className="text-deep-navy">
            In Progress
          </H3>
          <P level="h5" className="text-slate-gray-400">
            {stats.byStatus.inProgress}
          </P>
        </div>
        <div className="rounded-lg border border-white-400 bg-white p-4">
          <H3 weight="semibold" level="h5" className="text-deep-navy">
            Completed
          </H3>
          <P level="h5" className="text-slate-gray-400">
            {stats.byStatus.completed}
          </P>
        </div>
      </div>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <H3 level="label">Your Tickets</H3>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter size={14} />
            <P level="label" className="mr-4 text-brand-slate">
              Filter By
            </P>
            {/* By pending and completed */}
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {TICKETS.map((ticket) => (
            <div
              key={ticket.id}
              className="flex items-center justify-between rounded-lg border border-sky-blue-700 px-6 py-3"
              style={{
                background:
                  "linear-gradient(89deg, #EDFAFF 0%, #FCFEFF 39.26%)",
              }}
            >
              <H3
                level="title"
                weight={"semibold"}
                className="text-sky-blue-900"
              >
                {ticket.title}
              </H3>
              <div className="flex items-center gap-2">
                <Badge
                  size={"md"}
                  variant={ticket.status === "Pending" ? "gray" : "emerald"}
                  level="body"
                >
                  {ticket.status}
                </Badge>
                <Button
                  level="body"
                  className="flex items-center gap-2"
                  asChild
                >
                  <Link href={`/support/${ticket.id}`}>
                    See Details
                    <ChevronRight size={16} />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
