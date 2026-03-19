'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Select } from '@/components/ui/Select';
import { Switch } from '@/components/ui/Switch';
import { 
  Upload, 
  Search, 
  Database, 
  Tags, 
  Settings,
  FileText,
  Video,
  Mic,
  Link as LinkIcon,
  Plus,
  Loader2,
  CheckCircle2,
  Brain,
  Cloud,
  RefreshCw,
  BookOpen,
  AlertCircle
} from 'lucide-react';
import { IngestRequest, RetrieveRequest } from '@/types';

// Mock data
const mockAssets = [
  { id: 'asset_001', title: '2020年破产经历', type: 'story', tags: ['绝望', '重生', '深夜'], usage: 2, limit: 3 },
  { id: 'asset_002', title: '首次融资成功', type: 'milestone', tags: ['希望', '办公室', '激动'], usage: 5, limit: 10 },
  { id: 'asset_003', title: '产品失败复盘', type: 'lesson', tags: ['反思', '会议室', '成长'], usage: 1, limit: 10 },
];

export default function MemoryAgentPage() {
  const [activeTab, setActiveTab] = useState('ingest');
  const [isIngesting, setIsIngesting] = useState(false);
  const [ingestProgress, setIngestProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleIngest = async () => {
    setIsIngesting(true);
    setIngestProgress(0);
    
    // Simulate progress
    const interval = setInterval(() => {
      setIngestProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsIngesting(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const handleSearch = () => {
    // Mock search results
    setSearchResults(mockAssets);
  };

  return (
    <MainLayout title="记忆Agent - 配置">
      {/* Agent header */}
      <div className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-violet-500/10 to-purple-600/10 border border-violet-500/20">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-2xl">
            🧠
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-foreground">记忆Agent</h2>
            <p className="text-foreground-secondary">构建IP实时数字孪生，管理素材库和语义检索</p>
          </div>
          <Badge variant="success" dot>运行中</Badge>
        </div>
      </div>

      <Tabs defaultValue="ingest" className="w-full">
        <TabsList>
          <TabsTrigger value="ingest">素材录入</TabsTrigger>
          <TabsTrigger value="feishu">飞书同步</TabsTrigger>
          <TabsTrigger value="retrieve">语义检索</TabsTrigger>
          <TabsTrigger value="tags">标签管理</TabsTrigger>
          <TabsTrigger value="config">高级配置</TabsTrigger>
        </TabsList>

        {/* Ingest Tab */}
        <TabsContent value="ingest">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader 
                title="录入新素材" 
                description="将IP过往内容转化为可检索的数字资产"
              />
              <div className="space-y-4">
                <Select
                  label="素材类型"
                  options={[
                    { value: 'video', label: '视频' },
                    { value: 'audio', label: '音频' },
                    { value: 'text', label: '文本' },
                    { value: 'document', label: '文档' },
                  ]}
                />

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    上传方式
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="p-4 rounded-xl bg-background-tertiary border border-border hover:border-primary-500/50 transition-colors text-center">
                      <Upload className="w-6 h-6 mx-auto mb-2 text-foreground-secondary" />
                      <span className="text-sm text-foreground">本地上传</span>
                    </button>
                    <button className="p-4 rounded-xl bg-background-tertiary border border-border hover:border-primary-500/50 transition-colors text-center">
                      <LinkIcon className="w-6 h-6 mx-auto mb-2 text-foreground-secondary" />
                      <span className="text-sm text-foreground">URL链接</span>
                    </button>
                  </div>
                </div>

                <Input
                  label="素材标题"
                  placeholder="例如：2020年破产经历"
                  helper="简短描述素材内容，便于后续检索"
                />

                <Textarea
                  label="备注说明"
                  placeholder="补充素材的背景信息..."
                  helper="可选，添加更多上下文信息"
                />

                <Button 
                  className="w-full" 
                  onClick={handleIngest}
                  isLoading={isIngesting}
                  leftIcon={isIngesting ? undefined : <Upload className="w-4 h-4" />}
                >
                  {isIngesting ? `处理中 ${ingestProgress}%` : '开始录入'}
                </Button>

                {ingestProgress === 100 && (
                  <div className="p-3 rounded-xl bg-accent-green/10 border border-accent-green/20 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-accent-green" />
                    <span className="text-sm text-accent-green">录入完成！已生成3个资产片段</span>
                  </div>
                )}
              </div>
            </Card>

            <Card>
              <CardHeader 
                title="最近录入" 
                description="最近7天录入的素材"
              />
              <div className="space-y-3">
                {[
                  { title: '创业早期艰难经历', type: 'video', time: '2小时前', status: 'completed' },
                  { title: '融资路演心得', type: 'audio', time: '昨天', status: 'completed' },
                  { title: '团队管理经验', type: 'text', time: '3天前', status: 'completed' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-background-tertiary">
                    <div className="w-10 h-10 rounded-lg bg-background-elevated flex items-center justify-center">
                      {item.type === 'video' && <Video className="w-5 h-5 text-foreground-secondary" />}
                      {item.type === 'audio' && <Mic className="w-5 h-5 text-foreground-secondary" />}
                      {item.type === 'text' && <FileText className="w-5 h-5 text-foreground-secondary" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                      <p className="text-xs text-foreground-tertiary">{item.time}</p>
                    </div>
                    <Badge variant="success" size="sm">已完成</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Retrieve Tab */}
        <TabsContent value="retrieve">
          <Card>
            <CardHeader 
              title="语义检索" 
              description="使用自然语言搜索IP素材库"
            />
            <div className="space-y-6">
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    placeholder="例如：找一个深夜崩溃但最终翻盘的故事"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    leftIcon={<Brain className="w-4 h-4" />}
                  />
                </div>
                <Button onClick={handleSearch} leftIcon={<Search className="w-4 h-4" />}>
                  搜索
                </Button>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3">
                <Select
                  label="情绪标签"
                  options={[
                    { value: '', label: '全部情绪' },
                    { value: 'anger', label: '愤怒' },
                    { value: 'hope', label: '希望' },
                    { value: 'despair', label: '绝望' },
                    { value: 'joy', label: '喜悦' },
                  ]}
                  className="w-40"
                />
                <Select
                  label="场景标签"
                  options={[
                    { value: '', label: '全部场景' },
                    { value: 'office', label: '办公室' },
                    { value: 'night', label: '深夜' },
                    { value: 'stage', label: '舞台' },
                    { value: 'home', label: '家中' },
                  ]}
                  className="w-40"
                />
                <div className="pt-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 rounded-full bg-background-elevated peer-checked:bg-primary-500 transition-colors" />
                      <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
                    </div>
                    <span className="text-sm text-foreground-secondary">优先新素材</span>
                  </label>
                </div>
              </div>

              {/* Results */}
              {searchResults.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm text-foreground-secondary">
                    找到 {searchResults.length} 个相关素材
                  </p>
                  {searchResults.map((asset) => (
                    <div key={asset.id} className="p-4 rounded-xl bg-background-tertiary border border-border">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-foreground">{asset.title}</h4>
                        <Badge variant="primary" size="sm">{asset.type}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {asset.tags.map((tag: string) => (
                          <span key={tag} className="px-2 py-0.5 rounded-full bg-background-elevated text-2xs text-foreground-secondary">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-foreground-tertiary">
                          已使用 {asset.usage}/{asset.limit} 次
                        </span>
                        <div className="w-24 h-1.5 bg-background-elevated rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary-500 rounded-full"
                            style={{ width: `${(asset.usage / asset.limit) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {searchResults.length === 0 && searchQuery && (
                <div className="text-center py-12">
                  <Brain className="w-12 h-12 mx-auto mb-3 text-foreground-tertiary" />
                  <p className="text-sm text-foreground-secondary">输入关键词开始语义检索</p>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        {/* Tags Tab */}
        <TabsContent value="tags">
          <Card>
            <CardHeader 
              title="标签体系" 
              description="管理自动打标规则"
              action={<Button size="sm" leftIcon={<Plus className="w-4 h-4" />}>添加标签</Button>}
            />
            <div className="space-y-6">
              {[
                { name: '情绪标签', description: '内容情绪倾向', count: 8, examples: ['愤怒', '希望', '焦虑', '爽感'] },
                { name: '场景标签', description: '故事发生场景', count: 6, examples: ['办公室', '深夜', '舞台', '车内'] },
                { name: '认知标签', description: '认知维度分类', count: 5, examples: ['反常识', '揭秘', '方法论'] },
              ].map((category) => (
                <div key={category.name} className="p-4 rounded-xl bg-background-tertiary">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-foreground">{category.name}</h4>
                      <p className="text-xs text-foreground-tertiary">{category.description}</p>
                    </div>
                    <Badge variant="default" size="sm">{category.count} 个标签</Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {category.examples.map((tag) => (
                      <span key={tag} className="px-3 py-1 rounded-lg bg-background-elevated text-sm text-foreground-secondary">
                        {tag}
                      </span>
                    ))}
                    <button className="px-3 py-1 rounded-lg border border-dashed border-border text-sm text-foreground-tertiary hover:border-primary-500/50 hover:text-foreground transition-colors">
                      + 添加
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Feishu Sync Tab */}
        <TabsContent value="feishu">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader 
                title="飞书知识库同步" 
                description="将飞书知识库文档同步到 Memory"
              />
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-background-tertiary border border-border">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-accent-blue/10 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-accent-blue" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">知识空间</p>
                      <p className="text-xs text-foreground-tertiary">选择要同步的飞书知识库</p>
                    </div>
                  </div>
                  <Select
                    label="选择知识空间"
                    options={[
                      { value: '', label: '加载中...' },
                      { value: 'space_001', label: 'IP内容知识库' },
                      { value: 'space_002', label: '产品文档中心' },
                    ]}
                  />
                </div>

                <Input
                  label="目标 IP ID"
                  placeholder="例如：zhangkai_001"
                  helper="同步的文档将归属到该IP的素材库"
                />

                <div className="p-3 rounded-lg bg-accent-yellow/10 border border-accent-yellow/20">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-accent-yellow mt-0.5" />
                    <p className="text-xs text-accent-yellow">
                      请确保飞书应用已配置并有知识库访问权限
                    </p>
                  </div>
                </div>

                <Button className="w-full" leftIcon={<RefreshCw className="w-4 h-4" />}>
                  开始同步
                </Button>
              </div>
            </Card>

            <Card>
              <CardHeader 
                title="同步记录" 
                description="最近同步历史"
              />
              <div className="space-y-3">
                {[
                  { time: '2026-03-18 10:30', status: 'success', count: 15, space: 'IP内容知识库' },
                  { time: '2026-03-17 16:45', status: 'success', count: 8, space: '产品文档中心' },
                  { time: '2026-03-16 09:20', status: 'failed', count: 0, space: 'IP内容知识库' },
                ].map((record, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-background-tertiary">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground">{record.space}</p>
                        <Badge variant={record.status === 'success' ? 'success' : 'danger'} size="sm">
                          {record.status === 'success' ? '成功' : '失败'}
                        </Badge>
                      </div>
                      <p className="text-xs text-foreground-tertiary mt-1">{record.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">{record.count} 篇</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader 
                title="配置说明" 
                description="飞书开放平台配置指南"
              />
              <div className="space-y-4 text-sm text-foreground-secondary">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-background-tertiary">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-6 h-6 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center">1</span>
                      <span className="font-medium text-foreground">创建应用</span>
                    </div>
                    <p className="text-xs">在飞书开放平台创建企业自建应用，获取 App ID 和 App Secret</p>
                  </div>
                  <div className="p-4 rounded-xl bg-background-tertiary">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-6 h-6 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center">2</span>
                      <span className="font-medium text-foreground">配置权限</span>
                    </div>
                    <p className="text-xs">开通 wiki:space:read、wiki:node:read 等知识库相关权限</p>
                  </div>
                  <div className="p-4 rounded-xl bg-background-tertiary">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-6 h-6 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center">3</span>
                      <span className="font-medium text-foreground">授权访问</span>
                    </div>
                    <p className="text-xs">将应用添加为知识库成员，确保有读取权限</p>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-background-tertiary">
                  <p className="text-xs">
                    <span className="text-foreground font-medium">环境变量：</span>
                    在 Railway 或本地 .env 中配置 FEISHU_APP_ID 和 FEISHU_APP_SECRET
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Config Tab */}
        <TabsContent value="config">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader title="检索配置" description="语义检索参数设置" />
              <div className="space-y-4">
                <Select
                  label="检索策略"
                  options={[
                    { value: 'semantic', label: '语义相似度优先' },
                    { value: 'diverse', label: '多样性优先' },
                    { value: 'fresh', label: '新鲜度优先' },
                    { value: 'balanced', label: '平衡模式' },
                  ]}
                />
                <Input
                  label="返回数量 (top_k)"
                  type="number"
                  defaultValue="10"
                  helper="每次检索返回的最大结果数"
                />
                <Input
                  label="最小相似度"
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  defaultValue="0.7"
                  helper="相似度阈值，低于此值的结果将被过滤"
                />
                <div className="pt-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 rounded-full bg-background-elevated peer-checked:bg-primary-500 transition-colors" />
                      <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-foreground">启用多样性</span>
                      <p className="text-xs text-foreground-tertiary">在结果中增加多样性，避免相似内容重复</p>
                    </div>
                  </label>
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader title="使用限制" description="素材使用频次控制" />
              <div className="space-y-4">
                <Input
                  label="核心素材上限"
                  type="number"
                  defaultValue="3"
                  helper="核心级素材的最大使用次数"
                />
                <Input
                  label="常规素材上限"
                  type="number"
                  defaultValue="10"
                  helper="常规级素材的最大使用次数"
                />
                <Input
                  label="消耗素材上限"
                  type="number"
                  defaultValue="999"
                  helper="消耗级素材的最大使用次数"
                />
                <Select
                  label="超限处理方式"
                  options={[
                    { value: 'block', label: '阻止使用' },
                    { value: 'warn', label: '警告提示' },
                    { value: 'ignore', label: '忽略限制' },
                  ]}
                />
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
