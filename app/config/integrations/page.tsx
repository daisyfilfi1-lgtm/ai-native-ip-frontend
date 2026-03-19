'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { 
  Cloud,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Save,
  RefreshCw,
  BookOpen,
  ChevronRight,
  Shield,
  Database
} from 'lucide-react';

interface FeishuConfig {
  app_id: string;
  app_secret: string;
  is_configured: boolean;
  last_tested?: string;
  status?: 'connected' | 'error' | 'unknown';
}

export default function IntegrationsConfigPage() {
  const [feishuConfig, setFeishuConfig] = useState<FeishuConfig>({
    app_id: '',
    app_secret: '',
    is_configured: false,
    status: 'unknown'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  // 模拟加载现有配置
  useEffect(() => {
    // 这里应该调用 API 获取现有配置
    // GET /api/v1/config/integrations/feishu
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    setMessage(null);
    
    try {
      // 调用后端 API 保存配置
      // POST /api/v1/config/integrations/feishu
      // Body: { app_id, app_secret }
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟 API 调用
      
      setFeishuConfig(prev => ({ ...prev, is_configured: true }));
      setMessage({ type: 'success', text: '飞书凭证保存成功！' });
    } catch (error) {
      setMessage({ type: 'error', text: '保存失败，请检查凭证是否正确' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTest = async () => {
    setIsTesting(true);
    setMessage(null);
    
    try {
      // 调用后端 API 测试连接
      // GET /api/v1/integrations/feishu/spaces
      
      await new Promise(resolve => setTimeout(resolve, 1500)); // 模拟 API 调用
      
      setFeishuConfig(prev => ({ 
        ...prev, 
        status: 'connected',
        last_tested: new Date().toISOString()
      }));
      setMessage({ type: 'success', text: '连接测试成功！可以访问飞书知识库' });
    } catch (error) {
      setFeishuConfig(prev => ({ ...prev, status: 'error' }));
      setMessage({ type: 'error', text: '连接测试失败，请检查凭证和权限' });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <MainLayout title="集成配置中心">
      {/* Header */}
      <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-accent-blue/10 via-primary-500/10 to-accent-cyan/10 border border-accent-blue/20">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-blue to-primary-500 flex items-center justify-center">
            <Cloud className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-foreground">第三方集成配置</h2>
            <p className="text-foreground-secondary">管理 AI-Native IP 与外部服务的连接配置</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="feishu" className="w-full">
        <TabsList>
          <TabsTrigger value="feishu" className="gap-2">
            <BookOpen className="w-4 h-4" />
            飞书知识库
            {feishuConfig.is_configured && (
              <Badge variant="success" size="sm" dot />
            )}
          </TabsTrigger>
          <TabsTrigger value="ai" className="gap-2" disabled>
            <Database className="w-4 h-4" />
            AI 模型
            <Badge variant="default" size="sm">即将推出</Badge>
          </TabsTrigger>
          <TabsTrigger value="storage" className="gap-2" disabled>
            <Shield className="w-4 h-4" />
            存储服务
            <Badge variant="default" size="sm">即将推出</Badge>
          </TabsTrigger>
        </TabsList>

        {/* Feishu Integration */}
        <TabsContent value="feishu">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Configuration Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader 
                  title="飞书开放平台配置" 
                  description="输入飞书企业自建应用的凭证"
                />
                <div className="space-y-4">
                  {/* Status Banner */}
                  {feishuConfig.status === 'connected' && (
                    <div className="p-4 rounded-xl bg-accent-green/10 border border-accent-green/20 flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-accent-green" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-accent-green">连接正常</p>
                        <p className="text-xs text-accent-green/80">
                          上次测试: {feishuConfig.last_tested ? new Date(feishuConfig.last_tested).toLocaleString('zh-CN') : '刚刚'}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {feishuConfig.status === 'error' && (
                    <div className="p-4 rounded-xl bg-accent-red/10 border border-accent-red/20 flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-accent-red" />
                      <div>
                        <p className="text-sm font-medium text-accent-red">连接失败</p>
                        <p className="text-xs text-accent-red/80">请检查凭证和权限配置</p>
                      </div>
                    </div>
                  )}

                  {/* App ID */}
                  <Input
                    label="App ID"
                    placeholder="cli_xxxxxxxxxxxx"
                    value={feishuConfig.app_id}
                    onChange={(e) => setFeishuConfig(prev => ({ ...prev, app_id: e.target.value }))}
                    helper="从飞书开放平台「凭证与基础信息」中获取"
                  />

                  {/* App Secret */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      App Secret
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        placeholder="输入 App Secret"
                        value={feishuConfig.app_secret}
                        onChange={(e) => setFeishuConfig(prev => ({ ...prev, app_secret: e.target.value }))}
                        className="w-full bg-background-tertiary border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20"
                      />
                    </div>
                    <p className="mt-1.5 text-sm text-foreground-tertiary">
                      凭证将安全存储在服务器，不会在前端显示
                    </p>
                  </div>

                  {/* Message */}
                  {message && (
                    <div className={`p-3 rounded-xl ${
                      message.type === 'success' 
                        ? 'bg-accent-green/10 border border-accent-green/20 text-accent-green' 
                        : 'bg-accent-red/10 border border-accent-red/20 text-accent-red'
                    }`}>
                      {message.text}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button 
                      className="flex-1"
                      onClick={handleSave}
                      isLoading={isLoading}
                      leftIcon={<Save className="w-4 h-4" />}
                    >
                      保存配置
                    </Button>
                    <Button 
                      variant="secondary"
                      onClick={handleTest}
                      isLoading={isTesting}
                      disabled={!feishuConfig.app_id || !feishuConfig.app_secret}
                      leftIcon={<RefreshCw className="w-4 h-4" />}
                    >
                      测试连接
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader title="快捷操作" description="配置完成后的常用功能" />
                <div className="grid grid-cols-2 gap-3">
                  <a 
                    href="https://open.feishu.cn/app" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-4 rounded-xl bg-background-tertiary hover:bg-background-elevated transition-colors group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <ExternalLink className="w-5 h-5 text-foreground-secondary group-hover:text-primary-400" />
                      <ChevronRight className="w-4 h-4 text-foreground-muted" />
                    </div>
                    <p className="text-sm font-medium text-foreground">飞书开放平台</p>
                    <p className="text-xs text-foreground-tertiary mt-1">管理应用和权限</p>
                  </a>
                  
                  <button 
                    className="p-4 rounded-xl bg-background-tertiary hover:bg-background-elevated transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!feishuConfig.is_configured}
                    onClick={() => window.location.href = '/agents/memory?tab=feishu'}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <BookOpen className="w-5 h-5 text-foreground-secondary" />
                      <ChevronRight className="w-4 h-4 text-foreground-muted" />
                    </div>
                    <p className="text-sm font-medium text-foreground">知识库同步</p>
                    <p className="text-xs text-foreground-tertiary mt-1">开始同步文档</p>
                  </button>
                </div>
              </Card>
            </div>

            {/* Setup Guide */}
            <div className="space-y-6">
              <Card>
                <CardHeader title="配置指南" description="三步完成飞书集成" />
                <div className="space-y-4">
                  {[
                    {
                      step: 1,
                      title: '创建应用',
                      desc: '在飞书开放平台创建企业自建应用',
                      link: 'https://open.feishu.cn/app',
                      linkText: '去创建'
                    },
                    {
                      step: 2,
                      title: '开通权限',
                      desc: '开通 wiki:space:read、wiki:node:read 权限',
                    },
                    {
                      step: 3,
                      title: '授权访问',
                      desc: '将应用添加为知识库成员（可读权限）',
                    }
                  ].map((item) => (
                    <div key={item.step} className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-foreground">{item.title}</h4>
                        <p className="text-xs text-foreground-tertiary mt-0.5">{item.desc}</p>
                        {item.link && (
                          <a 
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary-400 hover:text-primary-300 mt-1 inline-block"
                          >
                            {item.linkText} →
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <CardHeader title="帮助文档" description="常见问题解答" />
                <div className="space-y-3">
                  {[
                    { q: '如何获取 App ID 和 Secret？', a: '飞书开放平台 → 凭证与基础信息' },
                    { q: '同步失败怎么办？', a: '检查权限和应用是否已添加为知识库成员' },
                    { q: '支持哪些文档类型？', a: '目前支持 doc 和 docx 格式' },
                  ].map((faq, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-background-tertiary">
                      <p className="text-sm font-medium text-foreground">{faq.q}</p>
                      <p className="text-xs text-foreground-secondary mt-1">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
