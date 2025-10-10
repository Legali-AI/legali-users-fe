import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
  BodyCreateIssueApiUserForumIssuesPost,
  CreateCommentApiUserForumIssuesIssueIdCommentsPostData,
  DeleteCommentApiUserForumCommentsCommentIdDeleteData,
  UpdateCommentApiUserForumCommentsCommentIdPutData,
  UpdateIssueApiUserForumIssuesIssueIdPutData,
} from "../sdk/out";
import {
  createCommentApiUserForumIssuesIssueIdCommentsPost,
  createIssueApiUserForumIssuesPost,
  deleteCommentApiUserForumCommentsCommentIdDelete,
  deleteIssueApiUserForumIssuesIssueIdDelete,
  listCommentsByIssueApiUserForumIssuesIssueIdCommentsGet,
  listIssuesApiUserForumIssuesGet,
  listMyIssuesApiUserForumIssuesMyGet,
  updateCommentApiUserForumCommentsCommentIdPut,
  updateIssueApiUserForumIssuesIssueIdPut,
} from "../sdk/out";

// Query keys
export const FORUM_QUERY_KEY = ["forum"] as const;
export const FORUM_ISSUE_QUERY_KEY = ["forum", "issue"] as const;
export const FORUM_COMMENT_QUERY_KEY = ["forum", "comment"] as const;

// List all forum issues
export function useForumIssuesQuery(params?: {
  search?: string | null;
  limit?: number | null;
  current_page?: number | null;
}) {
  return useQuery({
    queryKey: [...FORUM_QUERY_KEY, "issues", params],
    queryFn: async () => {
      const res = await listIssuesApiUserForumIssuesGet(
        params ? { query: params } : {}
      );

      if (!res.data?.success) {
        throw new Error(res.error?.message || "Failed to fetch forum issues");
      }

      return res.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// List my forum issues
export function useMyForumIssuesQuery(params?: {
  search?: string | null;
  limit?: number | null;
  current_page?: number | null;
}) {
  return useQuery({
    queryKey: [...FORUM_QUERY_KEY, "my-issues", params],
    queryFn: async () => {
      const res = await listMyIssuesApiUserForumIssuesMyGet(
        params ? { query: params } : {}
      );

      if (!res.data?.success) {
        throw new Error(
          res.error?.message || "Failed to fetch my forum issues"
        );
      }

      return res.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// List comments for an issue
export function useForumCommentsQuery(
  issueId: string,
  params?: {
    limit?: number | null;
    current_page?: number | null;
  }
) {
  return useQuery({
    queryKey: [...FORUM_COMMENT_QUERY_KEY, issueId, params],
    queryFn: async () => {
      const res = await listCommentsByIssueApiUserForumIssuesIssueIdCommentsGet(
        {
          path: { issue_id: issueId },
          ...(params && { query: params }),
        }
      );

      if (!res.data?.success) {
        throw new Error(res.error?.message || "Failed to fetch forum comments");
      }

      return res.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!issueId,
  });
}

// Forum issue mutations
export function useForumIssueMutation() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: BodyCreateIssueApiUserForumIssuesPost) => {
      const res = await createIssueApiUserForumIssuesPost({ body: data });

      if (!res.data?.success) {
        throw new Error(res.error?.message || "Failed to create forum issue");
      }

      return res.data;
    },
    onSuccess: () => {
      // Invalidate and refetch forum queries
      queryClient.refetchQueries({ queryKey: FORUM_QUERY_KEY, exact: false });
    },
    onError: error => {
      toast.error("Failed to create forum issue");
      console.error("Create forum issue error:", error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: UpdateIssueApiUserForumIssuesIssueIdPutData) => {
      const res = await updateIssueApiUserForumIssuesIssueIdPut(data);

      if (!res.data?.success) {
        throw new Error(res.error?.message || "Failed to update forum issue");
      }

      return res.data;
    },
    onSuccess: () => {
      // Invalidate and refetch forum queries
      queryClient.refetchQueries({ queryKey: FORUM_QUERY_KEY, exact: false });
    },
    onError: error => {
      toast.error("Failed to update forum issue");
      console.error("Update forum issue error:", error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (issueId: string) => {
      const res = await deleteIssueApiUserForumIssuesIssueIdDelete({
        path: { issue_id: issueId },
      });

      if (!res.data?.success) {
        throw new Error(res.error?.message || "Failed to delete forum issue");
      }

      return res.data;
    },
    onSuccess: () => {
      // Invalidate and refetch forum queries
      queryClient.refetchQueries({ queryKey: FORUM_QUERY_KEY, exact: false });
    },
    onError: error => {
      toast.error("Failed to delete forum issue");
      console.error("Delete forum issue error:", error);
    },
  });

  return {
    createWithToast: async (data: BodyCreateIssueApiUserForumIssuesPost) => {
      return toast.promise(createMutation.mutateAsync(data), {
        loading: "Creating forum issue...",
        success: "Forum issue created successfully",
        error: "Failed to create forum issue",
      });
    },
    updateWithToast: async (
      data: UpdateIssueApiUserForumIssuesIssueIdPutData
    ) => {
      return toast.promise(updateMutation.mutateAsync(data), {
        loading: "Updating forum issue...",
        success: "Forum issue updated successfully",
        error: "Failed to update forum issue",
      });
    },
    deleteWithToast: async (issueId: string) => {
      return toast.promise(deleteMutation.mutateAsync(issueId), {
        loading: "Deleting forum issue...",
        success: "Forum issue deleted successfully",
        error: "Failed to delete forum issue",
      });
    },
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

// Forum comment mutations
export function useForumCommentMutation() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (
      data: CreateCommentApiUserForumIssuesIssueIdCommentsPostData
    ) => {
      const res =
        await createCommentApiUserForumIssuesIssueIdCommentsPost(data);

      if (!res.data?.success) {
        throw new Error(res.error?.message || "Failed to create forum comment");
      }

      return res.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate forum comments for the specific issue
      queryClient.refetchQueries({
        queryKey: [...FORUM_COMMENT_QUERY_KEY, variables.path.issue_id],
        exact: false,
      });
      // Also invalidate forum issues to update comment counts
      queryClient.refetchQueries({ queryKey: FORUM_QUERY_KEY, exact: false });
      toast.success("Comment posted successfully");
    },
    onError: error => {
      toast.error("Failed to post comment");
      console.error("Create forum comment error:", error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (
      data: UpdateCommentApiUserForumCommentsCommentIdPutData
    ) => {
      const res = await updateCommentApiUserForumCommentsCommentIdPut(data);

      if (!res.data?.success) {
        throw new Error(res.error?.message || "Failed to update forum comment");
      }

      return res.data;
    },
    onSuccess: () => {
      // Invalidate forum comments
      queryClient.refetchQueries({
        queryKey: FORUM_COMMENT_QUERY_KEY,
        exact: false,
      });
      toast.success("Comment updated successfully");
    },
    onError: error => {
      toast.error("Failed to update comment");
      console.error("Update forum comment error:", error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (
      data: DeleteCommentApiUserForumCommentsCommentIdDeleteData
    ) => {
      const res = await deleteCommentApiUserForumCommentsCommentIdDelete(data);

      if (!res.data?.success) {
        throw new Error(res.error?.message || "Failed to delete forum comment");
      }

      return res.data;
    },
    onSuccess: () => {
      // Invalidate forum comments and issues
      queryClient.refetchQueries({
        queryKey: FORUM_COMMENT_QUERY_KEY,
        exact: false,
      });
      queryClient.refetchQueries({ queryKey: FORUM_QUERY_KEY, exact: false });
    },
    onError: error => {
      toast.error("Failed to delete comment");
      console.error("Delete forum comment error:", error);
    },
  });

  return {
    createWithToast: async (
      data: CreateCommentApiUserForumIssuesIssueIdCommentsPostData
    ) => {
      return toast.promise(createMutation.mutateAsync(data), {
        loading: "Posting comment...",
        success: "Comment posted successfully",
        error: "Failed to post comment",
      });
    },
    updateWithToast: async (
      data: UpdateCommentApiUserForumCommentsCommentIdPutData
    ) => {
      return toast.promise(updateMutation.mutateAsync(data), {
        loading: "Updating comment...",
        success: "Comment updated successfully",
        error: "Failed to update comment",
      });
    },
    deleteWithToast: async (
      data: DeleteCommentApiUserForumCommentsCommentIdDeleteData
    ) => {
      return toast.promise(deleteMutation.mutateAsync(data), {
        loading: "Deleting comment...",
        success: "Comment deleted successfully",
        error: "Failed to delete comment",
      });
    },
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
