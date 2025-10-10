"use client";

import {
  Edit,
  MessageCircle,
  Paperclip,
  Reply,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { H5, P, Small } from "../../../../components/elements/typography";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../../components/ui/avatar";
import { Button } from "../../../../components/ui/button";
import { Textarea } from "../../../../components/ui/textarea";
import { cn } from "../../../../lib/utils";
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
  onReply?:
    | ((commentId: string, authorName: string, content: string) => void)
    | undefined;
  onEdit?:
    | ((commentId: string, content: string, files?: File[]) => void)
    | undefined;
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
  onEdit,
  onDelete,
  className = "",
}: CommentCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message);
  const [editFiles, setEditFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleReply = () => {
    if (onReply) {
      onReply(commentId, author, message);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditContent(message);
    setEditFiles([]);
  };

  const handleSaveEdit = () => {
    if (onEdit && (editContent.trim() !== message || editFiles.length > 0)) {
      onEdit(
        commentId,
        editContent.trim(),
        editFiles.length > 0 ? editFiles : undefined
      );
    }
    setIsEditing(false);
    setEditFiles([]);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(message);
    setEditFiles([]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setEditFiles(prev => [...prev, ...files]);
  };

  const handleRemoveFile = (index: number) => {
    setEditFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleAttachFiles = () => {
    fileInputRef.current?.click();
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return "🖼️";
    if (file.type.includes("pdf")) return "📄";
    if (file.type.includes("word") || file.type.includes("document"))
      return "📝";
    if (file.type.includes("excel") || file.type.includes("spreadsheet"))
      return "📊";
    return "📎";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
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
            <div className="flex w-full items-center gap-2">
              <H5
                level="body"
                weight="semibold"
                className="flex-1 text-deep-navy"
              >
                {author}
              </H5>
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

                {/* Edit Button - Only show for current user's comments and not in edit mode */}
                {onEdit && canDelete && !isEditing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleEdit}
                    className="flex items-center gap-1 text-blue-600 hover:bg-blue-50"
                  >
                    <Edit size={14} className="text-sky-blue-600" />
                    <Small>Edit</Small>
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
            {isEditing ? (
              <div className="flex flex-col gap-2">
                <Textarea
                  value={editContent}
                  onChange={e => setEditContent(e.target.value)}
                  className="min-h-[80px] resize-none"
                  placeholder="Edit your comment..."
                />

                {/* File Attachment Section */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAttachFiles}
                      className="flex items-center gap-1"
                    >
                      <Paperclip size={14} />
                      <Small>Attach Files</Small>
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*,.pdf,.doc,.docx,.xlsx,.xls"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>

                  {/* File Preview */}
                  {editFiles.length > 0 && (
                    <div className="flex flex-col gap-1">
                      {editFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 rounded border bg-gray-50 p-2"
                        >
                          <span className="text-sm">{getFileIcon(file)}</span>
                          <div className="min-w-0 flex-1">
                            <Small className="truncate">{file.name}</Small>
                            <Small className="text-gray-500">
                              {formatFileSize(file.size)}
                            </Small>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFile(index)}
                            className="h-6 w-6 p-0 text-red-500 hover:bg-red-50"
                          >
                            <X size={12} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleSaveEdit}
                    disabled={
                      !editContent.trim() ||
                      (editContent.trim() === message && editFiles.length === 0)
                    }
                  >
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <P level="label" className="break-words text-deep-navy">
                {message}
              </P>
            )}
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
              onReply={onReply}
              onEdit={onEdit}
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
