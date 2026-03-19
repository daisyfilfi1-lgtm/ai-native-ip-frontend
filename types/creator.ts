// 创作者工作台类型定义
// 对应文档：场景-Agent-配置关联表

// ===== 样式类型 =====
export type StyleType = 'angry' | 'calm' | 'humor';

// ===== 选题卡片 =====
// 对应Agent：Strategy Agent输出
export interface TopicCard {
  id: string;
  title: string;
  score: number;                    // Strategy Agent: 四维评分结果
  estimatedViews: string;           // Analytics Agent: 播放量预测
  estimatedCompletion: number;      // Analytics Agent: 完播率预测
  tags: string[];
  reason: string;                   // 匹配原因说明（来自Memory Agent素材匹配）
  agentChain?: string[];            // 涉及的Agent链
  
  // Strategy Agent配置相关
  source?: string;                  // 来源竞品ID
  matchScore?: number;              // 团队素材匹配分（Memory Agent）
}

// ===== 生成内容 =====
// 对应Agent：Generation Agent输出 → Compliance Agent审核
export interface GeneratedContent {
  id: string;
  title: string;
  
  // 4段结构（Generation Agent分段生成）
  hook: string;                     // 钩子（黄金3秒）
  story: string;                    // 故事/案例
  opinion: string;                  // 观点/干货
  cta: string;                      // 行动号召
  
  // 风格配置（来自Generation Agent配置）
  style: StyleType;
  catchphrases?: string[];          // 检测到的口头禅
  
  // 溯源信息（Memory Agent提供）
  sourceTracing: SourceTrace[];
  
  // 合规检查（Compliance Agent输出）
  compliance: ComplianceResult;
  
  // Agent调用链
  agentChain: string[];
  
  // 元数据
  createdAt?: string;
  updatedAt?: string;
}

// ===== 素材溯源 =====
export interface SourceTrace {
  section: 'hook' | 'story' | 'opinion' | 'cta';
  sourceId: string;                 // 素材库中的ID
  sourceType?: 'story' | 'cognition' | 'scene' | 'remix';
  matchScore: number;               // 匹配度分数
  preview?: string;                 // 素材预览
}

// ===== 合规检查结果 =====
// 对应Agent：Compliance Agent输出
export interface ComplianceResult {
  originalityScore: number;         // 原创度分数（需>75%）
  sensitiveWords: SensitiveWord[];  // 检测到的敏感词
  platformChecks: {
    douyin: 'passed' | 'warning' | 'rejected';
    xiaohongshu: 'passed' | 'warning' | 'rejected';
  };
  suggestions?: string[];           // 修改建议
}

export interface SensitiveWord {
  word: string;
  level: 'red' | 'yellow' | 'blue'; // 三级敏感词
  position: string;                 // 出现位置
  suggestion: string;               // 替换建议
}

// ===== 内容库项目 =====
export interface LibraryItem {
  id: string;
  title: string;
  content: string;
  status: 'pending' | 'published' | 'viral' | 'draft';
  platforms?: string[];
  metrics?: {
    views: number;
    likes: number;
    comments: number;
    completionRate?: number;
  };
  createdAt: string;
  publishedAt?: string;
  
  // Agent相关
  generationSource?: 'topic' | 'remix' | 'voice';
  sourceTopicId?: string;
  sourceUrl?: string;               // remix来源
  agentChain?: string[];
}

// ===== 数据分析指标 =====
// 对应Agent：Analytics Agent提供
export interface AnalyticsMetrics {
  // 核心指标
  published: number;                // 本周发布数
  viral: number;                    // 本周爆款数（>10万播放）
  leads: number;                    // 本周引流数
  
  // 效率指标（Analytics Agent计算）
  viralRate: number;                // 爆款率
  completionRate: number;           // 平均完播率
  engagementRate: number;           // 互动率
  
  // AI优化建议
  suggestions?: AIRecommendation[];
}

export interface AIRecommendation {
  id: string;
  type: 'hook' | 'timing' | 'topic' | 'style';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  action?: string;
}

// ===== Agent配置类型（前端展示用） =====
export interface AgentConfig {
  // Strategy Agent配置
  strategy?: {
    competitorList: string[];       // 监控竞品列表
    scoreWeights: {
      traffic: number;              // 流量潜力权重
      monetization: number;         // 变现潜力权重
      fit: number;                  // 契合度权重
      cost: number;                 // 制作成本权重
    };
    blacklist: string[];            // 选题黑名单
  };
  
  // Memory Agent配置
  memory?: {
    tagSystem: {
      emotion: string[];
      scene: string[];
      cognition: string[];
    };
    retrievalStrategy: 'vector' | 'keyword' | 'hybrid';
    usageLimits: {
      story: number;
      cognition: number;
      scene: number;
    };
  };
  
  // Remix Agent配置
  remix?: {
    deconstructionRules: {
      hook: string[];
      emotion: string[];
      argument: string[];
      cta: string[];
    };
    originalityThreshold: {
      text: number;                 // 文本相似度阈值
      structure: number;            // 结构相似度阈值
    };
    hybridStrategy: 'full' | 'partial' | 'light';
  };
  
  // Generation Agent配置
  generation?: {
    styleTrainingSet: string[];     // S级文本ID列表（50篇）
    catchphrases: string[];         // 口头禅列表
    tabooWords: string[];           // 禁忌词列表
    sentenceLength: 'short' | 'medium' | 'long';
    emotionCurve: 'rising' | 'flat' | 'wavy';
  };
  
  // Compliance Agent配置
  compliance?: {
    sensitiveWords: {
      red: string[];
      yellow: string[];
      blue: string[];
    };
    platformRules: {
      douyin: PlatformRule;
      xiaohongshu: PlatformRule;
    };
    originalityThreshold: number;   // 原创度阈值（默认75%）
  };
}

export interface PlatformRule {
  maxLength: number;
  forbiddenWords: string[];
  contentGuidelines: string[];
}

// ===== API请求/响应类型 =====
export interface GenerateRequest {
  source: 'topic' | 'remix' | 'voice';
  topicId?: string;
  remixUrl?: string;
  voiceText?: string;
  style: StyleType;
  options?: {
    strictCompliance?: boolean;     // 是否严格合规（默认true）
    useMemory?: boolean;            // 是否使用素材库（默认true）
  };
}

export interface GenerateResponse {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  currentAgent?: string;            // 当前正在执行的Agent
  estimatedTime?: number;           // 预估剩余时间（秒）
  error?: string;
}

// ===== 工作台场景 =====
export type CreatorScenario = 'recommended' | 'remix' | 'voice';

export interface ScenarioConfig {
  id: CreatorScenario;
  name: string;
  description: string;
  agentChain: string[];             // 涉及的Agent链
  configRequired: string[];         // 需要配置的Agent
  icon: string;
}

export const SCENARIO_CONFIG: ScenarioConfig[] = [
  {
    id: 'recommended',
    name: '推荐选题',
    description: 'Strategy Agent智能推荐 + Memory Agent素材匹配',
    agentChain: ['Strategy', 'Memory', 'Analytics', 'Generation', 'Compliance'],
    configRequired: ['strategy', 'memory', 'generation', 'compliance'],
    icon: 'Sparkles'
  },
  {
    id: 'remix',
    name: '仿写爆款',
    description: 'Remix Agent结构仿写 + Memory Agent素材替换',
    agentChain: ['Remix', 'Memory', 'Generation', 'Compliance'],
    configRequired: ['remix', 'memory', 'generation', 'compliance'],
    icon: 'RefreshCw'
  },
  {
    id: 'voice',
    name: '语音创作',
    description: 'ASR语音识别 + Memory Agent语义检索 + 智能扩写',
    agentChain: ['ASR', 'Memory', 'Generation', 'Compliance'],
    configRequired: ['memory', 'generation', 'compliance'],
    icon: 'Mic'
  }
];
