export type DealStatus = "draft" | "active" | "completed" | "on_hold";
export type StepStatus = "todo" | "in_progress" | "done" | "blocked";
export type DocVerificationStatus = "pending" | "verified" | "rejected" | "expired";
export type TokenizationMode = "fractional" | "tokenized";
export type CopilotRecommendation = "PROCEED" | "HOLD" | "ESCALATE";

export interface Party {
  id: string;
  name: string;
  nameAr?: string;
  role: "seller" | "broker" | "buyer" | "regulator" | "escrow_agent";
  sharePercent?: number;
  kycStatus: "pending" | "verified" | "failed";
  email: string;
}

export interface DealDoc {
  id: string;
  type: "title_deed" | "noc" | "valuation_report" | "kyc_doc" | "escrow_agreement" | "spa" | "power_of_attorney" | "passport" | "emirates_id";
  filename: string;
  uploadedAt: string;
  extractedFields: Record<string, string>;
  verificationStatus: DocVerificationStatus;
  uploadedBy: string;
}

export interface DealStep {
  id: string;
  title: string;
  titleAr: string;
  status: StepStatus;
  requiredDocs: string[];
  notes: string[];
  order: number;
  completedAt?: string;
  blockedReason?: string;
}

export interface AuditEntry {
  ts: string;
  actor: string;
  action: string;
  detail: string;
  emoji: string;
}

export interface FieldReport {
  ts: string;
  user: string;
  note: string;
  noteAr?: string;
  mood: "positive" | "neutral" | "concerned";
  lang: "en" | "ar";
}

export interface DealMetrics {
  complianceScore: number;
  riskScore: number;
  estTimeToCloseDays: number;
}

export interface Deal {
  id: string;
  name: string;
  nameAr: string;
  city: "Dubai" | "Abu Dhabi" | "Sharjah" | "Ras Al Khaimah";
  propertyType: "residential" | "commercial" | "mixed_use" | "land";
  tokenizationMode: TokenizationMode;
  totalShares: number;
  sharePrice: number;
  currency: "AED";
  governanceRule: { majorityThreshold: number };
  parties: Party[];
  steps: DealStep[];
  docs: DealDoc[];
  audit: AuditEntry[];
  fieldReports: FieldReport[];
  metrics: DealMetrics;
  status: DealStatus;
  createdAt: string;
  propertyAddress: string;
  propertyAddressAr: string;
  totalValue: number;
  imageUrl?: string;
}

export interface CopilotInsight {
  recommendation: CopilotRecommendation;
  rationale: string[];
  rationaleAr: string[];
  actions: { label: string; labelAr: string; action: string }[];
}

export interface SimulateEvent {
  type: "missing_doc" | "noc_delay" | "majority_flip" | "risk_surge" | "doc_verified" | "step_completed" | "approval_delay";
  dealId: string;
}

export interface RentDistribution {
  partyId: string;
  partyName: string;
  sharePercent: number;
  monthlyRent: number;
  annualRent: number;
}

export interface LeaderboardEntry {
  name: string;
  avatar: string;
  reviews: number;
  avgDays: number;
}
