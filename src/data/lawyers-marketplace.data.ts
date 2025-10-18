import {
  Briefcase,
  DollarSign,
  FileText,
  Link2,
  type LucideIcon,
  MessageCircle,
  Scale,
  Users,
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
  headline: "Find trusted legal help, fast",
  subheadline:
    "Our lawyer marketplace connects you with verified US attorneys for any case, transaction, or legal question—no matter your background or experience.",
  cta: {
    text: "Explore Now",
    href: "/lawyers",
  },
};

// Problem Cards Content
export interface ProblemCard {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const PROBLEM_BADGE = "The Problem";

export const PROBLEMS: ProblemCard[] = [
  {
    icon: Scale,
    title: "Legal help is hard to get",
    description:
      "Every year, over 70% of people in the U.S. with a legal issue struggle to find help they can afford. Many end up handling their problems alone, facing confusing paperwork and unexpected fees. Legali is here to help you get the legal support you need.",
  },
  {
    icon: Users,
    title: "Many go unrepresented",
    description:
      "For those in rural communities, one in five Americans struggle to find legal help.",
  },
  {
    icon: Briefcase,
    title: "Rural areas hit harder",
    description:
      "Over 70% of Americans with civil issues struggle to find affordable professional advice.",
  },
  {
    icon: FileText,
    title: "Paperwork & fees create barriers",
    description: "Nearly half of court users face their cases without legal representation.",
  },
];

// Solution Cards Content
export const SOLUTION_BADGE = "The Solution";

export const SOLUTIONS: ProblemCard[] = [
  {
    icon: Link2,
    title: "Instantly connect with verified attorneys",
    description:
      "Over 70% of Americans with civil issues struggle to find affordable professional advice.",
  },
  {
    icon: MessageCircle,
    title: "Plain-language, state-specific guidance",
    description: "Nearly half of court users face their cases without legal representation.",
  },
  {
    icon: DollarSign,
    title: "Transparent pricing",
    description:
      "Over 70% of Americans with civil issues struggle to find affordable professional advice.",
  },
  {
    icon: MessageCircle,
    title: "Real-time messaging & collaboration",
    description: "Nearly half of court users face their cases without legal representation.",
  },
];

// How It Works Section Content
export interface HowItWorksStep {
  title: string;
  description: string;
  details: string[];
  imagePath: string;
  backgroundColor?: string;
}

export const HOW_IT_WORKS_HEADING = "How our marketplace works";
export const HOW_IT_WORKS_SUBHEADING =
  "Connect with the right attorney through our comprehensive platform designed for real people with real legal needs.";

export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    title: "Guided search, made simple",
    description: "Describe your legal need in simple words.",
    details: [
      "Our highly intuitive AI will guide you step by step to find the right legal help. You'll get instant tips and guidance for your state.",
    ],
    imagePath: "/home/features/lm-1.png",
    backgroundColor: "#FFF9E5",
  },
  {
    title: "Real-time connection and support",
    description:
      "Connect with lawyers right away. Book a free call or chat with them directly in the app to get answers fast, not days later.",
    details: [
      "Work with your lawyer to review documents, make drafts, or negotiate deals. Easily from your phone or computer.",
      "You'll get phone alerts so you can track progress and never miss a deadline.",
    ],
    imagePath: "/home/features/lm-2.png",
  },
  {
    title: "Transparent pricing and honest reviews",
    description:
      "You can see pricing and payment options up front, with no hidden fees or surprises. Compare costs for similar cases in your state and read reviews from other clients.",
    details: [
      "After your case is done, you can share your experience and help build a trustworthy legal community for everyone.",
    ],
    imagePath: "/home/features/lm-3.png",
    backgroundColor: "#E8F5E9",
  },
  {
    title: "Secure, private, and compliant",
    description:
      "Every lawyer is pre-screened, licensed, and verified to practice in your state. All files and messages are encrypted, and your data is never shared with anyone but your selected attorney.",
    details: [
      "We always follow the strictest ethical and privacy standards for American clients and attorneys.",
    ],
    imagePath: "/home/features/lm-4.png",
    backgroundColor: "#FFE8E8",
  },
  {
    title: "Fast, accessible, and mobile-first!",
    description:
      "You can use legali on your phone, tablet, or computer. It's easy to use no matter what device you have.",
    details: [
      "Our guides explain how legal matters work, and our team is here to help.",
      "We offer support in different languages and guides in plain English so everyone gets the help they need.",
    ],
    imagePath: "/home/features/lm-5.png",
    backgroundColor: "#E8E5FF",
  },
];

// Action Cards Content
export interface ActionCard {
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
  backgroundColor: string;
}

export const ACTION_CARDS: ActionCard[] = [
  {
    title: "Post your legal question",
    description: "No need to re-tell everything. Our selected lawyers come prepared.",
    buttonText: "Start Now",
    buttonHref: "/lawyers",
    backgroundColor: "#4A7C8C",
  },
  {
    title: "Need help getting started?",
    description:
      "Access self-help tools, explainer videos, or live chat with our 24/7 support team.",
    buttonText: "Get Help",
    buttonHref: "/support",
    backgroundColor: "#5A8C9C",
  },
  {
    title: "Browse attorney profiles",
    description:
      "Explore verified attorney profiles, read reviews, and compare pricing before you connect.",
    buttonText: "Browse Now",
    buttonHref: "/lawyers",
    backgroundColor: "#6A9CAC",
  },
];

// Final CTA Section Content
export interface FinalCTAContent {
  heading: string;
  headingHighlight: string;
  subheading: string;
  buttonText: string;
  buttonHref: string;
}

export const FINAL_CTA_CONTENT: FinalCTAContent = {
  heading: "Connect with the right attorney ",
  headingHighlight: "today",
  subheading: "Join thousands of us who have found reliable legal help through our marketplace.",
  buttonText: "Find your attorney",
  buttonHref: "/lawyers",
};

export default {
  HERO_CONTENT,
  PROBLEM_BADGE,
  PROBLEMS,
  SOLUTION_BADGE,
  SOLUTIONS,
  HOW_IT_WORKS_HEADING,
  HOW_IT_WORKS_SUBHEADING,
  HOW_IT_WORKS_STEPS,
  ACTION_CARDS,
  FINAL_CTA_CONTENT,
};
