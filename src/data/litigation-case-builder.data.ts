import {
  FileText,
  Clock,
  Shield,
  Download,
  Users,
  MousePointerClick,
  Network,
  Brain,
  Sparkles,
  CheckCircle,
  type LucideIcon,
} from "lucide-react";

// Hero Section Content
export interface HeroContent {
  headline: string;
  subheadline: string;
  cta: {
    text: string;
    href: string;
  };
}

export const HERO_CONTENT: HeroContent = {
  headline: "We give you control over your case, no matter your background",
  subheadline:
    "Legali transforms scattered facts, messy paperwork, and confusing deadlines into one clear, integrated litigation workspace designed for both legal teams and self-represented litigants.",
  cta: {
    text: "Start Building Your Case",
    href: "/agent?conversation_type=case-builder",
  },
};

// Features Grid Content
export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const FEATURES_HEADING = "Everything you need to manage your case";
export const FEATURES_SUBHEADING =
  "From document upload to courtroom presentation, we provide a complete toolkit for modern legal case management.";

export const FEATURES: Feature[] = [
  {
    icon: FileText,
    title: "Build your case step by step",
    description:
      "Upload documents, enter party names, outline the facts—we guide you through every step. Our agentic AI extracts, organizes, and timestamps your evidence, emails, and pleadings, building a complete case record as you go, making it easy to track your case history and plan your next moves.",
  },
  {
    icon: Clock,
    title: "See your timeline, make sense of your case",
    description:
      "Visualize every event in real time, filtering by people, issues, or date. Add notes, attach evidence, and refine facts with one click. Invite team members or lawyers to collaborate live, ensuring your case is always current.",
  },
  {
    icon: Shield,
    title: "Your legal dossier, organized",
    description:
      "All your court documents, evidence, and other files are in one place. Find missing information and strategic ideas quickly, then turn your notes into summaries and files ready for court.",
  },
  {
    icon: Download,
    title: "Designed for everyone: teams, clients, and SRLs",
    description:
      "Use legali anywhere on your phone, tablet, or desktop. Everything is easy to read. You can invite lawyers, clients, and others to follow your case timeline so everyone stays on the same page.",
  },
  {
    icon: Users,
    title: "Keeping it safe and confidential",
    description:
      "Your data is safe with our end-to-end encryption. You control who sees what, so you can share only what is needed with a judge, lawyer, or team member.",
  },
  {
    icon: MousePointerClick,
    title: "One click to results",
    description:
      "Export timelines and documents for court filings or trial presentations. Connect with legal experts for help, or use our guides to build your case with confidence.",
  },
];

// Differentiators Content
export const DIFFERENTIATORS_HEADING = "What makes us different";
export const DIFFERENTIATORS_SUBHEADING =
  "Purpose-built for litigation with AI-powered automation and workflows designed by legal professionals.";

export const DIFFERENTIATORS: Feature[] = [
  {
    icon: Network,
    title: "All-in-one workspace",
    description: "All your case files in one place. No more switching between apps or losing files",
  },
  {
    icon: Brain,
    title: "AI-powered structure",
    description: "We organize, timestamp, and connect your evidence to events as you upload, all in real time.",
  },
  {
    icon: Sparkles,
    title: "Automated drafting",
    description:
      "Instantly fill out complaints, motions, or filings with facts and deadlines pulled from your timeline.",
  },
  {
    icon: CheckCircle,
    title: "Litigation-focused",
    description: "Reminders, tracked documents, and filing tools tailored for real-world legal processes.",
  },
];

// Final CTA Section Content
export interface FinalCTAContent {
  heading: string;
  subheading: string;
  ctaPrimary: {
    text: string;
    href: string;
  };
  ctaSecondary: {
    text: string;
    href: string;
  };
}

export const FINAL_CTA_CONTENT: FinalCTAContent = {
  heading: "Ready to transform your legal case management?",
  subheading:
    "Join thousands of legal professionals who have streamlined their workflow and improved case outcomes with legali.",
  ctaPrimary: {
    text: "Start Your Free Trial",
    href: "/agent?conversation_type=case-builder",
  },
  ctaSecondary: {
    text: "Schedule a Demo",
    href: "/support",
  },
};

export default {
  HERO_CONTENT,
  FEATURES_HEADING,
  FEATURES_SUBHEADING,
  FEATURES,
  DIFFERENTIATORS_HEADING,
  DIFFERENTIATORS_SUBHEADING,
  DIFFERENTIATORS,
  FINAL_CTA_CONTENT,
};
