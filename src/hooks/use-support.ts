"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  type BodyCreateTicketApiUserSupportTicketsPost,
  createTicketApiUserSupportTicketsPost,
  deleteTicketApiUserSupportTicketsTicketIdDelete,
  getTicketApiUserSupportTicketsTicketIdGet,
  listMyTicketsApiUserSupportTicketsGet,
  type Options,
  updateTicketApiUserSupportTicketsTicketIdPut,
  type UpdateTicketApiUserSupportTicketsTicketIdPutData,
} from "../sdk/out";

export const SUPPORT_QUERY_KEY = ["support-tickets"] as const;
export const SUPPORT_TICKET_QUERY_KEY = (ticketId: string) =>
  ["support-ticket", ticketId] as const;

export const useSupportTicketsQuery = (params?: {
  search?: string | null;
  limit?: number | null;
  currentPage?: number | null;
}) => {
  return useQuery({
    queryKey: [...SUPPORT_QUERY_KEY, params],
    queryFn: async () => {
      try {
        const res = await listMyTicketsApiUserSupportTicketsGet({
          query: {
            search: params?.search ?? null,
            limit: params?.limit ?? null,
            current_page: params?.currentPage ?? null,
          },
        });

        if (!res.data?.success) {
          throw new Error(
            res.error?.message || "Failed to load support tickets"
          );
        }
        return res.data;
      } catch (e) {
        const message =
          e instanceof Error ? e.message : "Failed to load support tickets";
        toast.error(message);
        throw e;
      }
    },
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSupportTicketQuery = (ticketId: string) => {
  return useQuery({
    queryKey: SUPPORT_TICKET_QUERY_KEY(ticketId),
    queryFn: async () => {
      try {
        const res = await getTicketApiUserSupportTicketsTicketIdGet({
          path: { ticket_id: ticketId },
        });

        if (!res.data?.success) {
          throw new Error(
            res.error?.message || "Failed to load support ticket"
          );
        }
        return res.data;
      } catch (e) {
        const message =
          e instanceof Error ? e.message : "Failed to load support ticket";
        toast.error(message);
        throw e;
      }
    },
    enabled: !!ticketId,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

export const useSupportTicketMutation = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: BodyCreateTicketApiUserSupportTicketsPost) => {
      const res = await createTicketApiUserSupportTicketsPost({
        body: data,
      });

      if (!res.data?.success) {
        throw new Error(
          res.error?.message || "Failed to create support ticket"
        );
      }

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUPPORT_QUERY_KEY });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      ticketId,
      data,
    }: {
      ticketId: string;
      data: UpdateTicketApiUserSupportTicketsTicketIdPutData;
    }) => {
      const updateData = {
        path: { ticket_id: ticketId },
        body: data.body,
      };

      const res = await updateTicketApiUserSupportTicketsTicketIdPut(
        updateData as Options<
          UpdateTicketApiUserSupportTicketsTicketIdPutData,
          false
        >
      );

      if (!res.data?.success) {
        throw new Error(
          res.error?.message || "Failed to update support ticket"
        );
      }

      return res.data;
    },
    onSuccess: (_, { ticketId }) => {
      queryClient.invalidateQueries({ queryKey: SUPPORT_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: SUPPORT_TICKET_QUERY_KEY(ticketId),
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (ticketId: string) => {
      const res = await deleteTicketApiUserSupportTicketsTicketIdDelete({
        path: { ticket_id: ticketId },
      });

      if (!res.data?.success) {
        throw new Error(
          res.error?.message || "Failed to delete support ticket"
        );
      }

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUPPORT_QUERY_KEY });
    },
  });

  const createWithToast = async (
    data: BodyCreateTicketApiUserSupportTicketsPost,
    onSuccessCallback?: () => void
  ) => {
    return await toast.promise(
      createMutation.mutateAsync(data).then(() => {
        onSuccessCallback?.();
      }),
      {
        loading: "Creating support ticket...",
        success: () => ({
          message: "Support ticket created successfully",
          description:
            "Your ticket has been submitted and our team will review it soon.",
        }),
        error: (e: unknown) => ({
          message: "Failed to create support ticket",
          description: e instanceof Error ? e.message : "Please try again",
        }),
      }
    );
  };

  const updateWithToast = async (
    ticketId: string,
    data: UpdateTicketApiUserSupportTicketsTicketIdPutData,
    onSuccessCallback?: () => void
  ) => {
    return await toast.promise(
      updateMutation.mutateAsync({ ticketId, data }).then(() => {
        onSuccessCallback?.();
      }),
      {
        loading: "Updating support ticket...",
        success: () => ({
          message: "Support ticket updated successfully",
          description: "Your changes have been saved.",
        }),
        error: (e: unknown) => ({
          message: "Failed to update support ticket",
          description: e instanceof Error ? e.message : "Please try again",
        }),
      }
    );
  };

  const deleteWithToast = async (
    ticketId: string,
    onSuccessCallback?: () => void
  ) => {
    return await toast.promise(
      deleteMutation.mutateAsync(ticketId).then(() => {
        onSuccessCallback?.();
      }),
      {
        loading: "Deleting support ticket...",
        success: () => ({
          message: "Support ticket deleted successfully",
          description: "The ticket has been removed from your list.",
        }),
        error: (e: unknown) => ({
          message: "Failed to delete support ticket",
          description: e instanceof Error ? e.message : "Please try again",
        }),
      }
    );
  };

  return {
    createWithToast,
    updateWithToast,
    deleteWithToast,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
