"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  type DeleteDocumentApiUserDocumentsDocumentIdDeleteData,
  type ListDocumentsApiUserDocumentsGetData,
  type UploadDocumentApiUserDocumentsUploadPostData,
  deleteDocumentApiUserDocumentsDocumentIdDelete,
  downloadDocumentSecureApiUserDocumentsDocumentIdDownloadGet,
  getStorageInfoApiUserDocumentsStorageInfoGet,
  getUserSubscriptionApiUserSubscriptionsGet,
  listDocumentsApiUserDocumentsGet,
  uploadDocumentApiUserDocumentsUploadPost,
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
    mutationFn: async (files: File[]) => {
      // Upload each file individually using Promise.all
      const uploadPromises = files.map(file =>
        uploadDocumentApiUserDocumentsUploadPost({
          body: { file },
        } as UploadDocumentApiUserDocumentsUploadPostData)
      );

      const results = await Promise.all(uploadPromises);

      // Check if any upload failed
      const failedUploads = results.filter(res => !res.data?.success);
      if (failedUploads.length > 0) {
        // Group all error messages
        const errorMessages = failedUploads
          .map((res, index) => {
            const fileName = files[index]?.name || `File ${index + 1}`;
            const errorMsg = res.error?.message || "Upload failed";
            return `${fileName}: ${errorMsg}`;
          })
          .join("; ");

        const errorMessage =
          failedUploads.length === 1
            ? errorMessages
            : `Failed to upload ${failedUploads.length} files: ${errorMessages}`;

        throw new Error(errorMessage);
      }

      return results;
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: FILE_QUERY_KEY, exact: false });
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
  });

  return {
    uploadWithToast: async (files: File[], onSuccessCallback?: () => void) => {
      return toast.promise(
        uploadMutation.mutateAsync(files).then(() => {
          onSuccessCallback?.();
        }),
        {
          loading: "Uploading documents...",
          success: () => ({
            message: "Documents uploaded successfully",
            description: "Your documents have been uploaded successfully",
          }),
          error: (error: unknown) => ({
            message: "Failed to upload documents",
            description: error instanceof Error ? error.message : "Please try again",
          }),
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
          success: () => ({
            message: "Document deleted successfully",
            description: "Your document has been deleted successfully",
          }),
          error: (error: unknown) => ({
            message: "Failed to delete document",
            description: error instanceof Error ? error.message : "Please try again",
          }),
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
          success: () => ({
            message: "Download started",
            description: "Your document has been downloaded successfully",
          }),
          error: (error: unknown) => ({
            message: "Failed to download document",
            description: error instanceof Error ? error.message : "Please try again",
          }),
        }
      );
    },
    viewWithToast: async (
      params: { documentId: string; fileName: string },
      onSuccessCallback?: () => void
    ) => {
      return toast.promise(
        downloadDocumentSecureApiUserDocumentsDocumentIdDownloadGet({
          path: { document_id: params.documentId },
          ...({
            responseType: "blob",
            headers: { Accept: "application/pdf,application/octet-stream" },
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
            blob = new Blob([maybeAny], { type: "application/pdf" });
          } else if (
            typeof maybeAny === "object" &&
            maybeAny !== null &&
            (maybeAny as { byteLength?: number }).byteLength
          ) {
            blob = new Blob([maybeAny as ArrayBuffer], {
              type: "application/pdf",
            });
          } else {
            // Fallback: stringify
            blob = new Blob([JSON.stringify(maybeAny)], {
              type: "application/pdf",
            });
          }

          // Create object URL and open in new tab
          const objectUrl = window.URL.createObjectURL(blob);
          const newWindow = window.open(objectUrl, "_blank");

          // Clean up the URL after a delay
          setTimeout(() => {
            window.URL.revokeObjectURL(objectUrl);
          }, 1000);

          // Check if popup was blocked
          if (!newWindow) {
            throw new Error(
              "Popup blocked. Please allow popups for this site to view PDFs."
            );
          }

          onSuccessCallback?.();
        }),
        {
          loading: "Opening PDF...",
            success: () => ({
            message: "PDF opened in new tab",
            description: "Your PDF has been opened in a new tab",
          }),
          error: (error: unknown) => ({
            message: "Failed to open PDF",
            description: error instanceof Error ? error.message : "Please try again",
          }),
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
