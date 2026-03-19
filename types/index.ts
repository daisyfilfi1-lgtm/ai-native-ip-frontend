// IP Types
export interface IP {
  ip_id: string;
  name: string;
  owner_user_id: string;
  status: 'active' | 'inactive' | 'suspended';
  created_at?: string;
  updated_at?: string;
}

export interface CreateIPRequest {
  ip_id: string;
  name: string;
  owner_user_id: string;
  status?: string;
}

// Memory Types
export interface IngestRequest {
  ip_id: string;
  source_type: 'video' | 'audio' | 'text' | 'document';
  source_url?: string;
  local_file_id?: string;
  title?: string;
  notes?: string;
}

export interface IngestResponse {
  ingest_task_id: string;
  status: string;
}

export interface IngestStatus {
  ingest_task_id: string;
  status: 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  error?: string;
  created_assets: string[];
}

export interface RetrieveRequest {
  ip_id: string;
  query: string;
  filters?: {
    emotion_tags?: string[];
    scene_tags?: string[];
    max_usage_ratio?: number;
  };
  top_k?: number;
}

export interface RetrieveResult {
  asset_id: string;
  title?: string;
  content_snippet?: string;
  metadata: Record<string, any>;
  similarity: number;
}

// Tag Config Types
export interface TagCategoryValue {
  value: string;
  label: string;
  color: string;
  enabled: boolean;
}

export interface TagCategory {
  name: string;
  level: number;
  type: string;
  values: TagCategoryValue[];
}

export interface TagConfig {
  config_id: string;
  ip_id: string;
  tag_categories: TagCategory[];
  version: number;
  updated_by: string;
  updated_at: string;
}

// Memory Config Types
export interface RetrievalConfig {
  strategy: string;
  top_k: number;
  min_similarity: number;
  diversity_enabled: boolean;
  diversity_recent_window: number;
  freshness_weight: number;
}

export interface UsageLimitsConfig {
  core_max_usage: number;
  normal_max_usage: number;
  disposable_max_usage: number;
  exceed_behavior: string;
}

export interface MemoryConfig {
  config_id: string;
  ip_id: string;
  retrieval: RetrievalConfig;
  usage_limits: UsageLimitsConfig;
  version: number;
  updated_by: string;
  updated_at: string;
}

export interface MemoryFullConfig {
  tag_config?: TagConfig;
  memory_config?: MemoryConfig;
}

// Agent Types
export interface Agent {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  icon: string;
  color: string;
  status: 'active' | 'inactive' | 'configuring';
  config?: Record<string, any>;
}

// Dashboard Types
export interface DashboardStats {
  total_content: number;
  daily_output: number;
  approval_rate: number;
  avg_quality_score: number;
  cost_per_content: number;
  time_saved: number;
}

export interface WorkflowStatus {
  id: string;
  name: string;
  status: 'running' | 'completed' | 'failed' | 'pending';
  progress: number;
  startTime?: string;
  endTime?: string;
  agent?: string;
}

// Feishu integration
export interface FeishuConfig {
  configured: boolean;
  app_id: string;
  has_secret: boolean;
}

export interface FeishuConfigSave {
  app_id: string;
  app_secret: string;
}

export interface FeishuSpaceItem {
  space_id: string;
  name?: string;
  description?: string;
}

export interface FeishuSyncResult {
  synced: number;
  failed: number;
  errors: string[];
}
