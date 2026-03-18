'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { AgentCard } from '@/components/dashboard/AgentCard';
import { WorkflowTimeline } from '@/components/dashboard/WorkflowTimeline';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { 
  FileText, 
  Clock, 
  TrendingUp, 
  DollarSign, 
  Zap,
  Brain,
  GitBranch,
  Shield,
  Video,
  BarChart3,
  Sparkles,
  Plus,
  ArrowRight,
  Play
} from 'lucide-react';
import Link from 'next/link';
import { Agent, WorkflowStatus } from '@/types';

// Mock data for agents
const agents: Agent[] = [
  {
    id: 'memory',
    name: '记忆Agent',
    nameEn: 'Memory Agent',
    description: '构建IP实时数字孪生，管理素材库和语义检索',
    icon: '🧠',
    color: 'from-violet-500 to-purple-600',
    status: 'active',
  },
  {
    id: 'strategy',
    name: '策略Agent',
    nameEn: 'Strategy Agent',
    description: '决策内容选题和投放策略，全网监控竞品热点',
    icon: '🎯',
    color: 'from-cyan-500 to-blue-600',
    status: 'active',
  },
  {
    id: 'remix',
    name: '重组Agent',
    nameEn: 'Remix Agent',
    description: '竞品解构并IP化重组，保留结构替换内容',
    icon: '🔀',
    color: 'from-pink-500 to-rose-600',
    status: 'active',
  },
  {
    id: 'generation',
    name: '生成Agent',
    nameEn: 'Generation Agent',
    description: '转化为符合IP风格的终稿文案，风格克隆',
    icon: '✍️',
    color: 'from-amber-500 to-orange-600',
    status: 'configuring',
  },
  {
    id: 'compliance',
    name: '合规Agent',
    nameEn: 'Compliance Agent',
    description: '工业刹车系统，三级审查内容合规性',
    icon: '🛡️',
    color: 'from-emerald-500 to-teal-600',
    status: 'active',
  },
  {
    id: 'visual',
    name: '视觉Agent',
    nameEn: 'Visual Agent',
    description: '文案转视觉方案，数字人视频自动拍摄',
    icon: '🎬',
    color: 'from-blue-500 to-indigo-600',
    status: 'active',
  },
  {
    id: 'analytics',
    name: '分析Agent',
    nameEn: 'Analytics Agent',
    description: '自动化数据归因与策略迭代，生成周报',
    icon: '📊',
    color: 'from-purple-500 to-cyan-600',
    status: 'inactive',
  },
];

// Mock data for workflows
const workflows: WorkflowStatus[] = [
  {
    id: 'wf-001',
    name: '日更内容生产 - 张凯IP',
    status: 'running',
    progress: 65,
    startTime: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    agent: '生成Agent',
  },
  {
    id: 'wf-002',
    name: '竞品热点分析',
    status: 'completed',
    progress: 100,
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    endTime: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    agent: '策略Agent',
  },
  {
    id: 'wf-003',
    name: '素材库更新任务',
    status: 'completed',
    progress: 100,
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    endTime: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    agent: '记忆Agent',
  },
];

export default function DashboardPage() {
  const activeAgents = agents.filter(a => a.status === 'active').length;
  const runningWorkflows = workflows.filter(w => w.status === 'running').length;

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
              今日已生成 <span className="text-primary-400 font-semibold">86</span> 条内容，
              待审核 <span className="text-accent-yellow font-semibold">12</span> 条
            </p>
          </div>
          <Link href="/workflow/new">
            <Button leftIcon={<Plus className="w-4 h-4" />}>
              新建工作流
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="今日产出"
          value="86"
          description="条内容"
          trend={{ value: 23, isPositive: true }}
          icon={FileText}
          iconColor="text-primary-400"
        />
        <StatCard
          title="人工审核"
          value="45分钟"
          description="较昨日节省2小时"
          trend={{ value: 15, isPositive: true }}
          icon={Clock}
          iconColor="text-accent-cyan"
        />
        <StatCard
          title="过审率"
          value="96.5%"
          trend={{ value: 2.3, isPositive: true }}
          icon={TrendingUp}
          iconColor="text-accent-green"
        />
        <StatCard
          title="单条成本"
          value="¥48"
          description="较传统降低96%"
          trend={{ value: 12, isPositive: true }}
          icon={DollarSign}
          iconColor="text-accent-yellow"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agent status */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">7-Agent 状态</h3>
            <div className="flex items-center gap-2">
              <Badge variant="success" dot>{activeAgents} 运行中</Badge>
              <Badge variant="warning" dot>1 配置中</Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>

          {/* Quick actions */}
          <Card>
            <CardHeader 
              title="快捷操作" 
              description="常用功能一键直达"
            />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { name: '素材录入', icon: Brain, href: '/agents/memory/ingest', color: 'from-violet-500 to-purple-600' },
                { name: '选题推荐', icon: GitBranch, href: '/agents/strategy/topics', color: 'from-cyan-500 to-blue-600' },
                { name: '文案生成', icon: Sparkles, href: '/agents/generation/draft', color: 'from-amber-500 to-orange-600' },
                { name: '视频制作', icon: Video, href: '/agents/visual/video', color: 'from-blue-500 to-indigo-600' },
              ].map((action) => (
                <Link key={action.name} href={action.href}>
                  <div className="group p-4 rounded-xl bg-background-tertiary hover:bg-background-elevated border border-transparent hover:border-border transition-all duration-200 cursor-pointer">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <action.icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-sm font-medium text-foreground">{action.name}</p>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Workflow timeline */}
          <WorkflowTimeline workflows={workflows} />

          {/* Daily goal */}
          <Card>
            <CardHeader 
              title="今日目标" 
              description="日产300条内容进度"
            />
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-foreground-secondary">已生成</span>
                  <span className="text-sm font-medium text-foreground">86 / 300</span>
                </div>
                <Progress value={86} max={300} variant="gradient" showValue />
              </div>
              
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-background-tertiary">
                  <p className="text-2xs text-foreground-tertiary uppercase tracking-wider">A级内容</p>
                  <p className="text-lg font-semibold text-foreground mt-1">6条</p>
                </div>
                <div className="p-3 rounded-xl bg-background-tertiary">
                  <p className="text-2xs text-foreground-tertiary uppercase tracking-wider">B级内容</p>
                  <p className="text-lg font-semibold text-foreground mt-1">80条</p>
                </div>
              </div>

              <Button variant="secondary" className="w-full" leftIcon={<Play className="w-4 h-4" />}>
                启动批量生成
              </Button>
            </div>
          </Card>

          {/* System health */}
          <Card>
            <CardHeader 
              title="系统健康" 
              description="各组件运行状态"
            />
            <div className="space-y-3">
              {[
                { name: 'API服务', status: '正常', latency: '45ms' },
                { name: '向量数据库', status: '正常', latency: '23ms' },
                { name: 'AI模型服务', status: '正常', latency: '1.2s' },
                { name: '数字人服务', status: '正常', latency: '2.1s' },
              ].map((service) => (
                <div key={service.name} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-accent-green" />
                    <span className="text-sm text-foreground">{service.name}</span>
                  </div>
                  <span className="text-xs text-foreground-tertiary font-mono">{service.latency}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
