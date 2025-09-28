// File management types and mock data

export interface FileItem {
  id: string;
  fileName: string;
  summary: string;
  caseTitle: string;
  date: string;
  fileSize?: string;
  fileType?: string;
  status?: "active" | "archived" | "pending";
  aiSummary?: string;
}

export interface FileFilters {
  caseType: string;
  sortBy: string;
  showCount: number;
}

export const MOCK_FILES: FileItem[] = [
  {
    id: "file-001",
    fileName: "Approve.pdf",
    summary: "Contract approval document",
    caseTitle: "Smith vs. Johnson",
    date: "22/12/2025",
    fileSize: "2.4 MB",
    fileType: "PDF",
    status: "active",
    aiSummary:
      "Case Title: Smith v. Greenfield Realty, Inc.\nCourt: Superior Court of Brookfield County\nCase Number: 2025-CV-01482\nDate Filed: March 3, 2025\nStatus: Ongoing (Pre-trial Discovery)\n\nEmily Smith entered into a purchase agreement with Greenfield Realty for a residential property in Brookfield Heights. After closing, she discovered multiple undisclosed structural issues, including foundation cracks and unsafe electrical wiring.",
  },
  {
    id: "file-002",
    fileName: "Contract.docx",
    summary: "Legal contract template",
    caseTitle: "-",
    date: "22/12/2025",
    fileSize: "1.8 MB",
    fileType: "DOCX",
    status: "active",
    aiSummary:
      "Standard legal contract template for property transactions. Contains standard clauses for purchase agreements, including inspection periods, financing contingencies, and closing procedures.",
  },
  {
    id: "file-003",
    fileName: "Evidence.pdf",
    summary: "Supporting evidence files",
    caseTitle: "Brown vs. Davis",
    date: "22/12/2025",
    fileSize: "5.2 MB",
    fileType: "PDF",
    status: "active",
    aiSummary:
      "Case Title: Brown v. Davis Construction\nCourt: District Court of Riverside County\nCase Number: 2025-CV-00891\nDate Filed: February 15, 2025\nStatus: Discovery Phase\n\nEvidence package includes photographs of construction defects, expert witness reports on structural integrity, and correspondence between parties regarding warranty claims.",
  },
  {
    id: "file-004",
    fileName: "Report.xlsx",
    summary: "Financial analysis report",
    caseTitle: "Wilson vs. Miller",
    date: "22/12/2025",
    fileSize: "3.1 MB",
    fileType: "XLSX",
    status: "active",
    aiSummary:
      "Case Title: Wilson v. Miller Financial Services\nCourt: Superior Court of Metro County\nCase Number: 2025-CV-01234\nDate Filed: January 28, 2025\nStatus: Settlement Negotiations\n\nFinancial analysis report detailing investment losses, market performance comparisons, and fiduciary duty breach calculations. Includes expert testimony on standard industry practices.",
  },
  {
    id: "file-005",
    fileName: "Agreement.pdf",
    summary: "Settlement agreement",
    caseTitle: "-",
    date: "22/12/2025",
    fileSize: "1.5 MB",
    fileType: "PDF",
    status: "active",
    aiSummary:
      "Standard settlement agreement template covering confidentiality clauses, payment terms, release of claims, and dispute resolution procedures. Suitable for various civil litigation settlements.",
  },
  {
    id: "file-006",
    fileName: "Statement.docx",
    summary: "Witness statement",
    caseTitle: "Taylor vs. Anderson",
    date: "22/12/2025",
    fileSize: "2.7 MB",
    fileType: "DOCX",
    status: "active",
    aiSummary:
      "Case Title: Taylor v. Anderson Medical Group\nCourt: Superior Court of Health County\nCase Number: 2025-CV-01567\nDate Filed: March 10, 2025\nStatus: Pre-trial Motions\n\nWitness statement from Dr. Sarah Mitchell regarding standard of care in emergency medicine. Details the sequence of events during patient treatment and identifies potential deviations from medical protocols.",
  },
  {
    id: "file-007",
    fileName: "Brief.pdf",
    summary: "Legal brief document",
    caseTitle: "Clark vs. Lewis",
    date: "22/12/2025",
    fileSize: "4.3 MB",
    fileType: "PDF",
    status: "active",
    aiSummary:
      "Case Title: Clark v. Lewis Corporation\nCourt: Federal District Court\nCase Number: 2025-FD-00345\nDate Filed: February 22, 2025\nStatus: Motion for Summary Judgment\n\nLegal brief arguing for summary judgment based on statute of limitations, lack of material facts in dispute, and failure to establish causation. Includes case law citations and legal precedent analysis.",
  },
  {
    id: "file-008",
    fileName: "Motion.docx",
    summary: "Court motion filing",
    caseTitle: "-",
    date: "22/12/2025",
    fileSize: "1.9 MB",
    fileType: "DOCX",
    status: "active",
    aiSummary:
      "Standard motion template for court filings including motion to dismiss, motion for summary judgment, and motion for protective order. Contains procedural requirements and legal standards for each motion type.",
  },
  {
    id: "file-009",
    fileName: "Order.pdf",
    summary: "Court order document",
    caseTitle: "Moore vs. White",
    date: "22/12/2025",
    fileSize: "2.8 MB",
    fileType: "PDF",
    status: "active",
    aiSummary:
      "Case Title: Moore v. White Insurance Company\nCourt: Superior Court of Commerce County\nCase Number: 2025-CV-00987\nDate Filed: March 5, 2025\nStatus: Discovery Dispute\n\nCourt order granting motion to compel discovery, setting deadlines for document production, and establishing protective order for confidential business information. Includes sanctions for non-compliance.",
  },
];

export const CASE_TYPE_OPTIONS = [
  { value: "all", label: "All Cases" },
  { value: "criminal", label: "Criminal" },
  { value: "civil", label: "Civil" },
  { value: "family", label: "Family" },
  { value: "corporate", label: "Corporate" },
];

export const SORT_OPTIONS = [
  { value: "date", label: "Date" },
  { value: "name", label: "Name" },
  { value: "case", label: "Case" },
  { value: "size", label: "Size" },
];

export const SHOW_COUNT_OPTIONS = [
  { value: 8, label: "8" },
  { value: 16, label: "16" },
  { value: 32, label: "32" },
  { value: 64, label: "64" },
];

export function getFilesByCaseType(caseType: string): FileItem[] {
  if (caseType === "all") return MOCK_FILES;
  return MOCK_FILES.filter((file) =>
    file.caseTitle.toLowerCase().includes(caseType.toLowerCase())
  );
}

export function sortFiles(files: FileItem[], sortBy: string): FileItem[] {
  const sorted = [...files];

  switch (sortBy) {
    case "date":
      return sorted.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    case "name":
      return sorted.sort((a, b) => a.fileName.localeCompare(b.fileName));
    case "case":
      return sorted.sort((a, b) => a.caseTitle.localeCompare(b.caseTitle));
    case "size":
      // Mock size sorting - in real app, you'd have actual file sizes
      return sorted.sort((a, b) => a.fileName.length - b.fileName.length);
    default:
      return sorted;
  }
}

export function paginateFiles(
  files: FileItem[],
  page: number,
  pageSize: number
): FileItem[] {
  const startIndex = (page - 1) * pageSize;
  return files.slice(startIndex, startIndex + pageSize);
}
