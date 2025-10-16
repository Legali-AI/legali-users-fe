// Google Docs Types and Interfaces

export interface GoogleAuthStatus {
  isAuthenticated: boolean;
  isExpired: boolean;
  expiresAt: string | null;
  scopes: string[];
  note?: string;
}

export interface GoogleDocument {
  id: string;
  google_doc_id: string;
  title: string;
  url: string;
  created_at: string;
  last_modified_at?: string;
  template_type?: string;
  conversation_id?: string;
}

export interface GoogleDocumentContent {
  id: string;
  google_doc_id: string;
  title: string;
  content: any; // Google Docs API content structure
  last_modified_at: string;
  url: string;
}

export interface CreateDocumentRequest {
  title: string;
  content?: string;
  template_type?: string;
  conversation_id?: string;
}

export interface CreateDocumentResponse {
  id: string;
  google_doc_id: string;
  title: string;
  url: string;
  created_at: string;
}

// Google Drive Types

export interface GoogleConfig {
  googleApiKey: string;
  googleAccessToken: string | null;
}

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  iconLink?: string;
  thumbnailLink?: string;
  webViewLink?: string;
  webContentLink?: string;
  modifiedTime: string;
  createdTime?: string;
}

export interface DriveFileList {
  files: DriveFile[];
  nextPageToken?: string;
}
