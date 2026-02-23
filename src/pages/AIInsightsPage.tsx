import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Brain, TrendingUp, TrendingDown, Lightbulb, Target, Zap, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const demandForecast = [
  { month: 'Mar', innerwear: 45, thermals: 12, socks: 28, vests: 18 },
  { month: 'Apr', innerwear: 48, thermals: 5, socks: 30, vests: 20 },
  { month: 'May', innerwear: 52, thermals: 3, socks: 35, vests: 22 },
  { month: 'Jun', innerwear: 55, thermals: 2, socks: 32, vests: 24 },
  { month: 'Jul', innerwear: 50, thermals: 2, socks: 28, vests: 20 },
  { month: 'Aug', innerwear: 48, thermals: 8, socks: 30, vests: 22 },
];

const aiRecommendations = [
  { title: 'Increase Thermal Production for Q4', confidence: 92, impact: 'High', type: 'demand', desc: 'Historical data shows 40% demand surge Oct-Dec. Recommend starting production 6 weeks early to avoid stockouts.', trend: 'up' },
  { title: 'Eco-Fabric Shift — Cotton to Bamboo', confidence: 78, impact: 'Medium', type: 'trend', desc: 'Consumer sentiment analysis shows 65% preference growth for sustainable materials. Bamboo blend reduces cost by 8%.', trend: 'up' },
  { title: 'Reduce Kids Range SKU Count', confidence: 85, impact: 'Medium', type: 'optimization', desc: '30% of Kids SKUs contribute only 5% revenue. Consolidating to top performers could improve margins by ₹2.1L/quarter.', trend: 'down' },
  { title: 'North Zone Distribution Gap', confidence: 88, impact: 'High', type: 'supply', desc: 'Demand exceeds supply by 18% in UP/Rajasthan. Adding one distributor could capture ₹8L additional quarterly revenue.', trend: 'up' },
  { title: 'Social Media ROI Declining on Print Ads', confidence: 71, impact: 'Low', type: 'marketing', desc: 'Print campaign CTR dropped 35% YoY while social media CTR grew 22%. Consider reallocating 40% of print budget.', trend: 'down' },
];

const trendAnalysis = [
  { category: 'Innerwear Briefs', trend: '+12%', direction: 'up', season: 'Year-round' },
  { category: 'Thermal Sets', trend: '+28%', direction: 'up', season: 'Oct — Feb' },
  { category: 'Cotton Vests', trend: '-5%', direction: 'down', season: 'Year-round' },
  { category: 'Athletic Socks', trend: '+18%', direction: 'up', season: 'Year-round' },
  { category: 'Camisoles', trend: '+8%', direction: 'up', season: 'Mar — Aug' },
  { category: 'Kids Innerwear', trend: '+22%', direction: 'up', season: 'Year-round' },
];

const typeColor: Record<string, string> = {
  demand: 'bg-primary/10 text-primary',
  trend: 'bg-info/10 text-info',
  optimization: 'bg-warning/10 text-warning',
  supply: 'bg-success/10 text-success',
  marketing: 'bg-muted text-muted-foreground',
};

const AIInsightsPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Brain className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-heading text-foreground">AI Insights</h3>
          <p className="text-xs text-muted-foreground font-body">Powered by predictive analytics · Last updated 2 hours ago</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Lightbulb, label: 'Active Insights', value: '5' },
          { icon: Target, label: 'Avg. Confidence', value: '83%' },
          { icon: Zap, label: 'Revenue Impact', value: '₹12.4L' },
          { icon: Brain, label: 'Models Running', value: '3' },
        ].map(k => (
          <Card key={k.label}>
            <CardContent className="pt-4 pb-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <k.icon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-body">{k.label}</p>
                <p className="text-lg font-bold font-heading text-foreground">{k.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Demand Forecast Chart */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-heading">6-Month Demand Forecast (K Units)</CardTitle>
            <Badge variant="outline" className="text-xs font-body">AI Predicted</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={demandForecast}>
                <defs>
                  <linearGradient id="innerGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(355, 75%, 47%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(355, 75%, 47%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 18%, 18%)" />
                <XAxis dataKey="month" stroke="hsl(0, 0%, 55%)" fontSize={11} />
                <YAxis stroke="hsl(0, 0%, 55%)" fontSize={11} />
                <Tooltip contentStyle={{ background: 'hsl(220, 22%, 10%)', border: '1px solid hsl(220, 18%, 18%)', borderRadius: '8px', color: '#fff', fontSize: 12 }} />
                <Area type="monotone" dataKey="innerwear" stroke="hsl(355, 75%, 47%)" fill="url(#innerGrad)" strokeWidth={2} name="Innerwear" />
                <Area type="monotone" dataKey="socks" stroke="hsl(210, 60%, 50%)" fill="none" strokeWidth={1.5} name="Socks" />
                <Area type="monotone" dataKey="vests" stroke="hsl(43, 90%, 50%)" fill="none" strokeWidth={1.5} name="Vests" />
                <Area type="monotone" dataKey="thermals" stroke="hsl(160, 50%, 40%)" fill="none" strokeWidth={1.5} name="Thermals" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-3 text-xs font-body text-muted-foreground">
            {[{ l: 'Innerwear', c: 'hsl(355,75%,47%)' }, { l: 'Socks', c: 'hsl(210,60%,50%)' }, { l: 'Vests', c: 'hsl(43,90%,50%)' }, { l: 'Thermals', c: 'hsl(160,50%,40%)' }].map(x => (
              <div key={x.l} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: x.c }} />
                {x.l}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-heading">AI Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {aiRecommendations.map(r => (
            <div key={r.title} className="p-3 rounded-lg bg-muted/40 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-foreground font-body">{r.title}</p>
                    <Badge className={`text-[10px] ${typeColor[r.type]}`}>{r.type}</Badge>
                    <Badge variant={r.impact === 'High' ? 'destructive' : 'outline'} className="text-[10px]">{r.impact} Impact</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground font-body mt-1">{r.desc}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className={`flex items-center gap-1 text-sm font-bold ${r.trend === 'up' ? 'text-success' : 'text-destructive'}`}>
                    {r.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  </div>
                  <div className="mt-1">
                    <p className="text-xs text-muted-foreground font-body">Confidence</p>
                    <p className="text-sm font-bold font-mono-data text-foreground">{r.confidence}%</p>
                  </div>
                </div>
              </div>
              <Progress value={r.confidence} className="h-1" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Category Trends */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-heading">Category Trend Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {trendAnalysis.map(t => (
              <div key={t.category} className="p-3 rounded-lg bg-muted/40 flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${t.direction === 'up' ? 'bg-success/10' : 'bg-destructive/10'}`}>
                  {t.direction === 'up' ? <TrendingUp className="w-4 h-4 text-success" /> : <TrendingDown className="w-4 h-4 text-destructive" />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground font-body">{t.category}</p>
                  <p className="text-xs text-muted-foreground font-body">{t.season}</p>
                </div>
                <span className={`ml-auto text-sm font-bold font-mono-data ${t.direction === 'up' ? 'text-success' : 'text-destructive'}`}>{t.trend}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIInsightsPage;