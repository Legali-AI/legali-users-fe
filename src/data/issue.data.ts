// Issue types and mock data

export interface Comment {
  id: string;
  author: string;
  authorAvatar?: string;
  message: string;
  attachments?: string[];
  timestamp: string;
  comments: number;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  attachments: string[];
  files?: string[];
  commentsCount: number;
  author: string;
  authorAvatar?: string;
  category: "your-issues" | "explore-issues";
  comments?: Comment[];
}

export const MOCK_ISSUES: Issue[] = [
  {
    id: "issue-001",
    title: "Upload button not working on evidence page",
    description:
      "We've identified that the upload button issue was caused by a recent change in the file validation script. Our development team has rolled back the problematic update and deployed a fix. Please clear your browser cache and try uploading your file again. The button should now function correctly. If you continue to experience issues, let us know so we can investigate further.",
    timestamp: "2025-03-22T10:30:00Z",
    attachments: [
      "/images/issue-attachment-1.jpg",
      "/images/issue-attachment-2.jpg",
      "/images/issue-attachment-3.jpg",
      "/images/issue-attachment-4.jpg",
    ],
    files: ["document.pdf"],
    commentsCount: 14,
    author: "Username",
    authorAvatar: "/avatars/user-1.jpg",
    category: "your-issues",
    comments: [
      {
        id: "comment-001",
        author: "Support Team",
        authorAvatar: "/avatars/support-1.jpg",
        message:
          "Hi Jamal, we're really sorry for the trouble. Our phone system had a temporary outage this morning but it's back online now. If you're still having issues, DM us your case ID and we'll get you connected right away",
        attachments: [
          "/images/comment-attachment-1.jpg",
          "/images/comment-attachment-2.jpg",
          "/images/comment-attachment-3.jpg",
          "/images/comment-attachment-4.jpg",
          "/images/comment-attachment-5.jpg",
        ],
        timestamp: "2025-03-22T11:00:00Z",
        comments: 3,
      },
      {
        id: "comment-002",
        author: "CommunityUser",
        authorAvatar: "/avatars/community-1.jpg",
        message:
          "I had the same issue last week. Clearing the browser cache worked for me. Try Ctrl+F5 to force refresh.",
        timestamp: "2025-03-22T11:30:00Z",
        comments: 1,
      },
    ],
  },
  {
    id: "issue-002",
    title: "Issue name",
    description:
      "Tried calling the law firm's hotline three times this morning—kept getting put on hold for 20+ minutes and then disconnected. Anyone else having this issue? #CustomerService #LawFirmSupport",
    timestamp: "2025-03-22T14:15:00Z",
    attachments: ["/images/issue-attachment-5.jpg", "/images/issue-attachment-6.jpg"],
    commentsCount: 8,
    author: "Username",
    authorAvatar: "/avatars/user-2.jpg",
    category: "your-issues",
  },
  {
    id: "issue-003",
    title: "Issue name",
    description:
      "Tried calling the law firm's hotline three times this morning—kept getting put on hold for 20+ minutes and then disconnected. Anyone else having this issue? #CustomerService #LawFirmSupport",
    timestamp: "2025-02-11T09:45:00Z",
    attachments: [],
    commentsCount: 5,
    author: "Username",
    authorAvatar: "/avatars/user-3.jpg",
    category: "your-issues",
  },
  {
    id: "issue-004",
    title: "Community Issue",
    description:
      "Has anyone experienced delays in document processing? My case documents have been pending review for over a week now. #DocumentProcessing #CaseManagement",
    timestamp: "2024-01-19T16:20:00Z",
    attachments: ["/images/community-attachment-1.jpg"],
    commentsCount: 23,
    author: "CommunityUser",
    authorAvatar: "/avatars/community-1.jpg",
    category: "explore-issues",
  },
  {
    id: "issue-005",
    title: "Legal Advice Request",
    description:
      "Looking for advice on contract disputes. Has anyone dealt with breach of contract cases? What was your experience? #LegalAdvice #ContractDisputes",
    timestamp: "2024-01-18T11:30:00Z",
    attachments: ["/images/legal-attachment-1.jpg", "/images/legal-attachment-2.jpg"],
    commentsCount: 17,
    author: "LegalSeeker",
    authorAvatar: "/avatars/legal-1.jpg",
    category: "explore-issues",
  },
  {
    id: "issue-006",
    title: "Document Upload Problems",
    description:
      "Having trouble uploading PDF documents to my case file. The upload keeps failing after 50% progress. Any solutions? #TechnicalSupport #DocumentUpload",
    timestamp: "2024-01-17T08:30:00Z",
    attachments: [
      "/images/upload-error-1.jpg",
      "/images/upload-error-2.jpg",
      "/images/upload-error-3.jpg",
    ],
    commentsCount: 12,
    author: "TechUser",
    authorAvatar: "/avatars/tech-1.jpg",
    category: "your-issues",
  },
  {
    id: "issue-007",
    title: "Billing Dispute Resolution",
    description:
      "Need help understanding my recent bill. There are charges I don't recognize. How do I dispute these charges? #Billing #DisputeResolution",
    timestamp: "2024-01-16T15:45:00Z",
    attachments: ["/images/bill-dispute.jpg"],
    commentsCount: 9,
    author: "BillingUser",
    authorAvatar: "/avatars/billing-1.jpg",
    category: "explore-issues",
  },
  {
    id: "issue-008",
    title: "Case Status Update",
    description:
      "My case has been 'under review' for 3 weeks now. Is this normal? When can I expect an update? #CaseStatus #Timeline",
    timestamp: "2024-01-15T12:20:00Z",
    attachments: [],
    commentsCount: 6,
    author: "CaseUser",
    authorAvatar: "/avatars/case-1.jpg",
    category: "your-issues",
  },
];

// Helper functions
export const getIssuesByCategory = (category: "your-issues" | "explore-issues"): Issue[] => {
  return MOCK_ISSUES.filter(issue => issue.category === category);
};

export const getAllIssues = (): Issue[] => {
  return MOCK_ISSUES;
};

export const getIssueById = (id: string): Issue | undefined => {
  return MOCK_ISSUES.find(issue => issue.id === id);
};

export const getIssuesByAuthor = (author: string): Issue[] => {
  return MOCK_ISSUES.filter(issue => issue.author === author);
};

export const sortIssuesByDate = (issues: Issue[], ascending: boolean = false): Issue[] => {
  return [...issues].sort((a, b) => {
    const dateA = new Date(a.timestamp).getTime();
    const dateB = new Date(b.timestamp).getTime();
    return ascending ? dateA - dateB : dateB - dateA;
  });
};

export const sortIssuesByComments = (issues: Issue[], ascending: boolean = false): Issue[] => {
  return [...issues].sort((a, b) => {
    return ascending ? a.commentsCount - b.commentsCount : b.commentsCount - a.commentsCount;
  });
};

// Statistics
export const getIssueStats = () => {
  const total = MOCK_ISSUES.length;
  const yourIssues = MOCK_ISSUES.filter(issue => issue.category === "your-issues").length;
  const exploreIssues = MOCK_ISSUES.filter(issue => issue.category === "explore-issues").length;
  const totalComments = MOCK_ISSUES.reduce((sum, issue) => sum + issue.commentsCount, 0);
  const issuesWithAttachments = MOCK_ISSUES.filter(issue => issue.attachments.length > 0).length;

  return {
    total,
    yourIssues,
    exploreIssues,
    totalComments,
    issuesWithAttachments,
    averageCommentsPerIssue: Math.round(totalComments / total),
  };
};

export default {
  MOCK_ISSUES,
  getIssuesByCategory,
  getAllIssues,
  getIssueById,
  getIssuesByAuthor,
  sortIssuesByDate,
  sortIssuesByComments,
  getIssueStats,
};
