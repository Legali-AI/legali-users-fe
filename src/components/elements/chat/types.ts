export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  attachments?: File[] | undefined;
  conversation_id?: string;
  role?: "user" | "assistant" | "system";
}

// API Response Types
export interface ApiMessage {
  id: string;
  conversation_id: string;
  created_at: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  attachments: any[];
}

export interface WorkflowRecommendation {
  action_type: string;
  priority: number;
  title: string;
  description: string;
  endpoint: string;
  method: string;
  parameters: Record<string, any>;
  prerequisites: any[];
  estimated_time: string;
  case_context: {
    complexity_level: string;
    urgency_level: string;
    case_type: string;
    jurisdiction: string;
    risk_factors: string[];
  };
  confidence_score: number;
  frontend_route: string;
  frontend_params: Record<string, any>;
  button_text: string;
  icon: string;
}

export interface CaseAnalysis {
  id: string;
  conversation_id: string;
  user_id: string;
  analysis_type: string;
  case_summary: string;
  complexity_score: number;
  complexity_level: string;
  jurisdiction: string;
  case_type: string;
  urgency_level: string;
  risk_factors: string[];
  recommended_actions: any[];
  has_contracts: boolean;
  has_litigation: boolean;
  requires_specialist: boolean;
  estimated_value: number | null;
  has_mediation_clause: boolean;
  is_high_value: boolean;
  analysis_data: Record<string, any>;
  confidence_score: number;
  created_at: string;
}

export interface SendMessageResponse {
  success: boolean;
  message: string;
  data: {
    conversation_id: string;
    output: string;
    document_recommendations: Record<string, any>;
    redflag_recommendation: Record<string, any>;
    workflow_recommendations: WorkflowRecommendation[];
    case_analysis: CaseAnalysis;
    next_suggested_action: WorkflowRecommendation;
    related_recommendations: Record<string, any>;
    active_agent: any;
  };
  meta: Record<string, any>;
  error: any;
  timestamp: string;
}

export interface GetMessagesResponse {
  success: boolean;
  message: string;
  data: ApiMessage[];
  meta: Record<string, any>;
  error: any;
  timestamp: string;
}
