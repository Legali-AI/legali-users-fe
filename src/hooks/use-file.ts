"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  type DeleteDocumentApiUserDocumentsDocumentIdDeleteData,
  type ListDocumentsApiUserDocumentsGetData,
  type UploadDocumentsApiUserDocumentsUploadsPostData,
  deleteDocumentApiUserDocumentsDocumentIdDelete,
  downloadDocumentSecureApiUserDocumentsDocumentIdDownloadGet,
  getStorageInfoApiUserDocumentsStorageInfoGet,
  getUserSubscriptionApiUserSubscriptionsGet,
  listDocumentsApiUserDocumentsGet,
  uploadDocumentsApiUserDocumentsUploadsPost,
} from "../sdk/out";

export const FILE_QUERY_KEY = ["files"] as const;

export function useFilesQuery(params?: {
  search?: string | null;
  limit?: number | null;
  current_page?: number | null;
}) {
  return useQuery({
    queryKey: [...FILE_QUERY_KEY, params],
    queryFn: async () => {
      try {
        const res = await listDocumentsApiUserDocumentsGet({
          query: {
            search: params?.search ?? null,
            limit: params?.limit ?? null,
            current_page: params?.current_page ?? null,
          },
        } as ListDocumentsApiUserDocumentsGetData);

        if (!res.data?.success) {
          throw new Error(res.error?.message || "Failed to load documents");
        }

        return res.data;
      } catch (e) {
        const message =
          e instanceof Error ? e.message : "Failed to load documents";
        toast.error(message);
        throw e;
      }
    },
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

export function useFileMutation() {
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (
      data: UploadDocumentsApiUserDocumentsUploadsPostData
    ) => {
      const res = await uploadDocumentsApiUserDocumentsUploadsPost(data);

      if (!res.data?.success) {
        throw new Error(res.error?.message || "Failed to upload documents");
      }

      return res.data;
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: FILE_QUERY_KEY, exact: false });
    },
    onError: error => {
      toast.error("Failed to upload documents");
      console.error("Upload documents error:", error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (
      data: DeleteDocumentApiUserDocumentsDocumentIdDeleteData
    ) => {
      const res = await deleteDocumentApiUserDocumentsDocumentIdDelete(data);

      if (!res.data?.success) {
        throw new Error(res.error?.message || "Failed to delete document");
      }

      return res.data;
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: FILE_QUERY_KEY, exact: false });
    },
    onError: error => {
      toast.error("Failed to delete document");
      console.error("Delete document error:", error);
    },
  });

  return {
    uploadWithToast: async (
      data: UploadDocumentsApiUserDocumentsUploadsPostData,
      onSuccessCallback?: () => void
    ) => {
      return toast.promise(
        uploadMutation.mutateAsync(data).then(() => {
          onSuccessCallback?.();
        }),
        {
          loading: "Uploading documents...",
          success: "Documents uploaded successfully",
          error: "Failed to upload documents",
        }
      );
    },
    deleteWithToast: async (
      data: DeleteDocumentApiUserDocumentsDocumentIdDeleteData,
      onSuccessCallback?: () => void
    ) => {
      return toast.promise(
        deleteMutation.mutateAsync(data).then(() => {
          onSuccessCallback?.();
        }),
        {
          loading: "Deleting document...",
          success: "Document deleted successfully",
          error: "Failed to delete document",
        }
      );
    },
    downloadWithToast: async (
      params: { documentId: string; fileName: string },
      onSuccessCallback?: () => void
    ) => {
      return toast.promise(
        downloadDocumentSecureApiUserDocumentsDocumentIdDownloadGet({
          path: { document_id: params.documentId },
          ...({
            responseType: "blob",
            headers: { Accept: "*/*" },
          } as unknown as Record<string, unknown>),
        }).then((res: unknown) => {
          // Normalize to Blob regardless of client shape
          let blob: Blob;
          const maybeAny = res as unknown;
          if (maybeAny instanceof Blob) {
            blob = maybeAny as Blob;
          } else if (
            typeof maybeAny === "object" &&
            maybeAny !== null &&
            (maybeAny as { data?: unknown }).data instanceof Blob
          ) {
            blob = (maybeAny as { data: Blob }).data;
          } else if (typeof maybeAny === "string") {
            blob = new Blob([maybeAny], { type: "application/octet-stream" });
          } else if (
            typeof maybeAny === "object" &&
            maybeAny !== null &&
            (maybeAny as { byteLength?: number }).byteLength
          ) {
            blob = new Blob([maybeAny as ArrayBuffer], {
              type: "application/octet-stream",
            });
          } else {
            // Fallback: stringify
            blob = new Blob([JSON.stringify(maybeAny)], {
              type: "application/octet-stream",
            });
          }

          const objectUrl = window.URL.createObjectURL(blob);
          const anchor = document.createElement("a");
          anchor.href = objectUrl;
          anchor.download = params.fileName || "document";
          document.body.appendChild(anchor);
          anchor.click();
          anchor.remove();
          setTimeout(() => window.URL.revokeObjectURL(objectUrl), 1000);
          onSuccessCallback?.();
        }),
        {
          loading: "Downloading document...",
          success: "Download started",
          error: "Failed to download document",
        }
      );
    },
    isUploading: uploadMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

export function useStorageInfoQuery() {
  return useQuery({
    queryKey: [...FILE_QUERY_KEY, "storage-info"],
    queryFn: async () => {
      try {
        const res = await getStorageInfoApiUserDocumentsStorageInfoGet();
        if (!res.data?.success) {
          throw new Error(res.error?.message || "Failed to load storage info");
        }
        return res.data.data;
      } catch (e) {
        const message =
          e instanceof Error ? e.message : "Failed to load storage info";
        toast.error(message);
        throw e;
      }
    },
    staleTime: 30 * 1000,
  });
}

export function useSubscriptionInfoQuery() {
  return useQuery({
    queryKey: [...FILE_QUERY_KEY, "subscription-info"],
    queryFn: async () => {
      try {
        const res = await getUserSubscriptionApiUserSubscriptionsGet();
        if (!res.data?.success) {
          throw new Error(
            res.error?.message || "Failed to load subscription info"
          );
        }
        return res.data.data;
      } catch (e) {
        const message =
          e instanceof Error ? e.message : "Failed to load subscription info";
        toast.error(message);
        throw e;
      }
    },
    staleTime: 30 * 1000,
  });
}
