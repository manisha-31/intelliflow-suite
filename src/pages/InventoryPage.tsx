import React from 'react';
import AppHeader from '@/components/layout/AppHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import { inventory } from '@/data/mockData';
import { AlertTriangle } from 'lucide-react';

const InventoryPage: React.FC = () => {
  return (
    <>
      <AppHeader title="Inventory Management" subtitle="Real-time stock monitoring" />
      <div className="flex-1 p-6 space-y-4 overflow-auto scrollbar-thin">
        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Total SKUs', value: inventory.length, color: 'text-foreground' },
            { label: 'Healthy', value: inventory.filter(i => i.status === 'healthy').length, color: 'text-success' },
            { label: 'Low Stock', value: inventory.filter(i => i.status === 'low').length, color: 'text-warning' },
            { label: 'Critical', value: inventory.filter(i => i.status === 'critical').length, color: 'text-destructive' },
          ].map((s, i) => (
            <div key={i} className="glass-card rounded-xl p-4 text-center">
              <p className={`text-2xl font-bold font-mono-data ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="glass-card rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left p-4 text-xs text-muted-foreground font-medium">SKU</th>
                <th className="text-left p-4 text-xs text-muted-foreground font-medium">Product</th>
                <th className="text-left p-4 text-xs text-muted-foreground font-medium">Category</th>
                <th className="text-right p-4 text-xs text-muted-foreground font-medium">Stock</th>
                <th className="text-right p-4 text-xs text-muted-foreground font-medium">Reorder Level</th>
                <th className="text-right p-4 text-xs text-muted-foreground font-medium">Unit Cost</th>
                <th className="text-center p-4 text-xs text-muted-foreground font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map(item => (
                <tr key={item.sku} className="border-b border-border/50 hover:bg-secondary/10 transition-colors">
                  <td className="p-4 font-mono-data text-xs text-primary">{item.sku}</td>
                  <td className="p-4 text-foreground font-medium">
                    <div className="flex items-center gap-2">
                      {item.status === 'critical' && <AlertTriangle className="w-3.5 h-3.5 text-destructive" />}
                      {item.name}
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">{item.category}</td>
                  <td className="p-4 text-right font-mono-data text-foreground">{item.stock.toLocaleString()}</td>
                  <td className="p-4 text-right font-mono-data text-muted-foreground">{item.reorderLevel.toLocaleString()}</td>
                  <td className="p-4 text-right font-mono-data text-foreground">{item.unitCost}</td>
                  <td className="p-4 text-center"><StatusBadge status={item.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default InventoryPage;
