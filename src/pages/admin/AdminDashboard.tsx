import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart
} from 'recharts';
import {
  TrendingUp, TrendingDown, Package, ShoppingCart, Palette, Users,
  IndianRupee, Factory, Truck, AlertTriangle, CheckCircle, Clock,
  ArrowUpRight, ArrowDownRight
} from 'lucide-react';

const revenueData = [
  { month: 'Aug', revenue: 42, target: 45 },
  { month: 'Sep', revenue: 48, target: 47 },
  { month: 'Oct', revenue: 55, target: 50 },
  { month: 'Nov', revenue: 52, target: 53 },
  { month: 'Dec', revenue: 68, target: 58 },
  { month: 'Jan', revenue: 72, target: 62 },
  { month: 'Feb', revenue: 78, target: 65 },
];

const orderStatusData = [
  { name: 'Delivered', value: 340, color: 'hsl(160, 50%, 40%)' },
  { name: 'In Transit', value: 125, color: 'hsl(210, 60%, 50%)' },
  { name: 'Processing', value: 85, color: 'hsl(43, 90%, 50%)' },
  { name: 'Pending', value: 45, color: 'hsl(355, 75%, 47%)' },
];

const productionData = [
  { week: 'W1', cutting: 120, sewing: 95, finishing: 80, dispatch: 65 },
  { week: 'W2', cutting: 135, sewing: 110, finishing: 92, dispatch: 78 },
  { week: 'W3', cutting: 148, sewing: 125, finishing: 105, dispatch: 90 },
  { week: 'W4', cutting: 160, sewing: 140, finishing: 118, dispatch: 102 },
];

const designPipeline = [
  { stage: 'Concept', count: 12 },
  { stage: 'Review', count: 8 },
  { stage: 'Sampling', count: 5 },
  { stage: 'Approved', count: 18 },
  { stage: 'Production', count: 14 },
];

const recentActivity = [
  { action: 'New design "Summer Breeze V3" submitted', user: 'Priya Sharma', time: '12 min ago', type: 'design' },
  { action: 'Production order #PO-2847 completed', user: 'Factory Unit B', time: '34 min ago', type: 'production' },
  { action: 'Campaign "Spring Launch 2026" approved', user: 'Rahul Mehta', time: '1 hr ago', type: 'campaign' },
  { action: 'Distributor order #DO-1923 dispatched', user: 'Logistics Team', time: '2 hrs ago', type: 'order' },
  { action: 'Collection "Monsoon Essentials" created', user: 'Anita Desai', time: '3 hrs ago', type: 'collection' },
  { action: 'BOM materials flagged low stock', user: 'System Alert', time: '4 hrs ago', type: 'alert' },
];

const topProducts = [
  { name: 'Arctic Thermals Pro', category: 'Thermals', units: 2840, revenue: '₹14.2L', growth: 12.5 },
  { name: 'Eco Comfort Briefs', category: 'Innerwear', units: 3420, revenue: '₹10.3L', growth: 8.2 },
  { name: 'Sport Flex Socks', category: 'Socks', units: 5100, revenue: '₹7.7L', growth: -3.1 },
  { name: 'Heritage Classic Vest', category: 'Vests', units: 1950, revenue: '₹9.8L', growth: 15.7 },
];

const KpiCard = ({ icon: Icon, label, value, change, changeType, subtitle }: any) => (
  <Card className="relative overflow-hidden">
    <CardContent className="pt-5 pb-4">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground font-body uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-bold font-heading text-foreground">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground font-body">{subtitle}</p>}
        </div>
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>
      {change !== undefined && (
        <div className={`flex items-center gap-1 mt-2 text-xs font-body ${changeType === 'up' ? 'text-success' : 'text-destructive'}`}>
          {changeType === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          <span>{change}% vs last month</span>
        </div>
      )}
    </CardContent>
  </Card>
);

const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={IndianRupee} label="Total Revenue" value="₹78.4L" change={8.7} changeType="up" subtitle="FY 2025-26 YTD" />
        <KpiCard icon={ShoppingCart} label="Total Orders" value="595" change={12.3} changeType="up" subtitle="This quarter" />
        <KpiCard icon={Palette} label="Active Designs" value="57" change={5.2} changeType="up" subtitle="Across 6 collections" />
        <KpiCard icon={Factory} label="Production Units" value="12,480" change={3.1} changeType="down" subtitle="Monthly output" />
      </div>

      {/* Revenue + Order Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-heading">Revenue vs Target (₹ Lakhs)</CardTitle>
              <Badge variant="outline" className="text-xs font-body">Last 7 Months</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(355, 75%, 47%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(355, 75%, 47%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 18%, 18%)" />
                  <XAxis dataKey="month" stroke="hsl(0, 0%, 55%)" fontSize={11} />
                  <YAxis stroke="hsl(0, 0%, 55%)" fontSize={11} />
                  <Tooltip contentStyle={{ background: 'hsl(220, 22%, 10%)', border: '1px solid hsl(220, 18%, 18%)', borderRadius: '8px', color: '#fff', fontSize: 12 }} />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(355, 75%, 47%)" fill="url(#revGrad)" strokeWidth={2} />
                  <Line type="monotone" dataKey="target" stroke="hsl(0, 0%, 45%)" strokeDasharray="5 5" strokeWidth={1.5} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-heading">Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={orderStatusData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" stroke="none">
                    {orderStatusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'hsl(220, 22%, 10%)', border: '1px solid hsl(220, 18%, 18%)', borderRadius: '8px', color: '#fff', fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {orderStatusData.map(s => (
                <div key={s.name} className="flex items-center gap-2 text-xs font-body">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                  <span className="text-muted-foreground">{s.name}</span>
                  <span className="ml-auto text-foreground font-semibold">{s.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Production + Design Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-heading">Production Pipeline (Weekly)</CardTitle>
              <Badge variant="outline" className="text-xs font-body">Feb 2026</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productionData} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 18%, 18%)" />
                  <XAxis dataKey="week" stroke="hsl(0, 0%, 55%)" fontSize={11} />
                  <YAxis stroke="hsl(0, 0%, 55%)" fontSize={11} />
                  <Tooltip contentStyle={{ background: 'hsl(220, 22%, 10%)', border: '1px solid hsl(220, 18%, 18%)', borderRadius: '8px', color: '#fff', fontSize: 12 }} />
                  <Bar dataKey="cutting" fill="hsl(355, 75%, 47%)" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="sewing" fill="hsl(210, 60%, 50%)" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="finishing" fill="hsl(43, 90%, 50%)" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="dispatch" fill="hsl(160, 50%, 40%)" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs font-body text-muted-foreground justify-center">
              {[{ l: 'Cutting', c: 'hsl(355,75%,47%)' }, { l: 'Sewing', c: 'hsl(210,60%,50%)' }, { l: 'Finishing', c: 'hsl(43,90%,50%)' }, { l: 'Dispatch', c: 'hsl(160,50%,40%)' }].map(x => (
                <div key={x.l} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: x.c }} />
                  {x.l}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-heading">Design Pipeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {designPipeline.map(stage => (
              <div key={stage.stage} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-body">
                  <span className="text-muted-foreground">{stage.stage}</span>
                  <span className="text-foreground font-semibold">{stage.count}</span>
                </div>
                <Progress value={(stage.count / 20) * 100} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Top Products + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-heading">Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topProducts.map((p, i) => (
                <div key={p.name} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/40">
                  <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-xs font-bold text-primary font-mono-data">
                    #{i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground font-body truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground font-body">{p.category} · {p.units.toLocaleString()} units</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground font-mono-data">{p.revenue}</p>
                    <div className={`flex items-center justify-end gap-0.5 text-xs ${p.growth > 0 ? 'text-success' : 'text-destructive'}`}>
                      {p.growth > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      <span className="font-mono-data">{Math.abs(p.growth)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-heading">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    a.type === 'design' ? 'bg-primary' :
                    a.type === 'production' ? 'bg-success' :
                    a.type === 'campaign' ? 'bg-info' :
                    a.type === 'alert' ? 'bg-warning' : 'bg-muted-foreground'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground font-body leading-tight">{a.action}</p>
                    <p className="text-xs text-muted-foreground font-body mt-0.5">{a.user} · {a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Status Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-success/30 bg-success/5">
          <CardContent className="pt-4 pb-3 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-success" />
            <div>
              <p className="text-sm font-semibold text-foreground font-body">18 Designs Approved</p>
              <p className="text-xs text-muted-foreground font-body">Ready for production</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-warning/30 bg-warning/5">
          <CardContent className="pt-4 pb-3 flex items-center gap-3">
            <Clock className="w-5 h-5 text-warning" />
            <div>
              <p className="text-sm font-semibold text-foreground font-body">5 Orders Delayed</p>
              <p className="text-xs text-muted-foreground font-body">Requires attention</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="pt-4 pb-3 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <div>
              <p className="text-sm font-semibold text-foreground font-body">3 BOM Items Low Stock</p>
              <p className="text-xs text-muted-foreground font-body">Reorder needed</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;