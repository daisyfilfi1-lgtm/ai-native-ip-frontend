// IP创作端 API 接口（Mock实现）

import type { 
  TopicCard, 
  GeneratedContent, 
  ContentItem, 
  AnalyticsData,
  StyleType 
} from '@/types/creator';

// Mock数据：今日推荐选题
export const mockTopics: TopicCard[] = [
  {
    id: 'topic_001',
    title: '现金流告急时，这3个动作能救命',
    score: 4.8,
    estimatedViews: '50-80万',
    estimatedCompletion: 32,
    tags: ['现金流', '创业', '危机管理'],
    reason: '基于你的故事_003匹配'
  },
  {
    id: 'topic_002',
    title: '我从负债200万到年入千万的转折点',
    score: 4.9,
    estimatedViews: '80-120万',
    estimatedCompletion: 45,
    tags: ['逆袭', '个人成长', '搞钱'],
    reason: '近期"负债翻盘"话题热度上升'
  },
  {
    id: 'topic_003',
    title: '为什么90%的创业者都倒在第3年？',
    score: 4.6,
    estimatedViews: '30-50万',
    estimatedCompletion: 28,
    tags: ['创业', '认知', '避坑'],
    reason: '符合你的"创业认知"人设标签'
  }
];

// Mock数据：生成中的内容
export const mockGeneratedContent: Record<StyleType, GeneratedContent> = {
  angry: {
    id: 'gen_001',
    topicId: 'topic_001',
    status: 'completed',
    style: 'angry',
    sections: {
      hook: {
        id: 'sec_001',
        content: '现金流断了！公司账上只剩3个月工资，我整夜整夜睡不着。',
        source: '你的素材库：2020年破产经历',
        editable: true
      },
      story: {
        id: 'sec_002',
        content: '那年公司连续6个月亏损，供应商天天堵门，员工开始离职。我试过借钱、试过裁员、甚至想过关门。直到我遇到了一个贵人，教会我这3个救命动作...',
        source: '你的素材库：贵人相助故事',
        editable: true
      },
      opinion: {
        id: 'sec_003',
        content: '现金流不是等来的，是设计出来的！大部分创业者只关注营收，却忽略了现金流的三个关键节点：回款周期、库存周转、固定成本。',
        editable: true
      },
      cta: {
        id: 'sec_004',
        content: '如果你现在正在经历现金流危机，评论区扣"急救"，我把这份《现金流急救清单》发给你。',
        editable: true
      }
    },
    compliance: {
      originality: 87,
      sensitiveWords: false,
      status: 'passed'
    },
    createdAt: new Date().toISOString()
  },
  calm: {
    id: 'gen_002',
    topicId: 'topic_001',
    status: 'completed',
    style: 'calm',
    sections: {
      hook: {
        id: 'sec_005',
        content: '创业10年，我经历过3次现金流危机，每次都让我对企业管理有了更深的理解。',
        source: '你的素材库：创业经历总结',
        editable: true
      },
      story: {
        id: 'sec_006',
        content: '2020年那次，公司账上现金流只够运转2个月。我没有慌乱，而是静下心来，做了三件关键的事：梳理应收账款、谈判延长账期、砍掉非核心业务...',
        source: '你的素材库：2020危机处理',
        editable: true
      },
      opinion: {
        id: 'sec_007',
        content: '现金流管理本质上是时间管理。你需要清楚地知道：钱什么时候进来，什么时候出去，中间的缺口有多大。做好这三点，现金流就不会出大问题。',
        editable: true
      },
      cta: {
        id: 'sec_008',
        content: '关于现金流管理，你还有什么困惑？欢迎在评论区交流。',
        editable: true
      }
    },
    compliance: {
      originality: 89,
      sensitiveWords: false,
      status: 'passed'
    },
    createdAt: new Date().toISOString()
  },
  humor: {
    id: 'gen_003',
    topicId: 'topic_001',
    status: 'completed',
    style: 'humor',
    sections: {
      hook: {
        id: 'sec_009',
        content: '我曾经以为创业最难的是找客户，后来才发现，最难的是找——钱！',
        source: '原创',
        editable: true
      },
      story: {
        id: 'sec_010',
        content: '最惨的时候，我每天早上起床第一件事，就是打开银行APP看看余额。那感觉，比看股票还刺激！有次请客户吃饭，结账时卡刷不出来，那个尴尬啊...',
        source: '你的素材库：创业囧事',
        editable: true
      },
      opinion: {
        id: 'sec_011',
        content: '但说真的，现金流这事，预防比救火重要。就像你不可能等房子着火了才想起买保险，对吧？',
        editable: true
      },
      cta: {
        id: 'sec_012',
        content: '你有过"余额不足"的尴尬时刻吗？评论区说说，让我知道我不是一个人',
        editable: true
      }
    },
    compliance: {
      originality: 85,
      sensitiveWords: false,
      status: 'passed'
    },
    createdAt: new Date().toISOString()
  }
};

// Mock数据：内容库
export const mockContentLibrary: ContentItem[] = [
  {
    id: 'content_001',
    title: '现金流告急时，这3个动作能救命',
    status: 'pending',
    style: 'angry',
    createdAt: '2026-03-19T10:00:00Z'
  },
  {
    id: 'content_002',
    title: '我从负债200万到年入千万的转折点',
    status: 'published',
    style: 'calm',
    views: 850000,
    likes: 12000,
    createdAt: '2026-03-18T14:00:00Z',
    publishedAt: '2026-03-18T16:00:00Z'
  },
  {
    id: 'content_003',
    title: '为什么90%的创业者都倒在第3年？',
    status: 'hit',
    style: 'angry',
    views: 1200000,
    likes: 25000,
    createdAt: '2026-03-17T09:00:00Z',
    publishedAt: '2026-03-17T11:00:00Z'
  },
  {
    id: 'content_004',
    title: '团队管理的3个坑，我踩过2个',
    status: 'draft',
    style: 'humor',
    createdAt: '2026-03-19T11:00:00Z'
  },
  {
    id: 'content_005',
    title: '投资人最看重的不是商业模式',
    status: 'published',
    style: 'calm',
    views: 320000,
    likes: 5600,
    createdAt: '2026-03-16T10:00:00Z',
    publishedAt: '2026-03-16T14:00:00Z'
  }
];

// Mock数据：分析数据
export const mockAnalytics: AnalyticsData = {
  publishedCount: 28,
  hitCount: 5,
  leadsCount: 156,
  weeklyGrowth: {
    published: 12,
    hit: 2,
    leads: 34
  },
  bestContent: [
    {
      id: 'content_003',
      title: '为什么90%的创业者都倒在第3年？',
      views: 1200000,
      likes: 25000
    },
    {
      id: 'content_002',
      title: '我从负债200万到年入千万的转折点',
      views: 850000,
      likes: 12000
    }
  ],
  suggestions: [
    '近期"创业避坑"类内容表现优异，建议增加相关选题',
    '愤怒风格的内容爆款率比冷静风格高30%',
    'CTA中添加"评论区扣XXX"的文案互动率提升明显'
  ]
};

// API函数（Mock实现）
export const creatorApi = {
  // 获取推荐选题
  async getRecommendedTopics(): Promise<TopicCard[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockTopics;
  },

  // 生成内容
  async generateContent(topicId: string, style: StyleType): Promise<{ id: string }> {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { id: `gen_${Date.now()}` };
  },

  // 获取生成状态
  async getGenerationStatus(id: string): Promise<GeneratedContent['status']> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return 'completed';
  },

  // 获取生成结果
  async getGeneratedContent(id: string, style: StyleType): Promise<GeneratedContent> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockGeneratedContent[style];
  },

  // 保存编辑后的内容
  async saveContent(id: string, content: Partial<GeneratedContent>): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 600));
    console.log('Content saved:', id, content);
  },

  // 发布内容
  async publishContent(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 700));
    console.log('Content published:', id);
  },

  // 获取内容库
  async getContentLibrary(status?: ContentItem['status']): Promise<ContentItem[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    if (status) {
      return mockContentLibrary.filter(item => item.status === status);
    }
    return mockContentLibrary;
  },

  // 获取分析数据
  async getAnalytics(): Promise<AnalyticsData> {
    await new Promise(resolve => setTimeout(resolve, 600));
    return mockAnalytics;
  }
};
