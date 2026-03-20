'use client';

import { useState, useEffect } from 'react';
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
  ExternalLink,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { IP } from '@/types';
import { api } from '@/lib/api';

// 统计为占位（后端暂无内容/素材数接口）
const statsData: Record<string, { content: number; assets: number; lastActive: string }> = {};

export default function IPManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [ips, setIps] = useState<IP[]>([]);
  const [loading, setLoading] = useState(true);
  const [createName, setCreateName] = useState('');
  const [createIpId, setCreateIpId] = useState('');
  const [createOwnerId, setCreateOwnerId] = useState('admin');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const list = await api.listIPs();
        setIps(list);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredIPs = ips.filter(ip => 
    ip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ip.ip_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateIP = async () => {
    const name = createName.trim();
    const ip_id = createIpId.trim();
    const owner_user_id = createOwnerId.trim();
    if (!name || !ip_id || !owner_user_id) {
      setCreateError('请填写 IP 名称、IP ID 和负责人 ID');
      return;
    }
    setCreating(true);
    setCreateError('');
    try {
      await api.createIP({ ip_id, name, owner_user_id, status: 'active' });
      const list = await api.listIPs();
      setIps(list);
      setShowCreateModal(false);
      setCreateName('');
      setCreateIpId('');
    } catch (e: any) {
      setCreateError(e.response?.data?.detail || (e as Error).message || '创建失败');
    } finally {
      setCreating(false);
    }
  };

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
      {loading ? (
        <div className="flex items-center justify-center py-12 gap-2 text-foreground-secondary">
          <Loader2 className="w-5 h-5 animate-spin" /> 加载中...
        </div>
      ) : (
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
      )}

      {/* Empty state */}
      {!loading && filteredIPs.length === 0 && (
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

      {/* Create IP Modal */}
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
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
              />
              <Input 
                label="IP ID" 
                placeholder="例如：zhangkai_001"
                helper="唯一标识符，创建后不可修改"
                value={createIpId}
                onChange={(e) => setCreateIpId(e.target.value)}
              />
              <Input 
                label="负责人 ID" 
                placeholder="例如：admin"
                helper="归属运营/管理账号"
                value={createOwnerId}
                onChange={(e) => setCreateOwnerId(e.target.value)}
              />
              {createError && (
                <p className="text-sm text-accent-red">{createError}</p>
              )}
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="ghost" onClick={() => { setShowCreateModal(false); setCreateError(''); }} disabled={creating}>
                  取消
                </Button>
                <Button onClick={handleCreateIP} disabled={creating} leftIcon={creating ? <Loader2 className="w-4 h-4 animate-spin" /> : undefined}>
                  {creating ? '创建中...' : '创建'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </MainLayout>
  );
}
