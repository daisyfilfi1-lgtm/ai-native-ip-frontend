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
    <MainLayout title="Analytics Agent">
      <div className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-purple-500/10 to-cyan-600/10 border border-purple-500/20">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-600 flex items-center justify-center text-2xl">
            📊
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-foreground">Analytics Agent</h2>
            <p className="text-foreground-secondary">Automated data attribution and strategy iteration</p>
          </div>
          <Badge variant="default" dot>Not Started</Badge>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="attribution">Attribution</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="config">Config</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <p className="text-2xs text-foreground-tertiary uppercase">Total Views</p>
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
                  <p className="text-2xs text-foreground-tertiary uppercase">Likes</p>
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
                  <p className="text-2xs text-foreground-tertiary uppercase">Comments</p>
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
                  <p className="text-2xs text-foreground-tertiary uppercase">Shares</p>
                  <p className="text-xl font-bold text-foreground">856</p>
                </div>
              </div>
            </Card>
          </div>

          <Card>
            <CardHeader title="Trends" description="Last 7 days views" />
            <div className="h-64 flex items-center justify-center bg-background-tertiary rounded-xl">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-2 text-foreground-tertiary" />
                <p className="text-sm text-foreground-secondary">Chart will be displayed here</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="attribution">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader title="Success Factors" description="What makes content successful" />
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-accent-green/10 border border-accent-green/20">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-accent-green" />
                    <span className="font-medium text-accent-green">Analysis</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground">Topic Appeal</span>
                      <Badge variant="success" size="sm">35%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground">First 3s Hook</span>
                      <Badge variant="success" size="sm">25%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground">Content Quality</span>
                      <Badge variant="success" size="sm">20%</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader title="Improvement Suggestions" description="How to improve low-performing content" />
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-accent-red/10 border border-accent-red/20">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="w-5 h-5 text-accent-red" />
                    <span className="font-medium text-accent-red">Suggestions</span>
                  </div>
                  <ul className="space-y-2 text-sm text-foreground-secondary">
                    <li>Improve the opening hook to grab attention</li>
                    <li>Keep video length under 45 seconds</li>
                    <li>Add more emotional turning points</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader 
              title="Weekly Reports" 
              description="Automated data analysis reports"
              action={<Button size="sm" leftIcon={<Download className="w-4 h-4" />}>Export</Button>}
            />
            <div className="space-y-3">
              {[
                { week: 'Week 11, 2026', date: '2026-03-10', views: '125K' },
                { week: 'Week 10, 2026', date: '2026-03-03', views: '98K' },
                { week: 'Week 9, 2026', date: '2026-02-24', views: '86K' },
              ].map((report, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-background-tertiary">
                  <div>
                    <h4 className="font-medium text-foreground">{report.week}</h4>
                    <p className="text-xs text-foreground-tertiary">Generated: {report.date}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-foreground-secondary">Views: {report.views}</span>
                    <Badge variant="success" size="sm">Generated</Badge>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="config">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader title="Viral Definition" description="What counts as viral" />
              <div className="space-y-4">
                <Select
                  label="View Threshold"
                  options={[
                    { value: '10w', label: '> 100K' },
                    { value: 'fans3x', label: '> Fans x 3' },
                    { value: 'custom', label: 'Custom' },
                  ]}
                />
              </div>
            </Card>

            <Card>
              <CardHeader title="Alert Thresholds" description="When to send alerts" />
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-foreground">CPA Alert</span>
                    <span className="text-sm font-medium text-foreground">{'> ¥100'}</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="500"
                    defaultValue="100"
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
