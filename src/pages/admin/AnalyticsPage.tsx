import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { BarChart3, TrendingUp, IndianRupee, Package, Palette, ShoppingCart } from 'lucide-react';

const revenueByCategory = [
  { category: 'Innerwear', revenue: 32.5 },
  { category: 'Thermals', revenue: 18.2 },
  { category: 'Vests', revenue: 14.8 },
  { category: 'Socks', revenue: 9.5 },
  { category: 'Camisoles', revenue: 7.2 },
  { category: 'Kids', revenue: 5.1 },
];

const monthlyRevenue = [
  { month: 'Apr', fy25: 35, fy26: 42 },
  { month: 'May', fy25: 38, fy26: 45 },
  { month: 'Jun', fy25: 32, fy26: 48 },
  { month: 'Jul', fy25: 40, fy26: 52 },
  { month: 'Aug', fy25: 42, fy26: 55 },
  { month: 'Sep', fy25: 48, fy26: 58 },
  { month: 'Oct', fy25: 55, fy26: 62 },
  { month: 'Nov', fy25: 50, fy26: 68 },
  { month: 'Dec', fy25: 65, fy26: 72 },
  { month: 'Jan', fy25: 58, fy26: 78 },
  { month: 'Feb', fy25: 52, fy26: 82 },
];

const regionData = [
  { name: 'North', value: 35, color: 'hsl(355, 75%, 47%)' },
  { name: 'South', value: 28, color: 'hsl(210, 60%, 50%)' },
  { name: 'West', value: 22, color: 'hsl(43, 90%, 50%)' },
  { name: 'East', value: 15, color: 'hsl(160, 50%, 40%)' },
];

const designEfficiency = [
  { month: 'Sep', submitted: 12, approved: 8, toProduction: 6 },
  { month: 'Oct', submitted: 15, approved: 11, toProduction: 9 },
  { month: 'Nov', submitted: 10, approved: 7, toProduction: 7 },
  { month: 'Dec', submitted: 18, approved: 14, toProduction: 10 },
  { month: 'Jan', submitted: 14, approved: 12, toProduction: 11 },
  { month: 'Feb', submitted: 16, approved: 10, toProduction: 8 },
];

const AnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: IndianRupee, label: 'YTD Revenue', value: '₹5.62Cr', change: '+14.2% YoY' },
          { icon: ShoppingCart, label: 'Orders Fulfilled', value: '1,842', change: '+22% YoY' },
          { icon: Palette, label: 'Design-to-Market', value: '28 days', change: '-5 days vs Q3' },
          { icon: Package, label: 'Units Produced', value: '6.8L', change: '+8% YoY' },
        ].map(k => (
          <Card key={k.label}>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-body uppercase tracking-wider">{k.label}</p>
                  <p className="text-2xl font-bold font-heading text-foreground mt-1">{k.value}</p>
                  <p className="text-xs text-success font-body mt-0.5">{k.change}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <k.icon className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue YoY Comparison */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-heading">Revenue Comparison — FY25 vs FY26 (₹ Lakhs)</CardTitle>
            <Badge variant="outline" className="text-xs font-body">Year-over-Year</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenue}>
                <defs>
                  <linearGradient id="fy26Grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(355, 75%, 47%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(355, 75%, 47%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 18%, 18%)" />
                <XAxis dataKey="month" stroke="hsl(0, 0%, 55%)" fontSize={11} />
                <YAxis stroke="hsl(0, 0%, 55%)" fontSize={11} />
                <Tooltip contentStyle={{ background: 'hsl(220, 22%, 10%)', border: '1px solid hsl(220, 18%, 18%)', borderRadius: '8px', color: '#fff', fontSize: 12 }} />
                <Area type="monotone" dataKey="fy26" stroke="hsl(355, 75%, 47%)" fill="url(#fy26Grad)" strokeWidth={2} name="FY 2025-26" />
                <Line type="monotone" dataKey="fy25" stroke="hsl(0, 0%, 45%)" strokeDasharray="5 5" strokeWidth={1.5} dot={false} name="FY 2024-25" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Revenue by Category + Region */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-heading">Revenue by Category (₹ Lakhs)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueByCategory} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 18%, 18%)" />
                  <XAxis type="number" stroke="hsl(0, 0%, 55%)" fontSize={11} />
                  <YAxis type="category" dataKey="category" stroke="hsl(0, 0%, 55%)" fontSize={11} width={80} />
                  <Tooltip contentStyle={{ background: 'hsl(220, 22%, 10%)', border: '1px solid hsl(220, 18%, 18%)', borderRadius: '8px', color: '#fff', fontSize: 12 }} />
                  <Bar dataKey="revenue" fill="hsl(355, 75%, 47%)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-heading">Sales by Region</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={regionData} cx="50%" cy="50%" innerRadius={42} outerRadius={68} dataKey="value" stroke="none">
                    {regionData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'hsl(220, 22%, 10%)', border: '1px solid hsl(220, 18%, 18%)', borderRadius: '8px', color: '#fff', fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {regionData.map(r => (
                <div key={r.name} className="flex items-center gap-1.5 text-xs font-body">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: r.color }} />
                  <span className="text-muted-foreground">{r.name}</span>
                  <span className="font-semibold text-foreground">{r.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Design Pipeline Efficiency */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-heading">Design Pipeline Efficiency</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={designEfficiency} barGap={3}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 18%, 18%)" />
                <XAxis dataKey="month" stroke="hsl(0, 0%, 55%)" fontSize={11} />
                <YAxis stroke="hsl(0, 0%, 55%)" fontSize={11} />
                <Tooltip contentStyle={{ background: 'hsl(220, 22%, 10%)', border: '1px solid hsl(220, 18%, 18%)', borderRadius: '8px', color: '#fff', fontSize: 12 }} />
                <Bar dataKey="submitted" fill="hsl(355, 75%, 47%)" radius={[3, 3, 0, 0]} name="Submitted" />
                <Bar dataKey="approved" fill="hsl(210, 60%, 50%)" radius={[3, 3, 0, 0]} name="Approved" />
                <Bar dataKey="toProduction" fill="hsl(160, 50%, 40%)" radius={[3, 3, 0, 0]} name="To Production" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-3 text-xs font-body text-muted-foreground">
            {[{ l: 'Submitted', c: 'hsl(355,75%,47%)' }, { l: 'Approved', c: 'hsl(210,60%,50%)' }, { l: 'To Production', c: 'hsl(160,50%,40%)' }].map(x => (
              <div key={x.l} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: x.c }} />
                {x.l}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPage;