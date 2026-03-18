'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Progress } from '@/components/ui/Progress';
import { 
  Save, 
  RotateCcw, 
  Brain, 
  GitBranch, 
  FileText, 
  Shield, 
  Video, 
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

// Agent config status
const agentConfigs = [
  { id: 'memory', name: '记忆Agent', icon: Brain, status: 'configured', progress: 100, color: 'from-violet-500 to-purple-600' },
  { id: 'strategy', name: '策略Agent', icon: GitBranch, status: 'configured', progress: 85, color: 'from-cyan-500 to-blue-600' },
  { id: 'generation', name: '生成Agent', icon: FileText, status: 'configuring', progress: 60, color: 'from-amber-500 to-orange-600' },
  { id: 'compliance', name: '合规Agent', icon: Shield, status: 'configured', progress: 100, color: 'from-emerald-500 to-teal-600' },
  { id: 'visual', name: '视觉Agent', icon: Video, status: 'pending', progress: 30, color: 'from-blue-500 to-indigo-600' },
  { id: 'analytics', name: '分析Agent', icon: BarChart3, status: 'pending', progress: 0, color: 'from-purple-500 to-cyan-600' },
];

const configHistory = [
  { id: 1, agent: '记忆Agent', action: '更新标签体系', user: '管理员', time: '2小时前', version: 5 },
  { id: 2, agent: '策略Agent', action: '修改评分权重', user: '管理员', time: '昨天', version: 3 },
  { id: 3, agent: '生成Agent', action: '添加口头禅', user: '管理员', time: '3天前', version: 8 },
];

export default function ConfigPage() {
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setHasChanges(false);
  };

  const configuredCount = agentConfigs.filter(a => a.progress === 100).length;

  return (
    <MainLayout title="配置中心">
      {/* Config overview */}
      <div className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-primary-500/10 to-accent-cyan/10 border border-primary-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-cyan flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">配置中心</h2>
              <p className="text-foreground-secondary">
                已完成 {configuredCount}/7 个Agent配置
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" leftIcon={<RotateCcw className="w-4 h-4" />}>
              重置
            </Button>
            <Button 
              isLoading={isSaving}
              onClick={handleSave}
              leftIcon={<Save className="w-4 h-4" />}
            >
              保存更改
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agent config list */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader 
              title="Agent配置状态" 
              description="各Agent的配置完整度和状态"
            />
            <div className="space-y-4">
              {agentConfigs.map((agent) => {
                const Icon = agent.icon;
                return (
                  <div key={agent.id} className="p-4 rounded-xl bg-background-tertiary">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${agent.color} flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-foreground">{agent.name}</h4>
                          <div className="flex items-center gap-2">
                            {agent.status === 'configured' && (
                              <Badge variant="success" size="sm">已配置</Badge>
                            )}
                            {agent.status === 'configuring' && (
                              <Badge variant="warning" size="sm">配置中</Badge>
                            )}
                            {agent.status === 'pending' && (
                              <Badge variant="default" size="sm">待配置</Badge>
                            )}
                            <Link href={`/agents/${agent.id}`}>
                              <Button variant="ghost" size="sm" className="gap-1">
                                配置
                                <ChevronRight className="w-4 h-4" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <Progress 
                              value={agent.progress} 
                              size="sm" 
                              variant={agent.progress === 100 ? 'success' : 'default'} 
                            />
                          </div>
                          <span className="text-xs text-foreground-tertiary w-10 text-right">
                            {agent.progress}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Global settings */}
          <Card>
            <CardHeader title="全局设置" description="影响所有Agent的全局配置" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="默认内容等级"
                options={[
                  { value: 'A', label: 'A级 - 人设型（真人实拍）' },
                  { value: 'B', label: 'B级 - 流量型（数字人）' },
                  { value: 'C', label: 'C级 - 测试型' },
                ]}
              />
              <Select
                label="目标平台"
                options={[
                  { value: 'douyin', label: '抖音' },
                  { value: 'kuaishou', label: '快手' },
                  { value: 'xiaohongshu', label: '小红书' },
                  { value: 'shipinhao', label: '视频号' },
                  { value: 'all', label: '全平台' },
                ]}
              />
              <Input
                label="日产量目标"
                type="number"
                defaultValue="300"
                helper="每日计划生成的内容数量"
              />
              <Input
                label="人工审核时限"
                type="number"
                defaultValue="60"
                helper="建议的每日审核时间（分钟）"
              />
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Config history */}
          <Card>
            <CardHeader title="配置历史" description="最近的配置变更记录" />
            <div className="space-y-3">
              {configHistory.map((item) => (
                <div key={item.id} className="flex items-start gap-3 p-3 rounded-xl bg-background-tertiary">
                  <Clock className="w-4 h-4 text-foreground-tertiary mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{item.action}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-foreground-secondary">{item.agent}</span>
                      <span className="text-xs text-foreground-muted">·</span>
                      <span className="text-xs text-foreground-muted">v{item.version}</span>
                    </div>
                    <p className="text-xs text-foreground-muted mt-1">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick tips */}
          <Card variant="gradient">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-primary-400 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-foreground mb-1">配置建议</h4>
                <ul className="text-sm text-foreground-secondary space-y-2">
                  <li>1. 先完成记忆Agent的素材录入</li>
                  <li>2. 配置生成Agent的风格参数</li>
                  <li>3. 设置合规Agent的敏感词库</li>
                  <li>4. 最后启用分析Agent的数据追踪</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* System version */}
          <Card>
            <div className="text-center">
              <p className="text-sm text-foreground-secondary">系统版本</p>
              <p className="text-lg font-semibold text-foreground mt-1">v1.0.0</p>
              <p className="text-xs text-foreground-muted mt-2">最后更新: 2026-03-18</p>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
