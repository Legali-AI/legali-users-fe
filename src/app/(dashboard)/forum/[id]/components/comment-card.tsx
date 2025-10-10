"use client";

import { MessageCircle, Reply, Trash2, User } from "lucide-react";
import { useState } from "react";
import { H5, P, Small } from "../../../../../components/elements/typography";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../../../components/ui/avatar";
import { Button } from "../../../../../components/ui/button";
import { cn } from "../../../../../lib/utils";
import { CommentAttachmentPreview } from "./comment-attachment-preview";
import { DeleteCommentDialog } from "./delete-comment-dialog";

export interface CommentCardProps {
  commentId: string;
  author: string;
  authorId: string;
  authorAvatar?: string | undefined;
  message: string;
  attachments?: Array<{ url?: string | null }>;
  comments: number;
  replies?: CommentCardProps[];
  isReply?: boolean;
  currentUserId?: string | undefined;
  onReply?: (commentId: string, authorName: string, content: string) => void;
  onDelete?: ((commentId: string) => void) | undefined;
  className?: string;
}

export function CommentCard({
  commentId,
  author,
  authorId,
  authorAvatar,
  message,
  attachments,
  comments,
  replies = [],
  isReply = false,
  currentUserId,
  onReply,
  onDelete,
  className = "",
}: CommentCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const handleReply = () => {
    if (onReply) {
      onReply(commentId, author, message);
    }
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (onDelete) {
      onDelete(commentId);
    }
    setShowDeleteDialog(false);
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
  };

  // Check if current user can delete this comment
  const canDelete = currentUserId && authorId === currentUserId;

  return (
    <div className={cn("flex flex-col", className)}>
      {/* Main Comment */}
      <div
        className={cn(
          "flex gap-3 p-4 lg:gap-4 lg:p-5",
          "border-b border-slate-200"
        )}
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
        <div className="flex min-w-0 flex-1 flex-col gap-3 lg:gap-4">
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
            <CommentAttachmentPreview attachments={attachments} />
          )}

          {/* Comment Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {/* Show reply count for root comments (not replies) */}
              {!isReply && (
                <>
                  <MessageCircle size={16} className="text-slate-gray-300" />
                  <Small level="label" className="text-slate-gray-400">
                    {comments} replies
                  </Small>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Reply Button - Only show for root comments (not replies) */}
          {!isReply && onReply && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReply}
              className="hover:bg-sky-blue-50 flex items-center gap-1 text-sky-blue-600"
            >
              <Reply size={14} />
              <Small>Reply</Small>
            </Button>
          )}

          {/* Delete Button */}
          {onDelete && canDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="flex items-center gap-1 text-red-600 hover:bg-red-50"
            >
              <Trash2 size={14} />
              <Small>Delete</Small>
            </Button>
          )}
        </div>
      </div>

      {/* Nested Replies */}
      {replies.length > 0 && (
        <div className="ml-8 flex flex-col">
          {replies.map(reply => (
            <CommentCard
              key={reply.commentId}
              {...reply}
              isReply={true}
              currentUserId={currentUserId}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteCommentDialog
        isOpen={showDeleteDialog}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
