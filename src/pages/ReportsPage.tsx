import React from 'react';
import AppHeader from '@/components/layout/AppHeader';
import { salesData, categoryDistribution } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Download } from 'lucide-react';

const ReportsPage: React.FC = () => {
  const tooltipStyle = { background: 'hsl(222, 44%, 10%)', border: '1px solid hsl(222, 30%, 16%)', borderRadius: 8, fontSize: 12 };

  return (
    <>
      <AppHeader title="Reports" subtitle="Business intelligence & analytics" />
      <div className="flex-1 p-6 space-y-6 overflow-auto scrollbar-thin">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {['Weekly', 'Monthly', 'Quarterly', 'Yearly'].map(period => (
              <button key={period} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors first:bg-primary first:text-primary-foreground">
                {period}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Revenue by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 16%)" />
                <XAxis dataKey="month" tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }} axisLine={false} />
                <YAxis tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="briefs" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="vests" fill="hsl(160, 84%, 39%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="thermals" fill="hsl(38, 92%, 50%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Sales Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 16%)" />
                <XAxis dataKey="month" tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }} axisLine={false} />
                <YAxis tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="briefs" stroke="hsl(217, 91%, 60%)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="vests" stroke="hsl(160, 84%, 39%)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="thermals" stroke="hsl(38, 92%, 50%)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportsPage;
