export interface LitigationCase {
  id: string;
  title: string;
  description: string;
  summary: string;
  category: string;
  practiceArea: string;
  fundingGoal: number;
  amountRaised: number;
  investorCount: number;
  riskLevel: "Low" | "Medium" | "High";
  riskProfile: string;
  expectedReturn: string;
  expectedReturnMin: number;
  expectedReturnMax: number;
  timeframe: string;
  lawFirm: string;
  leadCounsel: string;
  counselExperience: string;
  image: string;
  status: "Active" | "Funded" | "Completed" | "Cancelled";
  fundingStage: string;
  progressPercentage: number;
  daysRemaining: number;
  minimumInvestment: number;
  caseType: string;
  jurisdiction: string;
  filedDate: string;
  lastUpdate: string;
  disclosureDocument: string;
  kycRequired: boolean;
  escrowStatus: string;
  updates: CaseUpdate[];
  keyFactors: string[];
  risks: string[];
  adminStatus: "Pending" | "Approved" | "Rejected";
  complianceNotes: string;
}

export interface CaseUpdate {
  date: string;
  title: string;
  content: string;
}

export interface InvestmentData {
  amount: string;
  investorNote: string;
  disclosureAcknowledged: boolean;
  riskAcknowledged: boolean;
  termsAccepted: boolean;
  kycConfirmed: boolean;
}

export interface InvestmentStep {
  number: number;
  title: string;
  description: string;
}

export interface RiskLevel {
  color: string;
}

export interface ReturnRange {
  label: string;
  min: number;
  max: number;
}

export interface CaseFilters {
  searchTerm: string;
  selectedPracticeArea: string;
  selectedFundingStage: string;
  selectedRiskProfile: string;
  selectedReturnRange: string;
  sortBy: string;
}

export interface CaseStats {
  totalCases: number;
  activeCases: number;
  fundedCases: number;
  totalRaised: number;
}

export interface UserRole {
  type: "investor" | "admin";
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  adminOnly?: boolean;
}

// Constants
export const PRACTICE_AREAS = [
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
] as const;

export const FUNDING_STAGES = [
  "All Stages",
  "Early Funding",
  "Active Funding",
  "Fully Funded",
  "Pre-Settlement",
] as const;

export const RETURN_RANGES: ReturnRange[] = [
  { label: "All Returns", min: 0, max: 100 },
  { label: "1.5x - 2.5x", min: 1.5, max: 2.5 },
  { label: "2.5x - 4x", min: 2.5, max: 4.0 },
  { label: "3x - 6x", min: 3.0, max: 6.0 },
  { label: "4x+", min: 4.0, max: 100 },
];

export const RISK_LEVELS: Record<string, RiskLevel> = {
  Low: { color: "bg-green-100 text-green-800 border-green-200" },
  Medium: { color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  High: { color: "bg-red-100 text-red-800 border-red-200" },
};
