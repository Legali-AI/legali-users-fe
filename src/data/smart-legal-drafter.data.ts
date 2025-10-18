import {
  CheckCircle,
  FileCheck,
  FileText,
  HelpCircle,
  Lock,
  type LucideIcon,
  Smartphone,
} from "lucide-react";

// Hero Section Content
export interface HeroContent {
  headline: string;
  subheadline: string;
  ctaPrimary: {
    text: string;
    href: string;
  };
  ctaSecondary: {
    text: string;
    href: string;
  };
}

export const HERO_CONTENT: HeroContent = {
  headline: "Smart legal drafter: empowering self-represented litigants",
  subheadline:
    "Draft legal documents with confidence. We have the most-needed, expertly-crafted templates so you can feel empowered to represent yourself. This makes every step less intimidating, more accurate, and accessible.",
  ctaPrimary: {
    text: "Try Our Free Template",
    href: "/agent?conversation_type=legal-drafter",
  },
  ctaSecondary: {
    text: "Browse Template Library",
    href: "/templates",
  },
};

// Self-Representation Section Content
export interface SelfRepresentationContent {
  headline: string;
  description: string;
}

export const SELF_REPRESENTATION_CONTENT: SelfRepresentationContent = {
  headline:
    "Nearly two-thirds of Americans in civil court matters now represent themselves, facing a system built for lawyers with limited access to affordable legal help.",
  description:
    "When people face legal issues, they often have to handle it on their own. They may not know what to do or where to begin. legali helps you find the right information, organize your evidence, and get the legal help you need,",
};

// Features Grid Content
export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const FEATURES_GRID_HEADING = "legali changes that for you";
export const FEATURES_GRID_SUBHEADING =
  "No legal jargon or uncertainty, just step-by-step clarity for the self-represented user.";

export const FEATURES: Feature[] = [
  {
    icon: FileText,
    title: "Every document you need, easy to find",
    description:
      "Get instant access to a comprehensive library: court pleadings, family law forms, contracts, real estate documents, business agreements, and more. Guided questions help you find the right template for your situation. No more searching through endless outdated forms. Legali steers you directly to the right template for your unique situation.",
  },
  {
    icon: FileCheck,
    title: "Create legal documents from simple answers",
    description:
      "Answer clear questions and we transform your information into a professional document. Automatically adapts clauses and language to your facts and current regulations. See helpful suggestions, update details as needed, and preview your draft before submitting or signing. No more confusing legal jargon.",
  },
  {
    icon: Lock,
    title: "Compliance and peace of mind, built in",
    description:
      "Every template is reviewed by licensed attorneys and legal-tech experts. This ensures compliance with local court and jurisdictional requirements, even when rules change. You get the confidence of professional standards without the cost or complexity.",
  },
  {
    icon: Smartphone,
    title: "Secure by default",
    description:
      "You can control access with specific permissions, so confidential files are shared only when needed. End-to-end encryption and compliance with SOC 2 and HIPAA keep your data safe and secure.",
  },
  {
    icon: HelpCircle,
    title: "Tailored help for every user",
    description:
      "No legal experience? No problem. Built-in guides and tips make complex documents easy to understand for everyone. You can start a draft on your computer, finish on your phone, and access your work securely from anywhere. Our AI is powerful—but never alone. Human experts stay in the loop every step of the way.",
  },
  {
    icon: CheckCircle,
    title: "Next steps, simplified",
    description:
      "Finalize and e-sign, send for an optional legal review, or securely share your documents. Track every stage and receive instant updates, so you never miss a deadline or required filing.",
  },
];

// Experience Section Content
export interface Stat {
  value: string;
  label: string;
}

export interface ExperienceContent {
  heading: string;
  subheading: string;
  ctaText: string;
  ctaHref: string;
  stats: Stat[];
}

export const EXPERIENCE_CONTENT: ExperienceContent = {
  heading: "Experience the difference",
  subheading:
    "Try a free template and discover just how approachable, accurate, and empowering legal paperwork can be.",
  ctaText: "Start Your Free Template",
  ctaHref: "/agent?conversation_type=legal-drafter",
  stats: [
    {
      value: "100%",
      label: "attorney-reviewed templates",
    },
    {
      value: "24/7",
      label: "secure access from any device",
    },
    {
      value: "0",
      label: "legal background required",
    },
  ],
};

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
  heading: "Ready to take control of your legal documents?",
  subheading:
    "Need guidance or have a question? Chat with our Support instantly or browse our curated template library, designed with self-represented users in mind.",
  ctaPrimary: {
    text: "Chat with Support",
    href: "/support",
  },
  ctaSecondary: {
    text: "Browse Template Library",
    href: "/templates",
  },
};

export default {
  HERO_CONTENT,
  SELF_REPRESENTATION_CONTENT,
  FEATURES_GRID_HEADING,
  FEATURES_GRID_SUBHEADING,
  FEATURES,
  EXPERIENCE_CONTENT,
  FINAL_CTA_CONTENT,
};
