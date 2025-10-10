"use client";

import { Paperclip, Send, X } from "lucide-react";
import { useRef, useState } from "react";
import { ZodError } from "zod";
import { H3, Small } from "../../../../components/elements/typography";
import { Button } from "../../../../components/ui/button";
import { Textarea } from "../../../../components/ui/textarea";
import {
  type ForumCommentFormData,
  forumCommentSchema,
} from "../../../../schema/forum.schema";

export interface CommentInputProps {
  onSubmit: (content: string, files: File[]) => Promise<void>;
  isReplying?: boolean;
  replyingToAuthor?: string;
  replyingToContent?: string;
  onCancelReply?: () => void;
  className?: string;
}

export function CommentInput({
  onSubmit,
  isReplying = false,
  replyingToAuthor = "",
  replyingToContent = "",
  onCancelReply,
  className = "",
}: CommentInputProps) {
  const [commentText, setCommentText] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [validationError, setValidationError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachedFiles(prev => [...prev, ...files]);
  };

  const handleRemoveFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleAttachFiles = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    setValidationError("");

    try {
      // Validate the form data using Zod
      const formData: ForumCommentFormData = {
        message: commentText.trim(),
        files: attachedFiles.length > 0 ? attachedFiles : undefined,
      };

      const validatedData = forumCommentSchema.parse(formData);

      await onSubmit(validatedData.message, validatedData.files || []);
      setCommentText("");
      setAttachedFiles([]);
    } catch (error) {
      if (error instanceof ZodError) {
        const firstError = error.issues[0];
        if (firstError) {
          setValidationError(firstError.message);
        }
      } else {
        console.error("Failed to submit comment:", error);
        setValidationError("Failed to submit comment. Please try again.");
      }
    }
  };

  const handleCancel = () => {
    setCommentText("");
    setAttachedFiles([]);
    setValidationError("");
    onCancelReply?.();
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return "📄";
      case "doc":
      case "docx":
        return "📝";
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "webp":
        return "🖼️";
      case "zip":
      case "rar":
        return "📦";
      default:
        return "📎";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <div
      className={`sticky bottom-0 z-10 flex w-full flex-col gap-3 rounded-[20px] border border-white-400 bg-white p-4 shadow-lg md:p-5 lg:p-6 ${className}`}
    >
      <H3 weight="semibold" level="h5" className="text-deep-navy">
        {isReplying ? `Reply to ${replyingToAuthor}` : "Add a Comment"}
      </H3>

      {/* Show original comment content when replying */}
      {isReplying && replyingToContent && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <Small className="mb-1 text-slate-500">Replying to:</Small>
          <Small className="break-words text-slate-700">
            {replyingToContent.length > 100
              ? `${replyingToContent.substring(0, 100)}...`
              : replyingToContent}
          </Small>
        </div>
      )}

      {/* Validation Error Display */}
      {validationError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3">
          <Small className="text-red-600">{validationError}</Small>
        </div>
      )}

      <div className="flex w-full flex-col gap-3">
        <Textarea
          placeholder={
            isReplying
              ? `Reply to ${replyingToAuthor}...`
              : "Share your thoughts or ask a question..."
          }
          className={`min-h-[100px] resize-none ${validationError ? "border-red-300 focus:border-red-500" : ""}`}
          value={commentText}
          onChange={e => {
            setCommentText(e.target.value);
            if (validationError) setValidationError("");
          }}
        />

        {/* File Attachments Preview */}
        {attachedFiles.length > 0 && (
          <div className="flex flex-col gap-2">
            <Small className="text-slate-gray-500">Attached files:</Small>
            <div className="flex flex-wrap gap-2">
              {attachedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
                >
                  <span className="text-lg">{getFileIcon(file.name)}</span>
                  <div className="flex flex-col">
                    <Small className="font-medium text-slate-700">
                      {file.name.length > 20
                        ? `${file.name.substring(0, 20)}...`
                        : file.name}
                    </Small>
                    <Small className="text-slate-500">
                      {formatFileSize(file.size)}
                    </Small>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFile(index)}
                    className="h-6 w-6 p-0 text-slate-400 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isReplying ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="text-slate-gray-500 hover:text-slate-gray-700"
              >
                Cancel Reply
              </Button>
            ) : (
              <div className="flex flex-col">
                <Small className="text-slate-gray-400">
                  You can attach files and images to your comment
                </Small>
                <Small
                  className={`text-xs ${
                    commentText.length > 900
                      ? "text-orange-500"
                      : commentText.length > 1000
                        ? "text-red-500"
                        : "text-slate-400"
                  }`}
                >
                  {commentText.length}/1000 characters
                </Small>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAttachFiles}
              className="flex items-center gap-1 text-slate-gray-600 hover:bg-slate-100"
            >
              <Paperclip className="h-4 w-4" />
              <Small>Attach</Small>
            </Button>

            <Button
              size="sm"
              className="flex items-center gap-2"
              onClick={handleSubmit}
              disabled={!commentText.trim() || commentText.length > 1000}
            >
              <Send className="h-4 w-4" />
              {isReplying ? "Post Reply" : "Post Comment"}
            </Button>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        accept="image/*,.pdf,.doc,.docx,.txt,.zip,.rar"
      />
    </div>
  );
}
