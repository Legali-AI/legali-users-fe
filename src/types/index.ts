export interface Lawyer {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  credentials: string[];
  educations: string[];
  jurisdiction: string[];
  specialties: string[];
  experience: number; // years
  rating: number; // 1-5
  reviewCount: number;
  hourlyRate: number;
  minPrice: number;
  maxPrice: number;
  completedCases: number;
  ongoingCases: number;
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
  language?: string;
  availability?: string;
  specialty?: string;
}

export interface SearchParams extends SearchFilters {
  query?: string;
  page?: number;
  limit?: number;
  sortBy?: "rating" | "price" | "name";
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

// API Response Types
export interface ApiLawyer {
  id: string;
  name: string;
  practice_area: string[];
  min_price: number;
  max_price: number;
  about: string;
  city: string;
  avg_rating: string;
  total_review: number;
  languages?: string[]; // Added for filtering
}

export interface LawyersApiResponse {
  success: boolean;
  message: string;
  data: ApiLawyer[];
  meta: number;
  error: null | string;
  timestamp: string;
}

// Lawyer Detail API Response
export interface LawyerDetailApiResponse {
  success: boolean;
  message: string;
  data: LawyerDetailApi;
  meta: {};
  error: null | string;
  timestamp: string;
}

export interface LawyerDetailApi {
  id: string;
  name: string;
  practice_area: string[];
  jurisdictions: string[];
  educations: string[];
  credentials: string[];
  languages: string[];
  min_price: number;
  max_price: number;
  about: string;
  city: string;
  avg_rating: string;
  total_review: number;
  client_reviews: ClientReview[];
  member_since: string;
  completed_cases: number;
  on_going_cases: number;
}

export interface ClientReview {
  name: string;
  scheduled_at: string | null;
  review: string;
  rate: number;
}
