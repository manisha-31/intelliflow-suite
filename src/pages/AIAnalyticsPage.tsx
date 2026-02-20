import React from 'react';
import AppHeader from '@/components/layout/AppHeader';
import { riskScores, demandForecast, salesData, aiInsights } from '@/data/mockData';
import AIInsightCard from '@/components/dashboard/AIInsightCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Brain, AlertTriangle, TrendingUp, Zap, Target } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const forecastFull = [
  ...salesData.map(s => ({ month: s.month, actual: s.briefs + s.vests + s.thermals, predicted: null, lower: null, upper: null })),
  ...demandForecast,
];

const AIAnalyticsPage: React.FC = () => {
  return (
    <>
      <AppHeader title="AI Analytics" subtitle="Machine learning powered insights" />
      <div className="flex-1 p-6 space-y-6 overflow-auto scrollbar-thin">
        {/* AI Status Bar */}
        <div className="glass-card rounded-xl p-4 flex items-center gap-4 border-primary/20">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center glow-primary animate-pulse-slow">
            <Brain className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">AI Engine Active</p>
            <p className="text-xs text-muted-foreground">4 models running · Last updated 2 min ago · Processing 1.2M data points</p>
          </div>
          <div className="flex items-center gap-6">
            {[
              { label: 'Demand Forecast', icon: TrendingUp, status: 'active' },
              { label: 'Risk Prediction', icon: AlertTriangle, status: 'active' },
              { label: 'Smart Reorder', icon: Target, status: 'active' },
              { label: 'Insight Engine', icon: Zap, status: 'active' },
            ].map((model, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                <span className="text-[10px] text-muted-foreground">{model.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* Demand Forecast */}
          <div className="col-span-2 glass-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Demand Forecasting</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Time series regression · 3-month prediction window</p>
              </div>
              <span className="text-[10px] px-2 py-1 rounded-full bg-success/10 text-success font-mono-data">R² = 0.94</span>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={forecastFull}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 16%)" />
                <XAxis dataKey="month" tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }} axisLine={false} />
                <YAxis tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }} axisLine={false} />
                <Tooltip contentStyle={{ background: 'hsl(222, 44%, 10%)', border: '1px solid hsl(222, 30%, 16%)', borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="upper" stroke="none" fill="hsl(217, 91%, 60%)" fillOpacity={0.1} />
                <Area type="monotone" dataKey="lower" stroke="none" fill="hsl(222, 47%, 6%)" fillOpacity={1} />
                <Area type="monotone" dataKey="actual" stroke="hsl(160, 84%, 39%)" fill="hsl(160, 84%, 39%)" fillOpacity={0.1} strokeWidth={2} />
                <Area type="monotone" dataKey="predicted" stroke="hsl(217, 91%, 60%)" fill="none" strokeWidth={2} strokeDasharray="6 3" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Inventory Risk */}
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4 text-warning" />
              <h3 className="text-sm font-semibold text-foreground">Inventory Risk Scores</h3>
            </div>
            <div className="space-y-4">
              {riskScores.map((item, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-foreground font-medium truncate mr-2">{item.product}</span>
                    <span className={`text-xs font-mono-data font-bold ${
                      item.risk > 80 ? 'text-destructive' : item.risk > 60 ? 'text-warning' : 'text-success'
                    }`}>{item.risk}%</span>
                  </div>
                  <Progress value={item.risk} className="h-1.5" />
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-muted-foreground">{item.velocity} units/day</span>
                    <span className="text-[10px] text-muted-foreground">{item.daysLeft}d remaining</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">AI-Generated Business Insights</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {aiInsights.map((insight, i) => (
              <AIInsightCard key={i} {...insight} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AIAnalyticsPage;
