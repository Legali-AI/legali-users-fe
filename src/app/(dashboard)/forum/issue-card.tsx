"use client";

import { Edit, MessageCircle, User } from "lucide-react";
import Link from "next/link";
import { H5, P, Small } from "../../../components/elements/typography";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import { Button } from "../../../components/ui/button";
import { cn, formatTimestampAgo } from "../../../lib/utils";
import { AttachmentsPreview } from "./attachment-preview";

export interface IssueCardProps {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  attachments?: string[];
  files?: string[];
  commentsCount: number;
  author: string;
  authorAvatar?: string | undefined;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  className?: string;
  onSeeAttachments?: () => void;
  isPaperClip?: boolean;
  isMine?: boolean;
}

export function IssueCard({
  id,
  title,
  description,
  timestamp,
  attachments = [],
  files = [],
  commentsCount,
  author,
  authorAvatar,
  onDelete,
  onEdit,
  className,
  onSeeAttachments = () => {},
  isPaperClip = false,
  isMine = false,
}: IssueCardProps) {
  return (
    <div
      className={cn(
        "hover:bg-sky-blue-50 flex cursor-pointer flex-col gap-2 rounded-[10px] border border-white-400 bg-white p-4 transition-colors lg:p-5",
        className
      )}
    >
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Link href={`/forum/${id}`} className="block flex-1">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
            <H5
              level="title"
              weight="semibold"
              className="break-words text-deep-navy"
            >
              {title}
            </H5>
            <Small level="label" className="text-deep-navy-300">
              {formatTimestampAgo(timestamp)}
            </Small>
          </div>
        </Link>

        {(onDelete || onEdit) && isMine && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEdit?.(id);
                }}
                className="text-blue-500 hover:bg-blue-50 hover:text-blue-600"
              >
                <Edit className="mr-1 h-4 w-4" />
                <P level="body">Edit</P>
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete?.(id);
                }}
                className="text-brand-rose hover:bg-red-50 hover:text-red-600"
              >
                <P level="body">Delete</P>
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Description */}
      <Link href={`/forum/${id}`} className="block">
        <P level="body" className="break-words">
          {description}
        </P>
      </Link>

      {/* Attachments */}
      {(attachments.length > 0 || files.length > 0) && (
        <AttachmentsPreview
          attachments={attachments}
          files={files}
          onSeeAttachments={onSeeAttachments}
          isPaperClip={isPaperClip}
          issueId={id}
        />
      )}

      {/* Footer */}
      <Link href={`/forum/${id}`} className="block">
        <div
          className={cn(
            "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          )}
        >
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
      </Link>
    </div>
  );
}
