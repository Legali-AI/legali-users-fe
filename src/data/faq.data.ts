export type FAQAnswerBlock =
  | { type: "paragraph"; content: string }
  | { type: "list"; title?: string; items: string[]; variant?: "default" | "check" | "cross" }
  | { type: "note"; content: string };

export interface FAQItem {
  id: string;
  question: string;
  answer: FAQAnswerBlock[];
}

export interface FAQCategory {
  id: string;
  title: string;
  description?: string;
  items: FAQItem[];
}

export const FAQ_PAGE_TITLE = "Legali: Frequently Asked Questions";

export const FAQ_PAGE_INTRO = [
  "We're building Legali to help you navigate legal processes with confidence. Below you'll find detailed answers about how the platform works, when to involve an attorney, and what to expect as you build your case.",
  "Every response is informational—not legal advice. If you need guidance about your specific situation, consult a licensed attorney through Legali or your own network.",
];

export const FAQ_CATEGORIES: FAQCategory[] = [
  {
    id: "understanding-legali",
    title: "Understanding Legali",
    items: [
      {
        id: "understanding-legali-what-is-legali",
        question: "What is Legali?",
        answer: [
          {
            type: "paragraph",
            content:
              "Legali is a legal navigation platform that helps you understand your legal situation through guided questions, document organization, and educational resources.",
          },
          {
            type: "paragraph",
            content:
              "We provide tools and information to help you make informed decisions—but we are not a law firm and do not provide legal advice or representation.",
          },
        ],
      },
      {
        id: "understanding-legali-can-i-use-legali-with-no-legal-experience",
        question: "Can I use Legali with no legal experience?",
        answer: [
          {
            type: "paragraph",
            content:
              "Absolutely. Legali is designed for people with zero legal background. We guide you with clear, step-by-step questions and plain-English explanations. You're never left wondering “what do I do next?”",
          },
          {
            type: "list",
            title: "What Legali does:",
            items: [
              "Asks questions to clarify your situation.",
              "Organizes your answers and supporting documents.",
              "Flags important deadlines and requirements.",
              "Explains legal terms so you understand the basics.",
            ],
            variant: "check",
          },
          {
            type: "list",
            title: "What Legali doesn't do:",
            items: [
              "Tell you what action you specifically should take.",
              "Predict your case outcome.",
              "Act as your lawyer or provide legal representation.",
            ],
            variant: "cross",
          },
        ],
      },
    ],
  },
  {
    id: "avoiding-legal-mistakes",
    title: "Avoiding Legal Mistakes",
    items: [
      {
        id: "avoiding-legal-mistakes-how-does-legali-help-avoid-critical-errors",
        question: "How does Legali help me avoid critical errors?",
        answer: [
          {
            type: "paragraph",
            content: "Our system helps you catch issues before they become problems:",
          },
          {
            type: "list",
            items: [
              "Flags common procedural risks and missing information.",
              "Reminds you about filing deadlines and requirements.",
              "Provides checklists based on your situation type.",
              "Offers optional attorney review at key decision points.",
            ],
          },
          {
            type: "note",
            content:
              "Important: These are safety features, not legal advice. While our tools help you stay organized, only a licensed attorney can review your specific case and advise you on legal strategy.",
          },
        ],
      },
      {
        id: "avoiding-legal-mistakes-what-if-i-make-a-mistake",
        question: "What if I make a mistake even with Legali's help?",
        answer: [
          {
            type: "paragraph",
            content: "Our tools are designed to reduce errors, but they cannot eliminate risk.",
          },
          {
            type: "paragraph",
            content:
              "That's why we always recommend attorney review for complex situations or high-stakes decisions. When you opt for attorney review, a licensed lawyer (not Legali staff) examines your work and provides professional guidance.",
          },
          {
            type: "paragraph",
            content:
              "Remember: You remain responsible for your legal actions. Legali provides tools; attorneys provide advice.",
          },
        ],
      },
    ],
  },
  {
    id: "human-and-attorney-involvement",
    title: "Human & Attorney Involvement",
    items: [
      {
        id: "human-and-attorney-involvement-is-there-always-a-human",
        question: "Is there always a human in the loop?",
        answer: [
          {
            type: "paragraph",
            content: "Yes, in two ways:",
          },
          {
            type: "list",
            items: [
              "Support team: Our staff helps with technical questions, platform navigation, and understanding how our tools work (not legal advice).",
              "Licensed attorneys: Independent lawyers are available for document review, legal consultations, and representation when you choose to hire them.",
            ],
          },
          {
            type: "paragraph",
            content:
              "Legali employees provide informational support about using the platform. Licensed attorneys provide legal services and advice about your case.",
          },
        ],
      },
      {
        id: "human-and-attorney-involvement-when-should-i-hire-an-attorney",
        question: "When should I hire an attorney?",
        answer: [
          {
            type: "paragraph",
            content: "Consider attorney involvement when:",
          },
          {
            type: "list",
            items: [
              "Your case is complex or involves significant money or rights.",
              "You're facing an opponent with legal representation.",
              "Court deadlines are approaching and you're unsure how to proceed.",
              "You've received legal documents you don't understand.",
              "Legali's guidance prompts suggest attorney review.",
              "You simply want professional peace of mind.",
            ],
          },
          {
            type: "paragraph",
            content:
              "You decide: Legali never forces you to hire an attorney, but we'll always tell you when it's typically recommended.",
          },
        ],
      },
      {
        id: "human-and-attorney-involvement-are-attorneys-independent",
        question: "Are Legali's attorneys really independent?",
        answer: [
          {
            type: "paragraph",
            content: "Yes. When you hire an attorney through Legali's network:",
          },
          {
            type: "list",
            items: [
              "You're hiring that attorney, not Legali.",
              "The attorney-client relationship is between you and them.",
              "Attorney-client privilege applies to your communications with them.",
              "They owe you professional duties under their state bar rules.",
              "They set their own fees (Legali may facilitate payment but doesn't control pricing).",
            ],
          },
          {
            type: "paragraph",
            content:
              "Legali's role: We connect you with licensed attorneys and provide the technology platform. We don't supervise legal work or practice law ourselves.",
          },
        ],
      },
    ],
  },
  {
    id: "what-legali-can-and-cannot-do",
    title: "What Legali Can and Cannot Do",
    items: [
      {
        id: "what-legali-can-and-cannot-do-does-legali-give-legal-advice",
        question: "Does Legali give legal advice?",
        answer: [
          {
            type: "paragraph",
            content: "Legali provides:",
          },
          {
            type: "list",
            items: [
              "Educational content about legal processes.",
              "Guided questions to help you organize facts.",
              "Document templates and procedural checklists.",
              "General information about legal requirements.",
              "Technology tools to track deadlines and tasks.",
            ],
            variant: "check",
          },
          {
            type: "paragraph",
            content: "Legali does not provide:",
          },
          {
            type: "list",
            items: [
              "Recommendations about what action you should take.",
              "Predictions about your case outcome.",
              "Analysis of your specific legal rights.",
              "Strategy for winning your case.",
              "Representation in court.",
            ],
            variant: "cross",
          },
          {
            type: "paragraph",
            content:
              "When you need the “cannot do” items, hire an attorney outside Legali or through our network.",
          },
        ],
      },
      {
        id: "what-legali-can-and-cannot-do-can-legali-represent-me",
        question: "Can Legali represent me in court?",
        answer: [
          {
            type: "paragraph",
            content:
              "No. Legali is not a law firm and cannot represent you. However, attorneys in our network can represent you if you hire them. They appear in court as your attorney, not as Legali representatives.",
          },
        ],
      },
      {
        id: "what-legali-can-and-cannot-do-what-if-things-go-wrong",
        question: "What if I follow Legali's guidance and things go wrong?",
        answer: [
          {
            type: "paragraph",
            content:
              "Legali's tools provide general information and assistance, but cannot guarantee legal outcomes. This is why we:",
          },
          {
            type: "list",
            items: [
              "Clearly label everything as informational (not advice).",
              "Recommend attorney review for important decisions.",
              "Remind you that you're responsible for your legal actions.",
              "Provide access to licensed attorneys who can guide your specific case.",
            ],
          },
          {
            type: "paragraph",
            content:
              "By using Legali, you agree: Our platform is a tool to help you help yourself, not a substitute for professional legal counsel when you need it.",
          },
        ],
      },
    ],
  },
  {
    id: "pricing-and-access",
    title: "Pricing & Access",
    items: [
      {
        id: "pricing-and-access-is-legali-free",
        question: "Is Legali free?",
        answer: [
          {
            type: "paragraph",
            content: "Legali offers:",
          },
          {
            type: "list",
            items: [
              "Free tier: Basic guided questions, document organization, and educational resources.",
              "Premium features: Advanced tools, priority support, and enhanced document capabilities (subscription fee).",
              "Attorney services: Paid separately—no subscription required. You pay the attorney directly for their time and expertise.",
            ],
          },
          {
            type: "paragraph",
            content:
              "No hidden fees: We clearly outline costs, and you're never forced to upgrade.",
          },
        ],
      },
      {
        id: "pricing-and-access-how-much-do-attorney-services-cost",
        question: "How much do attorney services cost?",
        answer: [
          {
            type: "paragraph",
            content: "Attorney fees vary by service type:",
          },
          {
            type: "list",
            items: [
              "Document review: Typically a fixed fee.",
              "Consultations: Usually hourly or per session.",
              "Representation: Depends on case complexity.",
            ],
          },
          {
            type: "paragraph",
            content:
              "Attorneys in our network set their own rates. You'll see pricing before committing, and you can compare options.",
          },
        ],
      },
    ],
  },
  {
    id: "getting-stuck-or-confused",
    title: "Getting Stuck or Confused",
    items: [
      {
        id: "getting-stuck-or-confused-what-if-i-dont-understand-a-question",
        question: "What if I don't understand a question?",
        answer: [
          {
            type: "paragraph",
            content: "Every question in Legali includes:",
          },
          {
            type: "list",
            items: [
              "Plain-English definitions.",
              "Relevant examples.",
              '"Why we\'re asking this" explanations.',
              "Links to educational resources.",
            ],
          },
          {
            type: "paragraph",
            content:
              "If you're still stuck, our support team can explain how the platform works (though they can't give legal advice). For case-specific confusion, we'll guide you to consult an attorney.",
          },
        ],
      },
      {
        id: "getting-stuck-or-confused-what-if-legali-does-not-cover-my-situation",
        question: "What if Legali doesn't cover my situation?",
        answer: [
          {
            type: "paragraph",
            content:
              "Legali covers many common legal situations, but we can't handle everything. When we identify something outside our scope, we:",
          },
          {
            type: "list",
            items: [
              "Tell you clearly and early.",
              "Explain why attorney help is especially important for your situation.",
              "Connect you with relevant attorneys in our network and provide helpful resources.",
            ],
          },
          {
            type: "paragraph",
            content: "We'd rather say “hire a lawyer” than give inadequate guidance.",
          },
        ],
      },
    ],
  },
  {
    id: "privacy-and-security",
    title: "Privacy & Security",
    items: [
      {
        id: "privacy-and-security-is-my-information-confidential",
        question: "Is my information confidential?",
        answer: [
          {
            type: "paragraph",
            content: "Your data on Legali is:",
          },
          {
            type: "list",
            items: [
              "Encrypted and securely stored.",
              "Protected by our privacy policy.",
              "Never sold to third parties.",
              "Shared with attorneys only when you explicitly choose to hire them.",
            ],
          },
          {
            type: "paragraph",
            content:
              "Important distinction: Information you share on Legali's platform is not protected by attorney-client privilege until you hire an attorney and share it with them.",
          },
        ],
      },
    ],
  },
  {
    id: "state-specific-rules",
    title: "State-Specific Rules",
    items: [
      {
        id: "state-specific-rules-does-legali-work-in-my-state",
        question: "Does Legali work in my state?",
        answer: [
          {
            type: "paragraph",
            content:
              "Legali's informational tools work nationwide, but legal requirements vary by state. When you use Legali:",
          },
          {
            type: "list",
            items: [
              "Select your state or jurisdiction at the start.",
              "Receive information tailored to your location.",
              "Get connected with attorneys licensed in your state when needed.",
            ],
          },
          {
            type: "paragraph",
            content:
              "Compliance matters: We take unauthorized practice of law seriously and design our platform to respect state bar rules everywhere we operate.",
          },
        ],
      },
    ],
  },
  {
    id: "trust-and-transparency",
    title: "Trust & Transparency",
    items: [
      {
        id: "trust-and-transparency-how-do-i-know-legali-is-compliant",
        question: "How do I know Legali isn't practicing law illegally?",
        answer: [
          {
            type: "paragraph",
            content:
              "We've designed Legali with unauthorized practice of law (UPL) compliance as a core principle:",
          },
          {
            type: "list",
            items: [
              "Clear disclaimers throughout the platform.",
              "Separation between informational tools and attorney services.",
              "Human attorney review available at critical junctures.",
              "Compliance with state bar association rules.",
              "Regular legal review of our platform and processes.",
            ],
          },
          {
            type: "paragraph",
            content:
              "Our commitment: If regulators or bar associations have concerns, we're responsive and adaptive. Serving you legally is our priority.",
          },
        ],
      },
      {
        id: "trust-and-transparency-what-if-im-still-concerned",
        question: "What if I'm still concerned about UPL issues?",
        answer: [
          {
            type: "paragraph",
            content:
              "We take these concerns seriously. If something on our platform seems to cross the line into legal advice, please:",
          },
          {
            type: "list",
            items: [
              "Contact our support team immediately.",
              "Report it through our compliance feedback system.",
              "Consult your state bar association with questions.",
            ],
          },
          {
            type: "paragraph",
            content: "We'd rather fix a problem than risk your legal rights.",
          },
        ],
      },
    ],
  },
  {
    id: "bottom-line",
    title: "Bottom Line",
    items: [
      {
        id: "bottom-line-what-am-i-getting-with-legali",
        question: "So what exactly am I getting with Legali?",
        answer: [
          {
            type: "paragraph",
            content: "Think of Legali as:",
          },
          {
            type: "list",
            items: [
              "Your legal GPS and confidant: Understand where you are and what paths might exist.",
              "Your organizer: Keep documents, deadlines, and tasks in one place.",
              "Your educator: Learn legal concepts without jargon.",
              "Your connector: Reach real attorneys when you want professional help.",
            ],
          },
          {
            type: "paragraph",
            content:
              "What we're not: Your lawyer, your representative, or your legal advisor—unless you hire an attorney through us, and then that attorney fills those roles.",
          },
        ],
      },
      {
        id: "bottom-line-ready-to-get-started",
        question: "Ready to get started?",
        answer: [
          {
            type: "paragraph",
            content:
              "Your story. Your tools. Your confidence—with real experts in the loop whenever needed.",
          },
          {
            type: "paragraph",
            content:
              "Still have questions? Contact our support team at support@legali.com or click the help icon in your dashboard. For legal advice about your specific situation, we'll connect you with a licensed attorney in our network.",
          },
        ],
      },
    ],
  },
];

export const FAQ_PREVIEW_IDS = [
  "understanding-legali-what-is-legali",
  "understanding-legali-can-i-use-legali-with-no-legal-experience",
  "avoiding-legal-mistakes-how-does-legali-help-avoid-critical-errors",
  "human-and-attorney-involvement-when-should-i-hire-an-attorney",
  "what-legali-can-and-cannot-do-does-legali-give-legal-advice",
  "pricing-and-access-is-legali-free",
] as const;

export const FAQ_PAGE_CLOSING_NOTE =
  "Legali provides legal information and tools, not legal advice, representation, or services. By using Legali, you acknowledge that no attorney-client relationship exists with Legali unless and until you separately engage an attorney through our network. Content on Legali is educational and general in nature.";
