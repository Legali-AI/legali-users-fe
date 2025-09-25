export interface Lawyer {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  credentials: string[];
  jurisdiction: string[];
  specialties: string[];
  experience: number; // years
  rating: number; // 1-5
  reviewCount: number;
  hourlyRate: number;
  availability: "available" | "busy" | "offline";
  languages: string[];
  bio: string;
  caseResults: CaseResult[];
  pricingPackages: PricingPackage[];
  videoIntroUrl?: string;
  verificationStatus: "verified" | "pending" | "unverified";
  disciplinaryHistory: DisciplinaryRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface CaseResult {
  id: string;
  caseType: string;
  outcome: string;
  description: string;
  year: number;
}

export interface PricingPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string; // e.g., "1 hour", "consultation"
  features: string[];
}

export interface DisciplinaryRecord {
  id: string;
  date: string;
  description: string;
  resolution: string;
}

export interface Review {
  id: string;
  lawyerId: string;
  clientName: string;
  rating: number;
  comment: string;
  caseType: string;
  date: string;
  verificationStatus: "verified" | "pending";
  isAnonymous: boolean;
}

export interface Booking {
  id: string;
  lawyerId: string;
  clientId: string;
  packageId: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  scheduledDate: string;
  scheduledTime: string;
  duration: number; // minutes
  totalAmount: number;
  paymentStatus: "pending" | "paid" | "refunded";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  createdAt: string;
}

export interface SearchFilters {
  caseType?: string;
  location?: string;
  budget?: {
    min: number;
    max: number;
  };
  rating?: number;
  experience?: number;
  language?: string;
  availability?: string;
  specialty?: string;
}

export interface SearchParams extends SearchFilters {
  query?: string;
  page?: number;
  limit?: number;
  sortBy?: "rating" | "price" | "experience" | "reviews";
  sortOrder?: "asc" | "desc";
}

export type CaseType =
  | "criminal"
  | "civil"
  | "family"
  | "corporate"
  | "immigration"
  | "real_estate"
  | "intellectual_property"
  | "employment"
  | "personal_injury"
  | "tax"
  | "bankruptcy"
  | "estate_planning";

export type LawyerSpecialty =
  | "litigation"
  | "mediation"
  | "arbitration"
  | "consultation"
  | "contract_review"
  | "legal_research"
  | "document_preparation";

export interface FormErrors {
  [key: string]: string | undefined;
}
