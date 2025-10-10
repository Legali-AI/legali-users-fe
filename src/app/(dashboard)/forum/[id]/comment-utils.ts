import type { ForumCommentDao } from "../../../../sdk/out";
import type { CommentCardProps } from "./comment-card";

/**
 * Utility function to transform ForumCommentDao to CommentCardProps
 */
export const transformForumCommentToCardProps = (
  comment: ForumCommentDao
): CommentCardProps => {
  const getAuthorName = (user: ForumCommentDao["user"]) => {
    const fullName =
      `${user?.first_name || ""} ${user?.last_name || ""}`.trim();
    return fullName || user?.email || "Unknown";
  };

  return {
    commentId: comment.comment_id,
    author: getAuthorName(comment.user),
    authorId: comment.user?.id || "",
    authorAvatar: comment.user?.profile_picture_url || undefined,
    message: comment.content,
    attachments: comment.attachments || [],
    comments: comment.comment_count || 0,
  };
};

/**
 * Utility function to organize comments into a nested structure
 */
export const organizeCommentsIntoNestedStructure = (
  comments: ForumCommentDao[]
): CommentCardProps[] => {
  const commentMap = new Map<string, CommentCardProps>();
  const rootComments: CommentCardProps[] = [];

  // First pass: create all comment objects
  comments.forEach(comment => {
    const commentProps = transformForumCommentToCardProps(comment);
    commentMap.set(comment.comment_id, commentProps);
  });

  // Second pass: organize into nested structure
  comments.forEach(comment => {
    const commentProps = commentMap.get(comment.comment_id);
    if (!commentProps) return;

    if (comment.parent_comment_id) {
      const parentComment = commentMap.get(comment.parent_comment_id);
      if (parentComment) {
        if (!parentComment.replies) {
          parentComment.replies = [];
        }
        parentComment.replies.push(commentProps);
      }
    } else {
      rootComments.push(commentProps);
    }
  });

  return rootComments;
};
