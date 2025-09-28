"use client";

import { MessageCircle, User } from "lucide-react";
import { ImageAttachmentPreview } from "../../../../components/elements/attachments/image-attachment-preview";
import { H5, P, Small } from "../../../../components/elements/typography";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../../components/ui/avatar";

export interface CommentCardProps {
  author: string;
  authorAvatar?: string | undefined;
  message: string;
  attachments?: string[] | undefined;
  comments: number;
  className?: string;
}

export function CommentCard({
  author,
  authorAvatar,
  message,
  attachments,
  comments,
  className = "",
}: CommentCardProps) {
  return (
    <div
      className={`flex gap-3 border-b border-white-400 p-4 lg:gap-4 lg:p-5 ${className}`}
    >
      {/* Avatar */}
      <Avatar className="h-10 w-10 lg:h-12 lg:w-12">
        <AvatarImage src={authorAvatar} alt={author} />
        <AvatarFallback className="bg-slate-gray-300">
          <User
            size={18}
            className="text-light-gray-100 lg:h-[22px] lg:w-[22px]"
          />
        </AvatarFallback>
      </Avatar>

      {/* Comment Content */}
      <div className="flex flex-1 flex-col gap-3 lg:gap-4">
        {/* Comment Header */}
        <div className="flex flex-col gap-1 lg:gap-1.5">
          <H5 level="body" weight="semibold" className="text-deep-navy">
            {author}
          </H5>
          <P level="label" className="break-words text-deep-navy">
            {message}
          </P>
        </div>

        {/* Comment Attachments */}
        {attachments && attachments.length > 0 && (
          <ImageAttachmentPreview
            images={attachments}
            maxVisible={3}
            imageSize={78}
          />
        )}

        {/* Comment Footer */}
        <div className="flex items-center gap-1">
          <MessageCircle size={16} className="text-slate-gray-300" />
          <Small level="label" className="text-slate-gray-400">
            {comments} comments
          </Small>
        </div>
      </div>
    </div>
  );
}
