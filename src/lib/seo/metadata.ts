import type { Metadata } from "next";

// Base URL configuration
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://legali.com";

// Common metadata for all pages
export const commonMetadata: Partial<Metadata> = {
  authors: [{ name: "Legali Team" }],
  creator: "Legali",
  publisher: "Legali",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(baseUrl),
};

// SEO metadata for public pages (indexable)
export const createPublicMetadata = (
  title: string,
  description: string,
  path: string,
  keywords: string[] = [],
  imagePath: string = "/og-image.jpg"
): Metadata => ({
  ...commonMetadata,
  title: {
    default: `${title} | Legali`,
    template: "%s | Legali",
  },
  description,
  keywords: [
    "legal AI",
    "law firm",
    "legal technology",
    "case building",
    "evidence organization",
    "document drafting",
    "legal risks",
    "attorney connection",
    "litigation funding",
    "legal platform",
    "justice",
    "legal assistance",
    "AI lawyer",
    "legal automation",
    "smart legal tools",
    ...keywords,
  ],
  alternates: {
    canonical: path,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: path,
    siteName: "Legali",
    title: `${title} | Legali`,
    description,
    images: [
      {
        url: imagePath,
        width: 1200,
        height: 630,
        alt: `${title} - Legali Legal Platform`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | Legali`,
    description,
    images: [imagePath],
    creator: "@legali",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
});

// SEO metadata for private pages (not indexable)
export const createPrivateMetadata = (
  title: string,
  description: string,
  path: string,
  keywords: string[] = [],
  imagePath: string = "/og-dashboard.jpg"
): Metadata => ({
  ...commonMetadata,
  title: {
    default: `${title} | Legali`,
    template: "%s | Legali",
  },
  description,
  keywords: [
    "legal dashboard",
    "case management",
    "attorney connection",
    "legal AI tools",
    "profile management",
    "legal platform",
    "justice",
    "legal assistance",
    ...keywords,
  ],
  alternates: {
    canonical: path,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: path,
    siteName: "Legali",
    title: `${title} | Legali`,
    description,
    images: [
      {
        url: imagePath,
        width: 1200,
        height: 630,
        alt: `${title} - Legali Dashboard`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | Legali`,
    description,
    images: [imagePath],
    creator: "@legali",
  },
  robots: {
    index: false, // Private pages should not be indexed
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
});

// Specific metadata configurations
export const homePageMetadata = createPublicMetadata(
  "Meet your first AI-law firm",
  "Legali helps you build cases, organize evidence, draft documents, spot legal risks, connect with affordable attorneys, and even crowdfund litigation—all on a secure, AI-driven platform.",
  "/",
  [
    "AI law firm",
    "legal technology",
    "case building",
    "evidence organization",
    "attorney connection",
  ],
  "/og-image.jpg"
);

export const dashboardMetadata = createPrivateMetadata(
  "Dashboard",
  "Manage your legal cases, connect with attorneys, and access AI-powered legal tools through your Legali dashboard.",
  "/dashboard",
  ["legal dashboard", "case management", "attorney connection", "legal AI tools"],
  "/og-dashboard.jpg"
);

export const profileMetadata = createPrivateMetadata(
  "Your Profile",
  "Manage your personal information, subscription details, and account settings on Legali. Update your profile, view usage statistics, and customize your legal platform experience.",
  "/profile",
  [
    "profile management",
    "account settings",
    "user profile",
    "subscription management",
    "personal information",
  ],
  "/og-profile.jpg"
);

export const attorneysMetadata = createPrivateMetadata(
  "Attorneys",
  "Connect with qualified attorneys and legal professionals through Legali's network. Find the right lawyer for your case with our AI-powered matching system.",
  "/attorneys",
  ["attorney connection", "find lawyer", "legal professionals", "lawyer matching", "legal network"],
  "/og-attorneys.jpg"
);

export const documentsMetadata = createPrivateMetadata(
  "Legal Documents",
  "Create, manage, and organize your legal documents with AI-powered assistance. Draft contracts, agreements, and legal forms with confidence.",
  "/documents",
  [
    "legal documents",
    "document drafting",
    "contract creation",
    "legal forms",
    "document management",
  ],
  "/og-documents.jpg"
);

export const appointmentsMetadata = createPrivateMetadata(
  "Appointments",
  "Schedule and manage your legal appointments and consultations. Keep track of meetings with attorneys and legal professionals.",
  "/appointments",
  [
    "legal appointments",
    "attorney consultations",
    "meeting scheduling",
    "legal meetings",
    "consultation management",
  ],
  "/og-appointments.jpg"
);

export const messagesMetadata = createPrivateMetadata(
  "Messages",
  "Communicate securely with attorneys and legal professionals through Legali's encrypted messaging system. Keep all your legal communications in one place.",
  "/messages",
  [
    "legal messaging",
    "attorney communication",
    "secure messaging",
    "legal chat",
    "professional communication",
  ],
  "/og-messages.jpg"
);
