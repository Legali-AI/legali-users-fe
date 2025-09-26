import type {
  LitigationCase,
  ReturnRange,
  RiskLevel,
} from "@/types/litigation";

export const practiceAreas = [
  "All Practice Areas",
  "Employment Law",
  "Intellectual Property",
  "Personal Injury",
  "Commercial Litigation",
  "Securities Litigation",
  "Product Liability",
  "Medical Malpractice",
  "Antitrust",
  "Environmental Law",
];

export const fundingStages = [
  "All Stages",
  "Early Funding",
  "Active Funding",
  "Fully Funded",
  "Pre-Settlement",
];

export const returnRanges: ReturnRange[] = [
  { label: "All Returns", min: 0, max: 100 },
  { label: "1.5x - 2.5x", min: 1.5, max: 2.5 },
  { label: "2.5x - 4x", min: 2.5, max: 4.0 },
  { label: "3x - 6x", min: 3.0, max: 6.0 },
  { label: "4x+", min: 4.0, max: 100 },
];

export const riskLevels: Record<string, RiskLevel> = {
  Low: { color: "bg-green-100 text-green-800 border-green-200" },
  Medium: { color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  High: { color: "bg-red-100 text-red-800 border-red-200" },
};

export const mockCases: LitigationCase[] = [
  {
    id: "1",
    title: "Employment Discrimination Class Action",
    description:
      "Seeking justice for systematic workplace discrimination affecting over 200 employees. Strong evidence of discriminatory practices with significant potential for recovery.",
    summary:
      "Class action lawsuit against Fortune 500 company for workplace discrimination affecting 200+ employees.",
    category: "Employment Law",
    practiceArea: "Employment Law",
    fundingGoal: 250000,
    amountRaised: 180000,
    investorCount: 47,
    riskLevel: "Medium",
    riskProfile: "Medium",
    expectedReturn: "2.5x - 4x",
    expectedReturnMin: 2.5,
    expectedReturnMax: 4.0,
    timeframe: "18-24 months",
    lawFirm: "Thompson & Associates LLP",
    leadCounsel: "Sarah Thompson, Esq.",
    counselExperience: "15 years employment law",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800",
    status: "Active",
    fundingStage: "Active Funding",
    progressPercentage: 72,
    daysRemaining: 45,
    minimumInvestment: 1000,
    caseType: "Class Action",
    jurisdiction: "California",
    filedDate: "2024-03-15",
    lastUpdate: "2024-06-20",
    disclosureDocument: "/docs/case-1-disclosure.pdf",
    kycRequired: true,
    escrowStatus: "Active",
    updates: [
      {
        date: "2024-06-20",
        title: "Discovery Phase Completed",
        content:
          "Successfully completed discovery phase. Evidence strongly supports our case.",
      },
      {
        date: "2024-05-15",
        title: "Additional Plaintiffs Added",
        content:
          "Added 35 additional plaintiffs, strengthening our class action.",
      },
    ],
    keyFactors: [
      "Strong documentary evidence",
      "Experienced legal team",
      "Clear damages calculation",
      "Favorable jurisdiction",
    ],
    risks: [
      "Defendant may appeal",
      "Settlement negotiations ongoing",
      "Regulatory changes possible",
    ],
    adminStatus: "Approved",
    complianceNotes: "KYC verification required for all investors",
  },
  {
    id: "2",
    title: "Patent Infringement Dispute",
    description:
      "Major tech company patent infringement case with clear evidence of unauthorized use of patented technology.",
    summary:
      "Patent infringement litigation against major technology corporation for unauthorized use of proprietary algorithms.",
    category: "Intellectual Property",
    practiceArea: "Intellectual Property",
    fundingGoal: 500000,
    amountRaised: 125000,
    investorCount: 23,
    riskLevel: "High",
    riskProfile: "High",
    expectedReturn: "3x - 6x",
    expectedReturnMin: 3.0,
    expectedReturnMax: 6.0,
    timeframe: "24-36 months",
    lawFirm: "IP Law Partners",
    leadCounsel: "Michael Chen, Esq.",
    counselExperience: "20 years IP litigation",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800",
    status: "Active",
    fundingStage: "Early Funding",
    progressPercentage: 25,
    daysRemaining: 120,
    minimumInvestment: 5000,
    caseType: "Patent Litigation",
    jurisdiction: "Delaware",
    filedDate: "2024-01-10",
    lastUpdate: "2024-06-18",
    disclosureDocument: "/docs/case-2-disclosure.pdf",
    kycRequired: true,
    escrowStatus: "Pending Threshold",
    updates: [
      {
        date: "2024-06-18",
        title: "Case Accepted by Court",
        content:
          "Federal court has accepted our case for trial. Preliminary motions scheduled.",
      },
    ],
    keyFactors: [
      "Valid patent claims",
      "Clear infringement evidence",
      "High damages potential",
      "Experienced IP counsel",
    ],
    risks: [
      "Patent validity challenges",
      "Complex technical arguments",
      "Long litigation timeline",
      "Appeal likelihood",
    ],
    adminStatus: "Approved",
    complianceNotes: "Accredited investors only due to high risk profile",
  },
  {
    id: "3",
    title: "Personal Injury Settlement",
    description:
      "Medical malpractice case with strong liability and significant damages. Hospital negligence resulted in permanent injury.",
    summary:
      "Medical malpractice lawsuit with clear negligence and documented damages against major hospital system.",
    category: "Personal Injury",
    practiceArea: "Personal Injury",
    fundingGoal: 150000,
    amountRaised: 150000,
    investorCount: 62,
    riskLevel: "Low",
    riskProfile: "Low",
    expectedReturn: "1.8x - 2.5x",
    expectedReturnMin: 1.8,
    expectedReturnMax: 2.5,
    timeframe: "12-18 months",
    lawFirm: "Injury Law Center",
    leadCounsel: "David Rodriguez, Esq.",
    counselExperience: "12 years personal injury",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800",
    status: "Funded",
    fundingStage: "Fully Funded",
    progressPercentage: 100,
    daysRemaining: 0,
    minimumInvestment: 500,
    caseType: "Medical Malpractice",
    jurisdiction: "New York",
    filedDate: "2024-02-20",
    lastUpdate: "2024-06-25",
    disclosureDocument: "/docs/case-3-disclosure.pdf",
    kycRequired: true,
    escrowStatus: "Released",
    updates: [
      {
        date: "2024-06-25",
        title: "Settlement Negotiations Advanced",
        content:
          "Productive settlement discussions with hospital administration. Mediation scheduled.",
      },
      {
        date: "2024-05-10",
        title: "Expert Testimony Secured",
        content:
          "Leading medical expert agrees to testify. Strengthens malpractice claims significantly.",
      },
    ],
    keyFactors: [
      "Clear medical negligence",
      "Expert witness testimony",
      "Documented damages",
      "Favorable precedents",
    ],
    risks: ["Settlement amount uncertainty", "Medical review board challenges"],
    adminStatus: "Approved",
    complianceNotes: "Standard due diligence completed",
  },
];
