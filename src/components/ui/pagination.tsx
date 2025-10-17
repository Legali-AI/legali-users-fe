"use client";

import { MoreHorizontalIcon } from "lucide-react";
import type * as React from "react";
import { cn } from "@/lib/utils";
import { Span } from "../elements/typography";

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      aria-label="pagination"
      data-slot="pagination"
      className={cn("flex h-[28px] w-full flex-row items-center justify-center gap-[10px]", className)}
      {...props}
    />
  );
}

function PaginationContent({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul data-slot="pagination-content" className={cn("flex flex-row items-center gap-[10px]", className)} {...props} />
  );
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
  isActive?: boolean;
} & React.ComponentProps<"a">;

function PaginationLink({ className, isActive, ...props }: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        "flex h-[32px] flex-row items-center justify-center gap-[10px] rounded-[10px] border-[0.3px] border-white-400 px-[10px] py-[6px]",
        isActive ? "text-slate-gray bg-sky-blue-100" : "text-slate-gray bg-white hover:bg-sky-blue-100",
        "text-[13px] leading-[120%] font-normal",
        className
      )}
      {...props}
    />
  );
}

function PaginationPrevious({ className, ...props }: React.ComponentProps<typeof PaginationLink>) {
  return (
    <Span level={"caption"} className={cn("text-slate-gray font-normal", className)} {...props}>
      Previous
    </Span>
  );
}

function PaginationNext({ className, ...props }: React.ComponentProps<typeof PaginationLink>) {
  return (
    <Span level={"caption"} className={cn("text-slate-gray font-normal", className)} {...props}>
      Next
    </Span>
  );
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}>
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only hidden">More pages</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
