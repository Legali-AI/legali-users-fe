"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { googleDocsService } from "@/services/google-docs.service";
import type {
  GoogleAuthStatus,
  GoogleDocument,
  GoogleDocumentContent,
} from "@/types/google-docs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileText, RefreshCw, ExternalLink, Download, Trash2, CheckCircle, XCircle, Play, Pause } from "lucide-react";

export default function GoogleDocsPoCPage() {
  const searchParams = useSearchParams();
  const [authStatus, setAuthStatus] = useState<GoogleAuthStatus | null>(null);
  const [documents, setDocuments] = useState<GoogleDocument[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<GoogleDocumentContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [newDocTitle, setNewDocTitle] = useState("My Legal Document");
  const [newDocContent, setNewDocContent] = useState("This is a sample legal document created from Legali platform.\n\nYou can edit this document in Google Docs and the changes will be synced back to our platform.");

  // Auto-refresh polling
  const [isPollingEnabled, setIsPollingEnabled] = useState(false);
  const [pollingInterval, setPollingInterval] = useState(30); // seconds

  // Check for OAuth success/error in URL
  useEffect(() => {
    const success = searchParams.get("success");
    const errorParam = searchParams.get("error");

    if (success === "true") {
      setError(null);
      fetchAuthStatus();
      fetchDocuments();
      // Remove query params
      window.history.replaceState({}, "", "/google-docs-poc");
    } else if (errorParam) {
      setError(`OAuth Error: ${errorParam}`);
    }
  }, [searchParams]);

  // Initial load
  useEffect(() => {
    fetchAuthStatus();
    fetchDocuments();
  }, []);

  // Auto-polling for selected document
  useEffect(() => {
    if (!isPollingEnabled || !selectedDoc) return;

    const interval = setInterval(() => {
      handleRefreshContent();
    }, pollingInterval * 1000);

    return () => clearInterval(interval);
  }, [isPollingEnabled, selectedDoc, pollingInterval]);

  const fetchAuthStatus = async () => {
    try {
      const status = await googleDocsService.getAuthStatus();
      setAuthStatus(status);
    } catch (err: any) {
      console.error("Failed to fetch auth status:", err);
      setError(err.message || "Failed to fetch authentication status");
    }
  };

  const fetchDocuments = async () => {
    try {
      const docs = await googleDocsService.getUserDocuments();
      setDocuments(docs);
    } catch (err: any) {
      console.error("Failed to fetch documents:", err);
    }
  };

  const handleConnectGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      const authUrl = await googleDocsService.initiateAuth();
      // Redirect to Google OAuth
      window.location.href = authUrl;
    } catch (err: any) {
      setError(err.message || "Failed to initiate Google authentication");
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setLoading(true);
      setError(null);
      await googleDocsService.revokeAuth();
      setAuthStatus({ ...authStatus!, isAuthenticated: false });
      setDocuments([]);
      setSelectedDoc(null);
    } catch (err: any) {
      setError(err.message || "Failed to disconnect Google account");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDocument = async () => {
    if (!newDocTitle.trim()) {
      setError("Please enter a document title");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const newDoc = await googleDocsService.createDocument({
        title: newDocTitle,
        content: newDocContent,
        template_type: "poc_test",
      });

      // Refresh documents list
      await fetchDocuments();

      // Clear form
      setNewDocTitle("My Legal Document");
      setNewDocContent("This is a sample legal document created from Legali platform.\n\nYou can edit this document in Google Docs and the changes will be synced back to our platform.");

      // Auto-select the new document
      handleViewDocument(newDoc.id);
    } catch (err: any) {
      setError(err.message || "Failed to create document");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDocument = async (docId: string) => {
    try {
      setLoading(true);
      setError(null);
      const content = await googleDocsService.getDocumentContent(docId);
      setSelectedDoc(content);
    } catch (err: any) {
      setError(err.message || "Failed to fetch document content");
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshContent = async () => {
    if (!selectedDoc) return;

    try {
      setLoading(true);
      const content = await googleDocsService.getDocumentContent(selectedDoc.id);
      setSelectedDoc(content);
    } catch (err: any) {
      setError(err.message || "Failed to refresh document content");
    } finally {
      setLoading(false);
    }
  };

  const handleExportDocument = async (format: "pdf" | "docx") => {
    if (!selectedDoc) return;

    try {
      setLoading(true);
      const blob = await googleDocsService.exportDocument(selectedDoc.id, format);

      // Download the file
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${selectedDoc.title}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      setError(err.message || "Failed to export document");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    if (!confirm("Are you sure you want to delete this document record? (The document will remain in your Google Drive)")) {
      return;
    }

    try {
      setLoading(true);
      await googleDocsService.deleteDocument(docId);

      // Refresh list
      await fetchDocuments();

      // Clear selection if deleted doc was selected
      if (selectedDoc?.id === docId) {
        setSelectedDoc(null);
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete document");
    } finally {
      setLoading(false);
    }
  };

  // Extract plain text from Google Docs content
  const extractTextContent = (content: any): string => {
    if (!content?.body?.content) return "";

    let text = "";
    for (const element of content.body.content) {
      if (element.paragraph?.elements) {
        for (const el of element.paragraph.elements) {
          if (el.textRun?.content) {
            text += el.textRun.content;
          }
        }
      }
    }
    return text;
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Google Docs Integration PoC</h1>
        <p className="text-gray-600">
          Test Google Docs integration with OAuth, document creation, and real-time sync
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* OAuth Status Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Google Account Connection</span>
            {authStatus?.isAuthenticated ? (
              <Badge variant="default" className="bg-green-500">
                <CheckCircle className="w-4 h-4 mr-1" />
                Connected
              </Badge>
            ) : (
              <Badge variant="secondary">
                <XCircle className="w-4 h-4 mr-1" />
                Not Connected
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            {authStatus?.isAuthenticated
              ? "Your Google account is connected. You can create and manage Google Docs."
              : "Connect your Google account to start creating and managing documents."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            {!authStatus?.isAuthenticated ? (
              <Button onClick={handleConnectGoogle} disabled={loading}>
                {loading ? "Connecting..." : "Connect with Google"}
              </Button>
            ) : (
              <Button onClick={handleDisconnect} variant="outline" disabled={loading}>
                Disconnect
              </Button>
            )}
            <Button onClick={fetchAuthStatus} variant="ghost" size="icon">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>

          {authStatus?.note && (
            <p className="text-sm text-gray-500 mt-2">{authStatus.note}</p>
          )}
        </CardContent>
      </Card>

      {authStatus?.isAuthenticated && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Create & List */}
          <div className="lg:col-span-1 space-y-6">
            {/* Create Document Card */}
            <Card>
              <CardHeader>
                <CardTitle>Create New Document</CardTitle>
                <CardDescription>Create a new Google Doc</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Title</label>
                  <Input
                    value={newDocTitle}
                    onChange={(e) => setNewDocTitle(e.target.value)}
                    placeholder="Document title"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Initial Content</label>
                  <Textarea
                    value={newDocContent}
                    onChange={(e) => setNewDocContent(e.target.value)}
                    placeholder="Document content"
                    rows={6}
                  />
                </div>
                <Button onClick={handleCreateDocument} disabled={loading} className="w-full">
                  {loading ? "Creating..." : "Create Document"}
                </Button>
              </CardContent>
            </Card>

            {/* Documents List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Your Documents ({documents.length})</span>
                  <Button onClick={fetchDocuments} variant="ghost" size="icon">
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </CardTitle>
                <CardDescription>Click to view and edit</CardDescription>
              </CardHeader>
              <CardContent>
                {documents.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No documents yet. Create your first one!
                  </p>
                ) : (
                  <div className="space-y-2">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className={`p-3 rounded border cursor-pointer hover:bg-gray-50 transition ${
                          selectedDoc?.id === doc.id ? "border-blue-500 bg-blue-50" : ""
                        }`}
                        onClick={() => handleViewDocument(doc.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-blue-500" />
                              <span className="font-medium text-sm">{doc.title || "Untitled"}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(doc.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteDocument(doc.id);
                            }}
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Document Preview */}
          <div className="lg:col-span-2">
            {selectedDoc ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{selectedDoc.title}</span>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setIsPollingEnabled(!isPollingEnabled)}
                        variant={isPollingEnabled ? "default" : "outline"}
                        size="sm"
                      >
                        {isPollingEnabled ? (
                          <>
                            <Pause className="w-4 h-4 mr-1" />
                            Stop Auto-Refresh
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-1" />
                            Auto-Refresh ({pollingInterval}s)
                          </>
                        )}
                      </Button>
                      <Button onClick={handleRefreshContent} variant="outline" size="sm" disabled={loading}>
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Refresh
                      </Button>
                      <Button
                        onClick={() => window.open(selectedDoc.url, "_blank")}
                        variant="outline"
                        size="sm"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Open in Google Docs
                      </Button>
                    </div>
                  </CardTitle>
                  <CardDescription>
                    Last modified: {new Date(selectedDoc.last_modified_at).toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <Separator />
                <CardContent className="pt-6">
                  <div className="mb-4 flex gap-2">
                    <Button onClick={() => handleExportDocument("pdf")} variant="outline" size="sm" disabled={loading}>
                      <Download className="w-4 h-4 mr-1" />
                      Export PDF
                    </Button>
                    <Button onClick={() => handleExportDocument("docx")} variant="outline" size="sm" disabled={loading}>
                      <Download className="w-4 h-4 mr-1" />
                      Export DOCX
                    </Button>
                  </div>

                  <div className="bg-white border rounded-lg p-6 min-h-[400px] whitespace-pre-wrap">
                    {extractTextContent(selectedDoc.content) || "No content"}
                  </div>

                  <div className="mt-4 p-4 bg-blue-50 rounded-lg space-y-2">
                    <p className="text-sm text-blue-700">
                      💡 <strong>Tip:</strong> Open this document in Google Docs, make changes, then click "Refresh" to see your edits here!
                    </p>
                    {isPollingEnabled && (
                      <p className="text-xs text-blue-600">
                        ⚡ Auto-refresh is enabled - content will update every {pollingInterval} seconds
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-[600px]">
                  <div className="text-center text-gray-500">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p>Select a document from the list to view its content</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
