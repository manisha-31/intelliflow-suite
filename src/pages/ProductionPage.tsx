import React from 'react';
import AppHeader from '@/components/layout/AppHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import { production } from '@/data/mockData';
import { Progress } from '@/components/ui/progress';

const ProductionPage: React.FC = () => {
  return (
    <>
      <AppHeader title="Production Tracking" subtitle="Manufacturing lines & batch status" />
      <div className="flex-1 p-6 space-y-4 overflow-auto scrollbar-thin">
        {/* Line Status */}
        <div className="grid grid-cols-3 gap-4">
          {['Line A', 'Line B', 'Line C'].map(line => {
            const lineBatches = production.filter(p => p.line === line);
            const active = lineBatches.filter(p => p.status === 'in_progress');
            return (
              <div key={line} className="glass-card rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-foreground">{line}</h4>
                  <StatusBadge status={active.length > 0 ? 'in_progress' : 'completed'} />
                </div>
                <p className="text-xs text-muted-foreground">{lineBatches.length} batches · {active.length} active</p>
              </div>
            );
          })}
        </div>

        {/* Batch Table */}
        <div className="glass-card rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left p-4 text-xs text-muted-foreground font-medium">Batch ID</th>
                <th className="text-left p-4 text-xs text-muted-foreground font-medium">Product</th>
                <th className="text-left p-4 text-xs text-muted-foreground font-medium">Line</th>
                <th className="text-left p-4 text-xs text-muted-foreground font-medium w-48">Progress</th>
                <th className="text-center p-4 text-xs text-muted-foreground font-medium">Status</th>
                <th className="text-left p-4 text-xs text-muted-foreground font-medium">ETA</th>
              </tr>
            </thead>
            <tbody>
              {production.map(batch => {
                const pct = Math.round((batch.completed / batch.qty) * 100);
                return (
                  <tr key={batch.batchId} className="border-b border-border/50 hover:bg-secondary/10 transition-colors">
                    <td className="p-4 font-mono-data text-xs text-primary">{batch.batchId}</td>
                    <td className="p-4 text-foreground font-medium">{batch.product}</td>
                    <td className="p-4 text-muted-foreground">{batch.line}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Progress value={pct} className="h-2 flex-1" />
                        <span className="text-xs font-mono-data text-muted-foreground w-10 text-right">{pct}%</span>
                      </div>
                    </td>
                    <td className="p-4 text-center"><StatusBadge status={batch.status} /></td>
                    <td className="p-4 text-muted-foreground text-xs">{batch.eta}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ProductionPage;
