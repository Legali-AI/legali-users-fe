"use client";

import { MessageCircle, Send, User } from "lucide-react";
import { use, useState } from "react";
import { FileAttachmentContainer } from "../../../../components/elements/attachments/file-attachment-container";
import { ImageAttachmentPreview } from "../../../../components/elements/attachments/image-attachment-preview";
import { H3, P, Small } from "../../../../components/elements/typography";
import { CommentCard } from "../../../../components/module/forum/comment-card";
import { DeleteConfirmationDialog } from "../../../../components/module/forum/delete-confirmation-dialog";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../../components/ui/avatar";
import { Button } from "../../../../components/ui/button";
import { Textarea } from "../../../../components/ui/textarea";
import { getIssueById } from "../../../../data/issue.data";

export default function ForumDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const issue = getIssueById(id);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDeleteIssue = () => {
    setShowDeleteDialog(true);
  };

  const confirmDeleteIssue = () => {
    setShowDeleteDialog(false);
    // TODO: Implement actual delete logic
    console.log("Deleting issue:", issue?.id);
  };

  if (!issue) {
    return (
      <main className="flex w-full flex-1 flex-col gap-5 overflow-hidden">
        <div className="flex w-full max-w-[1042px] items-center justify-center rounded-[20px] border border-white-400 bg-gradient-to-b from-white to-sky-blue-100 p-10">
          <H3 weight="semibold" level="h5" className="text-deep-navy">
            Issue not found
          </H3>
        </div>
      </main>
    );
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return `Posted on ${date.toLocaleDateString("en-CA")}`;
  };

  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-white to-sky-blue-100">
      <main className="flex w-full flex-1 flex-col gap-5 overflow-hidden ">
        {/* Main Issue Card */}
        {/* Header */}
        <div className="flex w-full items-center justify-between">
          <H3 level="h5" weight="semibold" className="text-deep-navy">
            {issue.title}
          </H3>
          {issue.category === "your-issues" && (
            <Button variant="ghost" size="sm" onClick={handleDeleteIssue}>
              <P level="body" className="text-brand-rose">
                Delete
              </P>
            </Button>
          )}
        </div>

        {/* Description */}
        <P level="body" className="text-deep-navy">
          {issue.description}
        </P>

        {/* Attachments */}
        <div className="flex flex-col gap-2">
          {/* Images */}
          {issue.attachments.length > 0 && (
            <ImageAttachmentPreview
              images={issue.attachments}
              maxVisible={4}
              imageSize={78}
            />
          )}

          {/* Files */}
          {issue.files && issue.files.length > 0 && (
            <FileAttachmentContainer
              attachments={issue.files}
              maxVisible={3}
              showRemaining={true}
            />
          )}
        </div>

        {/* Timestamp */}
        <P level="body" className="text-slate-gray-400">
          {formatTimestamp(issue.timestamp)}
        </P>

        {/* Footer */}
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-1">
            <MessageCircle size={16} className="text-slate-gray-300" />
            <Small level="label" className="text-slate-gray-400">
              {issue.commentsCount} comments
            </Small>
          </div>

          <div className="flex items-center gap-1">
            <Avatar className="h-5 w-5">
              <AvatarImage src={issue.authorAvatar} alt={issue.author} />
              <AvatarFallback className="bg-slate-gray-300">
                <User size={9} className="text-light-gray-100" />
              </AvatarFallback>
            </Avatar>
            <Small level="label" className="text-slate-gray-400">
              {issue.author}
            </Small>
          </div>
        </div>

        {/* Comments Section */}
        <div className="flex w-full flex-1 flex-col gap-4 overflow-hidden">
          <H3 level="h5" weight="medium" className="text-deep-navy">
            Comments
          </H3>

          {/* Comments List  */}
          <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col gap-0">
              {issue.comments?.map((comment) => (
                <CommentCard
                  key={comment.id}
                  author={comment.author}
                  authorAvatar={comment.authorAvatar}
                  message={comment.message}
                  attachments={comment.attachments}
                  comments={comment.comments}
                />
              ))}

              {/* Load More Comments */}
              <P level="label" className="py-6 text-center text-slate-gray-400">
                Load more comments
              </P>
            </div>
          </div>
        </div>
      </main>

      {/* Comment Input*/}
      <div className="sticky bottom-0 mx-auto flex w-[90%] items-center gap-2.5 rounded-[10px] border border-t border-white-500 bg-white p-5">
        <Textarea
          placeholder="Write your response here..."
          className="flex-1 border-none shadow-none placeholder:text-slate-gray-300 focus-visible:ring-0"
        />
        <Button size="icon" className="h-10 w-10 rounded-full">
          <Send size={15} className="text-white" />
        </Button>
      </div>

      {/* Delete Issue Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={confirmDeleteIssue}
        title="Delete this issue?"
        description="This action cannot be undone. The issue and all its comments will be permanently removed."
        confirmText="Delete Issue"
        cancelText="Cancel"
      />
    </div>
  );
}
