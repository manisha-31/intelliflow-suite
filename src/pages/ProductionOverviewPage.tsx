import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { Factory, Package, AlertTriangle, CheckCircle, Clock, Truck, TrendingUp } from 'lucide-react';

const factoryPerformance = [
  { name: 'Unit A — Tirupur', orders: 8, units: 42000, onTime: 92, utilization: 87 },
  { name: 'Unit B — Bengaluru', orders: 5, units: 28000, onTime: 85, utilization: 78 },
  { name: 'Unit C — Ludhiana', orders: 6, units: 35000, onTime: 96, utilization: 91 },
  { name: 'Unit D — Kolkata', orders: 3, units: 15000, onTime: 78, utilization: 65 },
];

const stageDistribution = [
  { name: 'Cutting', value: 18, color: 'hsl(355, 75%, 47%)' },
  { name: 'Sewing', value: 25, color: 'hsl(210, 60%, 50%)' },
  { name: 'Finishing', value: 12, color: 'hsl(43, 90%, 50%)' },
  { name: 'QC', value: 8, color: 'hsl(280, 45%, 55%)' },
  { name: 'Dispatch', value: 15, color: 'hsl(160, 50%, 40%)' },
];

const monthlyOutput = [
  { month: 'Sep', units: 85 },
  { month: 'Oct', units: 102 },
  { month: 'Nov', units: 95 },
  { month: 'Dec', units: 120 },
  { month: 'Jan', units: 110 },
  { month: 'Feb', units: 98 },
];

const delayedOrders = [
  { id: 'PO-2836', design: 'Kids Cotton Vest', factory: 'Unit D — Kolkata', daysDelayed: 5, reason: 'Fabric shortage from supplier' },
  { id: 'PO-2841', design: 'Women Thermal Set', factory: 'Unit B — Bengaluru', daysDelayed: 3, reason: 'Machine maintenance downtime' },
  { id: 'PO-2844', design: 'Men Boxer Pack (3)', factory: 'Unit D — Kolkata', daysDelayed: 2, reason: 'Quality re-check required' },
];

const ProductionOverviewPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { icon: Factory, label: 'Active Factories', value: '4' },
          { icon: Package, label: 'Total Orders', value: '22' },
          { icon: TrendingUp, label: 'Units This Month', value: '98K' },
          { icon: CheckCircle, label: 'On-Time Rate', value: '88%' },
          { icon: AlertTriangle, label: 'Delayed', value: '3' },
        ].map(k => (
          <Card key={k.label}>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2">
                <k.icon className="w-4 h-4 text-primary" />
                <p className="text-xs text-muted-foreground font-body">{k.label}</p>
              </div>
              <p className="text-xl font-bold font-heading text-foreground mt-1">{k.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Factory Performance Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-heading">Factory Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {factoryPerformance.map(f => (
              <div key={f.name} className="flex items-center gap-4 p-3 rounded-lg bg-muted/40">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground font-body">{f.name}</p>
                  <p className="text-xs text-muted-foreground font-body">{f.orders} orders · {f.units.toLocaleString()} units</p>
                </div>
                <div className="text-center w-20">
                  <p className="text-xs text-muted-foreground font-body">On-Time</p>
                  <p className={`text-sm font-bold font-mono-data ${f.onTime >= 90 ? 'text-success' : f.onTime >= 80 ? 'text-warning' : 'text-destructive'}`}>{f.onTime}%</p>
                </div>
                <div className="w-28 space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground font-body">
                    <span>Utilization</span>
                    <span className="font-mono-data">{f.utilization}%</span>
                  </div>
                  <Progress value={f.utilization} className="h-1.5" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-heading">Monthly Output (K Units)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyOutput}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 18%, 18%)" />
                  <XAxis dataKey="month" stroke="hsl(0, 0%, 55%)" fontSize={11} />
                  <YAxis stroke="hsl(0, 0%, 55%)" fontSize={11} />
                  <Tooltip contentStyle={{ background: 'hsl(220, 22%, 10%)', border: '1px solid hsl(220, 18%, 18%)', borderRadius: '8px', color: '#fff', fontSize: 12 }} />
                  <Bar dataKey="units" fill="hsl(355, 75%, 47%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-heading">Orders by Stage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={stageDistribution} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" stroke="none">
                    {stageDistribution.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'hsl(220, 22%, 10%)', border: '1px solid hsl(220, 18%, 18%)', borderRadius: '8px', color: '#fff', fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-3 mt-2 justify-center">
              {stageDistribution.map(s => (
                <div key={s.name} className="flex items-center gap-1.5 text-xs font-body">
                  <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                  <span className="text-muted-foreground">{s.name}</span>
                  <span className="font-semibold text-foreground">{s.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delayed Orders */}
      <Card className="border-destructive/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-heading flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-destructive" /> Delayed Orders
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {delayedOrders.map(o => (
            <div key={o.id} className="flex items-center gap-4 p-3 rounded-lg bg-destructive/5 border border-destructive/15">
              <span className="text-xs font-mono-data text-primary font-semibold w-16">{o.id}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground font-body">{o.design}</p>
                <p className="text-xs text-muted-foreground font-body">{o.factory} · Reason: {o.reason}</p>
              </div>
              <Badge variant="destructive" className="text-[10px]">{o.daysDelayed} days late</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductionOverviewPage;