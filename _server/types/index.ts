// ============================================
// User & Auth Types
// ============================================
export interface User {
  id: number;
  email: string;
  name: string;
  password_hash: string;
  created_at: string;
  is_active: boolean;
}

export interface UserResponse {
  id: number;
  email: string;
  name: string;
  created_at: string;
  is_active: boolean;
}

export interface UserCreate {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: "bearer";
  expires_in: number;
  user?: UserResponse;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

// ============================================
// Policy Types
// ============================================
export interface Policy {
  policy_id: string;
  title: string;
  summary?: string;
  ministry?: string;
  source_type: "central" | "regional";
  ctpv_nm?: string;
  sgg_nm?: string;
  support_content?: string;
  support_provision?: string;
  target_detail?: string;
  application_method?: string;
  application_detail?: string;
  phone?: string;
  website?: string;
}

export interface PolicyListResponse {
  total: number;
  limit: number;
  offset: number;
  policies: Policy[];
}

export interface PolicyStatsResponse {
  total_policies: number;
  central_policies: number;
  regional_policies: number;
}

// ============================================
// Search Types
// ============================================
export interface SearchResult extends Policy {
  score: number;
}

export interface SearchResponse {
  query: string;
  total: number;
  results: SearchResult[];
}

export interface SearchHealthResponse {
  embedding_service: "ready" | "not_loaded";
  qdrant: "ready" | "unavailable";
  collection_count: number;
}

// ============================================
// Chat Types
// ============================================
export interface ChatFilters {
  chunk_type?: "basic_info" | "eligibility" | "benefit" | "application";
  province?: string;
}

export interface ChatRequest {
  query: string;
  session_id?: string;
  filters?: ChatFilters;
  top_k?: number;
  model?: string;
}

export interface PolicySource {
  policy_id: string;
  title: string;
  score: number;
  chunk_type?: string;
  chunk_content?: string;
  ministry?: string;
  summary?: string;
  support_content?: string;
  target_detail?: string;
  application_method?: string;
  phone?: string;
  website?: string;
  source_type: "central" | "regional";
  ctpv_nm?: string;
  sgg_nm?: string;
}

export interface ChatResponse {
  answer: string;
  sources: PolicySource[];
  query: string;
  context_used: boolean;
}

export interface ConversationRequest {
  message: string;
  session_id?: string;
}

export interface UserProfile {
  region?: string;
  life_cycle?: string;
  age_group?: string;
  interest?: string;
}

export type Intent =
  | "welfare_search"
  | "policy_detail"
  | "general_question"
  | "chitchat"
  | "unknown";

export interface ConversationResponse {
  response: string;
  session_id: string;
  intent: Intent;
  ready_to_search: boolean;
  user_profile: UserProfile;
  sources?: PolicySource[];
}

// ============================================
// Error Types
// ============================================
export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
    path: string;
  };
}

// ============================================
// Health Types
// ============================================
export interface HealthResponse {
  status: "healthy";
}

export interface RootResponse {
  message: string;
  version: string;
  status: string;
}

export interface ChatHealthResponse {
  qdrant: "ready" | "unavailable";
  postgres: "ready" | "unavailable";
  openai: "configured" | "not_configured";
  embedding_models: "pre-loaded" | "not_loaded";
  active_sessions: number;
  policy_count: {
    qdrant_chunks: number;
    postgres: number;
  };
}
