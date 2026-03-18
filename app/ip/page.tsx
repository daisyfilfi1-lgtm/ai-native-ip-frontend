'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { 
  Plus, 
  Search, 
  Users, 
  FileText, 
  Settings,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { IP } from '@/types';

// Mock data
const mockIPs: IP[] = [
  { 
    ip_id: 'zhangkai_001', 
    name: '张凯', 
    owner_user_id: 'user_001',
    status: 'active',
    created_at: '2026-03-01T00:00:00Z',
    updated_at: '2026-03-18T00:00:00Z',
  },
  { 
    ip_id: 'lina_002', 
    name: '李娜', 
    owner_user_id: 'user_002',
    status: 'active',
    created_at: '2026-03-05T00:00:00Z',
    updated_at: '2026-03-17T00:00:00Z',
  },
  { 
    ip_id: 'wanghao_003', 
    name: '王浩', 
    owner_user_id: 'user_003',
    status: 'inactive',
    created_at: '2026-03-10T00:00:00Z',
    updated_at: '2026-03-15T00:00:00Z',
  },
];

const statsData: Record<string, { content: number; assets: number; lastActive: string }> = {
  'zhangkai_001': { content: 1245, assets: 86, lastActive: '10分钟前' },
  'lina_002': { content: 892, assets: 64, lastActive: '1小时前' },
  'wanghao_003': { content: 456, assets: 32, lastActive: '3天前' },
};

export default function IPManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredIPs = mockIPs.filter(ip => 
    ip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ip.ip_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout title="IP管理">
      {/* Header actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-tertiary" />
          <Input
            placeholder="搜索IP名称或ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button 
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setShowCreateModal(true)}
        >
          新建IP
        </Button>
      </div>

      {/* IP Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredIPs.map((ip) => {
          const stats = statsData[ip.ip_id] || { content: 0, assets: 0, lastActive: '-' };
          
          return (
            <Card key={ip.ip_id} hover className="group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-cyan flex items-center justify-center text-white font-bold text-lg">
                    {ip.name[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{ip.name}</h3>
                    <p className="text-xs text-foreground-tertiary font-mono">{ip.ip_id}</p>
                  </div>
                </div>
                <Badge 
                  variant={ip.status === 'active' ? 'success' : 'default'}
                  dot
                >
                  {ip.status === 'active' ? '活跃' : '停用'}
                </Badge>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="p-3 rounded-lg bg-background-tertiary">
                  <div className="flex items-center gap-1.5 text-foreground-tertiary mb-1">
                    <FileText className="w-3.5 h-3.5" />
                    <span className="text-2xs">内容</span>
                  </div>
                  <p className="text-lg font-semibold text-foreground">{stats.content}</p>
                </div>
                <div className="p-3 rounded-lg bg-background-tertiary">
                  <div className="flex items-center gap-1.5 text-foreground-tertiary mb-1">
                    <Users className="w-3.5 h-3.5" />
                    <span className="text-2xs">素材</span>
                  </div>
                  <p className="text-lg font-semibold text-foreground">{stats.assets}</p>
                </div>
                <div className="p-3 rounded-lg bg-background-tertiary">
                  <div className="flex items-center gap-1.5 text-foreground-tertiary mb-1">
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span className="text-2xs">活跃</span>
                  </div>
                  <p className="text-sm font-medium text-foreground">{stats.lastActive}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Link href={`/ip/${ip.ip_id}`} className="flex-1">
                  <Button variant="secondary" size="sm" className="w-full">
                    详情
                  </Button>
                </Link>
                <Link href={`/agents/memory?ip=${ip.ip_id}`}>
                  <Button variant="ghost" size="sm">
                    素材
                  </Button>
                </Link>
                <Link href={`/config?ip=${ip.ip_id}`}>
                  <Button variant="ghost" size="sm">
                    配置
                  </Button>
                </Link>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Empty state */}
      {filteredIPs.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-background-tertiary flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-foreground-tertiary" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">暂无IP</h3>
          <p className="text-sm text-foreground-secondary mb-4">
            创建您的第一个IP开始内容生产
          </p>
          <Button onClick={() => setShowCreateModal(true)} leftIcon={<Plus className="w-4 h-4" />}>
            新建IP
          </Button>
        </div>
      )}

      {/* Create IP Modal (simplified) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-md">
            <CardHeader 
              title="新建IP" 
              description="创建一个新的IP进行管理"
            />
            <div className="space-y-4">
              <Input 
                label="IP名称" 
                placeholder="例如：张凯"
                helper="输入IP的显示名称"
              />
              <Input 
                label="IP ID" 
                placeholder="例如：zhangkai_001"
                helper="唯一标识符，创建后不可修改"
              />
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="ghost" onClick={() => setShowCreateModal(false)}>
                  取消
                </Button>
                <Button onClick={() => setShowCreateModal(false)}>
                  创建
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </MainLayout>
  );
}
