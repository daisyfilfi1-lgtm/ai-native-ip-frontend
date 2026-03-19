'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CreatorLayout } from '@/components/creator/CreatorLayout';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Input } from '@/components/ui/Input';
import { creatorApi, type AgentConfigStatus } from '@/lib/api/creator';
import type { TopicCard, StyleType } from '@/types/creator';
import { 
  Sparkles, 
  TrendingUp, 
  Target, 
  Zap,
  ArrowRight,
  Mic,
  FileText,
  Loader2,
  Link as LinkIcon,
  Brain,
  Shield,
  BarChart3,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Settings,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

// Agent配置状态组件
function AgentStatusCard({ 
  name, 
  icon: Icon, 
  status, 
  config 
}: { 
  name: string; 
  icon: any; 
  status: 'ready' | 'configuring' | 'error';
  config: string[];
}) {
  const statusColors = {
    ready: 'bg-accent-green/10 text-accent-green border-accent-green/20',
    configuring: 'bg-accent-yellow/10 text-accent-yellow border-accent-yellow/20',
    error: 'bg-accent-red/10 text-accent-red border-accent-red/20'
  };

  const statusLabels = {
    ready: '已就绪',
    configuring: '配置中',
    error: '需配置'
  };

  return (
    <div className={cn(
      "p-3 rounded-xl border flex items-center gap-3",
      statusColors[status]
    )}>
      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{name}</span>
          <Badge variant={status === 'ready' ? 'success' : status === 'configuring' ? 'warning' : 'danger'} size="sm">
            {statusLabels[status]}
          </Badge>
        </div>
        <p className="text-xs opacity-80 truncate">{config.join(' · ')}</p>
      </div>
    </div>
  );
}

// 选题卡片组件
function TopicCardComponent({ 
  topic, 
  index, 
  onGenerate,
  isGenerating 
}: { 
  topic: TopicCard; 
  index: number;
  onGenerate: (topic: TopicCard, style: StyleType) => void;
  isGenerating: boolean;
}) {
  const [selectedStyle, setSelectedStyle] = useState<StyleType>('angry');
  const styles: { value: StyleType; label: string; emoji: string }[] = [
    { value: 'angry', label: '愤怒', emoji: '🔥' },
    { value: 'calm', label: '冷静', emoji: '😌' },
    { value: 'humor', label: '幽默', emoji: '😄' },
  ];

  const scoreColor = topic.score >= 4.8 ? 'text-accent-green' : topic.score >= 4.5 ? 'text-accent-yellow' : 'text-foreground';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="h-full flex flex-col hover:border-primary-500/50 transition-all group">
        {/* Rank & Score */}
        <div className="p-5 pb-0 flex items-start justify-between">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg",
            index === 0 ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white" :
            index === 1 ? "bg-gradient-to-br from-gray-300 to-gray-500 text-white" :
            index === 2 ? "bg-gradient-to-br from-amber-600 to-amber-800 text-white" :
            "bg-background-tertiary text-foreground-secondary"
          )}>
            {index + 1}
          </div>
          <div className="text-right">
            <div className={cn("text-2xl font-bold", scoreColor)}>{topic.score.toFixed(1)}</div>
            <div className="text-xs text-foreground-tertiary">策略评分</div>
          </div>
        </div>

        <div className="p-5 flex-1 flex flex-col">
          {/* Title */}
          <h3 className="text-lg font-semibold text-foreground mb-3 line-clamp-2 group-hover:text-primary-400 transition-colors">
            {topic.title}
          </h3>

          {/* Match Reason */}
          <div className="flex items-center gap-2 mb-3 text-xs">
            <Brain className="w-3.5 h-3.5 text-primary-400" />
            <span className="text-foreground-secondary">{topic.reason}</span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {topic.tags.map(tag => (
              <span key={tag} className="px-2 py-0.5 bg-background-tertiary text-foreground-secondary text-xs rounded-full">
                {tag}
              </span>
            ))}
          </div>

          {/* Prediction */}
          <div className="space-y-2 mb-4 p-3 bg-background-tertiary/50 rounded-xl">
            <div className="flex items-center justify-between text-sm">
              <span className="text-foreground-secondary">预估播放</span>
              <span className="font-semibold text-foreground">{topic.estimatedViews}</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-foreground-tertiary">预估完播率</span>
                <span className="text-foreground-secondary">{topic.estimatedCompletion}%</span>
              </div>
              <Progress value={topic.estimatedCompletion} size="sm" variant="gradient" />
            </div>
          </div>

          {/* Style Selection */}
          <div className="mb-3">
            <div className="flex gap-1.5">
              {styles.map(style => (
                <button
                  key={style.value}
                  onClick={() => setSelectedStyle(style.value)}
                  disabled={isGenerating}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all",
                    selectedStyle === style.value
                      ? "bg-primary-500 text-white"
                      : "bg-background-tertiary text-foreground-secondary hover:bg-background-elevated"
                  )}
                >
                  <span>{style.emoji}</span>
                  <span>{style.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <Button 
            className="w-full mt-auto"
            leftIcon={isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            onClick={() => onGenerate(topic, selectedStyle)}
            isLoading={isGenerating}
            disabled={isGenerating}
          >
            {isGenerating ? '生成中...' : '一键生成'}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

// 主页面组件
export default function CreatorDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('recommended');
  const [topics, setTopics] = useState<TopicCard[]>([]);
  const [agentStatus, setAgentStatus] = useState<AgentConfigStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingTopicId, setGeneratingTopicId] = useState<string | null>(null);
  
  // 仿写爆款相关
  const [remixUrl, setRemixUrl] = useState('');
  const [remixStyle, setRemixStyle] = useState<StyleType>('angry');
  const [isRemixing, setIsRemixing] = useState(false);
  
  // 语音输入相关
  const [isRecording, setIsRecording] = useState(false);
  const [voiceText, setVoiceText] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [topicsData, statusData] = await Promise.all([
        creatorApi.getRecommendedTopics(),
        creatorApi.getAgentConfigStatus()
      ]);
      setTopics(topicsData);
      setAgentStatus(statusData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  // 场景一：推荐选题生成
  const handleGenerateFromTopic = async (topic: TopicCard, style: StyleType) => {
    setGeneratingTopicId(topic.id);
    try {
      // 调用 Strategy + Memory + Generation + Compliance
      const result = await creatorApi.generateFromTopic(topic.id, style);
      router.push(`/creator/generate?id=${result.id}&type=topic`);
    } catch (error) {
      console.error('Generate failed:', error);
      setGeneratingTopicId(null);
    }
  };

  // 场景二：仿写爆款
  const handleRemix = async () => {
    if (!remixUrl.trim()) return;
    setIsRemixing(true);
    try {
      // 调用 Remix + Memory + Generation + Compliance
      const result = await creatorApi.generateFromRemix(remixUrl, remixStyle);
      router.push(`/creator/generate?id=${result.id}&type=remix`);
    } catch (error) {
      console.error('Remix failed:', error);
      setIsRemixing(false);
    }
  };

  // 场景三：语音输入
  const handleVoiceGenerate = async () => {
    if (!voiceText.trim()) return;
    try {
      // 调用 ASR + Memory + Generation + Compliance
      const result = await creatorApi.generateFromVoice(voiceText, 'angry');
      router.push(`/creator/generate?id=${result.id}&type=voice`);
    } catch (error) {
      console.error('Voice generate failed:', error);
    }
  };

  // 检查Agent配置状态
  const isStrategyReady = agentStatus?.strategy.status === 'ready';
  const isMemoryReady = agentStatus?.memory.status === 'ready';
  const isGenerationReady = agentStatus?.generation.status === 'ready';
  const isRemixReady = agentStatus?.remix.status === 'ready';
  const isComplianceReady = agentStatus?.compliance.status === 'ready';

  const allReady = isStrategyReady && isMemoryReady && isGenerationReady && isComplianceReady;

  return (
    <CreatorLayout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          今日工作台
        </h1>
        <p className="text-foreground-secondary">
          选择创作方式，AI将调用已配置的Agent为你生成内容
        </p>
      </div>

      {/* Agent状态监控 */}
      <Card className="mb-6">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-foreground-secondary" />
              <span className="text-sm font-medium text-foreground">Agent配置状态</span>
            </div>
            <Link href="/agents" className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1">
              前往配置 <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            <AgentStatusCard 
              name="Strategy" 
              icon={BarChart3} 
              status={agentStatus?.strategy.status || 'configuring'}
              config={agentStatus?.strategy.config || ['评分权重', '竞品监控']}
            />
            <AgentStatusCard 
              name="Memory" 
              icon={Brain} 
              status={agentStatus?.memory.status || 'configuring'}
              config={agentStatus?.memory.config || ['标签体系', '检索策略']}
            />
            <AgentStatusCard 
              name="Remix" 
              icon={RefreshCw} 
              status={agentStatus?.remix.status || 'configuring'}
              config={agentStatus?.remix.config || ['解构规则', '原创度']}
            />
            <AgentStatusCard 
              name="Generation" 
              icon={Sparkles} 
              status={agentStatus?.generation.status || 'configuring'}
              config={agentStatus?.generation.config || ['风格训练', '口头禅']}
            />
            <AgentStatusCard 
              name="Compliance" 
              icon={Shield} 
              status={agentStatus?.compliance.status || 'configuring'}
              config={agentStatus?.compliance.config || ['敏感词库', '平台规则']}
            />
          </div>

          {!allReady && (
            <div className="mt-3 p-3 bg-accent-yellow/10 border border-accent-yellow/20 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-accent-yellow flex-shrink-0" />
              <p className="text-xs text-accent-yellow">
                部分Agent未配置完成，可能影响生成质量。建议先完成配置再创作。
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* 创作方式切换 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="recommended" className="gap-2">
            <Sparkles className="w-4 h-4" />
            推荐选题
            <Badge variant="primary" size="sm">Strategy</Badge>
          </TabsTrigger>
          <TabsTrigger value="remix" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            仿写爆款
            <Badge variant="primary" size="sm">Remix</Badge>
          </TabsTrigger>
          <TabsTrigger value="voice" className="gap-2">
            <Mic className="w-4 h-4" />
            语音创作
            <Badge variant="primary" size="sm">ASR</Badge>
          </TabsTrigger>
        </TabsList>

        {/* 场景一：推荐选题 */}
        <TabsContent value="recommended">
          <div className="space-y-6">
            {/* 场景说明 */}
            <div className="p-4 bg-background-tertiary/50 rounded-xl border border-border">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">Strategy Agent 智能推荐</h3>
                  <p className="text-sm text-foreground-secondary">
                    基于<span className="text-primary-400">四维评分算法</span>（流量/变现/契合度/成本），
                    从监控的竞品中筛选出最适合你的选题，并匹配Memory Agent中的相关素材。
                  </p>
                </div>
              </div>
            </div>

            {/* 选题卡片 */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary-400" />
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {topics.map((topic, index) => (
                  <TopicCardComponent
                    key={topic.id}
                    topic={topic}
                    index={index}
                    onGenerate={handleGenerateFromTopic}
                    isGenerating={generatingTopicId === topic.id}
                  />
                ))}
              </div>
            )}

            {!isStrategyReady && (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 mx-auto mb-3 text-accent-yellow" />
                <p className="text-foreground-secondary mb-3">Strategy Agent 未配置完成</p>
                <Button variant="secondary" leftIcon={<Settings className="w-4 h-4" />}>
                  前往配置评分权重
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        {/* 场景二：仿写爆款 */}
        <TabsContent value="remix">
          <div className="max-w-2xl mx-auto">
            {/* 场景说明 */}
            <div className="p-4 bg-background-tertiary/50 rounded-xl border border-border mb-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent-pink/10 flex items-center justify-center flex-shrink-0">
                  <RefreshCw className="w-5 h-5 text-accent-pink" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">Remix Agent 结构仿写</h3>
                  <p className="text-sm text-foreground-secondary">
                    输入竞品链接，Remix Agent会<span className="text-accent-pink">解构其结构</span>（钩子/情绪/论证），
                    然后调用Memory Agent<span className="text-accent-pink">替换为你的素材</span>，
                    最后Generation Agent用<span className="text-accent-pink">你的风格重写</span>。
                  </p>
                </div>
              </div>
            </div>

            <Card>
              <div className="p-6 space-y-6">
                {/* URL输入 */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    竞品视频链接
                  </label>
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-tertiary" />
                      <input
                        type="text"
                        value={remixUrl}
                        onChange={(e) => setRemixUrl(e.target.value)}
                        placeholder="粘贴抖音/视频号/小红书链接..."
                        className="w-full pl-10 pr-4 py-3 bg-background-tertiary border border-border rounded-xl text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-primary-500/50"
                      />
                    </div>
                  </div>
                </div>

                {/* 风格选择 */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    生成风格
                  </label>
                  <div className="flex gap-3">
                    {[
                      { value: 'angry' as StyleType, label: '愤怒', emoji: '🔥', desc: '直击痛点，引发共鸣' },
                      { value: 'calm' as StyleType, label: '冷静', emoji: '😌', desc: '理性分析，建立专业感' },
                      { value: 'humor' as StyleType, label: '幽默', emoji: '😄', desc: '轻松有趣，拉近距离' },
                    ].map(style => (
                      <button
                        key={style.value}
                        onClick={() => setRemixStyle(style.value)}
                        className={cn(
                          "flex-1 p-4 rounded-xl border text-left transition-all",
                          remixStyle === style.value
                            ? "border-primary-500 bg-primary-500/10"
                            : "border-border bg-background-tertiary hover:border-border-hover"
                        )}
                      >
                        <div className="text-2xl mb-2">{style.emoji}</div>
                        <div className="font-medium text-foreground mb-1">{style.label}</div>
                        <div className="text-xs text-foreground-secondary">{style.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 配置检查 */}
                <div className="p-4 bg-background-tertiary rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    {isRemixReady ? (
                      <CheckCircle2 className="w-4 h-4 text-accent-green" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-accent-yellow" />
                    )}
                    <span className={isRemixReady ? 'text-accent-green' : 'text-accent-yellow'}>
                      Remix Agent: {isRemixReady ? '解构规则已配置' : '需配置解构规则'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {isMemoryReady ? (
                      <CheckCircle2 className="w-4 h-4 text-accent-green" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-accent-yellow" />
                    )}
                    <span className={isMemoryReady ? 'text-accent-green' : 'text-accent-yellow'}>
                      Memory Agent: {isMemoryReady ? '素材库已就绪' : '需配置标签体系'}
                    </span>
                  </div>
                </div>

                {/* 生成按钮 */}
                <Button
                  className="w-full"
                  size="lg"
                  leftIcon={isRemixing ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
                  onClick={handleRemix}
                  isLoading={isRemixing}
                  disabled={!remixUrl.trim() || isRemixing || !isRemixReady || !isMemoryReady}
                >
                  {isRemixing ? '解构与生成中...' : '开始仿写'}
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* 场景三：语音创作 */}
        <TabsContent value="voice">
          <div className="max-w-2xl mx-auto">
            {/* 场景说明 */}
            <div className="p-4 bg-background-tertiary/50 rounded-xl border border-border mb-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent-cyan/10 flex items-center justify-center flex-shrink-0">
                  <Mic className="w-5 h-5 text-accent-cyan" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">语音 → ASR → Memory → Generation</h3>
                  <p className="text-sm text-foreground-secondary">
                    说出你的想法，ASR转为文字后，Memory Agent<span className="text-accent-cyan">语义理解并检索相关素材</span>，
                    最后Generation Agent<span className="text-accent-cyan">扩展成完整文案</span>。
                  </p>
                </div>
              </div>
            </div>

            <Card>
              <div className="p-6 space-y-6">
                {/* 语音输入区域 */}
                <div className="relative">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    说出你的想法
                  </label>
                  
                  {/* 录音按钮 */}
                  <button
                    onClick={() => setIsRecording(!isRecording)}
                    className={cn(
                      "w-full py-8 rounded-xl border-2 border-dashed transition-all flex flex-col items-center gap-3",
                      isRecording
                        ? "border-accent-red bg-accent-red/10 animate-pulse"
                        : "border-border hover:border-primary-500/50 bg-background-tertiary"
                    )}
                  >
                    <div className={cn(
                      "w-16 h-16 rounded-full flex items-center justify-center transition-all",
                      isRecording ? "bg-accent-red" : "bg-primary-500"
                    )}>
                      <Mic className="w-8 h-8 text-white" />
                    </div>
                    <span className={cn(
                      "font-medium",
                      isRecording ? "text-accent-red" : "text-foreground"
                    )}>
                      {isRecording ? '正在录音... 点击停止' : '点击开始录音'}
                    </span>
                  </button>

                  {/* 文本编辑区 */}
                  <div className="mt-4">
                    <textarea
                      value={voiceText}
                      onChange={(e) => setVoiceText(e.target.value)}
                      placeholder="或者在这里输入你的想法..."
                      rows={4}
                      className="w-full p-4 bg-background-tertiary border border-border rounded-xl text-foreground placeholder:text-foreground-muted resize-none focus:outline-none focus:border-primary-500/50"
                    />
                  </div>
                </div>

                {/* 配置检查 */}
                <div className="p-4 bg-background-tertiary rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-accent-green" />
                    <span className="text-accent-green">ASR服务: 已连接 (Whisper API)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {isMemoryReady ? (
                      <CheckCircle2 className="w-4 h-4 text-accent-green" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-accent-yellow" />
                    )}
                    <span className={isMemoryReady ? 'text-accent-green' : 'text-accent-yellow'}>
                      Memory Agent: {isMemoryReady ? '语义检索已就绪' : '需配置检索策略'}
                    </span>
                  </div>
                </div>

                {/* 生成按钮 */}
                <Button
                  className="w-full"
                  size="lg"
                  leftIcon={<Sparkles className="w-5 h-5" />}
                  onClick={handleVoiceGenerate}
                  disabled={!voiceText.trim() || !isMemoryReady}
                >
                  生成文案
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </CreatorLayout>
  );
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ');
}
