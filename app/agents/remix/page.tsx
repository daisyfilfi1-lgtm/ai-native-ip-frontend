'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { 
  Shuffle, 
  Link as LinkIcon, 
  Scissors, 
  CheckCircle2,
  Play
} from 'lucide-react';

export default function RemixAgentPage() {
  return (
    <MainLayout title="重组Agent - 配置">
      {/* Agent header */}
      <div className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-pink-500/10 to-rose-600/10 border border-pink-500/20">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-2xl">
            🔀
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-foreground">重组Agent</h2>
            <p className="text-foreground-secondary">竞品解构并IP化重组，保留结构替换内容</p>
          </div>
          <Badge variant="success" dot>运行中</Badge>
        </div>
      </div>

      <Tabs defaultValue="deconstruct" className="w-full">
        <TabsList>
          <TabsTrigger value="deconstruct">竞品解构</TabsTrigger>
          <TabsTrigger value="remix">内容重组</TabsTrigger>
          <TabsTrigger value="rules">重组规则</TabsTrigger>
          <TabsTrigger value="config">高级配置</TabsTrigger>
        </TabsList>

        <TabsContent value="deconstruct">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader 
                title="输入竞品链接" 
                description="粘贴抖音/视频号/小红书链接"
              />
              <div className="space-y-4">
                <Input
                  placeholder="https://v.douyin.com/xxxxx"
                  leftIcon={<LinkIcon className="w-4 h-4" />}
                />
                <Button className="w-full" leftIcon={<Scissors className="w-4 h-4" />}>
                  开始解构
                </Button>
              </div>
            </Card>

            <Card>
              <CardHeader title="解构结果" description="分析视频结构和关键要素" />
              <div className="space-y-3">
                {[
                  { part: '黄金3秒', content: '钩子：90%的人不知道...', type: 'hook' },
                  { part: '情绪铺垫', content: '讲述失败经历，建立共鸣', type: 'setup' },
                  { part: '冲突转折', content: '但是我发现了一个秘密...', type: 'conflict' },
                  { part: '高潮论证', content: '用数据和案例支撑观点', type: 'climax' },
                  { part: '结尾CTA', content: '关注我看更多干货', type: 'cta' },
                ].map((item, index) => (
                  <div key={index} className="p-3 rounded-xl bg-background-tertiary">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="primary" size="sm">{item.part}</Badge>
                    </div>
                    <p className="text-sm text-foreground-secondary">{item.content}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="remix">
          <Card>
            <CardHeader 
              title="重组版本生成" 
              description="基于解构结果生成3个IP化版本"
            />
            <div className="space-y-4">
              {[
                { emotion: '愤怒版', desc: '直击痛点，引发共鸣', color: 'from-red-500 to-orange-500' },
                { emotion: '希望版', desc: '积极向上，传递力量', color: 'from-green-500 to-teal-500' },
                { emotion: '好奇版', desc: '悬念设置，引导思考', color: 'from-blue-500 to-purple-500' },
              ].map((version, index) => (
                <div key={index} className="p-4 rounded-xl bg-background-tertiary border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${version.color} flex items-center justify-center`}>
                        <span className="text-white font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{version.emotion}</h4>
                        <p className="text-xs text-foreground-tertiary">{version.desc}</p>
                      </div>
                    </div>
                    <Button size="sm" leftIcon={<Play className="w-4 h-4" />}>
                      生成
                    </Button>
                  </div>
                  <div className="p-3 rounded-lg bg-background-elevated">
                    <p className="text-sm text-foreground-secondary">
                      [生成的文案内容将显示在这里...]
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="rules">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader title="解构规则" description="提取竞品的哪些要素" />
              <div className="space-y-3">
                {[
                  { name: '钩子模式', desc: '分析开头如何吸引注意力', enabled: true },
                  { name: '情绪曲线', desc: '识别情绪起伏的时间点', enabled: true },
                  { name: '论证结构', desc: '提取逻辑框架和论据类型', enabled: true },
                  { name: '视觉元素', desc: '分析画面切换和特效使用', enabled: false },
                ].map((rule) => (
                  <label key={rule.name} className="flex items-start gap-3 p-3 rounded-xl bg-background-tertiary cursor-pointer">
                    <input type="checkbox" defaultChecked={rule.enabled} className="mt-1" />
                    <div>
                      <p className="font-medium text-foreground">{rule.name}</p>
                      <p className="text-xs text-foreground-tertiary">{rule.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </Card>

            <Card>
              <CardHeader title="原创度保障" description="防止内容过于相似" />
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-foreground">文本重复率阈值</span>
                    <span className="text-sm font-medium text-foreground">25%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    defaultValue="25"
                    className="w-full h-2 bg-background-elevated rounded-lg appearance-none cursor-pointer accent-primary-500"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-foreground">结构相似度阈值</span>
                    <span className="text-sm font-medium text-foreground">40%</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="60"
                    defaultValue="40"
                    className="w-full h-2 bg-background-elevated rounded-lg appearance-none cursor-pointer accent-primary-500"
                  />
                </div>
                <div className="p-3 rounded-lg bg-accent-green/10 border border-accent-green/20">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-accent-green" />
                    <span className="text-sm text-accent-green">当前设置符合平台安全标准</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="config">
          <Card>
            <CardHeader title="高级配置" description="重组策略参数" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="杂交策略"
                options={[
                  { value: 'best_of_breed', label: 'Best of Breed（每个节点取最优）' },
                  { value: 'single', label: '单一竞品深度解构' },
                  { value: 'hybrid', label: '多竞品融合' },
                ]}
              />
              <Select
                label="强制替换规则"
                options={[
                  { value: 'all', label: '竞品案例100%替换' },
                  { value: 'partial', label: '部分替换' },
                  { value: 'none', label: '不强制替换' },
                ]}
              />
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
