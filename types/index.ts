// IP Types
export interface IP {
  ip_id: string;
  name: string;
  owner_user_id: string;
  status: 'active' | 'inactive' | 'suspended';
  created_at?: string;
  updated_at?: string;
  
  // 账号体系：超级符号识别系统（7个标准化触点）
  avatar_url?: string;
  nickname?: string;
  bio?: string;
  cover_image_url?: string;
  cover_template?: string;
  pinned_content?: string;
  like_follower_ratio?: string;
  
  // 商业定位：变现前置原则
  monetization_model?: string;
  target_audience?: string;
  content_direction?: string;
  unique_value_prop?: string;
  
  // 定位交叉点：擅长 × 热爱 × 市场需求
  expertise?: string;
  passion?: string;
  market_demand?: string;
  
  // 变现象限：产品/服务 × 客单价 × 复购率
  product_service?: string;
  price_range?: string;
  repurchase_rate?: string;
}

export interface CreateIPRequest {
  ip_id: string;
  name: string;
  owner_user_id: string;
  status?: string;
  
  // 账号体系字段
  avatar_url?: string;
  nickname?: string;
  bio?: string;
  cover_image_url?: string;
  cover_template?: string;
  pinned_content?: string;
  like_follower_ratio?: string;
  
  // 商业定位字段
  monetization_model?: string;
  target_audience?: string;
  content_direction?: string;
  unique_value_prop?: string;
  
  // 定位交叉点字段
  expertise?: string;
  passion?: string;
  market_demand?: string;
  
  // 变现象限字段
  product_service?: string;
  price_range?: string;
  repurchase_rate?: string;
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

/** GET /memory/assets 单条素材摘要 */
export interface MemoryAssetItem {
  asset_id: string;
  title?: string;
  content_snippet?: string;
  asset_type: string;
  metadata: Record<string, unknown>;
}

export interface AssetsListResponse {
  items: MemoryAssetItem[];
  total: number;
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

// 待办标签 / 更新标签
export interface PendingLabelsItem {
  asset_id: string;
  title?: string;
  source?: string;
  content_snippet?: string;
  auto_labels: Record<string, unknown>;
}

export interface UpdateLabelsRequest {
  ip_id: string;
  confirmed_labels: Record<string, unknown>;
}

// Config history
export interface ConfigHistoryItem {
  id: string;
  agent: string;
  action: string;
  user: string;
  time: string;
  version: number;
}
