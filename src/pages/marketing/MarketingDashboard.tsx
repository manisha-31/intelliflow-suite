import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Megaphone, Target, Calendar, TrendingUp, Eye, MousePointerClick, ArrowUpRight } from 'lucide-react';

const campaignPerformance = [
  { name: 'Spring Launch', impressions: 245, clicks: 18, conversions: 4.2 },
  { name: 'Thermal Range', impressions: 180, clicks: 22, conversions: 5.8 },
  { name: 'Back to School', impressions: 320, clicks: 15, conversions: 3.1 },
  { name: 'Festive Wear', impressions: 410, clicks: 28, conversions: 6.4 },
];

const channelData = [
  { name: 'Social Media', value: 38, color: 'hsl(355, 75%, 47%)' },
  { name: 'Email', value: 22, color: 'hsl(210, 60%, 50%)' },
  { name: 'Print', value: 18, color: 'hsl(43, 90%, 50%)' },
  { name: 'Retail POS', value: 22, color: 'hsl(160, 50%, 40%)' },
];

const upcomingLaunches = [
  { collection: 'Monsoon Essentials 2026', date: 'Mar 15, 2026', status: 'On Track', designs: 8 },
  { collection: 'Summer Breeze Line', date: 'Apr 01, 2026', status: 'At Risk', designs: 12 },
  { collection: 'Kids Comfort Range', date: 'Apr 20, 2026', status: 'On Track', designs: 6 },
];

const MarketingDashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Megaphone, label: 'Active Campaigns', value: '8', change: '+2 this month', color: 'text-primary' },
          { icon: Calendar, label: 'Upcoming Launches', value: '3', change: 'Next 60 days', color: 'text-info' },
          { icon: Eye, label: 'Total Impressions', value: '1.15M', change: '+18% vs last quarter', color: 'text-success' },
          { icon: MousePointerClick, label: 'Avg. CTR', value: '4.8%', change: '+0.6% improvement', color: 'text-warning' },
        ].map(kpi => (
          <Card key={kpi.label}>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-body uppercase tracking-wider">{kpi.label}</p>
                  <p className={`text-2xl font-bold font-heading mt-1 ${kpi.color}`}>{kpi.value}</p>
                  <p className="text-xs text-muted-foreground font-body mt-1">{kpi.change}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <kpi.icon className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Campaign Performance + Channel Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-heading">Campaign Performance (K)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={campaignPerformance} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 18%, 18%)" />
                  <XAxis dataKey="name" stroke="hsl(0, 0%, 55%)" fontSize={10} />
                  <YAxis stroke="hsl(0, 0%, 55%)" fontSize={11} />
                  <Tooltip contentStyle={{ background: 'hsl(220, 22%, 10%)', border: '1px solid hsl(220, 18%, 18%)', borderRadius: '8px', color: '#fff', fontSize: 12 }} />
                  <Bar dataKey="impressions" fill="hsl(355, 75%, 47%)" radius={[3, 3, 0, 0]} name="Impressions (K)" />
                  <Bar dataKey="clicks" fill="hsl(210, 60%, 50%)" radius={[3, 3, 0, 0]} name="Clicks (K)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-heading">Channel Mix</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[150px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={channelData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" stroke="none">
                    {channelData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'hsl(220, 22%, 10%)', border: '1px solid hsl(220, 18%, 18%)', borderRadius: '8px', color: '#fff', fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1.5 mt-2">
              {channelData.map(c => (
                <div key={c.name} className="flex items-center gap-2 text-xs font-body">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
                  <span className="text-muted-foreground">{c.name}</span>
                  <span className="ml-auto text-foreground font-semibold">{c.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Launches */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-heading">Upcoming Collection Launches</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingLaunches.map(l => (
              <div key={l.collection} className="flex items-center gap-4 p-3 rounded-lg bg-muted/40">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground font-body">{l.collection}</p>
                  <p className="text-xs text-muted-foreground font-body">{l.designs} designs · Launch: {l.date}</p>
                </div>
                <Badge variant={l.status === 'On Track' ? 'default' : 'destructive'} className="text-xs">
                  {l.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketingDashboard;