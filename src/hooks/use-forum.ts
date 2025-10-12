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
export const FORUM_COMMENT_QUERY_KEY = ["forum", "comment"] as const;

// List all forum issues
export function useForumIssuesQuery(params?: {
  search?: string | null;
  limit?: number | null;
  current_page?: number | null;
}) {
  return useQuery({
    queryKey: [...FORUM_QUERY_KEY, params],
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
      queryClient.invalidateQueries({
        queryKey: FORUM_QUERY_KEY,
        exact: false,
      });
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
      queryClient.invalidateQueries({
        queryKey: FORUM_QUERY_KEY,
        exact: false,
      });
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
      queryClient.invalidateQueries({
        queryKey: FORUM_QUERY_KEY,
        exact: false,
      });
    },
  });

  return {
    createWithToast: async (data: BodyCreateIssueApiUserForumIssuesPost) => {
      return toast.promise(createMutation.mutateAsync(data), {
        loading: "Creating forum issue...",
        success: () => ({
          message: "Forum issue created successfully",
          description: "Your forum issue has been created successfully",
        }),
        error: (error: unknown) => ({
          message: "Failed to create forum issue",
          description:
            error instanceof Error ? error.message : "Please try again",
        }),
      });
    },
    updateWithToast: async (
      data: UpdateIssueApiUserForumIssuesIssueIdPutData
    ) => {
      return toast.promise(updateMutation.mutateAsync(data), {
        loading: "Updating forum issue...",
        success: () => ({
          message: "Forum issue updated successfully",
          description: "Your forum issue has been updated successfully",
        }),
        error: (error: unknown) => ({
          message: "Failed to update forum issue",
          description:
            error instanceof Error ? error.message : "Please try again",
        }),
      });
    },
    deleteWithToast: async (
      issueId: string,
      onSuccessCallback?: () => void
    ) => {
      return toast.promise(
        deleteMutation.mutateAsync(issueId).then(() => {
          onSuccessCallback?.();
        }),
        {
          loading: "Deleting forum issue...",
          success: () => ({
            message: "Forum issue deleted successfully",
            description: "Your forum issue has been deleted successfully",
          }),
          error: (error: unknown) => ({
            message: "Failed to delete forum issue",
            description:
              error instanceof Error ? error.message : "Please try again",
          }),
        }
      );
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
      queryClient.invalidateQueries({
        queryKey: [...FORUM_COMMENT_QUERY_KEY, variables.path.issue_id],
        exact: false,
      });
      // Also invalidate forum issues to update comment counts
      queryClient.invalidateQueries({
        queryKey: FORUM_QUERY_KEY,
        exact: false,
      });
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
      queryClient.invalidateQueries({
        queryKey: FORUM_COMMENT_QUERY_KEY,
        exact: false,
      });
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
      queryClient.invalidateQueries({
        queryKey: FORUM_COMMENT_QUERY_KEY,
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: FORUM_QUERY_KEY,
        exact: false,
      });
    },
  });

  return {
    createWithToast: async (
      data: CreateCommentApiUserForumIssuesIssueIdCommentsPostData
    ) => {
      return toast.promise(createMutation.mutateAsync(data), {
        loading: "Posting comment...",
        success: () => ({
          message: "Comment posted successfully",
          description: "Your comment has been posted successfully",
        }),
        error: (error: unknown) => ({
          message: "Failed to post comment",
          description:
            error instanceof Error ? error.message : "Please try again",
        }),
      });
    },
    updateWithToast: async (
      data: UpdateCommentApiUserForumCommentsCommentIdPutData
    ) => {
      return toast.promise(updateMutation.mutateAsync(data), {
        loading: "Updating comment...",
        success: () => ({
          message: "Comment updated successfully",
          description: "Your comment has been updated successfully",
        }),
        error: (error: unknown) => ({
          message: "Failed to update comment",
          description:
            error instanceof Error ? error.message : "Please try again",
        }),
      });
    },
    deleteWithToast: async (
      data: DeleteCommentApiUserForumCommentsCommentIdDeleteData
    ) => {
      return toast.promise(deleteMutation.mutateAsync(data), {
        loading: "Deleting comment...",
        success: () => ({
          message: "Comment deleted successfully",
          description: "Your comment has been deleted successfully",
        }),
        error: (error: unknown) => ({
          message: "Failed to delete comment",
          description:
            error instanceof Error ? error.message : "Please try again",
        }),
      });
    },
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
