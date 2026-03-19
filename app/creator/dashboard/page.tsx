'use client';

import { useState, useEffect } from 'react';
import { CreatorLayout } from '@/components/creator/CreatorLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { creatorApi } from '@/lib/api/creator';
import type { TopicCard } from '@/types/creator';
import { 
  Sparkles, 
  TrendingUp, 
  Target, 
  Zap,
  ArrowRight,
  Mic,
  FileText,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

function TopicScoreBadge({ score }: { score: number }) {
  let variant: 'success' | 'warning' | 'default' = 'default';
  if (score >= 4.8) variant = 'success';
  else if (score >= 4.5) variant = 'warning';
  
  return (
    <Badge variant={variant} size="sm">
      {score.toFixed(1)}分
    </Badge>
  );
}

export default function CreatorDashboardPage() {
  const [topics, setTopics] = useState<TopicCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  useEffect(() => {
    loadTopics();
  }, []);

  const loadTopics = async () => {
    try {
      const data = await creatorApi.getRecommendedTopics();
      setTopics(data);
    } catch (error) {
      console.error('Failed to load topics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (topicId: string) => {
    setGeneratingId(topicId);
    // 模拟跳转到生成页面
    await new Promise(resolve => setTimeout(resolve, 500));
    window.location.href = `/creator/generate?topic=${topicId}`;
  };

  return (
    <CreatorLayout>
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          早上好，张凯 👋
        </h1>
        <p className="text-foreground-secondary">
          今天有 <span className="text-primary-400 font-semibold">3个高匹配选题</span> 推荐给你，预计产出 <span className="text-primary-400 font-semibold">150-250万</span> 播放
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent-green/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-accent-green" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">12</p>
              <p className="text-xs text-foreground-tertiary">本周已发布</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent-yellow/10 flex items-center justify-center">
              <Zap className="w-5 h-5 text-accent-yellow" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">2</p>
              <p className="text-xs text-foreground-tertiary">本周爆款</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent-cyan/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-accent-cyan" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">34</p>
              <p className="text-xs text-foreground-tertiary">获客数量</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">+28%</p>
              <p className="text-xs text-foreground-tertiary">播放增长</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Today's Topics */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">今日推荐选题</h2>
          <Link 
            href="/creator/generate" 
            className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1"
          >
            更多选题 <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary-400" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {topics.map((topic, index) => (
              <Card 
                key={topic.id} 
                className="relative overflow-hidden group hover:border-primary-500/50 transition-colors"
              >
                {/* Rank Badge */}
                <div className={cn(
                  "absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                  index === 0 ? "bg-accent-yellow text-white" :
                  index === 1 ? "bg-gray-400 text-white" :
                  index === 2 ? "bg-amber-600 text-white" :
                  "bg-background-tertiary text-foreground-secondary"
                )}>
                  {index + 1}
                </div>

                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-start gap-3 mb-3 pr-12">
                    <TopicScoreBadge score={topic.score} />
                    <div className="flex flex-wrap gap-1">
                      {topic.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-xs text-foreground-tertiary bg-background-tertiary px-2 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
                    {topic.title}
                  </h3>

                  {/* Reason */}
                  <p className="text-xs text-foreground-tertiary mb-4">
                    {topic.reason}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-1 text-foreground-secondary">
                      <TrendingUp className="w-4 h-4" />
                      <span>{topic.estimatedViews}</span>
                    </div>
                    <div className="flex items-center gap-1 text-foreground-secondary">
                      <Target className="w-4 h-4" />
                      <span>{topic.estimatedCompletion}%完播</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button 
                    className="w-full"
                    leftIcon={generatingId === topic.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    onClick={() => handleGenerate(topic.id)}
                    isLoading={generatingId === topic.id}
                  >
                    一键生成
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-5 hover:border-primary-500/50 transition-colors cursor-pointer group">
          <Link href="/creator/generate" className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent-cyan/10 flex items-center justify-center group-hover:bg-accent-cyan/20 transition-colors">
              <Mic className="w-6 h-6 text-accent-cyan" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">语音输入想法</h3>
              <p className="text-sm text-foreground-secondary">说出你想讲的故事，AI帮你生成文案</p>
            </div>
            <ArrowRight className="w-5 h-5 text-foreground-muted group-hover:text-primary-400 transition-colors" />
          </Link>
        </Card>

        <Card className="p-5 hover:border-primary-500/50 transition-colors cursor-pointer group">
          <Link href="/creator/library" className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent-pink/10 flex items-center justify-center group-hover:bg-accent-pink/20 transition-colors">
              <FileText className="w-6 h-6 text-accent-pink" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">待审核内容</h3>
              <p className="text-sm text-foreground-secondary">你有 3 条内容待确认发布</p>
            </div>
            <Badge variant="warning" size="sm">3</Badge>
          </Link>
        </Card>
      </div>
    </CreatorLayout>
  );
}

// Helper
function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ');
}
