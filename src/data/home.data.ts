import {
  BriefcaseBusiness,
  Dices,
  DollarSign,
  FileText,
  Folder,
  FolderSync,
  Handshake,
  Home,
  Scale,
  ScaleIcon,
  ScrollTextIcon,
  SearchIcon,
  TriangleAlert,
  UserRound,
  Wallet,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export interface Feature {
  label: string;
  icon: LucideIcon;
  href: string;
  color?: string;
}

export const NAVIGATION_FEATURES: Feature[] = [
  {
    label: "Red Flag Analysis",
    icon: TriangleAlert,
    href: "/red-flag-analysis",
    color: "#C92F31",
  },
  {
    label: "Smart Legal Drafter",
    icon: FileText,
    href: "/smart-legal-drafter",
    color: "#143473",
  },
  {
    label: "Litigation Case Builder",
    icon: Wrench,
    href: "/litigation-case-builder",
    color: "#792FC9",
  },
  {
    label: "Lawyers Marketplace",
    icon: Scale,
    href: "/lawyers-marketplace",
    color: "#00ABF5",
  },
  {
    label: "Fund Your Litigation: Investors",
    icon: DollarSign,
    href: "/fund-your-litigation-investors",
    color: "#0B9601",
  },
  {
    label: "Fund Your Litigation: Litigants",
    icon: DollarSign,
    href: "/fund-your-litigation-litigants",
    color: "#0B9601",
  },
];

export interface JusticeGapStat {
  value: string;
  description: string;
}

export const JUSTICE_GAP_STATS: JusticeGapStat[] = [
  {
    value: "15M",
    description: "Navigate legal system alone yearly",
  },
  {
    value: "75%",
    description: "Cases involve unrepresented parties",
  },
  {
    value: "4%",
    description: "Win rate without proper resources",
  },
];
export interface ProblemAboutUs {
  title: string;
  description: string;
  icon: LucideIcon;
}
export const CORE_PROBLEMS: ProblemAboutUs[] = [
  {
    title: '"Self-represented litigants"',
    description:
      "15 million Americans navigate the legal system alone each year with just a 4% win rate.",
    icon: UserRound,
  },
  {
    title: '"Stuck in the middle"',
    description:
      "Problems too big for small claims court, but not big enough to justify six-figure legal fees.",
    icon: Scale,
  },
  {
    title: '"Settle for less"',
    description:
      "People accept unfair deals—or risk everything—because they can’t afford representation.",
    icon: Handshake,
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
  icon: LucideIcon;
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
        description:
          "Feel lost trying to understand legal processes without guidance.",
        icon: ScaleIcon,
      },
      {
        title: "Searching endlessly for answers",
        description:
          "Hours wasted Googling legal info and still unsure what's right.",
        icon: SearchIcon,
      },
      {
        title: "Worried about $400/hour fees",
        description:
          "Fear of massive legal bills stopping you from taking action.",
        icon: DollarSign,
      },
      {
        title: "Forced into impossible trade-offs",
        description:
          "Choosing between pursuing justice or protecting your finances.",
        icon: Dices,
      },
      {
        title: "Family/property disputes",
        description:
          "Tense disagreements over inheritance, custody, or real estate.",
        icon: Home,
      },
      {
        title: "Business, inheritance, or real estate conflicts",
        description:
          "Complex cases too high-stakes for small claims yet out of reach for big firms.",
        icon: BriefcaseBusiness,
      },
    ],
  },
  {
    title: "For Lawyers",
    items: [
      {
        title: "Reduce time on paperwork",
        description:
          "Automate repetitive legal tasks and focus on higher-value work.",
        icon: ScrollTextIcon,
      },
      {
        title: "Take on more clients",
        description:
          "Serve more people with streamlined workflows and prepared cases.",
        icon: Handshake,
      },
      {
        title: "Receive well-organized cases",
        description:
          "Get neatly packaged evidence and documents, ready to act on.",
        icon: Folder,
      },
    ],
  },
];

export interface ProcessStep {
  title: string;
  description: string;
  colorHex?: string;
  imageUrl?: string;
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    title: "Tell Us Your Story",
    description:
      "Text, voice, or photo—capture every key detail or event, instantly, so nothing is forgotten.",
    colorHex: "#ECD7FF",
    imageUrl: "/home/process/1.png",
  },
  {
    title: "We Build Your Case",
    description:
      "Watch your events, documents, and evidence come together as an interactive timeline. Organize uploads and communications with drag-and-drop ease.",
    colorHex: "#F5F3C3",
    imageUrl: "/home/process/2.png",
  },
  {
    title: "Get Red Flag Alerts",
    description:
      'Our AI reviews your case as you build it—warning you about common manipulation tactics, missing proof, or legal "danger zones" before they become showstoppers.',
    colorHex: "#FCCEC4",
    imageUrl: "/home/process/3.png",
  },
  {
    title: "Generate Your Legal Dossier",
    description:
      "Download a complete, organized packet: timeline, key docs, legal summary, and action plan—ready for court, mediation, or affordable attorney review.",
    imageUrl: "/home/process/4.png",
  },
  {
    title: "Find Help—When, Not If, You Need It",
    description:
      "Connect with fixed-fee lawyers (no surprise bills), or crowdfund help from friends and allies—right from your dashboard. No more expensive, confusing surprises.",
    imageUrl: "/home/process/5.png",
  },
];

export interface ValueProposition {
  headline: string;
  description: string;
}

export interface Attorney {
  name: string;
  address: string;
  specialization: string;
  hourlyRate?: string;
  linkedinUrl?: string;
  imageUrl?: string;
}

export const ATTORNEYS: Attorney[] = [
  {
    name: "Sofia Carver",
    address: "88 Harbor Point Road, Lakeside Park, TX 77103, USA",
    specialization: "Criminal Defense",
    hourlyRate: "$300 / hour",
    linkedinUrl: "https://www.linkedin.com/",
    imageUrl: "/home/attorneys/1.png",
  },
  {
    name: "Jamal Henderson",
    address: "457 Oakridge Boulevard, Silver Creek, CA 92715, USA",
    specialization: "Real Estate Law",
    hourlyRate: "$300 / hour",
    linkedinUrl: "https://www.linkedin.com/",
    imageUrl: "/home/attorneys/2.png",
  },
  {
    name: "Daniel Whitmore",
    address: "123 Maplewood Avenue, Brookfield Heights, NY 10245, USA",
    specialization: "Corporate Law",
    hourlyRate: "$300 / hour",
    linkedinUrl: "https://www.linkedin.com/",
    imageUrl: "/home/attorneys/3.png",
  },
];

export interface ToolkitItem {
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  href?: string;
}

export interface ToolkitCategory {
  category: "individuals" | "lawyers";
  items: ToolkitItem[];
}

export interface ToolkitContent {
  heading: string;
  subheading: string;
  tabIndividuals: string;
  tabLawyers: string;
}

export const TOOLKIT_CONTENT: ToolkitContent = {
  heading: "Your complete legal tool kit.",
  subheading: "One platform, every legal need.",
  tabIndividuals: "For Individuals",
  tabLawyers: "For Lawyers",
};

export const TOOLKIT_ITEMS: ToolkitCategory[] = [
  {
    category: "individuals",
    items: [
      {
        title: "Red Flag Analysis",
        subtitle: "Start here.",
        description:
          "Upload documents or describe your situation. Get instant analysis of legal risks, problematic terms, and key deadlines—explained in plain language. We'll show you what matters and what to do next.",
        icon: TriangleAlert,
        href: "/red-flag-analysis",
      },
      {
        title: "Litigation Case Builder",
        subtitle: "Build your case.",
        description:
          "Turn your story into a court-ready case. We organize evidence, build timelines, draft legal arguments, and prepare attorney-ready dossiers. File yourself, hand it to a lawyer, or we'll file it for you.",
        icon: DollarSign,
        href: "/litigation-case-builder",
      },
      {
        title: "Lawyers Marketplace",
        subtitle: "Find the right lawyer.",
        description:
          "Browse verified attorneys by location and practice area, share your case instantly through seamless integration, and get upfront pricing with built-in messaging for quick consultations.",
        icon: Home,
        href: "/lawyers",
      },
      {
        title: "Smart Legal Drafter",
        subtitle: "Create your documents.",
        description:
          "Generate legally sound, jurisdiction-specific contracts, agreements, demand letters, and filings through simple conversation. Built-in e-signature and instant delivery—no legal expertise required.",
        icon: SearchIcon,
        href: "/smart-legal-drafter",
      },
      {
        title: "File Organization & Workflows",
        subtitle: "Stay organized.",
        description:
          "Keep every document and task on track with auto-sorting, attorney-ready summaries, and deadline management. Enterprise clients get secure collaboration with role-based access and encryption.",
        icon: FolderSync,
        href: "/file-organization",
      },
      {
        title: "Investing in Litigation",
        subtitle: "Fund your fight.",
        description:
          "Launch transparent campaigns for Lawyers can launch transparent campaigns for investors or public supporters. Investors can access this emerging asset class and track milestones in real time.",
        icon: Wallet,
        href: "/litigation-crowdfunding",
      },
    ],
  },
  {
    category: "lawyers",
    items: [
      {
        title: "Smart Legal Drafter",
        subtitle: "Create your documents.",
        description:
          "Generate legally sound, jurisdiction-specific contracts, agreements, demand letters, and filings through simple conversation. Built-in e-signature and instant delivery—no legal expertise required.",
        icon: SearchIcon,
        href: "/smart-legal-drafter",
      },
      {
        title: "File Organization & Workflows",
        subtitle: "Stay organized.",
        description:
          "Keep every document and task on track with auto-sorting, attorney-ready summaries, and deadline management. Enterprise clients get secure collaboration with role-based access and encryption.",
        icon: FolderSync,
        href: "/file-organization",
      },
      {
        title: "Investing in Litigation",
        subtitle: "Fund your fight.",
        description:
          "Launch transparent campaigns for Lawyers can launch transparent campaigns for investors or public supporters. Investors can access this emerging asset class and track milestones in real time.",
        icon: Wallet,
        href: "/litigation-crowdfunding",
      },
    ],
  },
];

export interface LegalEquityPartner {
  name: string;
  imageUrl: string;
}

export interface LegalEquityContent {
  heading: string;
}

export const LEGAL_EQUITY_CONTENT: LegalEquityContent = {
  heading: "Empowering legal equity leaders",
};

export const LEGAL_EQUITY_PARTNERS: LegalEquityPartner[] = [
  {
    name: "Justice Access",
    imageUrl: "/home/org/1.png",
  },
  {
    name: "Nonprofit Website Insider",
    imageUrl: "/home/org/2.png",
  },
  {
    name: "RSI Resolution Systems Institute",
    imageUrl: "/home/org/3.png",
  },
  {
    name: "IAALS",
    imageUrl: "/home/org/4.png",
  },
];

export default {
  NAVIGATION_FEATURES,
  CORE_PROBLEMS,
  BENEFITS,
  PROCESS_STEPS,
  VALUE_PROPOSITIONS,
  TOOLKIT_CONTENT,
  TOOLKIT_ITEMS,
  LEGAL_EQUITY_CONTENT,
  LEGAL_EQUITY_PARTNERS,
};
