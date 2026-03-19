'use client';

import { useState, useEffect } from 'react';
import { CreatorLayout } from '@/components/creator/CreatorLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { creatorApi } from '@/lib/api/creator';
import type { LibraryItem } from '@/types/creator';
import type { LucideIcon } from 'lucide-react';
import { 
  FileText,
  Eye,
  Heart,
  MoreHorizontal,
  Play,
  Trash2,
  RefreshCw,
  Filter
} from 'lucide-react';
import Link from 'next/link';

interface TabConfig {
  value: string;
  label: string;
  count: number;
}

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning';

interface StatusConfig {
  label: string;
  variant: BadgeVariant;
}

const tabs: TabConfig[] = [
  { value: 'all', label: '全部', count: 28 },
  { value: 'pending', label: '待审核', count: 3 },
  { value: 'published', label: '已发布', count: 22 },
  { value: 'viral', label: '爆款', count: 3 },
  { value: 'draft', label: '草稿', count: 3 },
];

const statusConfig: Record<LibraryItem['status'], StatusConfig> = {
  draft: { label: '草稿', variant: 'default' },
  pending: { label: '待审核', variant: 'warning' },
  published: { label: '已发布', variant: 'primary' },
  viral: { label: '爆款', variant: 'success' },
};

const styleEmojis: Record<string, string> = {
  angry: '🔥',
  calm: '😌',
  humor: '😄',
};

export default function CreatorLibraryPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [contents, setContents] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContents();
  }, [activeTab]);

  const loadContents = async () => {
    setLoading(true);
    try {
      const status = activeTab === 'all' ? undefined : activeTab;
      const data: LibraryItem[] = await creatorApi.getLibraryItems(status);
      setContents(data);
    } catch (error) {
      console.error('Failed to load contents:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 10000) return (num / 10000).toFixed(1) + 'w';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  const getViews = (content: LibraryItem): number => content.metrics?.views ?? 0;
  const getLikes = (content: LibraryItem): number => content.metrics?.likes ?? 0;
  const getStyle = (content: LibraryItem): string => content.generationSource || 'angry';

  return (
    <CreatorLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">我的内容库</h1>
          <p className="text-sm text-foreground-secondary">管理和复用你的所有内容</p>
        </div>
        <Button variant="secondary" leftIcon={<Filter className="w-4 h-4" />}>
          筛选
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all',
              activeTab === tab.value
                ? 'bg-primary-500 text-white'
                : 'bg-background-tertiary text-foreground-secondary hover:text-foreground'
            )}
          >
            {tab.label}
            <span className={cn(
              'px-1.5 py-0.5 rounded text-xs',
              activeTab === tab.value ? 'bg-white/20' : 'bg-background-elevated'
            )}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contents.map((content) => (
            <Card 
              key={content.id}
              className="group overflow-hidden hover:border-primary-500/50 transition-colors"
            >
              {/* Thumbnail Placeholder */}
              <div className="aspect-video bg-gradient-to-br from-background-tertiary to-background-elevated flex items-center justify-center relative">
                <FileText className="w-12 h-12 text-foreground-tertiary" />
                
                {/* Style Emoji */}
                <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-background/80 flex items-center justify-center text-lg">
                  {styleEmojis[getStyle(content)]}
                </div>

                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <Badge variant={statusConfig[content.status].variant} size="sm">
                    {statusConfig[content.status].label}
                  </Badge>
                </div>

                {/* Hover Actions */}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 text-foreground" />
                  </button>
                </div>
              </div>

              {/* Content Info */}
              <div className="p-4">
                <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary-400 transition-colors">
                  {content.title}
                </h3>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-foreground-secondary mb-3">
                  {getViews(content) > 0 && (
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{formatNumber(getViews(content))}</span>
                    </div>
                  )}
                  {getLikes(content) > 0 && (
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span>{formatNumber(getLikes(content))}</span>
                    </div>
                  )}
                  <span className="text-xs text-foreground-tertiary">
                    {new Date(content.createdAt).toLocaleDateString('zh-CN')}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {content.status === 'draft' && (
                    <Button size="sm" className="flex-1">
                      继续编辑
                    </Button>
                  )}
                  {content.status === 'pending' && (
                    <Button size="sm" variant="secondary" className="flex-1">
                      查看详情
                    </Button>
                  )}
                  {content.status === 'published' && (
                    <Button size="sm" variant="secondary" className="flex-1">
                      查看数据
                    </Button>
                  )}
                  {content.status === 'viral' && (
                    <Button size="sm" className="flex-1" leftIcon={<RefreshCw className="w-3 h-3" />}>
                      复用爆款
                    </Button>
                  )}
                  <button className="p-2 rounded-lg hover:bg-background-tertiary transition-colors">
                    <MoreHorizontal className="w-4 h-4 text-foreground-secondary" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && contents.length === 0 && (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-full bg-background-tertiary flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-foreground-tertiary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">暂无内容</h3>
          <p className="text-sm text-foreground-secondary mb-4">
            还没有{tabs.find(t => t.value === activeTab)?.label}的内容
          </p>
          <Link href="/creator/dashboard">
            <Button>去创建内容</Button>
          </Link>
        </div>
      )}
    </CreatorLayout>
  );
}

function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
