// Support ticket data types and mock data

// Types
export interface SupportTicket {
  id: string;
  title: string;
  status: "pending" | "in-progress" | "completed" | "closed";
  urgency: "low" | "medium" | "high" | "critical";
  sender: string;
  issue: string;
  description: string;
  attachments: TicketAttachment[];
  responses: TicketResponse;
  createdAt: string;
  updatedAt: string;
  priority: number;
}

export interface TicketAttachment {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: string;
}

export interface TicketResponse {
  id: string;
  message: string;
  author: string;
  authorRole: "support" | "user";
  timestamp: string;
  isInternal?: boolean;
}

// Mock Data
export const SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: "TKT-001",
    title: "Upload button not working on evidence page",
    status: "completed",
    urgency: "medium",
    sender: "john.doe@example.com",
    issue: "Upload button not working on evidence page",
    description:
      "When I try to upload a PDF to my case timeline, the upload button turns grey and nothing happens. I've tried refreshing the page and using a different browser but the problem persists.",
    attachments: [
      {
        id: "att-001",
        name: "Screenshot.png",
        url: "/attachments/screenshot.png",
        size: 245760,
        type: "image/png",
        uploadedAt: "2024-01-15T09:30:00Z",
      },
    ],
    responses: {
      id: "resp-001",
      message:
        "We've identified that the upload button issue was caused by a recent change in the file validation script. Our development team has rolled back the problematic update and deployed a fix. Please clear your browser cache and try uploading your file again. The button should now function correctly. If you continue to experience issues, let us know so we can investigate further.",
      author: "Sarah Johnson",
      authorRole: "support",
      timestamp: "2024-01-15T10:30:00Z",
    },

    createdAt: "2024-01-15T09:15:00Z",
    updatedAt: "2024-01-15T14:20:00Z",
    priority: 2,
  },
  {
    id: "TKT-002",
    title: "Cannot access legal templates",
    status: "in-progress",
    urgency: "high",
    sender: "maria.garcia@company.com",
    issue: "Cannot access legal templates",
    description:
      "I'm trying to access the contract templates but I'm getting a 403 Forbidden error. I have a premium subscription and should have access to all templates. This is urgent as I need to prepare a contract for tomorrow's meeting.",
    attachments: [
      {
        id: "att-002",
        name: "error-screenshot.png",
        url: "/attachments/error-screenshot.png",
        size: 189440,
        type: "image/png",
        uploadedAt: "2024-01-16T08:45:00Z",
      },
      {
        id: "att-003",
        name: "subscription-receipt.pdf",
        url: "/attachments/subscription-receipt.pdf",
        size: 156789,
        type: "application/pdf",
        uploadedAt: "2024-01-16T08:46:00Z",
      },
    ],
    responses: {
      id: "resp-003",
      message:
        "I apologize for the inconvenience. I can see from your subscription receipt that you do have premium access. Let me escalate this to our technical team immediately. In the meantime, I'll provide you with direct access to the templates you need.",
      author: "Michael Chen",
      authorRole: "support",
      timestamp: "2024-01-16T09:15:00Z",
    },
    createdAt: "2024-01-16T08:30:00Z",
    updatedAt: "2024-01-16T09:15:00Z",
    priority: 1,
  },
  {
    id: "TKT-003",
    title: "Lawyer marketplace search not working",
    status: "pending",
    urgency: "low",
    sender: "david.wilson@email.com",
    issue: "Lawyer marketplace search not working",
    description:
      "When I search for lawyers in my area, the results are not showing up correctly. The search seems to be returning lawyers from other states instead of my local area. I've tried different search terms but the issue persists.",
    attachments: [],
    responses: {
      id: "resp-002",
      message:
        "We've identified that the search issue was caused by a recent change in the search algorithm. Our development team has rolled back the problematic update and deployed a fix. Please try searching again. The results should now be accurate.",
      author: "Sarah Johnson",
      authorRole: "support",
      timestamp: "2024-01-16T09:15:00Z",
    },
    createdAt: "2024-01-17T11:20:00Z",
    updatedAt: "2024-01-17T11:20:00Z",
    priority: 3,
  },
  {
    id: "TKT-004",
    title: "Case timeline not syncing across devices",
    status: "pending",
    urgency: "medium",
    sender: "lisa.brown@business.com",
    issue: "Case timeline not syncing across devices",
    description:
      "I've been working on my case timeline on my laptop, but when I try to access it from my phone, the changes aren't showing up. The timeline appears to be outdated on mobile. I've tried refreshing and logging out/in but the issue continues.",
    attachments: [
      {
        id: "att-004",
        name: "timeline-desktop.png",
        url: "/attachments/timeline-desktop.png",
        size: 298340,
        type: "image/png",
        uploadedAt: "2024-01-18T13:25:00Z",
      },
      {
        id: "att-005",
        name: "timeline-mobile.png",
        url: "/attachments/timeline-mobile.png",
        size: 187650,
        type: "image/png",
        uploadedAt: "2024-01-18T13:26:00Z",
      },
    ],
    responses: {
      id: "resp-003",
      message:
        "We've identified that the timeline syncing issue was caused by a recent change in the synchronization protocol. Our development team has rolled back the problematic update and deployed a fix. Please try syncing your timeline again. The changes should now be reflected across all devices.",
      author: "Sarah Johnson",
      authorRole: "support",
      timestamp: "2024-01-16T09:15:00Z",
    },
    createdAt: "2024-01-18T13:15:00Z",
    updatedAt: "2024-01-18T13:26:00Z",
    priority: 2,
  },
  {
    id: "TKT-005",
    title: "Payment processing error",
    status: "completed",
    urgency: "critical",
    sender: "robert.taylor@lawfirm.com",
    issue: "Payment processing error",
    description:
      "I'm trying to make a payment for premium features but I'm getting an error message saying 'Payment failed'. I've tried multiple credit cards and the payment information is correct. This is blocking my access to urgent legal documents.",
    attachments: [
      {
        id: "att-006",
        name: "payment-error.png",
        url: "/attachments/payment-error.png",
        size: 156780,
        type: "image/png",
        uploadedAt: "2024-01-19T10:15:00Z",
      },
    ],
    responses: {
      id: "resp-004",
      message:
        "I've identified the issue with your payment processing. There was a temporary glitch in our payment gateway. I've manually processed your payment and activated your premium features. You should now have full access to all premium features. I apologize for the inconvenience.",
      author: "Emily Rodriguez",
      authorRole: "support",
      timestamp: "2024-01-19T10:45:00Z",
    },
    createdAt: "2024-01-19T10:00:00Z",
    updatedAt: "2024-01-19T11:20:00Z",
    priority: 0,
  },
];

// Status options for filtering
export const STATUS_OPTIONS = [
  { label: "All Status", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "In Progress", value: "in-progress" },
  { label: "Completed", value: "completed" },
  { label: "Closed", value: "closed" },
];

// Urgency options
export const URGENCY_OPTIONS = [
  { label: "Low", value: "low", color: "text-green-600" },
  { label: "Medium", value: "medium", color: "text-yellow-600" },
  { label: "High", value: "high", color: "text-orange-600" },
  { label: "Critical", value: "critical", color: "text-red-600" },
];

// Support team members
export const SUPPORT_TEAM = [
  {
    id: "support-001",
    name: "Sarah Johnson",
    email: "sarah.johnson@legali.com",
    role: "Senior Support Specialist",
    avatar: "/avatars/sarah-johnson.jpg",
  },
  {
    id: "support-002",
    name: "Michael Chen",
    email: "michael.chen@legali.com",
    role: "Technical Support Lead",
    avatar: "/avatars/michael-chen.jpg",
  },
  {
    id: "support-003",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@legali.com",
    role: "Customer Success Manager",
    avatar: "/avatars/emily-rodriguez.jpg",
  },
];

// Helper functions
export const getTicketById = (id: string): SupportTicket | undefined => {
  return SUPPORT_TICKETS.find((ticket) => ticket.id === id);
};

export const getTicketsByStatus = (status: string): SupportTicket[] => {
  if (status === "all") return SUPPORT_TICKETS;
  return SUPPORT_TICKETS.filter((ticket) => ticket.status === status);
};

export const getTicketsByUrgency = (urgency: string): SupportTicket[] => {
  return SUPPORT_TICKETS.filter((ticket) => ticket.urgency === urgency);
};

export const sortTicketsByPriority = (
  tickets: SupportTicket[]
): SupportTicket[] => {
  return [...tickets].sort((a, b) => a.priority - b.priority);
};

export const sortTicketsByDate = (
  tickets: SupportTicket[],
  ascending: boolean = false
): SupportTicket[] => {
  return [...tickets].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return ascending ? dateA - dateB : dateB - dateA;
  });
};

// Statistics
export const getSupportStats = () => {
  const total = SUPPORT_TICKETS.length;
  const pending = SUPPORT_TICKETS.filter((t) => t.status === "pending").length;
  const inProgress = SUPPORT_TICKETS.filter(
    (t) => t.status === "in-progress"
  ).length;
  const completed = SUPPORT_TICKETS.filter(
    (t) => t.status === "completed"
  ).length;
  const closed = SUPPORT_TICKETS.filter((t) => t.status === "closed").length;

  const critical = SUPPORT_TICKETS.filter(
    (t) => t.urgency === "critical"
  ).length;
  const high = SUPPORT_TICKETS.filter((t) => t.urgency === "high").length;
  const medium = SUPPORT_TICKETS.filter((t) => t.urgency === "medium").length;
  const low = SUPPORT_TICKETS.filter((t) => t.urgency === "low").length;

  return {
    total,
    byStatus: { pending, inProgress, completed, closed },
    byUrgency: { critical, high, medium, low },
    averageResponseTime: "2.5 hours",
    resolutionRate: "94%",
  };
};

export default {
  SUPPORT_TICKETS,
  STATUS_OPTIONS,
  URGENCY_OPTIONS,
  SUPPORT_TEAM,
  getTicketById,
  getTicketsByStatus,
  getTicketsByUrgency,
  sortTicketsByPriority,
  sortTicketsByDate,
  getSupportStats,
};
