import { FileAttachmentContainer } from "../../../components/elements/attachments/file-attachment-container";
import { ImageAttachmentPreview } from "../../../components/elements/attachments/image-attachment-preview";
import { P } from "../../../components/elements/typography";

interface FileAttachment {
  url: string;
  name: string;
}

export const AttachmentsPreview = ({
  attachments,
  files,
  onSeeAttachments,
  isPaperClip = false,
  issueId,
}: {
  attachments: string[];
  files?: string[];
  onSeeAttachments?: () => void;
  isPaperClip?: boolean;
  issueId?: string;
}) => {
  const fileAttachments: FileAttachment[] =
    files?.map(file => ({
      url: file,
      name: file.split("/").pop() || "file",
    })) || [];

  return (
    <div className="flex flex-col gap-2">
      <ImageAttachmentPreview
        images={attachments}
        maxVisible={3}
        imageSize={78}
      />
      {isPaperClip && fileAttachments.length > 0 ? (
        <FileAttachmentContainer
          attachments={fileAttachments}
          maxVisible={3}
          showRemaining={true}
          className="my-2"
        />
      ) : (
        <button
          type="button"
          className="cursor-pointer text-left text-slate-gray-400 underline"
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            onSeeAttachments?.();
          }}
          onKeyDown={e => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              e.stopPropagation();
              onSeeAttachments?.();
            }
          }}
        >
          <P level="caption" className="text-slate-gray-400 underline">
            See Attachments
          </P>
        </button>
      )}
    </div>
  );
};
