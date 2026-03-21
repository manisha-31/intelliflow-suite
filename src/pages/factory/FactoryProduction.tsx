import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Factory, Package, AlertTriangle, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { useProductionOrders, useUpdateProductionOrder } from '@/hooks/useProductionOrders';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const STAGES = ['material_sourcing', 'cutting', 'sewing', 'finishing', 'qc', 'dispatch', 'completed'];
const stageLabel: Record<string, string> = { material_sourcing: 'Material Sourcing', cutting: 'Cutting', sewing: 'Sewing', finishing: 'Finishing', qc: 'QC', dispatch: 'Dispatch', completed: 'Completed' };
const priorityColor: Record<string, string> = { high: 'bg-destructive text-destructive-foreground', medium: 'bg-warning text-warning-foreground', low: 'bg-muted text-muted-foreground' };

const FactoryProduction: React.FC = () => {
  const { profile } = useAuth();
  const { data: orders = [], isLoading } = useProductionOrders(profile?.role === 'factory' ? profile.id : undefined);
  const updateMut = useUpdateProductionOrder();

  const handleStageChange = async (orderId: string, newStage: string) => {
    const stageIdx = STAGES.indexOf(newStage);
    const pct = Math.round((stageIdx / (STAGES.length - 1)) * 100);
    try {
      await updateMut.mutateAsync({ id: orderId, current_stage: newStage, completion_percentage: pct });
      toast({ title: `Stage updated to ${stageLabel[newStage]}` });
    } catch (e: any) { toast({ title: 'Error', description: e.message, variant: 'destructive' }); }
  };

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  const delayed = orders.filter((o: any) => o.delay_flag);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Factory, label: 'Active Orders', value: orders.length.toString(), sub: `${orders.reduce((s: number, o: any) => s + (o.quantity || 0), 0).toLocaleString()} total units` },
          { icon: CheckCircle, label: 'Completed', value: orders.filter((o: any) => o.current_stage === 'completed').length.toString(), sub: 'Finished orders' },
          { icon: Clock, label: 'In Progress', value: orders.filter((o: any) => o.current_stage !== 'completed').length.toString(), sub: 'Active production' },
          { icon: AlertTriangle, label: 'Delayed', value: delayed.length.toString(), sub: 'Needs escalation' },
        ].map(kpi => (
          <Card key={kpi.label}>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-body uppercase tracking-wider">{kpi.label}</p>
                  <p className="text-2xl font-bold font-heading text-foreground mt-1">{kpi.value}</p>
                  <p className="text-xs text-muted-foreground font-body">{kpi.sub}</p>
                </div>
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center"><kpi.icon className="w-4 h-4 text-primary" /></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-heading">Production Orders</CardTitle></CardHeader>
        <CardContent>
          {orders.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No production orders assigned.</p>}
          <div className="space-y-3">
            {orders.map((o: any) => (
              <div key={o.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/40">
                <div className="w-20 text-xs font-mono-data text-primary font-semibold">{o.order_number || o.id.slice(0, 8)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground font-body truncate">{o.designs?.title || 'Unknown Design'}</p>
                  <p className="text-xs text-muted-foreground font-body">{(o.quantity || 0).toLocaleString()} units · Due: {o.due_date || 'N/A'}</p>
                </div>
                <Badge className={`text-[10px] ${priorityColor[o.priority || 'medium']}`}>{o.priority || 'medium'}</Badge>
                <Select value={o.current_stage || 'material_sourcing'} onValueChange={v => handleStageChange(o.id, v)}>
                  <SelectTrigger className="w-36 h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STAGES.map(s => <SelectItem key={s} value={s}>{stageLabel[s]}</SelectItem>)}
                  </SelectContent>
                </Select>
                <div className="w-20 space-y-1">
                  <span className="text-xs font-mono-data text-foreground">{o.completion_percentage || 0}%</span>
                  <Progress value={o.completion_percentage || 0} className="h-1.5" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {delayed.length > 0 && (
        <Card className="border-destructive/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-heading flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-destructive" /> Delayed Orders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {delayed.map((o: any) => (
              <div key={o.id} className="flex items-center gap-4 p-3 rounded-lg bg-destructive/5 border border-destructive/15">
                <span className="text-xs font-mono-data text-primary font-semibold w-20">{o.order_number || o.id.slice(0, 8)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground font-body">{o.designs?.title}</p>
                  <p className="text-xs text-muted-foreground font-body">Reason: {o.delay_reason || 'Not specified'}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FactoryProduction;
