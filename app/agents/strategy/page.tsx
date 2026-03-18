'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Switch } from '@/components/ui/Switch';
import { 
  GitBranch, 
  Search, 
  Target, 
  Settings,
  Plus,
  Trash2,
  TrendingUp
} from 'lucide-react';

export default function StrategyAgentPage() {
  return (
    <MainLayout title="策略Agent - 配置">
      {/* Agent header */}
      <div className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border border-cyan-500/20">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-2xl">
            🎯
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-foreground">策略Agent</h2>
            <p className="text-foreground-secondary">决策内容选题和投放策略，全网监控竞品热点</p>
          </div>
          <Badge variant="success" dot>运行中</Badge>
        </div>
      </div>

      <Tabs defaultValue="topics" className="w-full">
        <TabsList>
          <TabsTrigger value="topics">选题推荐</TabsTrigger>
          <TabsTrigger value="competitors">竞品监控</TabsTrigger>
          <TabsTrigger value="scoring">评分规则</TabsTrigger>
          <TabsTrigger value="config">高级配置</TabsTrigger>
        </TabsList>

        <TabsContent value="topics">
          <Card>
            <CardHeader 
              title="今日选题推荐" 
              description="基于热点数据和IP契合度智能推荐"
              action={<Button size="sm" leftIcon={<Search className="w-4 h-4" />}>刷新</Button>}
            />
            <div className="space-y-3">
              {[
                { title: '创业者如何度过低谷期', score: 95, trend: 'up', reason: '低粉爆款，情绪共鸣强' },
                { title: '2026年AI创业新机会', score: 88, trend: 'up', reason: '热点话题，搜索量激增' },
                { title: '从0到1打造个人IP', score: 82, trend: 'stable', reason: '经典话题， evergreen' },
              ].map((topic, index) => (
                <div key={index} className="p-4 rounded-xl bg-background-tertiary border border-border">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-foreground">{topic.title}</h4>
                        <Badge variant={topic.score >= 90 ? 'success' : 'primary'} size="sm">
                          {topic.score}分
                        </Badge>
                      </div>
                      <p className="text-sm text-foreground-secondary">{topic.reason}</p>
                    </div>
                    <Button variant="secondary" size="sm">生成内容</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="competitors">
          <Card>
            <CardHeader 
              title="竞品监控清单" 
              description="监控以下账号的爆款内容"
              action={<Button size="sm" leftIcon={<Plus className="w-4 h-4" />}>添加</Button>}
            />
            <div className="space-y-3">
              {[
                { name: '张琦商业思维', platform: '抖音', followers: '850万' },
                { name: '参哥认知圈', platform: '抖音', followers: '620万' },
                { name: '大齐商业人性', platform: '视频号', followers: '180万' },
              ].map((competitor, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-background-tertiary">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold">
                      {competitor.name[0]}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{competitor.name}</p>
                      <p className="text-xs text-foreground-tertiary">{competitor.platform} · {competitor.followers}粉丝</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" leftIcon={<Trash2 className="w-4 h-4" />}>
                    移除
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="scoring">
          <Card>
            <CardHeader title="四维评分权重" description="调节四个维度的权重占比" />
            <div className="space-y-6">
              {[
                { name: '流量潜力', key: 'traffic', value: 30, description: '话题热度和搜索量' },
                { name: '变现关联', key: 'monetization', value: 30, description: '与产品/服务的关联度' },
                { name: 'IP契合度', key: 'fit', value: 25, description: '与IP人设的匹配程度' },
                { name: '制作成本', key: 'cost', value: 15, description: '内容制作的时间和资源成本' },
              ].map((item) => (
                <div key={item.key}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-medium text-foreground">{item.name}</span>
                      <p className="text-xs text-foreground-tertiary">{item.description}</p>
                    </div>
                    <span className="text-sm font-medium text-foreground">{item.value}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    defaultValue={item.value}
                    className="w-full h-2 bg-background-elevated rounded-lg appearance-none cursor-pointer accent-primary-500"
                  />
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="config">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader title="抓取配置" description="竞品数据抓取设置" />
              <div className="space-y-4">
                <Select
                  label="监控频率"
                  options={[
                    { value: '15min', label: '每15分钟' },
                    { value: '1hour', label: '每小时' },
                    { value: '6hours', label: '每6小时' },
                    { value: 'daily', label: '每天' },
                  ]}
                />
                <Input
                  label="爆款阈值（点赞数）"
                  type="number"
                  defaultValue="10000"
                  helper="低粉账号的爆款判定标准"
                />
                <Switch 
                  label="自动抓取" 
                  description="开启后自动监控竞品更新"
                  defaultChecked
                />
              </div>
            </Card>

            <Card>
              <CardHeader title="选题黑名单" description="设置绝不触碰的话题" />
              <div className="space-y-3">
                {['政治', '宗教', '医疗', '竞品名称'].map((item) => (
                  <div key={item} className="flex items-center justify-between p-3 rounded-xl bg-background-tertiary">
                    <span className="text-foreground">{item}</span>
                    <Button variant="ghost" size="sm" leftIcon={<Trash2 className="w-4 h-4" />}>
                      移除
                    </Button>
                  </div>
                ))}
                <Button variant="secondary" size="sm" className="w-full" leftIcon={<Plus className="w-4 h-4" />}>
                  添加关键词
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
