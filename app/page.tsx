'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  FileText, 
  Clock, 
  TrendingUp, 
  DollarSign,
  Sparkles,
  Plus
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <MainLayout title="仪表盘">
      {/* Welcome banner */}
      <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-primary-500/10 via-accent-cyan/10 to-accent-pink/10 border border-primary-500/20">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              欢迎回来，<span className="text-gradient">IP操盘手</span>
            </h2>
            <p className="text-foreground-secondary">
              AI-Native IP 工厂已就绪，开始您的内容生产之旅
            </p>
          </div>
          <Link href="/ip">
            <Button leftIcon={<Plus className="w-4 h-4" />}>
              新建IP
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-foreground-secondary">今日产出</p>
              <p className="mt-2 text-3xl font-bold text-foreground">0</p>
              <p className="text-xs text-foreground-tertiary mt-1">条内容</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-400">
              <FileText className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-foreground-secondary">人工审核</p>
              <p className="mt-2 text-3xl font-bold text-foreground">0分钟</p>
              <p className="text-xs text-foreground-tertiary mt-1">今日累计</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-accent-cyan/10 flex items-center justify-center text-accent-cyan">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-foreground-secondary">过审率</p>
              <p className="mt-2 text-3xl font-bold text-foreground">--</p>
              <p className="text-xs text-foreground-tertiary mt-1">暂无数据</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-accent-green/10 flex items-center justify-center text-accent-green">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-foreground-secondary">单条成本</p>
              <p className="mt-2 text-3xl font-bold text-foreground">¥--</p>
              <p className="text-xs text-foreground-tertiary mt-1">待计算</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-accent-yellow/10 flex items-center justify-center text-accent-yellow">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader 
            title="快速开始" 
            description="常用功能入口"
          />
          <div className="grid grid-cols-2 gap-3">
            <Link href="/ip">
              <div className="p-4 rounded-xl bg-background-tertiary hover:bg-background-elevated transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-accent-cyan flex items-center justify-center mb-3">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm font-medium text-foreground">管理IP</p>
                <p className="text-xs text-foreground-tertiary mt-1">查看和管理您的IP</p>
              </div>
            </Link>
            <Link href="/agents">
              <div className="p-4 rounded-xl bg-background-tertiary hover:bg-background-elevated transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-3">
                  <span className="text-xl">🤖</span>
                </div>
                <p className="text-sm font-medium text-foreground">Agent配置</p>
                <p className="text-xs text-foreground-tertiary mt-1">配置7-Agent工作流</p>
              </div>
            </Link>
          </div>
        </Card>

        <Card>
          <CardHeader 
            title="系统状态" 
            description="各组件运行情况"
          />
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-accent-green" />
                <span className="text-sm text-foreground">API服务</span>
              </div>
              <Badge variant="success" size="sm">正常</Badge>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-accent-green" />
                <span className="text-sm text-foreground">前端构建</span>
              </div>
              <Badge variant="success" size="sm">正常</Badge>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-foreground-muted" />
                <span className="text-sm text-foreground">Agent工作流</span>
              </div>
              <Badge variant="default" size="sm">未启动</Badge>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
