"use client";

import { MessageCircle, Send, User } from "lucide-react";
import { useState } from "react";
import { FileAttachmentContainer } from "../../../../components/elements/attachments/file-attachment-container";
import { ImageAttachmentPreview } from "../../../../components/elements/attachments/image-attachment-preview";
import { DeleteConfirmationDialog } from "../../../../components/elements/delete-confirmation-dialog";
import { H3, P, Small } from "../../../../components/elements/typography";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../../components/ui/avatar";
import { Button } from "../../../../components/ui/button";
import { Textarea } from "../../../../components/ui/textarea";
import { Issue } from "../../../../data/issue.data";
import { CommentCard } from "../components/comment-card";

interface ForumDetailClientProps {
  issue: Issue;
}

export default function ForumDetailClient({ issue }: ForumDetailClientProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDeleteIssue = () => {
    setShowDeleteDialog(true);
  };

  const confirmDeleteIssue = () => {
    setShowDeleteDialog(false);
    // TODO: Implement actual delete logic
    console.log("Deleting issue:", issue?.id);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return `Posted on ${date.toLocaleDateString("en-CA")}`;
  };

  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-white to-sky-blue-100">
      <main className="flex w-full flex-1 flex-col gap-4 overflow-hidden lg:gap-5">
        {/* Main Issue Card */}
        <div className="flex w-full flex-col gap-3 rounded-[20px] border border-white-400 bg-white p-4 md:p-5 lg:p-6">
          <div className="flex items-start justify-between">
            <div className="flex flex-1 items-start gap-3">
              <Avatar className="h-10 w-10 border-2 border-sky-blue-500">
                <AvatarImage
                  src={issue.authorAvatar}
                  alt={issue.author}
                  className="h-full w-full object-cover"
                />
                <AvatarFallback className="bg-sky-blue-100 text-deep-navy">
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-1">
                  <H3 weight="semibold" level="h5" className="text-deep-navy">
                    {issue.title}
                  </H3>
                  <div className="flex items-center gap-2">
                    <Small className="text-slate-gray-400">
                      {issue.author}
                    </Small>
                    <Small className="text-slate-gray-400">•</Small>
                    <Small className="text-slate-gray-400">
                      {formatTimestamp(issue.timestamp)}
                    </Small>
                  </div>
                </div>

                <P level="body" className="break-words text-deep-navy">
                  {issue.description}
                </P>

                {/* Image Attachments */}
                {issue.attachments && issue.attachments.length > 0 && (
                  <ImageAttachmentPreview
                    images={issue.attachments}
                    maxVisible={4}
                  />
                )}

                {/* File Attachments */}
                {issue.files && issue.files.length > 0 && (
                  <FileAttachmentContainer
                    attachments={issue.files}
                    maxVisible={3}
                    showRemaining={true}
                  />
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <div className="flex items-center gap-1 text-slate-gray-400">
                    <MessageCircle className="h-4 w-4" />
                    <Small>{issue.commentsCount}</Small>
                  </div>
                </div>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleDeleteIssue}
              className="ml-2 text-red-500 hover:bg-red-50 hover:text-red-600"
            >
              Delete
            </Button>
          </div>
        </div>

        {/* Comments Section */}
        {issue.comments && issue.comments.length > 0 && (
          <div className="flex w-full flex-col gap-3">
            <H3 weight="semibold" level="h5" className="text-deep-navy">
              Comments ({issue.commentsCount})
            </H3>

            <div className="flex w-full flex-col gap-3">
              {issue.comments.map(comment => (
                <CommentCard
                  key={comment.id}
                  author={comment.author}
                  authorAvatar={comment.authorAvatar}
                  message={comment.message}
                  attachments={comment.attachments}
                  comments={comment.comments}
                />
              ))}
            </div>
          </div>
        )}

        {/* Add Comment Section */}
        <div className="flex w-full flex-col gap-3 rounded-[20px] border border-white-400 bg-white p-4 md:p-5 lg:p-6">
          <H3 weight="semibold" level="h5" className="text-deep-navy">
            Add a Comment
          </H3>

          <div className="flex w-full flex-col gap-3">
            <Textarea
              placeholder="Share your thoughts or ask a question..."
              className="min-h-[100px] resize-none"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Small className="text-slate-gray-400">
                  You can attach files and images to your comment
                </Small>
              </div>

              <Button size="sm" className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                Post Comment
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={confirmDeleteIssue}
        title="Delete Issue"
        description="Are you sure you want to delete this issue? This action cannot be undone."
      />
    </div>
  );
}
