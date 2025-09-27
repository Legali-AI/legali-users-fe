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

const STATUS_OPTIONS = [
  { label: "All Status", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Completed", value: "completed" },
  { label: "In Progress", value: "in-progress" },
];

const TICKETS = [
  {
    id: 1,
    title: "Ticket 1",
    status: "Pending",
  },
  {
    id: 2,
    title: "Ticket 2",
    status: "Completed",
  },
  {
    id: 3,
    title: "Ticket 3",
    status: "In Progress",
  },
];

export default function SupportPage() {
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
                <Button level="body" className="flex items-center gap-2">
                  See Details
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
