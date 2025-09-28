"use client";

import { MessageCircle, User } from "lucide-react";
import Link from "next/link";
import { FileAttachmentContainer } from "../../../../components/elements/attachments/file-attachment-container";
import { ImageAttachmentPreview } from "../../../../components/elements/attachments/image-attachment-preview";
import { H5, P, Small } from "../../../../components/elements/typography";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../../components/ui/avatar";
import { Button } from "../../../../components/ui/button";
import { cn } from "../../../../lib/utils";

export interface IssueCardProps {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  attachments?: string[];
  commentsCount: number;
  author: string;
  authorAvatar?: string | undefined;
  onDelete?: (id: string) => void;
  className?: string;
  onSeeAttachments?: () => void;
  isPaperClip?: boolean;
}

const AttachmentsPreview = ({
  attachments,
  onSeeAttachments,
  isPaperClip = false,
}: {
  attachments: string[];
  onSeeAttachments?: () => void;
  isPaperClip?: boolean;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <ImageAttachmentPreview
        images={attachments}
        maxVisible={3}
        imageSize={78}
      />
      {isPaperClip ? (
        <FileAttachmentContainer
          attachments={attachments}
          maxVisible={3}
          showRemaining={true}
          className="my-2"
        />
      ) : (
        <button
          type="button"
          className="cursor-pointer text-left text-slate-gray-400 underline"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onSeeAttachments?.();
          }}
          onKeyDown={(e) => {
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

export function IssueCard({
  id,
  title,
  description,
  timestamp,
  attachments = [],
  commentsCount,
  author,
  authorAvatar,
  onDelete,
  className,
  onSeeAttachments = () => {},
  isPaperClip = false,
}: IssueCardProps) {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <Link href={`/forum/${id}`} className="block">
      <div
        className={cn(
          "hover:bg-sky-blue-50 flex cursor-pointer flex-col gap-2 rounded-[10px] border border-white-400 bg-white p-4 transition-colors lg:p-5",
          className
        )}
      >
        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
            <H5
              level="title"
              weight="semibold"
              className="break-words text-deep-navy"
            >
              {title}
            </H5>
            <Small level="label" className="text-deep-navy-300">
              {formatTimestamp(timestamp)}
            </Small>
          </div>

          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete?.(id);
              }}
              className="self-start sm:self-auto"
            >
              <P level="body" className="text-brand-rose">
                Delete
              </P>
            </Button>
          )}
        </div>

        {/* Description */}
        <P level="body" className="break-words">
          {description}
        </P>

        {/* Attachments */}
        {attachments.length > 0 && (
          <AttachmentsPreview
            attachments={attachments}
            onSeeAttachments={onSeeAttachments}
            isPaperClip={isPaperClip}
          />
        )}

        {/* Footer */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-1">
            <MessageCircle size={16} className="text-slate-gray-300" />
            <Small level="label" className="text-slate-gray-400">
              {commentsCount} comments
            </Small>
          </div>

          <div className="flex items-center gap-1">
            <Avatar className="h-5 w-5">
              <AvatarImage src={authorAvatar} alt={author} />
              <AvatarFallback className="bg-slate-gray-300">
                <User size={9} className="text-light-gray-100" />
              </AvatarFallback>
            </Avatar>
            <Small level="label" className="text-slate-gray-400">
              {author}
            </Small>
          </div>
        </div>
      </div>
    </Link>
  );
}
