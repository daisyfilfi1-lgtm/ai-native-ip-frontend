'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CreatorLayout } from '@/components/creator/CreatorLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { creatorApi } from '@/lib/api/creator';
import type { GeneratedContent, StyleType, ComplianceResult, PlatformRule } from '@/types/creator';
import type { LucideIcon } from 'lucide-react';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Edit3,
  Save,
  Play,
  RefreshCw,
  Zap,
  Flame,
  Smile,
  ArrowLeft,
  Copy,
  Send
} from 'lucide-react';
import Link from 'next/link';

interface SectionConfig {
  title: string;
  color: string;
}

interface SectionData {
  content: string;
  source?: string;
}

interface ContentSections {
  hook: SectionData;
  story: SectionData;
  opinion: SectionData;
  cta: SectionData;
}

const styles: { value: StyleType; label: string; emoji: string; color: string }[] = [
  { value: 'angry', label: '愤怒', emoji: '🔥', color: 'from-red-500 to-orange-500' },
  { value: 'calm', label: '冷静', emoji: '😌', color: 'from-blue-500 to-cyan-500' },
  { value: 'humor', label: '幽默', emoji: '😄', color: 'from-yellow-500 to-amber-500' },
];

const sectionLabels: Record<string, SectionConfig> = {
  hook: { title: '钩子', color: 'text-accent-pink' },
  story: { title: '故事', color: 'text-accent-cyan' },
  opinion: { title: '观点', color: 'text-primary-400' },
  cta: { title: '行动指令', color: 'text-accent-green' },
};

function GeneratePageContent() {
  const searchParams = useSearchParams();
  const topicId = searchParams.get('topic');
  
  const [currentStyle, setCurrentStyle] = useState<StyleType>('angry');
  const [isGenerating, setIsGenerating] = useState(true);
  const [progress, setProgress] = useState(0);
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<Record<string, string>>({});
  const [isPublishing, setIsPublishing] = useState(false);

  // 生成动画
  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            loadContent();
            return 100;
          }
          return prev + 2;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isGenerating]);

  const loadContent = async () => {
    try {
      const data: GeneratedContent = await creatorApi.getGeneratedContent(topicId || 'topic_001');
      setContent(data);
      setIsGenerating(false);
    } catch (error) {
      console.error('Failed to load content:', error);
    }
  };

  const handleStyleChange = async (style: StyleType) => {
    setCurrentStyle(style);
    setIsGenerating(true);
    setProgress(0);
    setContent(null);
  };

  const getSectionContent = (key: string): string => {
    if (!content) return '';
    switch (key) {
      case 'hook': return content.hook;
      case 'story': return content.story;
      case 'opinion': return content.opinion;
      case 'cta': return content.cta;
      default: return '';
    }
  };

  const getSectionSource = (key: string): string | undefined => {
    if (!content || !content.sourceTracing) return undefined;
    const trace = content.sourceTracing.find(t => t.section === key);
    return trace ? `素材_${trace.sourceId}` : undefined;
  };

  const handleEdit = (sectionKey: string) => {
    setEditingSection(sectionKey);
    setEditedContent(prev => ({ ...prev, [sectionKey]: getSectionContent(sectionKey) }));
  };

  const handleSaveEdit = (sectionKey: string) => {
    if (content) {
      const newContent = editedContent[sectionKey] || getSectionContent(sectionKey);
      setContent({
        ...content,
        [sectionKey]: newContent
      });
    }
    setEditingSection(null);
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsPublishing(false);
    alert('内容已提交审核！');
  };

  const getComplianceStatus = (compliance: ComplianceResult): { passed: boolean; label: string } => {
    const allPassed = compliance.platformChecks.douyin === 'passed' && 
                      compliance.platformChecks.xiaohongshu === 'passed';
    return {
      passed: allPassed,
      label: allPassed ? '通过' : '需修改'
    };
  };

  const sections: ContentSections = content ? {
    hook: { content: content.hook, source: getSectionSource('hook') },
    story: { content: content.story, source: getSectionSource('story') },
    opinion: { content: content.opinion, source: getSectionSource('opinion') },
    cta: { content: content.cta, source: getSectionSource('cta') },
  } : { hook: { content: '' }, story: { content: '' }, opinion: { content: '' }, cta: { content: '' } };

  return (
    <CreatorLayout>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link 
          href="/creator/dashboard"
          className="p-2 rounded-lg hover:bg-background-tertiary transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground-secondary" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-foreground">魔法生成</h1>
          <p className="text-sm text-foreground-secondary">AI正在为你创作内容...</p>
        </div>
      </div>

      {/* Style Selector */}
      <div className="flex gap-3 mb-6">
        {styles.map((style) => (
          <button
            key={style.value}
            onClick={() => handleStyleChange(style.value)}
            disabled={isGenerating}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all',
              currentStyle === style.value
                ? `bg-gradient-to-r ${style.color} text-white shadow-lg`
                : 'bg-background-tertiary text-foreground-secondary hover:text-foreground'
            )}
          >
            <span>{style.emoji}</span>
            <span>{style.label}</span>
          </button>
        ))}
      </div>

      {/* Generation Animation or Content */}
      <AnimatePresence mode="wait">
        {isGenerating ? (
          <motion.div
            key="generating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            {/* Magic Animation */}
            <div className="relative mb-8">
              <motion.div
                className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-accent-cyan flex items-center justify-center"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Sparkles className="w-10 h-10 text-white" />
              </motion.div>
              
              {/* Orbiting particles */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 rounded-full bg-primary-400"
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 3 + i,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    top: '50%',
                    left: '50%',
                    marginLeft: -6,
                    marginTop: -6,
                    originX: 0,
                    originY: 0,
                    x: Math.cos((i * 120 * Math.PI) / 180) * 50,
                    y: Math.sin((i * 120 * Math.PI) / 180) * 50,
                  }}
                />
              ))}
            </div>

            <h3 className="text-lg font-semibold text-foreground mb-2">
              AI正在创作中...
            </h3>
            <p className="text-sm text-foreground-secondary mb-6">
              正在匹配你的素材库，生成符合你风格的文案
            </p>

            {/* Progress Bar */}
            <div className="w-64 h-2 bg-background-tertiary rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary-500 to-accent-cyan"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-xs text-foreground-tertiary mt-2">{progress}%</p>
          </motion.div>
        ) : content ? (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Content Editor */}
            <div className="lg:col-span-2 space-y-4">
              {Object.entries(sections).map(([key, section], index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden">
                    <div className="p-4">
                      {/* Section Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className={cn("font-semibold", sectionLabels[key].color)}>
                            {sectionLabels[key].title}
                          </span>
                          {section.source && (
                            <span className="text-xs text-foreground-tertiary">
                              来源: {section.source}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          {editingSection === key ? (
                            <Button
                              size="sm"
                              variant="ghost"
                              leftIcon={<CheckCircle2 className="w-4 h-4" />}
                              onClick={() => handleSaveEdit(key)}
                            >
                              保存
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="ghost"
                              leftIcon={<Edit3 className="w-4 h-4" />}
                              onClick={() => handleEdit(key)}
                            >
                              编辑
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      {editingSection === key ? (
                        <textarea
                          value={editedContent[key] || section.content}
                          onChange={(e) => setEditedContent(prev => ({ ...prev, [key]: e.target.value }))}
                          className="w-full min-h-[100px] p-3 bg-background-tertiary rounded-lg text-foreground resize-y focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                        />
                      ) : (
                        <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                          {section.content}
                        </p>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="secondary"
                  leftIcon={<Copy className="w-4 h-4" />}
                  onClick={() => {
                    const fullText = [content.hook, content.story, content.opinion, content.cta].join('\n\n');
                    navigator.clipboard.writeText(fullText);
                  }}
                >
                  复制文案
                </Button>
                <Button
                  variant="secondary"
                  leftIcon={<Save className="w-4 h-4" />}
                >
                  保存草稿
                </Button>
                <Button
                  className="flex-1"
                  leftIcon={isPublishing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  onClick={handlePublish}
                  isLoading={isPublishing}
                >
                  提交审核
                </Button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Compliance Check */}
              <Card>
                <div className="p-4">
                  <h3 className="font-semibold text-foreground mb-3">合规检查</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground-secondary">原创度</span>
                      <span className="text-sm font-medium text-accent-green">
                        {content.compliance.originalityScore}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-background-tertiary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-accent-green rounded-full"
                        style={{ width: `${content.compliance.originalityScore}%` }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-sm text-foreground-secondary">敏感词检测</span>
                      {content.compliance.sensitiveWords && content.compliance.sensitiveWords.length > 0 ? (
                        <Badge variant="danger" size="sm">未通过</Badge>
                      ) : (
                        <Badge variant="success" size="sm">已通过</Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground-secondary">整体状态</span>
                      <Badge 
                        variant={getComplianceStatus(content.compliance).passed ? 'success' : 'warning'} 
                        size="sm"
                      >
                        {getComplianceStatus(content.compliance).label}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Tips */}
              <Card>
                <div className="p-4">
                  <h3 className="font-semibold text-foreground mb-3">优化建议</h3>
                  <ul className="space-y-2 text-sm text-foreground-secondary">
                    <li className="flex items-start gap-2">
                      <Zap className="w-4 h-4 text-accent-yellow mt-0.5 flex-shrink-0" />
                      前3秒加入具体数字，完播率可提升20%
                    </li>
                    <li className="flex items-start gap-2">
                      <Zap className="w-4 h-4 text-accent-yellow mt-0.5 flex-shrink-0" />
                      CTA部分增加互动引导，评论率会更高
                    </li>
                  </ul>
                </div>
              </Card>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </CreatorLayout>
  );
}

function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export default function CreatorGeneratePage() {
  return (
    <Suspense fallback={
      <CreatorLayout>
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </CreatorLayout>
    }>
      <GeneratePageContent />
    </Suspense>
  );
}
