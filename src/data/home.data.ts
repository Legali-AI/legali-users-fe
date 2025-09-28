import {
  AlertTriangle,
  Clock,
  FileText,
  FolderOpen,
  HandHeart,
  type LucideIcon,
  TrendingUp,
  Users,
} from "lucide-react";
import type { BadgeVariantType } from "../components/ui/badge";

export interface Feature {
  label: string;
  color: BadgeVariantType["variant"];
  icon: LucideIcon;
}

export const NAVIGATION_FEATURES: Feature[] = [
  {
    label: "Red Flag Alerts",
    color: "coral",
    icon: AlertTriangle,
  },
  {
    label: "Legal Template",
    color: "warm-orange",
    icon: FileText,
  },
  {
    label: "Lawyers Marketplace",
    color: "sky-blue-light",
    icon: Users,
  },
  {
    label: "Fund Your Litigation: For Investors",
    color: "emerald",
    icon: TrendingUp,
  },
  {
    label: "Legal Dossier Builder",
    color: "emerald",
    icon: FolderOpen,
  },
  {
    label: "Case and Timeline Builder",
    color: "emerald",
    icon: Clock,
  },
  {
    label: "Fund Your Litigation: For Litigants",
    color: "emerald",
    icon: HandHeart,
  },
];
export interface Problem {
  title: string;
  description: string;
}
export const CORE_PROBLEMS: Problem[] = [
  {
    title: 'Stuck in the "missing middle"?',
    description: "Your case is too big for small claims, too small for big firms.",
  },
  {
    title: "Unfair settlements?",
    description: "Don't feel forced to accept lowball offers.",
  },
  {
    title: "Sky-high legal fees?",
    description: "Stop gambling your future just to stay in the game.",
  },
];

export const VALUE_PROPOSITIONS: ValueProposition[] = [
  {
    headline: "Legali revolutionizes access to justice.",
    description:
      "Organize evidence, draft documents, connect with affordable attorneys, and fund your case — all on one secure platform.",
  },
  {
    headline: "We built Legali from experience.",
    description:
      "After losing thousands in a dispute too big for small claims but too small for big firms, we set out to change the system.",
  },
];

export interface Problem {
  title: string;
  description: string;
}

export interface Benefits {
  title: string;
  items: Problem[];
}

export const BENEFITS: Benefits[] = [
  {
    title: "For Individuals & Businesses",
    items: [
      {
        title: "Navigating the law blindfolded",
        description: "Feel lost trying to understand legal processes without guidance.",
      },
      {
        title: "Searching endlessly for answers",
        description: "Hours wasted Googling legal info and still unsure what's right.",
      },
      {
        title: "Worried about $400/hour fees",
        description: "Fear of massive legal bills stopping you from taking action.",
      },
      {
        title: "Forced into impossible trade-offs",
        description: "Choosing between pursuing justice or protecting your finances.",
      },
      {
        title: "Family/property disputes",
        description: "Tense disagreements over inheritance, custody, or real estate.",
      },
      {
        title: "Business, inheritance, or real estate conflicts",
        description:
          "Complex cases too high-stakes for small claims yet out of reach for big firms.",
      },
    ],
  },
  {
    title: "For Lawyers",
    items: [
      {
        title: "Reduce time on paperwork",
        description: "Automate repetitive legal tasks and focus on higher-value work.",
      },
      {
        title: "Take on more clients",
        description: "Serve more people with streamlined workflows and prepared cases.",
      },
      {
        title: "Receive well-organized cases",
        description: "Get neatly packaged evidence and documents, ready to act on.",
      },
    ],
  },
];

export interface ProcessStep {
  title: string;
  description: string;
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    title: "Tell Us Your Story",
    description:
      "Text, voice, or photo—capture every key detail or event, instantly, so nothing is forgotten.",
  },
  {
    title: "We Build Your Case",
    description:
      "Watch your events, documents, and evidence come together as an interactive timeline. Organize uploads and communications with drag-and-drop ease.",
  },
  {
    title: "Get Red Flag Alerts",
    description:
      'Our AI reviews your case as you build it—warning you about common manipulation tactics, missing proof, or legal "danger zones" before they become showstoppers.',
  },
  {
    title: "Generate Your Legal Dossier",
    description:
      "Download a complete, organized packet: timeline, key docs, legal summary, and action plan—ready for court, mediation, or affordable attorney review.",
  },
  {
    title: "Find Help—When, Not If, You Need It",
    description:
      "Connect with fixed-fee lawyers (no surprise bills), or crowdfund help from friends and allies—right from your dashboard. No more expensive, confusing surprises.",
  },
];

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ValueProposition {
  headline: string;
  description: string;
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: "Can I use Legali with zero legal experience?",
    answer:
      "Absolutely. You can access bite-size templates, fixed-fee reviews, or plain-English advice.",
  },
  {
    question: "I only need help with a specific document or strategy. Is that possible?",
    answer:
      "Absolutely. You can access bite-size templates, fixed-fee reviews, or plain-English advice.",
  },
  {
    question: "How much does it cost?",
    answer:
      "Absolutely. You can access bite-size templates, fixed-fee reviews, or plain-English advice.",
  },
  {
    question: "What if I get stuck, confused, or worried?",
    answer:
      "Absolutely. You can access bite-size templates, fixed-fee reviews, or plain-English advice.",
  },
  {
    question: "Should I hire a lawyer or just build my case here?",
    answer:
      "Absolutely. You can access bite-size templates, fixed-fee reviews, or plain-English advice.",
  },
  {
    question: "What if I make a mistake?",
    answer:
      "Absolutely. You can access bite-size templates, fixed-fee reviews, or plain-English advice.",
  },
  {
    question: "Do I have to upgrade?",
    answer:
      "Absolutely. You can access bite-size templates, fixed-fee reviews, or plain-English advice.",
  },
];
export interface Attorney {
  name: string;
  address: string;
  specialization: string;
  hourlyRate?: string;
  linkedinUrl?: string;
}

export const ATTORNEYS: Attorney[] = [
  {
    name: "Sofia Carver",
    address: "88 Harbor Point Road, Lakeside Park, TX 77103, USA",
    specialization: "Criminal Defense",
    hourlyRate: "$300 / hour",
    linkedinUrl: "https://www.linkedin.com/",
  },
  {
    name: "Jamal Henderson",
    address: "457 Oakridge Boulevard, Silver Creek, CA 92715, USA",
    specialization: "Real Estate Law",
    hourlyRate: "$300 / hour",
    linkedinUrl: "https://www.linkedin.com/",
  },
  {
    name: "Daniel Whitmore",
    address: "123 Maplewood Avenue, Brookfield Heights, NY 10245, USA",
    specialization: "Corporate Law",
    hourlyRate: "$300 / hour",
    linkedinUrl: "https://www.linkedin.com/",
  },
];

export default {
  NAVIGATION_FEATURES,
  CORE_PROBLEMS,
  BENEFITS,
  PROCESS_STEPS,
  VALUE_PROPOSITIONS,
  FAQ_ITEMS,
};
