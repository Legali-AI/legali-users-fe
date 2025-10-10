import { FileAttachmentContainer } from "../../../../components/elements/attachments/file-attachment-container";
import { ImageAttachmentPreview } from "../../../../components/elements/attachments/image-attachment-preview";
import { separateAttachments } from "../forum-utils";

interface FileAttachment {
  url: string;
  name: string;
}

interface CommentAttachmentPreviewProps {
  attachments?: Array<{ url?: string | null }>;
  className?: string;
}

export function CommentAttachmentPreview({
  attachments = [],
  className = "",
}: CommentAttachmentPreviewProps) {
  if (!attachments || attachments.length === 0) {
    return null;
  }

  // Convert attachments to URL array
  const attachmentUrls = attachments
    .map(att => att.url)
    .filter((url): url is string => Boolean(url));

  if (attachmentUrls.length === 0) {
    return null;
  }

  // Separate images and files
  const { images, files } = separateAttachments(
    attachmentUrls.map(url => ({
      url,
      attachment_id: url.split("/").pop() || "attachment",
    }))
  );

  // Convert files to FileAttachment format
  const fileAttachments: FileAttachment[] = files.map(file => ({
    url: file.url,
    name: file.name,
  }));

  return (
    <div className={`flex min-w-0 flex-col gap-2 overflow-hidden ${className}`}>
      {/* Image Attachments */}
      {images.length > 0 && (
        <ImageAttachmentPreview images={images} maxVisible={3} imageSize={60} />
      )}

      {/* File Attachments */}
      {fileAttachments.length > 0 && (
        <FileAttachmentContainer
          attachments={fileAttachments}
          maxVisible={3}
          showRemaining={true}
          className="text-xs"
          truncate={true}
          isFileViewer={true}
        />
      )}
    </div>
  );
}
