'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Select } from '@/components/ui/Select';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Download
} from 'lucide-react';

export default function AnalyticsAgentPage() {
  return (
    <MainLayout title="分析Agent - 配置">
      {/* Agent header */}
      <div className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-purple-500/10 to-cyan-600/10 border border-purple-500/20">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-600 flex items-center justify-center text-2xl">
            📊
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-foreground">分析Agent</h2>
            <p className="text-foreground-secondary">自动化数据归因与策略迭代，生成周报</p>
          </div>
          <Badge variant="default" dot>未启动</Badge>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">数据概览</TabsTrigger>
          <TabsTrigger value="attribution">智能归因</TabsTrigger>
          <TabsTrigger value="reports">自动周报</TabsTrigger>
          <TabsTrigger value="config">分析配置</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <p className="text-2xs text-foreground-tertiary uppercase">总播放量</p>
                  <p className="text-xl font-bold text-foreground">128.5K</p>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent-pink/10 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-accent-pink" />
                </div>
                <div>
                  <p className="text-2xs text-foreground-tertiary uppercase">点赞数</p>
                  <p className="text-xl font-bold text-foreground">8.2K</p>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent-cyan/10 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-accent-cyan" />
                </div>
                <div>
                  <p className="text-2xs text-foreground-tertiary uppercase">评论数</p>
                  <p className="text-xl font-bold text-foreground">1.5K</p>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent-green/10 flex items-center justify-center">
                  <Share2 className="w-5 h-5 text-accent-green" />
                </div>
                <div>
                  <p className="text-2xs text-foreground-tertiary uppercase">分享数</p>
                  <p className="text-xl font-bold text-foreground">856</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Performance Chart Placeholder */}
          <Card>
            <CardHeader 
              title="播放趋势" 
              description="近7天播放量变化"
            />
            <div className="h-64 flex items-center justify-center bg-background-tertiary rounded-xl">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-2 text-foreground-tertiary" />
                <p className="text-sm text-foreground-secondary">数据图表将在此显示</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="attribution">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader title="爆款归因" description="分析S级内容的成功因素" />
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-accent-green/10 border border-accent-green/20">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-accent-green" />
                    <span className="font-medium text-accent-green">成功因素分析</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground">选题吸引力</span>
                      <Badge variant="success" size="sm">35%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground">开头3秒</span>
                      <Badge variant="success" size="sm">25%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground">内容质量</span>
                      <Badge variant="success" size="sm">20%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground">投放策略</span>
                      <Badge variant="success" size="sm">10%</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader title="失败归因" description="分析低表现内容的原因" />
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-accent-red/10 border border-accent-red/20">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="w-5 h-5 text-accent-red" />
                    <span className="font-medium text-accent-red">改进建议</span>
                  </div>
                  <ul className="space-y-2 text-sm text-foreground-secondary">
                    <li>• 开头钩子不够吸引，建议参考爆款模板</li>
                    <li>• 视频时长过长，建议控制在45秒内</li>
                    <li>• 情绪曲线太平，建议增加转折</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader 
              title="周报历史" 
              description="自动生成的数据复盘报告"
              action={<Button size="sm" leftIcon={<Download className="w-4 h-4" />}>导出</Button>}
            />
            <div className="space-y-3">
              {[
                { week: '2026年第11周', date: '2026-03-10', status: 'generated', views: '125K' },
                { week: '2026年第10周', date: '2026-03-03', status: 'generated', views: '98K' },
                { week: '2026年第9周', date: '2026-02-24', status: 'generated', views: '86K' },
              ].map((report, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-background-tertiary">
                  <div>
                    <h4 className="font-medium text-foreground">{report.week}</h4>
                    <p className="text-xs text-foreground-tertiary">生成时间: {report.date}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-foreground-secondary">播放量: {report.views}</span>
                    <Badge variant="success" size="sm">已生成</Badge>
                    <Button variant="ghost" size="sm">查看</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="config">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader title="爆款定义" description="什么算爆款" />
              <div className="space-y-4">
                <Select
                  label="播放量阈值"
                  options={[
                    { value: '10w', label: '> 10万' },
                    { value: 'fans3x', label: '> 粉丝数 × 3' },
                    { value: 'custom', label: '自定义' },
                  ]}
                />
                <Select
                  label="互动率阈值"
                  options={[
                    { value: '5', label: '> 5%' },
                    { value: '8', label: '> 8%' },
                    { value: '10', label: '> 10%' },
                  ]}
                />
              </div>
            </Card>

            <Card>
              <CardHeader title="周报配置" description="报告详细程度" />
              <div className="space-y-4">
                <Select
                  label="报告模板"
                  options={[
                    { value: 'minimal', label: '极简版（1页）' },
                    { value: 'standard', label: '标准版（5页）' },
                    { value: 'detailed', label: '详细版（10页）' },
                  ]}
                />
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 rounded-full bg-background-elevated peer-checked:bg-primary-500 transition-colors" />
                    <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-foreground">自动导出到飞书</span>
                  </div>
                </label>
              </div>
            </Card>

            <Card>
              <CardHeader title="预警阈值" description="异常自动提醒" />
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-foreground">CPA 告警</span>
                    <span className="text-sm font-medium text-foreground">> ¥100</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="500"
                    defaultValue="100"
                    className="w-full h-2 bg-background-elevated rounded-lg appearance-none cursor-pointer accent-primary-500"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-foreground">爆款率告警</span>
                    <span className="text-sm font-medium text-foreground">< 10%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    defaultValue="10"
                    className="w-full h-2 bg-background-elevated rounded-lg appearance-none cursor-pointer accent-primary-500"
                  />
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
