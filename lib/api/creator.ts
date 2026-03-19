// 创作者工作台API
// 对应后台：7-Agent工作流系统

import { TopicCard, GeneratedContent, LibraryItem, AnalyticsMetrics, StyleType } from '@/types/creator';

// ===== Agent配置状态类型 =====
export interface AgentStatus {
  status: 'ready' | 'configuring' | 'error';
  config: string[];
  lastUpdated?: string;
}

export interface AgentConfigStatus {
  // 场景一：推荐选题相关Agent
  strategy: AgentStatus;    // 策略Agent：评分权重、竞品监控
  memory: AgentStatus;      // 记忆Agent：标签体系、检索策略
  analytics: AgentStatus;   // 分析Agent：预测模型
  
  // 场景二：仿写爆款相关Agent
  remix: AgentStatus;       // 混剪Agent：解构规则、原创度
  
  // 场景三：语音创作相关Agent
  asr: AgentStatus;         // 语音识别：ASR服务状态
  
  // 通用生成Agent
  generation: AgentStatus;  // 生成Agent：风格训练、口头禅、禁忌词
  compliance: AgentStatus;  // 合规Agent：敏感词库、平台规则
}

// ===== 生成结果类型 =====
export interface GenerateResult {
  id: string;
  status: 'processing' | 'completed' | 'failed';
  progress?: number;
  estimatedTime?: number;
}

// ===== Mock数据 =====
const mockTopics: TopicCard[] = [
  {
    id: 'topic_001',
    title: '现金流断裂如何自救：从负债500万到3年翻身的真实案例',
    score: 4.85,
    estimatedViews: '50-80万',
    estimatedCompletion: 38,
    tags: ['现金流', '创业', '翻身'],
    reason: '故事_003素材匹配 + 现金流话题近期热度↑',
    agentChain: ['Strategy', 'Memory', 'Generation', 'Compliance']
  },
  {
    id: 'topic_002',
    title: '为什么90%的IP都在第一步做错了？',
    score: 4.72,
    estimatedViews: '30-50万',
    estimatedCompletion: 35,
    tags: ['IP定位', '认知'],
    reason: '竞对@张三近期爆款结构 + 高变现潜力',
    agentChain: ['Strategy', 'Memory', 'Generation', 'Compliance']
  },
  {
    id: 'topic_003',
    title: '月入3万的私域运营，朋友圈应该怎么发？',
    score: 4.65,
    estimatedViews: '25-40万',
    estimatedCompletion: 42,
    tags: ['私域', '变现'],
    reason: '团队专属素材库匹配 + 低竞争度蓝海',
    agentChain: ['Strategy', 'Memory', 'Generation', 'Compliance']
  }
];

const mockAgentStatus: AgentConfigStatus = {
  strategy: {
    status: 'ready',
    config: ['四维权重', '竞品监控列表', '选题黑名单'],
    lastUpdated: '2026-03-15'
  },
  memory: {
    status: 'ready',
    config: ['情绪/场景/认知标签', '混合检索策略', '素材使用追踪'],
    lastUpdated: '2026-03-16'
  },
  analytics: {
    status: 'ready',
    config: ['播放量预测', '完播率预测'],
    lastUpdated: '2026-03-15'
  },
  remix: {
    status: 'configuring',
    config: ['结构解构规则待完善'],
    lastUpdated: '2026-03-17'
  },
  asr: {
    status: 'ready',
    config: ['Whisper API连接正常'],
    lastUpdated: '2026-03-10'
  },
  generation: {
    status: 'ready',
    config: ['50篇S级训练文本', '3种情绪风格', '口头禅配置'],
    lastUpdated: '2026-03-16'
  },
  compliance: {
    status: 'ready',
    config: ['三级敏感词库', '平台规则库'],
    lastUpdated: '2026-03-18'
  }
};

// ===== API实现 =====
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ai-native-ip-production.up.railway.app';

async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
}

export const creatorApi = {
  // ===== Agent配置状态 =====
  async getAgentConfigStatus(): Promise<AgentConfigStatus> {
    // TODO: 连接后端 Agent配置状态API
    // 后端应返回各Agent的配置状态，用于前端展示是否可用
    return mockAgentStatus;
  },

  // ===== 场景一：推荐选题 =====
  // 对应Agent链：Strategy → Memory → Analytics
  async getRecommendedTopics(): Promise<TopicCard[]> {
    // TODO: 连接后端 /api/creator/topics/recommended
    // 后端Agent链调用顺序：
    // 1. Strategy Agent: 获取监控列表 + 四维评分 → 输出评分≥4.5的候选
    // 2. Memory Agent: 用关键词检索团队专属素材 → 标记匹配度
    // 3. Analytics Agent: 预测播放量/完播率 → 输出预估数据
    // 4. 返回前端排序后的3个推荐选题
    return mockTopics;
  },

  async refreshTopics(): Promise<TopicCard[]> {
    // 手动刷新选题
    await new Promise(resolve => setTimeout(resolve, 1000));
    return mockTopics.sort(() => Math.random() - 0.5);
  },

  // 场景一生成：选题 → 生成
  // 对应Agent链：Memory → Generation → Compliance
  async generateFromTopic(topicId: string, style: StyleType): Promise<GenerateResult> {
    // TODO: 连接后端 /api/creator/generate/topic
    // 后端Agent链调用顺序：
    // 1. Memory Agent: 根据topicId关键词检索素材（混合检索：文本+语义）
    // 2. Generation Agent: 
    //    - 加载已配置的50篇S级训练文本
    //    - 按指定style（angry/calm/humor）应用风格
    //    - 应用已配置的口头禅、句长偏好
    //    - 输出4段结构（钩子/故事/观点/CTA）
    // 3. Compliance Agent:
    //    - 原创度检测：vs竞品库 + vs已发表内容
    //    - 敏感词扫描：三级词库匹配
    //    - 平台规则检查：基于douyin/xiaohongshu规则
    //    - 如未通过，打回Generation Agent修改
    // 4. 返回生成任务ID，前端轮询进度
    
    console.log('[API] Generate from topic:', { topicId, style });
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      id: `gen_${Date.now()}`,
      status: 'processing',
      progress: 0,
      estimatedTime: 8
    };
  },

  // ===== 场景二：仿写爆款 =====
  // 对应Agent链：Remix → Memory → Generation → Compliance
  async generateFromRemix(url: string, style: StyleType): Promise<GenerateResult> {
    // TODO: 连接后端 /api/creator/generate/remix
    // 后端Agent链调用顺序：
    // 1. Remix Agent:
    //    - 解析竞品URL获取内容
    //    - 按钩子/情绪递进/论证逻辑/CTA解构
    //    - 计算原创度：文本相似度<25%, 结构相似度<40%
    // 2. Memory Agent:
    //    - 按竞品关键词检索可替换的团队素材
    //    - 返回候选素材列表
    // 3. Generation Agent:
    //    - 保持结构，替换内容为团队素材
    //    - 应用配置的风格/口头禅
    // 4. Compliance Agent:
    //    - 原创度检测
    //    - 敏感词检测
    // 5. 返回生成任务ID
    
    console.log('[API] Generate from remix:', { url, style });
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      id: `remix_${Date.now()}`,
      status: 'processing',
      progress: 0,
      estimatedTime: 12
    };
  },

  // ===== 场景三：语音创作 =====
  // 对应Agent链：ASR → Memory → Generation → Compliance
  async generateFromVoice(text: string, style: StyleType): Promise<GenerateResult> {
    // TODO: 连接后端 /api/creator/generate/voice
    // 后端Agent链调用顺序：
    // 1. ASR: 将语音转为文字（前端可直接传文字，或用Whisper API）
    // 2. Memory Agent:
    //    - 语义理解用户意图
    //    - 检索相关素材进行关联
    // 3. Generation Agent:
    //    - 将简短语音扩展为完整4段结构
    //    - 保持用户原始意思
    //    - 应用风格配置
    // 4. Compliance Agent:
    //    - 合规检查
    // 5. 返回生成任务ID
    
    console.log('[API] Generate from voice:', { text, style });
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      id: `voice_${Date.now()}`,
      status: 'processing',
      progress: 0,
      estimatedTime: 8
    };
  },

  // ===== 获取生成进度 =====
  async getGenerationProgress(id: string): Promise<GenerateResult> {
    // TODO: 连接后端 /api/creator/generate/:id/progress
    // 返回当前生成进度和各Agent调用状态
    return {
      id,
      status: 'processing',
      progress: 60,
      estimatedTime: 3
    };
  },

  // ===== 获取生成结果 =====
  async getGeneratedContent(id: string): Promise<GeneratedContent> {
    // TODO: 连接后端 /api/creator/generate/:id/result
    // 返回最终生成的文案和分段结构
    return {
      id,
      title: '现金流断裂如何自救',
      hook: '从负债500万到3年翻身，我只做对了一件事...',
      story: '2022年，我的公司现金流断裂，负债500万。那时我每天都在想，是申请破产还是继续坚持？直到有一天，我看到了一个数据：90%的企业倒闭不是因为没利润，而是因为现金流管理出了问题...',
      opinion: '现金流管理比利润更重要。利润是面子，现金流是里子。很多企业看起来很赚钱，但账上没钱，发不出工资，这就是现金流危机。',
      cta: '如果你也在为现金流发愁，评论区扣"现金流"，我把我的翻身方法论分享给你。',
      style: 'angry',
      sourceTracing: [
        { section: 'story', sourceId: 'story_003', matchScore: 85 }
      ],
      compliance: {
        originalityScore: 82,
        sensitiveWords: [],
        platformChecks: {
          douyin: 'passed',
          xiaohongshu: 'passed'
        }
      },
      agentChain: ['Memory', 'Generation', 'Compliance']
    };
  },

  // ===== 内容库 =====
  async getLibraryItems(status?: string): Promise<LibraryItem[]> {
    // TODO: 连接后端 /api/creator/library
    return [];
  },

  async publishContent(id: string, platforms: string[]): Promise<void> {
    // TODO: 连接后端 /api/creator/publish
    console.log('Publish:', { id, platforms });
  },

  // ===== 数据分析 =====
  async getAnalytics(): Promise<AnalyticsMetrics> {
    // TODO: 连接后端 /api/creator/analytics
    return {
      published: 12,
      viral: 2,
      leads: 156,
      viralRate: 16.7,
      completionRate: 38.5,
      engagementRate: 5.2
    };
  },
};

// ===== 重新导出类型 =====
export type { TopicCard, GeneratedContent, LibraryItem, AnalyticsMetrics, StyleType };
