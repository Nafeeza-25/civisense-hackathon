// Civisense Type Definitions

export type ServiceType = 
  | 'water' 
  | 'road' 
  | 'health' 
  | 'housing' 
  | 'welfare' 
  | 'electricity' 
  | 'sanitation' 
  | 'other';

export type UrgencyLevel = 'low' | 'medium' | 'high';

export type ComplaintStatus = 
  | 'New' 
  | 'Verified' 
  | 'Scheme Linked' 
  | 'Assigned' 
  | 'Resolved' 
  | 'Closed';

export interface VulnerabilityInfo {
  seniorCitizen: boolean;
  lowIncome: boolean;
  disability: boolean;
}

export interface ComplaintFormData {
  // Step 1
  description: string;
  area: string;
  // Step 2
  serviceType: ServiceType;
  // Step 3
  urgency: UrgencyLevel;
  // Step 4
  vulnerability: VulnerabilityInfo;
  // Step 5
  name: string;
  phone: string;
  email: string;
  consent: boolean;
}

export interface ComplaintSubmissionResult {
  referenceId: string;
  category: string;
  confidence: number;
  priorityScore: number;
  suggestedScheme: string;
  schemeExplanation: string;
  urgencyExplanation: string;
  nextSteps: string[];
}

export interface Complaint {
  id: string;
  description: string;
  category: string;
  priority: UrgencyLevel;
  scheme: string;
  area: string;
  status: ComplaintStatus;
  timestamp: string;
  contact: {
    name: string;
    phone: string;
    email: string;
  };
  vulnerability: VulnerabilityInfo;
}

export interface DashboardStats {
  total: number;
  pending: number;
  resolved: number;
  highPriority: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
}
