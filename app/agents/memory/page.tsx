'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { api } from '@/lib/api';
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
import type { FeishuSpaceItem, MemoryFullConfig, PendingLabelsItem, RetrievalConfig, RetrieveResult, UsageLimitsConfig, TagCategory } from '@/types';
import { IngestRequest, RetrieveRequest } from '@/types';

const defaultRetrieval: RetrievalConfig = {
  strategy: 'semantic',
  top_k: 10,
  min_similarity: 0.7,
  diversity_enabled: true,
  diversity_recent_window: 30,
  freshness_weight: 0.2,
};
const defaultUsageLimits: UsageLimitsConfig = {
  core_max_usage: 3,
  normal_max_usage: 10,
  disposable_max_usage: 999,
  exceed_behavior: 'block',
};

export default function MemoryAgentPage() {
  const searchParams = useSearchParams();
  const urlIp = searchParams.get('ip') || '';

  const [activeTab, setActiveTab] = useState('ingest');
  const [isIngesting, setIsIngesting] = useState(false);
  const [ingestTaskId, setIngestTaskId] = useState<string | null>(null);
  const [ingestStatus, setIngestStatus] = useState('');
  const [assetsPreview, setAssetsPreview] = useState<{ items: { asset_id: string; title?: string; content_snippet?: string }[]; total: number } | null>(null);
  const [ingestError, setIngestError] = useState<string | null>(null);
  const [ingestIpId, setIngestIpId] = useState('');
  const [ingestSourceType, setIngestSourceType] = useState<'video' | 'audio' | 'text' | 'document'>('text');
  const [ingestSourceUrl, setIngestSourceUrl] = useState('');
  const [ingestTitle, setIngestTitle] = useState('');
  const [ingestNotes, setIngestNotes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<RetrieveResult[]>([]);
  const [retrieveIpId, setRetrieveIpId] = useState('');
  const [retrieveLoading, setRetrieveLoading] = useState(false);
  const [retrieveFilters, setRetrieveFilters] = useState<{ emotion_tags?: string[]; scene_tags?: string[] }>({});

  // Feishu: 凭证与同步
  const [feishuAppId, setFeishuAppId] = useState('');
  const [feishuAppSecret, setFeishuAppSecret] = useState('');
  const [feishuConfigSaved, setFeishuConfigSaved] = useState(false);
  const [feishuSaving, setFeishuSaving] = useState(false);
  const [feishuSpaces, setFeishuSpaces] = useState<FeishuSpaceItem[]>([]);
  const [feishuSpacesLoading, setFeishuSpacesLoading] = useState(false);
  const [feishuSpaceId, setFeishuSpaceId] = useState('');
  const [feishuIpId, setFeishuIpId] = useState('');
  const [feishuSyncing, setFeishuSyncing] = useState(false);
  const [feishuSyncResult, setFeishuSyncResult] = useState<{ synced: number; failed: number; errors: string[] } | null>(null);

  // 高级配置
  const [configIpId, setConfigIpId] = useState('');
  const [memoryConfig, setMemoryConfig] = useState<MemoryFullConfig | null>(null);
  const [configLoading, setConfigLoading] = useState(false);
  const [configSaving, setConfigSaving] = useState(false);
  const [retrieval, setRetrieval] = useState<RetrievalConfig>(defaultRetrieval);
  const [usageLimits, setUsageLimits] = useState<UsageLimitsConfig>(defaultUsageLimits);
  const [tagConfigJson, setTagConfigJson] = useState('[]');
  const [tagConfigError, setTagConfigError] = useState('');

  // 待办标签
  const [tagsIpId, setTagsIpId] = useState('');
  const [pendingLabels, setPendingLabels] = useState<PendingLabelsItem[]>([]);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [confirmingAssetId, setConfirmingAssetId] = useState<string | null>(null);
  const [confirmedLabelsJson, setConfirmedLabelsJson] = useState('{}');
  const [labelSubmitError, setLabelSubmitError] = useState('');

  useEffect(() => { setIngestIpId(prev => prev || urlIp); setConfigIpId(prev => prev || urlIp); setRetrieveIpId(prev => prev || urlIp); setTagsIpId(prev => prev || urlIp); }, [urlIp]);

  const handleIngest = async () => {
    const ip_id = ingestIpId.trim();
    if (!ip_id) { setIngestError('请填写目标 IP ID'); return; }
    if ((ingestSourceType === 'text' || ingestSourceType === 'document') && !ingestSourceUrl.trim()) {
      setIngestError('文本/文档类型需填写 URL 链接'); return;
    }
    setIngestError(null);
    setIsIngesting(true);
    setIngestTaskId(null);
    setIngestStatus('QUEUED');
    try {
      const res = await api.ingestMemory({
        ip_id,
        source_type: ingestSourceType,
        source_url: ingestSourceUrl.trim() || undefined,
        title: ingestTitle.trim() || undefined,
        notes: ingestNotes.trim() || undefined,
      });
      setIngestTaskId(res.ingest_task_id);
      setIngestStatus(res.status);
      const poll = async () => {
        const st = await api.getIngestStatus(res.ingest_task_id);
        setIngestStatus(st.status);
        if (st.status === 'COMPLETED' || st.status === 'FAILED') {
          setIsIngesting(false);
          if (st.status === 'FAILED') setIngestError(st.error || '任务失败');
          else if (st.status === 'COMPLETED') api.getAssets(ip_id, 5).then(setAssetsPreview).catch(() => {});
          return;
        }
        setTimeout(poll, 1500);
      };
      setTimeout(poll, 1500);
    } catch (e: any) {
      setIngestError(e.response?.data?.detail || (e as Error).message || '提交失败');
      setIsIngesting(false);
    }
  };

  const handleSearch = async () => {
    const ip_id = retrieveIpId.trim();
    if (!ip_id) return;
    setRetrieveLoading(true);
    try {
      const results = await api.retrieveMemory({
        ip_id,
        query: searchQuery,
        filters: Object.keys(retrieveFilters).length ? retrieveFilters : undefined,
        top_k: 10,
      });
      setSearchResults(results);
    } catch (e) {
      console.error(e);
      setSearchResults([]);
    } finally {
      setRetrieveLoading(false);
    }
  };

  // 待办标签：进入 tab 时按 ip 拉取
  useEffect(() => {
    if (activeTab !== 'tags' || !tagsIpId.trim()) return;
    setPendingLoading(true);
    api.getPendingLabels(tagsIpId.trim(), 20)
      .then((res) => setPendingLabels(res.items))
      .catch(() => setPendingLabels([]))
      .finally(() => setPendingLoading(false));
  }, [activeTab, tagsIpId]);

  const handleConfirmLabels = async (assetId: string) => {
    const ip_id = tagsIpId.trim();
    if (!ip_id) return;
    let labels: Record<string, unknown>;
    try {
      labels = JSON.parse(confirmedLabelsJson || '{}');
    } catch {
      setLabelSubmitError('confirmed_labels 需为合法 JSON');
      return;
    }
    setLabelSubmitError('');
    try {
      await api.updateLabels(assetId, { ip_id, confirmed_labels: labels });
      setConfirmingAssetId(null);
      setConfirmedLabelsJson('{}');
      const res = await api.getPendingLabels(ip_id, 20);
      setPendingLabels(res.items);
    } catch (e: any) {
      setLabelSubmitError(e.response?.data?.detail || (e as Error).message || '提交失败');
    }
  };

  // 高级配置：进入 tab 时按 ip 拉取
  useEffect(() => {
    if (activeTab !== 'config' || !configIpId.trim()) return;
    setConfigLoading(true);
    api.getMemoryConfig(configIpId.trim())
      .then((data) => {
        setMemoryConfig(data);
        setTagConfigJson(JSON.stringify(data.tag_config?.tag_categories || [], null, 2));
        setTagConfigError('');
        if (data.memory_config) {
          setRetrieval(data.memory_config.retrieval);
          setUsageLimits(data.memory_config.usage_limits);
        } else {
          setRetrieval(defaultRetrieval);
          setUsageLimits(defaultUsageLimits);
        }
      })
      .catch(() => {
        setTagConfigJson('[]');
        setTagConfigError('');
        setRetrieval(defaultRetrieval);
        setUsageLimits(defaultUsageLimits);
      })
      .finally(() => setConfigLoading(false));
  }, [activeTab, configIpId]);

  // 飞书：进入 tab 时拉取配置与空间列表
  useEffect(() => {
    if (activeTab !== 'feishu') return;
    (async () => {
      try {
        const config = await api.getFeishuConfig();
        setFeishuConfigSaved(config.configured);
        if (config.configured) {
          setFeishuSpacesLoading(true);
          const { items } = await api.getFeishuSpaces();
          setFeishuSpaces(items);
        } else {
          setFeishuSpaces([]);
        }
      } catch {
        setFeishuSpaces([]);
      } finally {
        setFeishuSpacesLoading(false);
      }
    })();
  }, [activeTab, feishuConfigSaved]);

  const handleSaveFeishuConfig = async () => {
    if (!feishuAppId.trim() || !feishuAppSecret.trim()) return;
    setFeishuSaving(true);
    try {
      await api.saveFeishuConfig({ app_id: feishuAppId.trim(), app_secret: feishuAppSecret.trim() });
      setFeishuConfigSaved(true);
      const { items } = await api.getFeishuSpaces();
      setFeishuSpaces(items);
    } catch (e) {
      console.error(e);
    } finally {
      setFeishuSaving(false);
    }
  };

  const handleFeishuSync = async () => {
    if (!feishuIpId.trim()) return;
    setFeishuSyncing(true);
    setFeishuSyncResult(null);
    try {
      const result = await api.syncFeishu(feishuIpId.trim(), feishuSpaceId || undefined);
      setFeishuSyncResult(result);
    } catch (e) {
      setFeishuSyncResult({ synced: 0, failed: 0, errors: [(e as Error).message] });
    } finally {
      setFeishuSyncing(false);
    }
  };

  const handleSaveConfig = async () => {
    const ip_id = configIpId.trim();
    if (!ip_id) return;
    let tagCategories: TagCategory[] = [];
    try {
      tagCategories = JSON.parse(tagConfigJson || '[]');
      if (!Array.isArray(tagCategories)) throw new Error('标签配置必须是数组');
      setTagConfigError('');
    } catch {
      setTagConfigError('标签体系 JSON 非法，请修正后再保存');
      return;
    }
    setConfigSaving(true);
    try {
      await api.saveMemoryConfig({
        tag_config: {
          config_id: memoryConfig?.tag_config?.config_id || `tags_${ip_id}`,
          ip_id,
          tag_categories: tagCategories,
          version: memoryConfig?.tag_config?.version || 1,
          updated_by: 'admin',
          updated_at: new Date().toISOString(),
        },
        memory_config: {
          config_id: memoryConfig?.memory_config?.config_id || `memory_${ip_id}`,
          ip_id,
          retrieval,
          usage_limits: usageLimits,
          version: memoryConfig?.memory_config?.version || 1,
          updated_by: 'admin',
          updated_at: new Date().toISOString(),
        },
      });
      const data = await api.getMemoryConfig(ip_id);
      setMemoryConfig(data);
    } finally {
      setConfigSaving(false);
    }
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                <Input
                  label="目标 IP ID"
                  placeholder="例如：zhangkai_001（可从 IP 管理跳转带出）"
                  value={ingestIpId}
                  onChange={(e) => setIngestIpId(e.target.value)}
                />
                <Select
                  label="素材类型"
                  value={ingestSourceType}
                  onChange={(e) => setIngestSourceType(e.target.value as 'video' | 'audio' | 'text' | 'document')}
                  options={[
                    { value: 'video', label: '视频' },
                    { value: 'audio', label: '音频' },
                    { value: 'text', label: '文本' },
                    { value: 'document', label: '文档' },
                  ]}
                />
                {(ingestSourceType === 'text' || ingestSourceType === 'document') && (
                  <Input
                    label="URL 链接"
                    placeholder="文本/文档的 URL，必填"
                    value={ingestSourceUrl}
                    onChange={(e) => setIngestSourceUrl(e.target.value)}
                  />
                )}

                <Input
                  label="素材标题"
                  placeholder="例如：2020年破产经历"
                  helper="简短描述素材内容，便于后续检索"
                  value={ingestTitle}
                  onChange={(e) => setIngestTitle(e.target.value)}
                />

                <Textarea
                  label="备注说明"
                  placeholder="补充素材的背景信息..."
                  helper="可选，添加更多上下文信息"
                  value={ingestNotes}
                  onChange={(e) => setIngestNotes(e.target.value)}
                />

                {ingestError && <p className="text-sm text-accent-red">{ingestError}</p>}
                {ingestTaskId && <p className="text-xs text-foreground-tertiary">任务 ID: {ingestTaskId} · 状态: {ingestStatus}</p>}

                <Button 
                  className="w-full" 
                  onClick={handleIngest}
                  disabled={isIngesting}
                  leftIcon={isIngesting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                >
                  {isIngesting ? `处理中 (${ingestStatus})...` : '开始录入'}
                </Button>

                {ingestStatus === 'COMPLETED' && (
                  <div className="p-3 rounded-xl bg-accent-green/10 border border-accent-green/20 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-accent-green" />
                    <span className="text-sm text-accent-green">录入完成</span>
                  </div>
                )}
              </div>
            </Card>

            <Card>
              <CardHeader 
                title="素材库预览" 
                description="录入完成后可在此查看，或通过语义检索验证"
              />
              <div className="space-y-3">
                {ingestIpId && (
                  <Button variant="ghost" size="sm" onClick={() => api.getAssets(ingestIpId.trim(), 10).then(setAssetsPreview).catch(() => {})}>
                    刷新
                  </Button>
                )}
                {assetsPreview ? (
                  assetsPreview.items.length === 0 ? (
                    <p className="text-sm text-foreground-tertiary">暂无素材，请先录入或飞书同步</p>
                  ) : (
                    <>
                      <p className="text-xs text-foreground-tertiary">共 {assetsPreview.total} 条，展示最近 {assetsPreview.items.length} 条</p>
                      {assetsPreview.items.map((a) => (
                        <div key={a.asset_id} className="p-3 rounded-xl bg-background-tertiary">
                          <p className="text-sm font-medium text-foreground truncate">{a.title || a.asset_id}</p>
                          {a.content_snippet && <p className="text-xs text-foreground-tertiary mt-1 line-clamp-2">{a.content_snippet}</p>}
                        </div>
                      ))}
                    </>
                  )
                ) : (
                  <p className="text-sm text-foreground-tertiary">填写目标 IP ID 后点击刷新，或完成录入后自动加载</p>
                )}
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Retrieve Tab */}
        <TabsContent value="retrieve">
          <Card>
            <CardHeader 
              title="语义检索" 
              description="使用自然语言搜索IP素材库（后端占位时返回空，对接后按相似度返回）"
            />
            <div className="space-y-6">
              <Input
                label="目标 IP ID"
                placeholder="与 URL 参数 ip= 一致"
                value={retrieveIpId}
                onChange={(e) => setRetrieveIpId(e.target.value)}
              />
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    placeholder="例如：找一个深夜崩溃但最终翻盘的故事"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    leftIcon={<Brain className="w-4 h-4" />}
                  />
                </div>
                <Button onClick={handleSearch} disabled={retrieveLoading || !retrieveIpId.trim()} leftIcon={retrieveLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}>
                  {retrieveLoading ? '检索中...' : '搜索'}
                </Button>
              </div>

              {/* Results：按后端 RetrieveResult 展示 */}
              {searchResults.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm text-foreground-secondary">
                    找到 {searchResults.length} 个相关素材
                  </p>
                  {searchResults.map((asset) => (
                    <div key={asset.asset_id} className="p-4 rounded-xl bg-background-tertiary border border-border">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-foreground">{asset.title || asset.asset_id}</h4>
                        <span className="text-xs text-foreground-tertiary">相似度 {(asset.similarity * 100).toFixed(0)}%</span>
                      </div>
                      {asset.content_snippet && (
                        <p className="text-sm text-foreground-secondary mb-2 line-clamp-2">{asset.content_snippet}</p>
                      )}
                      {asset.metadata && Object.keys(asset.metadata).length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(asset.metadata).slice(0, 5).map(([k, v]) => (
                            <span key={k} className="px-2 py-0.5 rounded-full bg-background-elevated text-2xs text-foreground-tertiary">
                              {k}: {String(v)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {!retrieveLoading && searchResults.length === 0 && searchQuery && retrieveIpId && (
                <div className="text-center py-12">
                  <Brain className="w-12 h-12 mx-auto mb-3 text-foreground-tertiary" />
                  <p className="text-sm text-foreground-secondary">暂无结果（当前后端为占位实现，接入向量库后将返回检索结果）</p>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        {/* Tags Tab */}
        <TabsContent value="tags">
          <div className="space-y-6">
            {/* 待复核列表 */}
            <Card>
              <CardHeader 
                title="待复核列表" 
                description="自动打标待确认的素材，确认后写入正式标签"
              />
              <Input
                label="IP ID"
                placeholder="与 URL 参数 ip= 一致，用于拉取待复核列表"
                value={tagsIpId}
                onChange={(e) => setTagsIpId(e.target.value)}
                className="mb-4"
              />
              {pendingLoading && <p className="text-sm text-foreground-tertiary">加载中...</p>}
              {!pendingLoading && pendingLabels.length === 0 && tagsIpId && <p className="text-sm text-foreground-tertiary">暂无待复核项（后端占位时返回空）</p>}
              {!pendingLoading && pendingLabels.length > 0 && (
                <div className="space-y-3">
                  {pendingLabels.map((item) => (
                    <div key={item.asset_id} className="p-4 rounded-xl bg-background-tertiary border border-border">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground">{item.title || item.asset_id}</h4>
                          {item.content_snippet && <p className="text-sm text-foreground-secondary mt-1 line-clamp-2">{item.content_snippet}</p>}
                          {item.auto_labels && Object.keys(item.auto_labels).length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {Object.entries(item.auto_labels).map(([k, v]) => (
                                <span key={k} className="px-2 py-0.5 rounded bg-background-elevated text-2xs text-foreground-tertiary">{k}: {String(v)}</span>
                              ))}
                            </div>
                          )}
                        </div>
                        {confirmingAssetId === item.asset_id ? (
                          <div className="flex-shrink-0 space-y-2">
                            <textarea
                              className="w-48 h-20 rounded-lg border border-border bg-background-tertiary text-sm p-2"
                              placeholder='{"emotion":"希望","scene":"办公室"}'
                              value={confirmedLabelsJson}
                              onChange={(e) => setConfirmedLabelsJson(e.target.value)}
                            />
                            {labelSubmitError && <p className="text-xs text-accent-red">{labelSubmitError}</p>}
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => handleConfirmLabels(item.asset_id)}>确认提交</Button>
                              <Button size="sm" variant="ghost" onClick={() => { setConfirmingAssetId(null); setLabelSubmitError(''); }}>取消</Button>
                            </div>
                          </div>
                        ) : (
                          <Button size="sm" variant="secondary" onClick={() => { setConfirmingAssetId(item.asset_id); setConfirmedLabelsJson(JSON.stringify(item.auto_labels || {}, null, 2)); setLabelSubmitError(''); }}>确认标签</Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

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
          </div>
        </TabsContent>

        {/* Feishu Sync Tab */}
        <TabsContent value="feishu">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 飞书应用凭证：管理后台填写后保存到后端 */}
            <Card className="lg:col-span-2">
              <CardHeader 
                title="飞书应用凭证" 
                description="填写后在下方选择知识空间并同步，凭证仅保存在本系统不会提交给飞书以外的服务"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="App ID"
                  placeholder="飞书开放平台应用的 App ID"
                  value={feishuAppId}
                  onChange={(e) => setFeishuAppId(e.target.value)}
                />
                <Input
                  label="App Secret"
                  type="password"
                  placeholder="飞书开放平台应用的 App Secret"
                  value={feishuAppSecret}
                  onChange={(e) => setFeishuAppSecret(e.target.value)}
                />
              </div>
              <div className="mt-4 flex items-center gap-3">
                <Button
                  onClick={handleSaveFeishuConfig}
                  disabled={feishuSaving || !feishuAppId.trim() || !feishuAppSecret.trim()}
                  leftIcon={feishuSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : undefined}
                >
                  {feishuSaving ? '保存中...' : '保存凭证'}
                </Button>
                {feishuConfigSaved && (
                  <Badge variant="success" size="sm">已配置</Badge>
                )}
              </div>
            </Card>

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
                    value={feishuSpaceId}
                    onChange={(e) => setFeishuSpaceId(e.target.value)}
                    options={[
                      { value: '', label: feishuSpacesLoading ? '加载中...' : (feishuSpaces.length ? '请选择' : '请先保存凭证') },
                      ...feishuSpaces.map((s) => ({ value: s.space_id, label: s.name || s.space_id })),
                    ]}
                  />
                </div>

                <Input
                  label="目标 IP ID"
                  placeholder="例如：zhangkai_001"
                  helper="同步的文档将归属到该IP的素材库"
                  value={feishuIpId}
                  onChange={(e) => setFeishuIpId(e.target.value)}
                />

                <div className="p-3 rounded-lg bg-accent-yellow/10 border border-accent-yellow/20">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-accent-yellow mt-0.5" />
                    <p className="text-xs text-accent-yellow">
                      请确保飞书应用已配置并有知识库访问权限
                    </p>
                  </div>
                </div>

                {feishuSyncResult && (
                  <div className="p-3 rounded-lg bg-background-tertiary text-sm">
                    <p className="text-foreground">同步结果：成功 {feishuSyncResult.synced} 篇，失败 {feishuSyncResult.failed} 篇</p>
                    {feishuSyncResult.errors.length > 0 && (
                      <ul className="mt-1 text-foreground-tertiary text-xs list-disc list-inside">
                        {feishuSyncResult.errors.slice(0, 5).map((err, i) => (
                          <li key={i}>{err}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                <Button
                  className="w-full"
                  leftIcon={feishuSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                  onClick={handleFeishuSync}
                  disabled={feishuSyncing || !feishuIpId.trim()}
                >
                  {feishuSyncing ? '同步中...' : '开始同步'}
                </Button>
              </div>
            </Card>

            <Card>
              <CardHeader 
                title="同步说明" 
                description="使用步骤"
              />
              <div className="space-y-3 text-sm text-foreground-secondary">
                <p>1. 在上方填写飞书开放平台的 App ID、App Secret 并保存</p>
                <p>2. 选择要同步的知识空间（需应用已加入该知识库成员）</p>
                <p>3. 填写目标 IP ID（需已在本系统创建），点击开始同步</p>
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
                <p className="text-xs text-foreground-tertiary">
                  凭证可在本页「飞书应用凭证」中填写保存；也可在服务端环境变量中配置 FEISHU_APP_ID、FEISHU_APP_SECRET（管理后台填写优先）。
                </p>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Config Tab */}
        <TabsContent value="config">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Input
              label="当前 IP ID"
              placeholder="与 URL 参数 ip= 一致，用于拉取/保存该 IP 的配置"
              value={configIpId}
              onChange={(e) => setConfigIpId(e.target.value)}
              className="lg:col-span-2"
            />
            {configLoading && <p className="text-sm text-foreground-tertiary lg:col-span-2">加载中...</p>}
            <Card>
              <CardHeader title="检索配置" description="语义检索参数设置" />
              <div className="space-y-4">
                <Select
                  label="检索策略"
                  value={retrieval.strategy}
                  onChange={(e) => setRetrieval(r => ({ ...r, strategy: e.target.value }))}
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
                  value={retrieval.top_k}
                  onChange={(e) => setRetrieval(r => ({ ...r, top_k: Number(e.target.value) || 10 }))}
                  helper="每次检索返回的最大结果数"
                />
                <Input
                  label="最小相似度"
                  type="number"
                  step="0.1"
                  min={0}
                  max={1}
                  value={retrieval.min_similarity}
                  onChange={(e) => setRetrieval(r => ({ ...r, min_similarity: Number(e.target.value) || 0.7 }))}
                  helper="相似度阈值，低于此值的结果将被过滤"
                />
                <div className="pt-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={retrieval.diversity_enabled}
                      onChange={(e) => setRetrieval(r => ({ ...r, diversity_enabled: e.target.checked }))}
                      className="rounded border-border"
                    />
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
                  value={usageLimits.core_max_usage}
                  onChange={(e) => setUsageLimits(u => ({ ...u, core_max_usage: Number(e.target.value) || 3 }))}
                  helper="核心级素材的最大使用次数"
                />
                <Input
                  label="常规素材上限"
                  type="number"
                  value={usageLimits.normal_max_usage}
                  onChange={(e) => setUsageLimits(u => ({ ...u, normal_max_usage: Number(e.target.value) || 10 }))}
                  helper="常规级素材的最大使用次数"
                />
                <Input
                  label="消耗素材上限"
                  type="number"
                  value={usageLimits.disposable_max_usage}
                  onChange={(e) => setUsageLimits(u => ({ ...u, disposable_max_usage: Number(e.target.value) || 999 }))}
                  helper="消耗级素材的最大使用次数"
                />
                <Select
                  label="超限处理方式"
                  value={usageLimits.exceed_behavior}
                  onChange={(e) => setUsageLimits(u => ({ ...u, exceed_behavior: e.target.value }))}
                  options={[
                    { value: 'block', label: '阻止使用' },
                    { value: 'warn', label: '警告提示' },
                    { value: 'ignore', label: '忽略限制' },
                  ]}
                />
                <Button onClick={handleSaveConfig} disabled={configSaving || !configIpId.trim()} leftIcon={configSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : undefined} className="w-full">
                  {configSaving ? '保存中...' : '保存配置'}
                </Button>
              </div>
            </Card>
            <Card className="lg:col-span-2">
              <CardHeader title="标签体系（IP 自定义）" description="直接编辑 tag_categories JSON，保存后自动打标将严格按该术语表输出" />
              <div className="space-y-3">
                <textarea
                  className="w-full min-h-64 rounded-xl border border-border bg-background-tertiary text-sm p-3 font-mono"
                  value={tagConfigJson}
                  onChange={(e) => setTagConfigJson(e.target.value)}
                />
                {tagConfigError && <p className="text-sm text-accent-red">{tagConfigError}</p>}
                <p className="text-xs text-foreground-tertiary">
                  参考模板：docs/TAG_TAXONOMY_REFERENCE.md
                </p>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
