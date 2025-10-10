"use client";

import { Edit, MessageCircle, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
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
import { useAuth } from "../../../../hooks/use-auth";
import {
  useForumCommentMutation,
  useForumCommentsQuery,
  useForumIssueMutation,
  useForumIssuesQuery,
  useMyForumIssuesQuery,
} from "../../../../hooks/use-forum";
import type {
  CreateCommentApiUserForumIssuesIssueIdCommentsPostData,
  DeleteCommentApiUserForumCommentsCommentIdDeleteData,
  ForumIssueDao,
  UpdateCommentApiUserForumCommentsCommentIdPutData,
} from "../../../../sdk/out";
import { separateAttachments } from "../components/forum-utils";
import { CommentCard } from "./components/comment-card";
import { CommentInput } from "./components/comment-input";
import { organizeCommentsIntoNestedStructure } from "./components/comment-utils";

interface ForumDetailClientProps {
  issueId: string;
}

export default function ForumDetailClient({ issueId }: ForumDetailClientProps) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyingToAuthor, setReplyingToAuthor] = useState<string>("");
  const [replyingToContent, setReplyingToContent] = useState<string>("");

  const { user } = useAuth();
  const { data: exploreIssuesData, isLoading: isLoadingExplore } =
    useForumIssuesQuery();
  useMyForumIssuesQuery();
  const { data: commentsData, isLoading: isLoadingComments } =
    useForumCommentsQuery(issueId);
  const { deleteWithToast } = useForumIssueMutation();
  const {
    createWithToast,
    updateWithToast: updateCommentWithToast,
    deleteWithToast: deleteCommentWithToast,
  } = useForumCommentMutation();

  const issue = exploreIssuesData?.data?.find(
    (i: ForumIssueDao) => i.issue_id === issueId
  );

  const isLoading = isLoadingExplore || isLoadingComments;
  const comments = commentsData?.data || [];
  const nestedComments = organizeCommentsIntoNestedStructure(comments);

  const handleDeleteIssue = () => {
    setShowDeleteDialog(true);
  };

  const confirmDeleteIssue = async () => {
    if (issue) {
      await deleteWithToast(issue.issue_id);
    }
    setShowDeleteDialog(false);
  };

  const handlePostComment = async (content: string, files: File[]) => {
    if (!issue) return;

    try {
      await createWithToast({
        path: { issue_id: issue.issue_id },
        body: {
          content,
          parent_comment_id: replyingTo,
          files: files.length > 0 ? files : null,
        },
      } as CreateCommentApiUserForumIssuesIssueIdCommentsPostData);

      setReplyingTo(null);
      setReplyingToAuthor("");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to post comment"
      );
    }
  };

  const handleReplyToComment = (
    commentId: string,
    authorName: string,
    content: string
  ) => {
    setReplyingTo(commentId);
    setReplyingToAuthor(authorName);
    setReplyingToContent(content);
    // Scroll to the bottom input
    setTimeout(() => {
      const input = document.querySelector(
        'textarea[placeholder*="Share your thoughts"]'
      ) as HTMLTextAreaElement;
      if (input) {
        input.focus();
        input.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyingToAuthor("");
    setReplyingToContent("");
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteCommentWithToast({
        path: { comment_id: commentId },
      } as DeleteCommentApiUserForumCommentsCommentIdDeleteData);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete comment"
      );
    }
  };

  const handleEditComment = async (
    commentId: string,
    content: string,
    files?: File[]
  ) => {
    try {
      await updateCommentWithToast({
        body: {
          content: content,
          files: files || null,
        },
        path: { comment_id: commentId },
      } as UpdateCommentApiUserForumCommentsCommentIdPutData);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update comment"
      );
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return `Posted on ${date.toLocaleDateString("en-CA")}`;
  };

  if (isLoading) {
    return (
      <div className="flex h-full flex-col bg-gradient-to-b from-white to-sky-blue-100">
        <main className="flex w-full flex-1 flex-col gap-4 lg:gap-5">
          <div className="flex w-full flex-col gap-3 rounded-[20px] border border-white-400 bg-white p-4 md:p-5 lg:p-6">
            <div className="flex h-32 items-center justify-center">
              <P level="body" className="text-slate-gray-400">
                Loading issue...
              </P>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="flex h-full flex-col">
        <main className="flex w-full flex-1 flex-col gap-4 lg:gap-5">
          <div className="flex w-full flex-col gap-3 rounded-[20px] border border-white-400 bg-white p-4 md:p-5 lg:p-6">
            <div className="flex h-32 items-center justify-center">
              <H3 weight="semibold" level="h5" className="text-deep-navy">
                Issue not found
              </H3>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <main className="flex w-full flex-1 flex-col gap-4 pb-6 lg:gap-5">
        {/* Main Issue Card */}
        <div className="flex w-full flex-col gap-3 rounded-[20px] border border-white-400 bg-white p-4 md:p-5 lg:p-6">
          <div className="flex items-start justify-between">
            <div className="flex flex-1 items-start gap-3">
              {/* Avatar */}
              <Avatar className="h-10 w-10 border-2 border-sky-blue-500">
                <AvatarImage
                  src={issue.user?.profile_picture_url || undefined}
                  alt={
                    `${issue.user?.first_name || ""} ${issue.user?.last_name || ""}`.trim() ||
                    issue.user?.email
                  }
                  className="h-full w-full object-cover"
                />
                <AvatarFallback className="bg-sky-blue-100 text-deep-navy">
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>

              {/* Issue Info */}
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-1">
                  {/* Title */}
                  <H3 weight="semibold" level="h5" className="text-deep-navy">
                    {issue.title}
                  </H3>
                  <div className="flex items-center gap-2">
                    {/* Author */}
                    <Small className="text-slate-gray-400">
                      {`${issue.user?.first_name || ""} ${issue.user?.last_name || ""}`.trim() ||
                        issue.user?.email ||
                        "Unknown"}
                    </Small>
                    <Small className="text-slate-gray-400">•</Small>
                    {/* Timestamp */}
                    <Small className="text-slate-gray-400">
                      {formatTimestamp(issue.created_at)}
                    </Small>
                  </div>
                </div>

                {/* Description */}
                {issue.description && (
                  <P level="body" className="break-words text-deep-navy">
                    {issue.description}
                  </P>
                )}

                {/* Attachments */}
                {issue.attachments &&
                  issue.attachments.length > 0 &&
                  (() => {
                    const { images, files } = separateAttachments(
                      issue.attachments
                    );

                    return (
                      <div className="flex flex-col gap-3">
                        {/* Image Attachments */}
                        {images.length > 0 && (
                          <ImageAttachmentPreview
                            images={images}
                            maxVisible={4}
                          />
                        )}

                        {/* File Attachments */}
                        {files.length > 0 && (
                          <FileAttachmentContainer
                            attachments={files}
                            isFileViewer={true}
                          />
                        )}
                      </div>
                    );
                  })()}

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <MessageCircle className="h-4 w-4" />
                  <Small>{issue.comment_count}</Small>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(`/forum/${issueId}/edit`)}
                className="text-blue-500 hover:bg-blue-50 hover:text-blue-600"
              >
                <Edit className="mr-1 h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDeleteIssue}
                className="text-red-500 hover:bg-red-50 hover:text-red-600"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        {nestedComments.length > 0 && (
          <div className="flex w-full flex-col gap-3">
            <H3 weight="semibold" level="h5" className="text-deep-navy">
              Comments ({issue.comment_count})
            </H3>

            <div className="flex w-full flex-col gap-3">
              {nestedComments.map(comment => (
                <CommentCard
                  key={comment.commentId}
                  {...comment}
                  currentUserId={user?.id}
                  onReply={handleReplyToComment}
                  onEdit={handleEditComment}
                  onDelete={handleDeleteComment}
                />
              ))}
            </div>
          </div>
        )}

        {/* Add Comment Section */}
        <CommentInput
          onSubmit={handlePostComment}
          isReplying={!!replyingTo}
          replyingToAuthor={replyingToAuthor}
          replyingToContent={replyingToContent}
          onCancelReply={handleCancelReply}
        />
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
