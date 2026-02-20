import React from 'react';
import AppHeader from '@/components/layout/AppHeader';
import KPICard from '@/components/dashboard/KPICard';
import AIInsightCard from '@/components/dashboard/AIInsightCard';
import StatusBadge from '@/components/shared/StatusBadge';
import { kpiData, salesData, categoryDistribution, orders, aiInsights } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Brain, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <AppHeader title="Dashboard" subtitle="Enterprise Intelligence Overview" />
      <div className="flex-1 p-6 space-y-6 overflow-auto scrollbar-thin">
        {/* KPIs */}
        <div className="grid grid-cols-4 gap-4">
          {kpiData.map((kpi, i) => (
            <KPICard key={i} {...kpi} />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* Sales Trend */}
          <div className="col-span-2 glass-card rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Sales Trend — Last 6 Months</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={salesData} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 16%)" />
                <XAxis dataKey="month" tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }} axisLine={false} />
                <YAxis tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: 'hsl(222, 44%, 10%)', border: '1px solid hsl(222, 30%, 16%)', borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: 'hsl(210, 40%, 93%)' }}
                />
                <Bar dataKey="briefs" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="vests" fill="hsl(160, 84%, 39%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="thermals" fill="hsl(38, 92%, 50%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Category Mix */}
          <div className="glass-card rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Category Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={categoryDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                  {categoryDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'hsl(222, 44%, 10%)', border: '1px solid hsl(222, 30%, 16%)', borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {categoryDistribution.map((cat, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ background: cat.fill }} />
                  <span className="text-muted-foreground">{cat.name}</span>
                  <span className="ml-auto font-mono-data text-foreground">{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* Recent Orders */}
          <div className="col-span-2 glass-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">Recent Orders</h3>
              <button onClick={() => navigate('/orders')} className="text-xs text-primary hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-xs text-muted-foreground font-medium">Order ID</th>
                    <th className="text-left py-2 text-xs text-muted-foreground font-medium">Customer</th>
                    <th className="text-right py-2 text-xs text-muted-foreground font-medium">Total</th>
                    <th className="text-center py-2 text-xs text-muted-foreground font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map(order => (
                    <tr key={order.id} className="border-b border-border/50 hover:bg-secondary/20">
                      <td className="py-2.5 font-mono-data text-xs text-primary">{order.id}</td>
                      <td className="py-2.5 text-foreground">{order.customer}</td>
                      <td className="py-2.5 text-right font-mono-data text-foreground">{order.total}</td>
                      <td className="py-2.5 text-center"><StatusBadge status={order.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Insights */}
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">AI Insights</h3>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full gradient-accent text-accent-foreground font-bold uppercase ml-auto">Live</span>
            </div>
            <div className="space-y-3">
              {aiInsights.map((insight, i) => (
                <AIInsightCard key={i} {...insight} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
