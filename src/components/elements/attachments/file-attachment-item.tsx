"use client";

import { Paperclip } from "lucide-react";
import { cn } from "../../../lib/utils";
import { P } from "../typography";

export interface FileAttachmentItemProps {
  filename: string;
  className?: string;
  onClick?: (() => void) | undefined;
  variant?: "default" | "compact";
  truncate?: boolean;
}

export function FileAttachmentItem({
  filename,
  className,
  onClick,
  variant = "default",
  truncate = true,
}: FileAttachmentItemProps) {
  const getDisplayName = (filename: string) => {
    return filename.split("/").pop() || "File";
  };

  const baseClasses = "flex items-center gap-2.5 rounded-[10px] border border-white-500 bg-white px-5 py-2.5";
  const sizeClasses = variant === "compact" ? "h-[32px]" : "h-[39px]";
  const textClasses = variant === "compact" ? "max-w-[60px]" : "max-w-[80px]";
  const truncateClasses = truncate ? "truncate" : "";

  const Component = onClick ? "button" : "div";

  return (
    <Component
      type={onClick ? "button" : undefined}
      className={cn(
        baseClasses,
        sizeClasses,
        onClick && "cursor-pointer hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none",
        className
      )}
      onClick={onClick}>
      <Paperclip size={15} className="text-black" />
      <P level="body" className={cn("text-deep-navy", truncate ? textClasses : "w-fit", truncateClasses)}>
        {getDisplayName(filename)}
      </P>
    </Component>
  );
}
