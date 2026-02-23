import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { ShoppingCart, Truck, IndianRupee, Package, ArrowUpRight } from 'lucide-react';

const myOrders = [
  { id: 'DO-1928', product: 'Arctic Thermals Pro V3', qty: 500, status: 'Delivered', date: 'Feb 20', amount: '₹2.5L' },
  { id: 'DO-1925', product: 'Eco Comfort Briefs (Pack of 3)', qty: 1200, status: 'In Transit', date: 'Feb 18', amount: '₹3.6L' },
  { id: 'DO-1923', product: 'Heritage Classic Vest', qty: 300, status: 'Dispatched', date: 'Feb 22', amount: '₹1.5L' },
  { id: 'DO-1920', product: 'Sport Flex Socks (6-Pack)', qty: 800, status: 'Processing', date: 'Feb 21', amount: '₹1.2L' },
  { id: 'DO-1918', product: 'Summer Breeze Camisole', qty: 400, status: 'Pending', date: 'Feb 23', amount: '₹2.0L' },
];

const monthlySpend = [
  { month: 'Sep', amount: 8.5 },
  { month: 'Oct', amount: 12.2 },
  { month: 'Nov', amount: 10.8 },
  { month: 'Dec', amount: 18.5 },
  { month: 'Jan', amount: 14.3 },
  { month: 'Feb', amount: 10.8 },
];

const statusStyle: Record<string, string> = {
  Delivered: 'bg-success text-success-foreground',
  'In Transit': 'bg-info text-info-foreground',
  Dispatched: 'bg-info text-info-foreground',
  Processing: 'bg-warning text-warning-foreground',
  Pending: 'bg-muted text-muted-foreground',
};

const DistributorOrders: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: ShoppingCart, label: 'Total Orders', value: '48', sub: 'This quarter' },
          { icon: IndianRupee, label: 'Total Spend', value: '₹75.1L', sub: 'FY 2025-26 YTD' },
          { icon: Truck, label: 'In Transit', value: '3', sub: 'Expected this week' },
          { icon: Package, label: 'Units Ordered', value: '15,200', sub: 'Across all products' },
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

      {/* Orders List */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-heading">My Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {myOrders.map(o => (
              <div key={o.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/40">
                <div className="w-16 text-xs font-mono-data text-primary font-semibold">{o.id}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground font-body truncate">{o.product}</p>
                  <p className="text-xs text-muted-foreground font-body">{o.qty.toLocaleString()} units · {o.date}</p>
                </div>
                <p className="text-sm font-semibold text-foreground font-mono-data">{o.amount}</p>
                <Badge className={`text-[10px] ${statusStyle[o.status]}`}>{o.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Spend */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-heading">Monthly Spend (₹ Lakhs)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySpend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 18%, 18%)" />
                <XAxis dataKey="month" stroke="hsl(0, 0%, 55%)" fontSize={11} />
                <YAxis stroke="hsl(0, 0%, 55%)" fontSize={11} />
                <Tooltip contentStyle={{ background: 'hsl(220, 22%, 10%)', border: '1px solid hsl(220, 18%, 18%)', borderRadius: '8px', color: '#fff', fontSize: 12 }} />
                <Bar dataKey="amount" fill="hsl(355, 75%, 47%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DistributorOrders;