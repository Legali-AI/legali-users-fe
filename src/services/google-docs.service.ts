import { api } from "@/lib/api-client";
import { getAccessToken } from "@/lib/auth";
import type {
  GoogleAuthStatus,
  GoogleDocument,
  GoogleDocumentContent,
  CreateDocumentRequest,
  CreateDocumentResponse,
  GoogleConfig,
  DriveFileList,
  DriveFile,
} from "@/types/google-docs";

export const googleDocsService = {
  /**
   * Get Google OAuth authentication status
   */
  getAuthStatus: async (): Promise<GoogleAuthStatus> => {
    const response = await api.get<{ data: GoogleAuthStatus }>("/api/google/auth/status");
    return response.data;
  },

  /**
   * Initiate Google OAuth flow
   * Returns the OAuth URL to redirect user to
   */
  initiateAuth: async (): Promise<string> => {
    const response = await api.get<{ data: { authUrl: string } }>("/api/google/auth/init");
    return response.data.authUrl;
  },

  /**
   * Revoke Google OAuth access
   */
  revokeAuth: async (): Promise<void> => {
    await api.post("/api/google/auth/revoke");
  },

  /**
   * Create a new Google Doc
   */
  createDocument: async (request: CreateDocumentRequest): Promise<CreateDocumentResponse> => {
    const response = await api.post<{ data: CreateDocumentResponse }>(
      "/api/google/docs",
      request
    );
    return response.data;
  },

  /**
   * Get list of user's Google Docs
   */
  getUserDocuments: async (): Promise<GoogleDocument[]> => {
    const response = await api.get<{ data: GoogleDocument[] }>("/api/google/docs");
    return response.data;
  },

  /**
   * Get a specific document by ID
   */
  getDocument: async (id: string): Promise<GoogleDocument> => {
    const response = await api.get<{ data: GoogleDocument }>(`/api/google/docs/${id}`);
    return response.data;
  },

  /**
   * Get document content (fresh from Google)
   */
  getDocumentContent: async (id: string): Promise<GoogleDocumentContent> => {
    const response = await api.get<{ data: GoogleDocumentContent }>(
      `/api/google/docs/${id}/content`
    );
    return response.data;
  },

  /**
   * Export document as PDF or DOCX
   */
  exportDocument: async (id: string, format: "pdf" | "docx" = "pdf"): Promise<Blob> => {
    const token = getAccessToken();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/google/docs/${id}/export?format=${format}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token || ""}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to export document");
    }

    return response.blob();
  },

  /**
   * Delete a document
   */
  deleteDocument: async (id: string): Promise<void> => {
    await api.delete(`/api/google/docs/${id}`);
  },

  // Google Drive Methods

  /**
   * Get Google API configuration (API key, etc.)
   */
  getGoogleConfig: async (): Promise<GoogleConfig> => {
    const response = await api.get<{ data: GoogleConfig }>("/api/google/config");
    return response.data;
  },

  /**
   * List files from Google Drive
   * @param pageSize Number of files to return per page (default: 50)
   * @param pageToken Token for pagination
   * @param query Search query to filter files
   */
  listDriveFiles: async (
    pageSize?: number,
    pageToken?: string,
    query?: string
  ): Promise<DriveFileList> => {
    const params = new URLSearchParams();
    if (pageSize) params.append("pageSize", pageSize.toString());
    if (pageToken) params.append("pageToken", pageToken);
    if (query) params.append("query", query);

    const queryString = params.toString();
    const url = `/api/google/drive/files${queryString ? `?${queryString}` : ""}`;

    const response = await api.get<{ data: DriveFileList }>(url);
    return response.data;
  },

  /**
   * Get metadata for a specific Drive file
   * @param fileId Google Drive file ID
   */
  getDriveFileMetadata: async (fileId: string): Promise<DriveFile> => {
    const response = await api.get<{ data: DriveFile }>(
      `/api/google/drive/files/${fileId}/metadata`
    );
    return response.data;
  },

  /**
   * Download a file from Google Drive
   * Returns the file as a Blob that can be used to create a File object
   * @param fileId Google Drive file ID
   */
  downloadDriveFile: async (fileId: string): Promise<Blob> => {
    const token = getAccessToken();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/google/drive/files/${fileId}/download`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token || ""}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to download file from Google Drive");
    }

    return response.blob();
  },

  /**
   * Download file and convert to File object
   * @param fileId Google Drive file ID
   * @param fileName File name for the downloaded file
   * @param mimeType MIME type of the file
   */
  downloadDriveFileAsFile: async (
    fileId: string,
    fileName: string,
    mimeType: string
  ): Promise<File> => {
    const blob = await googleDocsService.downloadDriveFile(fileId);
    return new File([blob], fileName, { type: mimeType });
  },
};
