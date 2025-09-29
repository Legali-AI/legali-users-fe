"use client";

import { cn } from "../../../lib/utils";
import { FileAttachmentItem } from "./file-attachment-item";

export interface FileAttachmentContainerProps {
  attachments: string[];
  maxVisible?: number;
  showRemaining?: boolean;
  onAttachmentClick?: (attachment: string, index: number) => void;
  onRemainingClick?: () => void;
  className?: string;
  truncate?: boolean;
  classNameItem?: string;
}

export function FileAttachmentContainer({
  attachments,
  maxVisible = 3,
  showRemaining = true,
  onAttachmentClick,
  onRemainingClick,
  className,
  classNameItem,
  truncate = true,
}: FileAttachmentContainerProps) {
  const visibleAttachments = attachments.slice(0, maxVisible);
  const remainingCount = attachments.length - maxVisible;

  return (
    <div className={cn(`flex items-center gap-2`, className || "")}>
      {visibleAttachments.map((attachment, index) => (
        <FileAttachmentItem
          className={classNameItem || ""}
          key={`${attachment}-${index}`}
          filename={attachment}
          onClick={onAttachmentClick ? () => onAttachmentClick(attachment, index) : undefined}
          truncate={truncate}
        />
      ))}
      {showRemaining && remainingCount > 0 && (
        <FileAttachmentItem
          filename={`+${remainingCount} more`}
          className={classNameItem || ""}
          onClick={onRemainingClick}
          truncate={truncate}
        />
      )}
    </div>
  );
}
