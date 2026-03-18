'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { 
  FileText, 
  Sparkles, 
  Settings,
  Plus,
  Trash2,
  Wand2
} from 'lucide-react';

export default function GenerationAgentPage() {
  return (
    <MainLayout title="生成Agent - 配置">
      {/* Agent header */}
      <div className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-600/10 border border-amber-500/20">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-2xl">
            ✍️
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-foreground">生成Agent</h2>
            <p className="text-foreground-secondary">转化为符合IP风格的终稿文案，风格克隆</p>
          </div>
          <Badge variant="warning" dot>配置中</Badge>
        </div>
      </div>

      <Tabs defaultValue="style" className="w-full">
        <TabsList>
          <TabsTrigger value="style">风格训练</TabsTrigger>
          <TabsTrigger value="language">语言指纹</TabsTrigger>
          <TabsTrigger value="generate">文案生成</TabsTrigger>
          <TabsTrigger value="config">高级配置</TabsTrigger>
        </TabsList>

        <TabsContent value="style">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader 
                title="风格训练集" 
                description="上传50条S级文案训练专属模型"
              />
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-background-tertiary border border-dashed border-border">
                  <div className="text-center">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-foreground-tertiary" />
                    <p className="text-sm text-foreground-secondary">拖拽文件到此处或点击上传</p>
                    <p className="text-xs text-foreground-muted mt-1">支持 .txt, .docx, .pdf</p>
                    <Button variant="secondary" size="sm" className="mt-3">
                      选择文件
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground-secondary">已上传文案</span>
                  <Badge variant="primary" size="sm">32 / 50</Badge>
                </div>
                <div className="w-full h-2 bg-background-elevated rounded-full overflow-hidden">
                  <div className="h-full bg-primary-500 rounded-full" style={{ width: '64%' }} />
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader title="风格强度" description="调节AI模仿IP风格的程度" />
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-foreground">风格强度</span>
                    <span className="text-sm font-medium text-foreground">80%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    defaultValue="80"
                    className="w-full h-2 bg-background-elevated rounded-lg appearance-none cursor-pointer accent-primary-500"
                  />
                  <p className="text-xs text-foreground-tertiary mt-2">
                    推荐80%：既像IP又有新意
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-background-tertiary">
                  <p className="text-sm font-medium text-foreground mb-2">训练状态</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
                    <span className="text-sm text-foreground-secondary">训练中... 预计还需 15 分钟</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="language">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader 
                title="口头禅管理" 
                description="IP标志性短语"
                action={<Button size="sm" leftIcon={<Plus className="w-4 h-4" />}>添加</Button>}
              />
              <div className="space-y-3">
                {[
                  { phrase: '你知道吗', frequency: '高频' },
                  { phrase: '我跟你讲', frequency: '中频' },
                  { phrase: '说实话', frequency: '低频' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-background-tertiary">
                    <div className="flex items-center gap-3">
                      <span className="text-foreground">&ldquo;{item.phrase}&rdquo;</span>
                      <Badge variant="default" size="sm">{item.frequency}</Badge>
                    </div>
                    <Button variant="ghost" size="sm" leftIcon={<Trash2 className="w-4 h-4" />} />
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <CardHeader 
                title="禁忌词汇" 
                description="绝对不用"
                action={<Button size="sm" leftIcon={<Plus className="w-4 h-4" />}>添加</Button>}
              />
              <div className="space-y-3">
                {['亲们', '宝宝们', '显然', '必须'].map((word) => (
                  <div key={word} className="flex items-center justify-between p-3 rounded-xl bg-background-tertiary">
                    <span className="text-foreground">{word}</span>
                    <span className="text-xs text-foreground-tertiary">太微商/太说教</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <CardHeader title="句长偏好" description="长短句比例" />
              <div className="space-y-3">
                {[
                  { type: '短句（<15字）', value: 60 },
                  { type: '中句（15-30字）', value: 30 },
                  { type: '长句（>30字）', value: 10 },
                ].map((item) => (
                  <div key={item.type}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-foreground">{item.type}</span>
                      <span className="text-sm font-medium text-foreground">{item.value}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-background-elevated rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary-500 rounded-full" 
                        style={{ width: `${item.value}%` }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <CardHeader title="修辞偏好" description="喜欢的表达手法" />
              <div className="flex flex-wrap gap-2">
                {['极端数字（90%/100万）', '身体隐喻', '反问句', '排比', '对比'].map((item) => (
                  <span key={item} className="px-3 py-1.5 rounded-lg bg-background-tertiary text-sm text-foreground">
                    {item}
                  </span>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="generate">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader title="输入主题" description="输入想要生成的内容主题" />
              <div className="space-y-4">
                <Textarea
                  placeholder="例如：创业者如何度过低谷期..."
                  className="min-h-[150px]"
                />
                <Button className="w-full" leftIcon={<Wand2 className="w-4 h-4" />}>
                  生成文案
                </Button>
              </div>
            </Card>

            <Card>
              <CardHeader title="生成结果" description="AI生成的文案草稿" />
              <div className="p-4 rounded-xl bg-background-tertiary min-h-[200px]">
                <p className="text-sm text-foreground-secondary">
                  [生成的文案将显示在这里...]
                </p>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="secondary" size="sm" className="flex-1">
                  复制
                </Button>
                <Button variant="secondary" size="sm" className="flex-1">
                  重新生成
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="config">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader title="情绪曲线" description="文案节奏控制" />
              <Select
                label="选择模板"
                options={[
                  { value: 'anger-hope', label: '愤怒-希望型（解决方案类）' },
                  { value: 'curiosity-shock', label: '好奇-震惊型（揭秘类）' },
                  { value: 'problem-solution', label: '问题-解决型（干货类）' },
                ]}
              />
            </Card>

            <Card>
              <CardHeader title="去AI化" description="增加真实感" />
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-foreground">口语瑕疵频率</span>
                    <span className="text-sm font-medium text-foreground">2处/100字</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    defaultValue="2"
                    className="w-full h-2 bg-background-elevated rounded-lg appearance-none cursor-pointer accent-primary-500"
                  />
                </div>
                <p className="text-xs text-foreground-tertiary">
                  自动插入&ldquo;呃&rdquo;&ldquo;那个&rdquo;等口语词，打破对仗工整
                </p>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
