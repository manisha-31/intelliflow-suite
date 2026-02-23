import React, { useState } from 'react';
import AppHeader from '@/components/layout/AppHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import { orders as mockOrders } from '@/data/mockData';
import { Download } from 'lucide-react';
import AddOrderDialog from '@/components/orders/AddOrderDialog';
import { useAuth } from '@/contexts/AuthContext';

const OrdersPage: React.FC = () => {
  const { user } = useAuth();
  const [orderList, setOrderList] = useState(mockOrders);
  const [filter, setFilter] = useState('all');
  const statuses = ['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered'];
  const filtered = filter === 'all' ? orderList : orderList.filter(o => o.status === filter);

  const canAddOrder = user?.role === 'factory_admin' || user?.role === 'marketing';

  const handleAddOrder = (order: typeof orderList[0]) => {
    setOrderList(prev => [order, ...prev]);
  };

  return (
    <>
      <AppHeader title="Order Management" subtitle="Track and manage all orders" />
      <div className="flex-1 p-6 space-y-4 overflow-auto scrollbar-thin">
        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {statuses.map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                  filter === s ? 'bg-primary text-primary-foreground' : 'bg-secondary/50 text-muted-foreground hover:text-foreground'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {canAddOrder && (
              <AddOrderDialog onAdd={handleAddOrder} orderCount={orderList.length} />
            )}
            <button className="p-2 rounded-lg bg-secondary/50 text-muted-foreground hover:text-foreground">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="glass-card rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left p-4 text-xs text-muted-foreground font-medium">Order ID</th>
                <th className="text-left p-4 text-xs text-muted-foreground font-medium">Customer</th>
                <th className="text-right p-4 text-xs text-muted-foreground font-medium">Items</th>
                <th className="text-right p-4 text-xs text-muted-foreground font-medium">Total</th>
                <th className="text-center p-4 text-xs text-muted-foreground font-medium">Priority</th>
                <th className="text-center p-4 text-xs text-muted-foreground font-medium">Status</th>
                <th className="text-left p-4 text-xs text-muted-foreground font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(order => (
                <tr key={order.id} className="border-b border-border/50 hover:bg-secondary/10 transition-colors">
                  <td className="p-4 font-mono-data text-xs text-primary">{order.id}</td>
                  <td className="p-4 text-foreground font-medium">{order.customer}</td>
                  <td className="p-4 text-right font-mono-data text-muted-foreground">{order.items.toLocaleString()}</td>
                  <td className="p-4 text-right font-mono-data text-foreground">{order.total}</td>
                  <td className="p-4 text-center"><StatusBadge status={order.priority} /></td>
                  <td className="p-4 text-center"><StatusBadge status={order.status} /></td>
                  <td className="p-4 text-muted-foreground text-xs">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default OrdersPage;
