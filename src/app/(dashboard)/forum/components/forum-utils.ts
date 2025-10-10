import type { ForumAttachmentDao, ForumIssueDao } from "../../../../sdk/out";
import type { IssueCardProps } from "./issue-card";

/**
 * Utility function to separate image and file attachments
 */
export const separateAttachments = (attachments: ForumAttachmentDao[] = []) => {
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp)(?:_\d+)?(?:\?.*)?$/i;

  const result = attachments.reduce(
    (acc, attachment) => {
      if (!attachment.url) return acc;

      if (imageExtensions.test(attachment.url)) {
        acc.images.push(attachment.url);
      } else {
        acc.files.push({
          url: attachment.url,
          name:
            attachment.attachment_id ||
            attachment.url.split("/").pop() ||
            "attachment",
        });
      }

      return acc;
    },
    {
      images: [] as string[],
      files: [] as Array<{ url: string; name: string }>,
    }
  );

  return result;
};

/**
 * Utility function to transform ForumIssueDao to IssueCardProps
 */
export const transformForumIssueToCardProps = (
  issue: ForumIssueDao,
  isMine: boolean
): IssueCardProps => {
  const getAuthorName = (user: ForumIssueDao["user"]) => {
    const fullName =
      `${user?.first_name || ""} ${user?.last_name || ""}`.trim();
    return fullName || user?.email || "Unknown";
  };

  const { images, files } = separateAttachments(issue.attachments);

  return {
    id: issue.issue_id,
    title: issue.title,
    description: issue.description || "",
    timestamp: issue.created_at,
    attachments: images,
    files: files.map(f => f.url),
    commentsCount: issue.comment_count || 0,
    author: getAuthorName(issue.user),
    authorAvatar: issue.user?.profile_picture_url || undefined,
    isMine,
  };
};
