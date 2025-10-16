"use client";

import { useEffect, useState, useMemo } from "react";
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FileText,
  RefreshCw,
  ExternalLink,
  Download,
  Trash2,
  CheckCircle,
  XCircle,
  Plus,
  Search,
  MoreVertical,
  Filter,
  ArrowUpDown,
  Clock,
  FolderOpen,
  Zap,
  AlertCircle,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type FilterType = "all" | "recent" | "templates";
type SortType = "date_desc" | "date_asc" | "name_asc" | "name_desc";

export default function LegalDossierPage() {
  const searchParams = useSearchParams();

  // Auth & Documents state
  const [authStatus, setAuthStatus] = useState<GoogleAuthStatus | null>(null);
  const [documents, setDocuments] = useState<GoogleDocument[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<GoogleDocumentContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [sortType, setSortType] = useState<SortType>("date_desc");
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);
  const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] = useState(false);
  const [autoRefreshInterval] = useState(30); // seconds

  // Dialog state
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState("");
  const [newDocContent, setNewDocContent] = useState("");
  const [newDocTemplateType, setNewDocTemplateType] = useState("custom");

  // Toast/notification state
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  // Check for OAuth success/error in URL
  useEffect(() => {
    const success = searchParams.get("success");
    const errorParam = searchParams.get("error");

    if (success === "true") {
      setError(null);
      showNotification("Successfully connected to Google", "success");
      fetchAuthStatus();
      fetchDocuments();
      window.history.replaceState({}, "", "/legal-dossier");
    } else if (errorParam) {
      setError(`OAuth Error: ${errorParam}`);
      showNotification(`Authentication failed: ${errorParam}`, "error");
    }
  }, [searchParams]);

  // Initial load
  useEffect(() => {
    fetchAuthStatus();
    fetchDocuments();
  }, []);

  // Auto-refresh polling
  useEffect(() => {
    if (!isAutoRefreshEnabled || !selectedDoc) return;

    const interval = setInterval(() => {
      handleRefreshContent(true); // silent refresh
    }, autoRefreshInterval * 1000);

    return () => clearInterval(interval);
  }, [isAutoRefreshEnabled, selectedDoc, autoRefreshInterval]);

  // Notification auto-hide
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (message: string, type: "success" | "error" | "info") => {
    setNotification({ message, type });
  };

  const fetchAuthStatus = async () => {
    try {
      const status = await googleDocsService.getAuthStatus();
      setAuthStatus(status);
    } catch (err: any) {
      console.error("Failed to fetch auth status:", err);
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
      window.location.href = authUrl;
    } catch (err: any) {
      setError(err.message || "Failed to initiate Google authentication");
      showNotification("Failed to connect to Google", "error");
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
      showNotification("Disconnected from Google", "info");
    } catch (err: any) {
      setError(err.message || "Failed to disconnect Google account");
      showNotification("Failed to disconnect", "error");
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
        template_type: newDocTemplateType,
      });

      await fetchDocuments();
      setShowCreateDialog(false);
      setNewDocTitle("");
      setNewDocContent("");
      setNewDocTemplateType("custom");

      showNotification(`Document "${newDocTitle}" created successfully`, "success");

      // Auto-select the new document
      handleViewDocument(newDoc.id);
    } catch (err: any) {
      setError(err.message || "Failed to create document");
      showNotification("Failed to create document", "error");
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
      showNotification("Failed to load document", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshContent = async (silent = false) => {
    if (!selectedDoc) return;

    try {
      if (!silent) setLoading(true);
      const content = await googleDocsService.getDocumentContent(selectedDoc.id);
      setSelectedDoc(content);
      if (!silent) showNotification("Document synced successfully", "success");
    } catch (err: any) {
      setError(err.message || "Failed to refresh document content");
      if (!silent) showNotification("Failed to sync document", "error");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const handleExportDocument = async (format: "pdf" | "docx") => {
    if (!selectedDoc) return;

    try {
      setLoading(true);
      const blob = await googleDocsService.exportDocument(selectedDoc.id, format);

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${selectedDoc.title}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      showNotification(`Exported as ${format.toUpperCase()}`, "success");
    } catch (err: any) {
      setError(err.message || "Failed to export document");
      showNotification("Failed to export document", "error");
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
      await fetchDocuments();

      if (selectedDoc?.id === docId) {
        setSelectedDoc(null);
      }

      showNotification("Document deleted successfully", "success");
    } catch (err: any) {
      setError(err.message || "Failed to delete document");
      showNotification("Failed to delete document", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedDocIds.length === 0) return;

    if (!confirm(`Are you sure you want to delete ${selectedDocIds.length} document(s)?`)) {
      return;
    }

    try {
      setLoading(true);

      await Promise.all(
        selectedDocIds.map(id => googleDocsService.deleteDocument(id))
      );

      await fetchDocuments();

      if (selectedDoc && selectedDocIds.includes(selectedDoc.id)) {
        setSelectedDoc(null);
      }

      setSelectedDocIds([]);
      showNotification(`${selectedDocIds.length} document(s) deleted successfully`, "success");
    } catch (err: any) {
      showNotification("Failed to delete some documents", "error");
    } finally {
      setLoading(false);
    }
  };

  const toggleDocumentSelection = (docId: string) => {
    setSelectedDocIds(prev =>
      prev.includes(docId)
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedDocIds.length === filteredAndSortedDocuments.length) {
      setSelectedDocIds([]);
    } else {
      setSelectedDocIds(filteredAndSortedDocuments.map(doc => doc.id));
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

  // Filter and sort documents
  const filteredAndSortedDocuments = useMemo(() => {
    let filtered = [...documents];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(doc =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply type filter
    if (filterType === "recent") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      filtered = filtered.filter(doc => new Date(doc.created_at) >= sevenDaysAgo);
    } else if (filterType === "templates") {
      filtered = filtered.filter(doc => doc.template_type && doc.template_type !== "custom");
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortType) {
        case "date_desc":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "date_asc":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "name_asc":
          return a.title.localeCompare(b.title);
        case "name_desc":
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [documents, searchQuery, filterType, sortType]);

  // Get sync status for a document
  const getSyncStatus = (doc: GoogleDocument): "synced" | "pending" | "error" => {
    // For now, assume all are synced
    // In production, you'd check if there are pending updates
    return "synced";
  };

  const getTemplateTypeLabel = (type?: string): string => {
    if (!type || type === "custom") return "Custom";
    return type.toUpperCase();
  };

  const getTemplateTypeColor = (type?: string): string => {
    const colors: Record<string, string> = {
      nda: "bg-blue-100 text-blue-700",
      contract: "bg-green-100 text-green-700",
      motion: "bg-purple-100 text-purple-700",
      agreement: "bg-orange-100 text-orange-700",
      custom: "bg-slate-gray-100 text-slate-gray-700",
      poc_test: "bg-pink-100 text-pink-700",
    };
    return colors[type || "custom"] || colors.custom;
  };

  // Get template content based on template type
  const getTemplateContent = (templateType: string): string => {
    const templates: Record<string, string> = {
      custom: "",
      nda: `NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement (the "Agreement") is entered into as of [DATE], by and between:

PARTY A: [Company/Individual Name]
Address: [Address]
("Disclosing Party")

AND

PARTY B: [Company/Individual Name]
Address: [Address]
("Receiving Party")

WHEREAS, the Disclosing Party possesses certain confidential and proprietary information; and

WHEREAS, the Receiving Party desires to receive such confidential information for the purpose of [PURPOSE];

NOW, THEREFORE, in consideration of the mutual covenants and agreements contained herein, the parties agree as follows:

1. DEFINITION OF CONFIDENTIAL INFORMATION
   "Confidential Information" means any and all technical and non-technical information disclosed by the Disclosing Party, including but not limited to:
   - Trade secrets, business plans, and financial information
   - Technical data, know-how, research, and product development
   - Software, algorithms, and source code
   - Customer and supplier lists

2. OBLIGATIONS OF RECEIVING PARTY
   The Receiving Party agrees to:
   a) Hold the Confidential Information in strict confidence
   b) Not disclose Confidential Information to any third parties without prior written consent
   c) Use the Confidential Information solely for the agreed purpose
   d) Protect the information with at least the same degree of care used to protect its own confidential information

3. TERM
   This Agreement shall remain in effect for a period of [X] years from the date of execution.

4. RETURN OF MATERIALS
   Upon request or termination of this Agreement, the Receiving Party shall return or destroy all materials containing Confidential Information.

5. GENERAL PROVISIONS
   - This Agreement shall be governed by the laws of [JURISDICTION]
   - Any modification must be in writing and signed by both parties
   - This Agreement constitutes the entire agreement between the parties

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.


_________________________          _________________________
[Disclosing Party Name]            [Receiving Party Name]
Date: _______________              Date: _______________`,

      contract: `PROFESSIONAL SERVICES CONTRACT

This Professional Services Contract (the "Agreement") is made and entered into as of [DATE], by and between:

CLIENT:
Name: [Client Name]
Address: [Client Address]
("Client")

SERVICE PROVIDER:
Name: [Service Provider Name]
Address: [Service Provider Address]
("Service Provider")

1. SERVICES TO BE PROVIDED
   The Service Provider agrees to provide the following services ("Services"):

   [Detailed description of services to be provided]

   The Services shall be performed in accordance with industry standards and completed by [COMPLETION DATE].

2. COMPENSATION
   As compensation for the Services, the Client agrees to pay the Service Provider:

   - Total Contract Value: $[AMOUNT]
   - Payment Schedule: [Payment terms]
   - Payment Method: [Payment method]

   Invoices shall be submitted [FREQUENCY] and are due within [X] days of receipt.

3. TERM AND TERMINATION
   - Contract Period: [START DATE] to [END DATE]
   - Either party may terminate this Agreement with [X] days written notice
   - In the event of material breach, termination may be immediate upon written notice

4. INTELLECTUAL PROPERTY
   All work product, deliverables, and intellectual property created under this Agreement shall be the property of [CLIENT/SERVICE PROVIDER].

5. CONFIDENTIALITY
   Both parties agree to maintain confidentiality of proprietary information shared during the term of this Agreement.

6. INDEPENDENT CONTRACTOR STATUS
   The Service Provider is an independent contractor and not an employee of the Client.

7. LIMITATION OF LIABILITY
   Neither party shall be liable for indirect, incidental, or consequential damages arising from this Agreement.

8. GENERAL PROVISIONS
   - Governing Law: [JURISDICTION]
   - Entire Agreement: This document constitutes the entire agreement
   - Amendments: Must be in writing and signed by both parties

AGREED AND ACCEPTED:


_________________________          _________________________
Client Signature                   Service Provider Signature
Name: _______________              Name: _______________
Date: _______________              Date: _______________`,

      agreement: `GENERAL AGREEMENT

This Agreement (the "Agreement") is entered into as of [DATE], by and between:

FIRST PARTY:
Name: [Party Name]
Address: [Address]
("First Party")

SECOND PARTY:
Name: [Party Name]
Address: [Address]
("Second Party")

RECITALS

WHEREAS, the parties desire to [PURPOSE OF AGREEMENT];

NOW, THEREFORE, in consideration of the mutual promises and covenants contained herein, the parties agree as follows:

1. PURPOSE
   The purpose of this Agreement is to [DETAILED PURPOSE].

2. OBLIGATIONS OF FIRST PARTY
   The First Party agrees to:
   - [Obligation 1]
   - [Obligation 2]
   - [Obligation 3]

3. OBLIGATIONS OF SECOND PARTY
   The Second Party agrees to:
   - [Obligation 1]
   - [Obligation 2]
   - [Obligation 3]

4. TERM
   This Agreement shall commence on [START DATE] and continue until [END DATE] or until terminated as provided herein.

5. COMPENSATION (if applicable)
   [Payment terms, amounts, and schedules]

6. CONFIDENTIALITY
   Both parties agree to maintain the confidentiality of any proprietary or sensitive information shared during the term of this Agreement.

7. TERMINATION
   Either party may terminate this Agreement by providing [X] days written notice to the other party.

8. DISPUTE RESOLUTION
   Any disputes arising under this Agreement shall be resolved through [MEDIATION/ARBITRATION/LITIGATION] in [JURISDICTION].

9. GENERAL PROVISIONS
   - This Agreement shall be governed by the laws of [JURISDICTION]
   - This Agreement may only be amended in writing signed by both parties
   - This Agreement constitutes the entire agreement between the parties
   - If any provision is found invalid, the remaining provisions shall remain in effect

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.


_________________________          _________________________
First Party Signature              Second Party Signature
Name: _______________              Name: _______________
Title: _______________             Title: _______________
Date: _______________              Date: _______________`,

      motion: `MOTION TO [TYPE OF MOTION]

[COURT NAME]
[COUNTY/DISTRICT]
[STATE]

Case No.: [CASE NUMBER]

[PLAINTIFF NAME],
                    Plaintiff,
v.

[DEFENDANT NAME],
                    Defendant.

MOTION TO [SPECIFIC RELIEF SOUGHT]

TO THE HONORABLE COURT:

COMES NOW, [MOVANT NAME], by and through undersigned counsel, and respectfully moves this Honorable Court to [STATE RELIEF SOUGHT], and in support thereof states as follows:

I. INTRODUCTION

[Brief overview of the motion and the relief being requested]

II. STATEMENT OF FACTS

1. [Relevant fact 1]

2. [Relevant fact 2]

3. [Relevant fact 3]

4. [Additional facts as necessary]

III. LEGAL STANDARD

[Cite and explain the applicable legal standard for the motion]

Under [APPLICABLE LAW/RULE], [explain the standard that the court must apply].

IV. ARGUMENT

A. [First Legal Argument]

[Detailed explanation of why the motion should be granted based on the first legal argument. Include case citations and analysis.]

B. [Second Legal Argument]

[Detailed explanation supporting the second legal argument. Include relevant precedents and statutory authority.]

C. [Third Legal Argument]

[Additional arguments as necessary to support the motion.]

V. CONCLUSION

For the foregoing reasons, [MOVANT] respectfully requests that this Honorable Court GRANT this Motion and [SPECIFIC RELIEF REQUESTED].

Respectfully submitted,

_________________________
[Attorney Name]
[Bar Number]
[Law Firm Name]
[Address]
[Phone]
[Email]

Attorney for [MOVANT]

CERTIFICATE OF SERVICE

I hereby certify that a true and correct copy of the foregoing Motion was served upon all parties of record via [METHOD OF SERVICE] on this ___ day of _________, 20___.

_________________________
[Attorney Name]`,

      poc_test: `PROOF OF CONCEPT TEST DOCUMENT

Project: [Project Name]
Date: [Date]
Prepared by: [Name]

EXECUTIVE SUMMARY

This document outlines the proof of concept (PoC) for [PROJECT/FEATURE NAME], demonstrating the feasibility and potential value of the proposed solution.

1. OBJECTIVE

   The primary objective of this PoC is to:
   - [Objective 1]
   - [Objective 2]
   - [Objective 3]

2. SCOPE

   This proof of concept includes:
   - [Scope item 1]
   - [Scope item 2]
   - [Scope item 3]

   Out of scope:
   - [Out of scope item 1]
   - [Out of scope item 2]

3. TEST METHODOLOGY

   The following approach was used to validate the concept:

   Phase 1: [Description]
   Phase 2: [Description]
   Phase 3: [Description]

4. TECHNICAL REQUIREMENTS

   - Technology Stack: [List technologies]
   - Infrastructure: [Infrastructure requirements]
   - Integrations: [Required integrations]
   - Dependencies: [Dependencies]

5. SUCCESS CRITERIA

   The PoC will be considered successful if:
   ✓ [Criterion 1]
   ✓ [Criterion 2]
   ✓ [Criterion 3]

6. RESULTS

   [Document test results, findings, and observations]

   Key Findings:
   - [Finding 1]
   - [Finding 2]
   - [Finding 3]

7. RECOMMENDATIONS

   Based on the PoC results:
   - [Recommendation 1]
   - [Recommendation 2]
   - [Recommendation 3]

8. NEXT STEPS

   If approved, the following steps are recommended:
   1. [Next step 1]
   2. [Next step 2]
   3. [Next step 3]

9. TIMELINE & BUDGET

   Estimated Timeline: [Timeline]
   Estimated Budget: [Budget]

10. CONCLUSION

    [Concluding remarks about the PoC and its viability]


Prepared by: _________________________
Date: _________________________
Approved by: _________________________
Date: _________________________`
    };

    return templates[templateType] || "";
  };

  // Auto-fill content when template type changes
  useEffect(() => {
    if (showCreateDialog) {
      const templateContent = getTemplateContent(newDocTemplateType);
      setNewDocContent(templateContent);
    }
  }, [newDocTemplateType, showCreateDialog]);

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-gradient-to-b from-white to-sky-blue-100">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-white-400 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-gray-900">Legal Dossier</h1>
            <p className="text-sm text-slate-gray-600">Organize and manage your legal documents</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Google Auth Status */}
            {authStatus?.isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="text-sm">Google Connected</span>
                    </div>
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Google Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={fetchAuthStatus}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh Status
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDisconnect} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Disconnect
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={handleConnectGoogle} disabled={loading} className="gap-2">
                <User className="h-4 w-4" />
                Connect Google
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg ${
          notification.type === "success" ? "bg-green-50 text-green-800 border border-green-200" :
          notification.type === "error" ? "bg-red-50 text-red-800 border border-red-200" :
          "bg-blue-50 text-blue-800 border border-blue-200"
        }`}>
          {notification.type === "success" && <CheckCircle className="h-5 w-5" />}
          {notification.type === "error" && <AlertCircle className="h-5 w-5" />}
          {notification.type === "info" && <AlertCircle className="h-5 w-5" />}
          <span className="text-sm font-medium">{notification.message}</span>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="flex-shrink-0 bg-red-50 border-b border-red-200 px-6 py-3">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      {authStatus?.isAuthenticated ? (
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <aside className="w-80 flex-shrink-0 border-r border-white-400 bg-white flex flex-col">
            {/* Search & Filters */}
            <div className="p-4 space-y-3 border-b border-white-400">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-gray-400" />
                <Input
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Filter & Sort Row */}
              <div className="flex gap-2">
                <Select value={filterType} onValueChange={(value) => setFilterType(value as FilterType)}>
                  <SelectTrigger className="flex-1">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All ({documents.length})</SelectItem>
                    <SelectItem value="recent">
                      Recent ({documents.filter(d => {
                        const sevenDaysAgo = new Date();
                        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                        return new Date(d.created_at) >= sevenDaysAgo;
                      }).length})
                    </SelectItem>
                    <SelectItem value="templates">
                      Templates ({documents.filter(d => d.template_type && d.template_type !== "custom").length})
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortType} onValueChange={(value) => setSortType(value as SortType)}>
                  <SelectTrigger className="w-[110px]">
                    <div className="flex items-center gap-2">
                      <ArrowUpDown className="h-4 w-4" />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date_desc">Newest</SelectItem>
                    <SelectItem value="date_asc">Oldest</SelectItem>
                    <SelectItem value="name_asc">A → Z</SelectItem>
                    <SelectItem value="name_desc">Z → A</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Create New Button */}
              <Button
                onClick={() => setShowCreateDialog(true)}
                className="w-full gap-2"
                disabled={loading}
              >
                <Plus className="h-4 w-4" />
                New Document
              </Button>

              {/* Bulk Actions */}
              {selectedDocIds.length > 0 && (
                <div className="flex items-center justify-between p-2 bg-sky-blue-50 rounded-lg">
                  <span className="text-sm text-slate-gray-700">{selectedDocIds.length} selected</span>
                  <Button
                    onClick={handleBulkDelete}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              )}
            </div>

            {/* Documents List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {filteredAndSortedDocuments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FolderOpen className="h-12 w-12 text-slate-gray-300 mb-3" />
                  <p className="text-sm text-slate-gray-600 font-medium">No documents found</p>
                  <p className="text-xs text-slate-gray-400 mt-1">Create your first document to get started</p>
                </div>
              ) : (
                <>
                  {/* Select All */}
                  {filteredAndSortedDocuments.length > 1 && (
                    <div className="flex items-center gap-2 pb-2">
                      <Checkbox
                        checked={selectedDocIds.length === filteredAndSortedDocuments.length}
                        onCheckedChange={toggleSelectAll}
                      />
                      <span className="text-xs text-slate-gray-600">Select all</span>
                    </div>
                  )}

                  {filteredAndSortedDocuments.map((doc) => {
                    const syncStatus = getSyncStatus(doc);
                    const isSelected = selectedDoc?.id === doc.id;
                    const isChecked = selectedDocIds.includes(doc.id);

                    return (
                      <div
                        key={doc.id}
                        className={`group relative flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                          isSelected
                            ? "border-sky-blue-500 bg-sky-blue-50 shadow-sm"
                            : "border-white-400 bg-white hover:border-sky-blue-300 hover:shadow-sm"
                        }`}
                      >
                        {/* Checkbox */}
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => toggleDocumentSelection(doc.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="mt-1"
                        />

                        {/* Document Info */}
                        <div
                          className="flex-1 min-w-0"
                          onClick={() => handleViewDocument(doc.id)}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <FileText className="h-4 w-4 text-sky-blue-600 flex-shrink-0" />
                              <span className="text-sm font-medium text-slate-gray-900 truncate">
                                {doc.title || "Untitled"}
                              </span>
                            </div>

                            {/* Sync Status Badge */}
                            {syncStatus === "synced" && (
                              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            )}
                            {syncStatus === "pending" && (
                              <Clock className="h-4 w-4 text-amber-500 flex-shrink-0 animate-pulse" />
                            )}
                            {syncStatus === "error" && (
                              <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                            )}
                          </div>

                          {/* Template Type Badge */}
                          {doc.template_type && (
                            <Badge
                              className={`mt-2 text-xs ${getTemplateTypeColor(doc.template_type)}`}
                            >
                              {getTemplateTypeLabel(doc.template_type)}
                            </Badge>
                          )}

                          {/* Date */}
                          <p className="text-xs text-slate-gray-500 mt-1">
                            {new Date(doc.created_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric"
                            })}
                          </p>
                        </div>

                        {/* Delete Button */}
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteDocument(doc.id);
                          }}
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </aside>

          {/* Document Viewer */}
          <main className="flex-1 overflow-hidden flex flex-col bg-gradient-to-b from-white to-sky-blue-50">
            {selectedDoc ? (
              <>
                {/* Document Header */}
                <div className="flex-shrink-0 border-b border-white-400 bg-white px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-bold text-slate-gray-900 truncate">
                        {selectedDoc.title}
                      </h2>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-slate-gray-600">
                          Last synced: {new Date(selectedDoc.last_modified_at).toLocaleString()}
                        </span>
                        {isAutoRefreshEnabled && (
                          <Badge variant="outline" className="gap-1">
                            <Zap className="h-3 w-3" />
                            Auto-sync enabled
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => setIsAutoRefreshEnabled(!isAutoRefreshEnabled)}
                        variant={isAutoRefreshEnabled ? "default" : "outline"}
                        size="sm"
                      >
                        <Zap className="h-4 w-4 mr-1" />
                        {isAutoRefreshEnabled ? "Auto-sync ON" : "Auto-sync OFF"}
                      </Button>

                      <Button
                        onClick={() => handleRefreshContent(false)}
                        variant="outline"
                        size="sm"
                        disabled={loading}
                      >
                        <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} />
                        Sync
                      </Button>

                      <Button
                        onClick={() => window.open(selectedDoc.url, "_blank")}
                        variant="outline"
                        size="sm"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Open in Google Docs
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Document Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="mx-auto max-w-4xl">
                    {/* Content Display */}
                    <div className="bg-white border border-white-400 rounded-[20px] p-8 shadow-sm min-h-[600px]">
                      <div className="prose prose-slate max-w-none">
                        <pre className="whitespace-pre-wrap font-sans text-slate-gray-900 leading-relaxed">
                          {extractTextContent(selectedDoc.content) || "No content"}
                        </pre>
                      </div>
                    </div>

                    {/* Info Box */}
                    <div className="mt-6 p-4 bg-sky-blue-50 border border-sky-blue-200 rounded-lg">
                      <p className="text-sm text-sky-blue-900">
                        💡 <strong>Tip:</strong> Open this document in Google Docs to make edits, then click
                        <strong> Sync</strong> to see your changes here. Auto-sync will refresh automatically every {autoRefreshInterval} seconds.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Footer */}
                <div className="flex-shrink-0 border-t border-white-400 bg-white px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handleExportDocument("pdf")}
                        variant="outline"
                        size="sm"
                        disabled={loading}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Export PDF
                      </Button>
                      <Button
                        onClick={() => handleExportDocument("docx")}
                        variant="outline"
                        size="sm"
                        disabled={loading}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Export DOCX
                      </Button>
                    </div>

                    <Button
                      onClick={() => handleDeleteDocument(selectedDoc.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete Document
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              /* Empty State */
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <FileText className="h-24 w-24 text-slate-gray-200 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-gray-900 mb-2">
                    No document selected
                  </h3>
                  <p className="text-sm text-slate-gray-600">
                    Select a document from the sidebar to view its content
                  </p>
                </div>
              </div>
            )}
          </main>
        </div>
      ) : (
        /* Not Connected State */
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <div className="h-20 w-20 rounded-full bg-sky-blue-100 flex items-center justify-center mx-auto mb-6">
              <User className="h-10 w-10 text-sky-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-gray-900 mb-3">
              Connect Your Google Account
            </h2>
            <p className="text-slate-gray-600 mb-6">
              To access your legal dossier and manage documents, please connect your Google account.
              Your documents will be stored in your Google Drive and synced automatically.
            </p>
            <Button onClick={handleConnectGoogle} disabled={loading} size="lg" className="gap-2">
              <User className="h-5 w-5" />
              {loading ? "Connecting..." : "Connect with Google"}
            </Button>
          </div>
        </div>
      )}

      {/* Create Document Dialog */}
      <Dialog
        open={showCreateDialog}
        onOpenChange={(open) => {
          setShowCreateDialog(open);
          if (!open) {
            // Reset form when dialog is closed
            setNewDocTitle("");
            setNewDocContent("");
            setNewDocTemplateType("custom");
          }
        }}
      >
        <DialogContent className="sm:max-w-[700px] max-h-[85vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Create New Document</DialogTitle>
            <DialogDescription>
              Create a new legal document in Google Docs
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4 overflow-y-auto flex-1 px-1">
            {/* Title */}
            <div>
              <label className="text-sm font-medium mb-2 block">Document Title *</label>
              <Input
                value={newDocTitle}
                onChange={(e) => setNewDocTitle(e.target.value)}
                placeholder="e.g., Non-Disclosure Agreement"
              />
            </div>

            {/* Template Type */}
            <div>
              <label className="text-sm font-medium mb-2 block">Template Type</label>
              <Select value={newDocTemplateType} onValueChange={setNewDocTemplateType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="custom">Custom Document</SelectItem>
                  <SelectItem value="nda">Non-Disclosure Agreement</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="agreement">Agreement</SelectItem>
                  <SelectItem value="motion">Motion</SelectItem>
                  <SelectItem value="poc_test">PoC Test</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Content */}
            <div>
              <label className="text-sm font-medium mb-2 block">Initial Content (Optional)</label>
              <Textarea
                value={newDocContent}
                onChange={(e) => setNewDocContent(e.target.value)}
                placeholder="Enter initial document content..."
                className="min-h-[300px] max-h-[400px] resize-none"
              />
              {newDocContent && (
                <p className="text-xs text-slate-gray-500 mt-2">
                  {newDocContent.length} characters • Scroll to see full template
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="flex-shrink-0">
            <Button
              variant="outline"
              onClick={() => setShowCreateDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateDocument}
              disabled={loading || !newDocTitle.trim()}
            >
              {loading ? "Creating..." : "Create Document"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
