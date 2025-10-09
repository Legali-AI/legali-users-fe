"use client";

import { useState } from "react";
import { cn } from "../../../lib/utils";
import { FileAttachmentItem } from "./file-attachment-item";
import { FileViewerModal } from "./file-viewer-modal";

interface FileAttachment {
  url: string;
  name: string;
}

const getFilenameFromUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const filename = pathname.split("/").pop() || "file";

    const cleanFilename = filename.split("?")[0];
    return decodeURIComponent(cleanFilename);
  } catch {
    return "attachment";
  }
};

const getCleanFilename = (filename: string): string => {
  const cleaned = filename.replace(/_\d{14}$/, "");
  return cleaned;
};

export interface FileAttachmentContainerProps {
  attachments: FileAttachment[];
  maxVisible?: number;
  showRemaining?: boolean;
  isFileViewer?: boolean;
  onRemainingClick?: () => void;
  className?: string;
  truncate?: boolean;
  classNameItem?: string;
}

export function FileAttachmentContainer({
  attachments,
  maxVisible,
  showRemaining = true,
  isFileViewer,
  onRemainingClick,
  className,
  classNameItem,
  truncate = true,
}: FileAttachmentContainerProps) {
  const [isFileViewerOpen, setIsFileViewerOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileAttachment | null>(null);

  const validAttachments = attachments
    .filter(
      att => att && typeof att === "object" && "url" in att && "name" in att
    )
    .map(att => ({
      ...att,
      name: att.url
        ? getCleanFilename(getFilenameFromUrl(att.url))
        : getCleanFilename(att.name || "attachment"),
    }));
  const visibleAttachments = maxVisible
    ? validAttachments.slice(0, maxVisible)
    : validAttachments;
  const remainingCount = maxVisible ? validAttachments.length - maxVisible : 0;

  const handleAttachmentClick = (attachment: FileAttachment) => {
    if (isFileViewer) {
      setSelectedFile({
        url: attachment.url,
        name: attachment.name,
      });
      setIsFileViewerOpen(true);
    } else {
      setSelectedFile({
        url: attachment.url,
        name: attachment.name,
      });
      setIsFileViewerOpen(true);
    }
  };

  const handleCloseFileViewer = () => {
    setIsFileViewerOpen(false);
    setSelectedFile(null);
  };

  return (
    <>
      <div className={cn(`flex items-center gap-2`, className || "")}>
        {visibleAttachments.map((attachment, index) => (
          <FileAttachmentItem
            className={classNameItem || ""}
            key={`${attachment}-${index}`}
            filename={attachment.name}
            onClick={() => handleAttachmentClick(attachment)}
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

      {/* File Viewer Modal  */}
      {isFileViewer && (
        <FileViewerModal
          isOpen={isFileViewerOpen}
          onClose={handleCloseFileViewer}
          fileUrl={selectedFile?.url}
          fileName={selectedFile?.name}
        />
      )}
    </>
  );
}
