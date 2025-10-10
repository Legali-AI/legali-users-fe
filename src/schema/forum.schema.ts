import { z } from "zod";
import { IssueStatus } from "../sdk/out";

// Forum issue schema for form validation
export const forumIssueSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(500, "Title must be less than 500 characters"),
  description: z
    .string()
    .min(10, "Please provide a detailed description")
    .max(2000, "Description must be less than 2000 characters")
    .optional(),
  files: z.array(z.instanceof(File)).optional(),
});

export type ForumIssueFormData = z.infer<typeof forumIssueSchema>;

// Forum comment schema for form validation
export const forumCommentSchema = z.object({
  message: z
    .string()
    .min(1, "Please enter a comment")
    .max(1000, "Comment must be less than 1000 characters"),
  files: z.array(z.instanceof(File)).optional(),
});

export type ForumCommentFormData = z.infer<typeof forumCommentSchema>;

// Status options mapped from IssueStatus enum
export const STATUS_OPTIONS = Object.values(IssueStatus).map(value => ({
  value: value as string,
  label:
    (value as string).charAt(0).toUpperCase() +
    (value as string).slice(1).replace("_", " "),
}));
