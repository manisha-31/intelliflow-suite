import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Factory, Package, AlertTriangle, CheckCircle, Clock, Truck } from 'lucide-react';

const productionOrders = [
  { id: 'PO-2851', design: 'Arctic Thermals Pro V3', qty: 5000, stage: 'Sewing', progress: 62, priority: 'High', due: 'Feb 28' },
  { id: 'PO-2849', design: 'Eco Comfort Brief', qty: 8000, stage: 'Cutting', progress: 35, priority: 'Medium', due: 'Mar 05' },
  { id: 'PO-2847', design: 'Heritage Classic Vest', qty: 3000, stage: 'Finishing', progress: 88, priority: 'High', due: 'Feb 25' },
  { id: 'PO-2845', design: 'Sport Flex Socks', qty: 12000, stage: 'Dispatch', progress: 95, priority: 'Low', due: 'Feb 24' },
  { id: 'PO-2843', design: 'Summer Breeze Camisole', qty: 4000, stage: 'Cutting', progress: 15, priority: 'Medium', due: 'Mar 12' },
];

const weeklyOutput = [
  { day: 'Mon', units: 820 },
  { day: 'Tue', units: 940 },
  { day: 'Wed', units: 1100 },
  { day: 'Thu', units: 980 },
  { day: 'Fri', units: 1050 },
  { day: 'Sat', units: 650 },
];

const bomAlerts = [
  { material: 'Cotton Yarn 40s', available: 120, required: 300, supplier: 'Vardhman Textiles' },
  { material: 'Elastic Band 25mm', available: 50, required: 180, supplier: 'Sri Lakshmi Elastics' },
  { material: 'Polyester Thread', available: 400, required: 450, supplier: 'Coats India' },
];

const priorityColor: Record<string, string> = {
  High: 'bg-destructive text-destructive-foreground',
  Medium: 'bg-warning text-warning-foreground',
  Low: 'bg-muted text-muted-foreground',
};

const FactoryProduction: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Factory, label: 'Active Orders', value: '5', sub: '28,000 total units' },
          { icon: CheckCircle, label: 'Completed Today', value: '1,050', sub: 'Units produced' },
          { icon: Clock, label: 'Avg Lead Time', value: '12 days', sub: 'From cutting to dispatch' },
          { icon: AlertTriangle, label: 'Delayed Orders', value: '2', sub: 'Needs escalation' },
        ].map(kpi => (
          <Card key={kpi.label}>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-body uppercase tracking-wider">{kpi.label}</p>
                  <p className="text-2xl font-bold font-heading text-foreground mt-1">{kpi.value}</p>
                  <p className="text-xs text-muted-foreground font-body">{kpi.sub}</p>
                </div>
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <kpi.icon className="w-4 h-4 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Production Orders Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-heading">Production Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {productionOrders.map(o => (
              <div key={o.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/40">
                <div className="w-16 text-xs font-mono-data text-primary font-semibold">{o.id}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground font-body truncate">{o.design}</p>
                  <p className="text-xs text-muted-foreground font-body">{o.qty.toLocaleString()} units · Due: {o.due}</p>
                </div>
                <Badge className={`text-[10px] ${priorityColor[o.priority]}`}>{o.priority}</Badge>
                <div className="w-28 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-body text-muted-foreground">
                    <span>{o.stage}</span>
                    <span className="font-mono-data">{o.progress}%</span>
                  </div>
                  <Progress value={o.progress} className="h-1.5" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Output + BOM Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-heading">Weekly Output (Units)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyOutput}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 18%, 18%)" />
                  <XAxis dataKey="day" stroke="hsl(0, 0%, 55%)" fontSize={11} />
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
            <CardTitle className="text-sm font-heading">BOM Alerts — Low Stock</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {bomAlerts.map(b => (
              <div key={b.material} className="p-3 rounded-lg bg-destructive/5 border border-destructive/20 space-y-1.5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground font-body">{b.material}</p>
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                </div>
                <p className="text-xs text-muted-foreground font-body">
                  {b.available} / {b.required} kg available · Supplier: {b.supplier}
                </p>
                <Progress value={(b.available / b.required) * 100} className="h-1.5" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FactoryProduction;