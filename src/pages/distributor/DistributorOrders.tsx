import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, Truck, IndianRupee, Package, Plus, Loader2 } from 'lucide-react';
import { useDistributorOrders, useCreateDistributorOrder } from '@/hooks/useDistributorOrders';
import { useDesigns } from '@/hooks/useDesigns';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { demoDistributorOrders } from '@/data/demoData';

const statusStyle: Record<string, string> = {
  delivered: 'bg-success text-success-foreground',
  in_transit: 'bg-info text-info-foreground',
  dispatched: 'bg-info text-info-foreground',
  processing: 'bg-warning text-warning-foreground',
  pending: 'bg-muted text-muted-foreground',
};

const DistributorOrders: React.FC = () => {
  const { profile } = useAuth();
  const { data: dbOrders = [], isLoading } = useDistributorOrders();
  const { data: designs = [] } = useDesigns({ approval_status: 'approved' });
  const createMut = useCreateDistributorOrder();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ design_id: '', quantity_ordered: '', shipping_address: '', notes: '' });

  const isDemo = dbOrders.length === 0;
  const orders = isDemo ? demoDistributorOrders : dbOrders;

  const handleCreate = async () => {
    if (!form.design_id || !form.quantity_ordered) return toast({ title: 'Design and quantity required', variant: 'destructive' });
    if (!profile) return;
    try {
      await createMut.mutateAsync({
        distributor_id: profile.id,
        design_id: form.design_id,
        quantity_ordered: parseInt(form.quantity_ordered),
        shipping_address: form.shipping_address || null,
        notes: form.notes || null,
        order_number: `DO-${Date.now().toString().slice(-6)}`,
      });
      setOpen(false);
      setForm({ design_id: '', quantity_ordered: '', shipping_address: '', notes: '' });
      toast({ title: 'Order placed!' });
    } catch (e: any) { toast({ title: 'Error', description: e.message, variant: 'destructive' }); }
  };

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  const totalUnits = orders.reduce((s: number, o: any) => s + (o.quantity_ordered || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {isDemo && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg px-4 py-2.5 text-xs text-muted-foreground font-body">
          📊 Showing demo data. Place your first order to see real data.
        </div>
      )}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h3 className="text-lg font-heading text-foreground">My Orders</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button size="sm" className="gap-1.5"><Plus className="w-4 h-4" /> Place Order</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Place New Order</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Product *</Label>
                <Select value={form.design_id} onValueChange={v => setForm(f => ({ ...f, design_id: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select approved design" /></SelectTrigger>
                  <SelectContent>{designs.map((d: any) => <SelectItem key={d.id} value={d.id}>{d.title}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Quantity *</Label><Input type="number" value={form.quantity_ordered} onChange={e => setForm(f => ({ ...f, quantity_ordered: e.target.value }))} placeholder="e.g. 500" /></div>
              <div><Label>Shipping Address</Label><Textarea value={form.shipping_address} onChange={e => setForm(f => ({ ...f, shipping_address: e.target.value }))} /></div>
              <div><Label>Notes</Label><Input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></div>
              <Button onClick={handleCreate} disabled={createMut.isPending} className="w-full">{createMut.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Place Order'}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: ShoppingCart, label: 'Total Orders', value: orders.length.toString(), sub: 'All time' },
          { icon: IndianRupee, label: 'Pending', value: orders.filter((o: any) => o.status === 'pending').length.toString(), sub: 'Awaiting processing' },
          { icon: Truck, label: 'In Transit', value: orders.filter((o: any) => o.status === 'in_transit' || o.status === 'dispatched').length.toString(), sub: 'On the way' },
          { icon: Package, label: 'Units Ordered', value: totalUnits.toLocaleString(), sub: 'Across all orders' },
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
        <CardHeader className="pb-2"><CardTitle className="text-sm font-heading">My Orders</CardTitle></CardHeader>
        <CardContent>
          {orders.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No orders yet. Place your first order!</p>}
          <div className="space-y-3">
            {orders.map((o: any) => (
              <div key={o.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/40">
                <div className="w-20 text-xs font-mono-data text-primary font-semibold">{o.order_number || o.id.slice(0, 8)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground font-body truncate">{o.designs?.title || 'Unknown Product'}</p>
                  <p className="text-xs text-muted-foreground font-body">{(o.quantity_ordered || 0).toLocaleString()} units · {o.order_date || 'N/A'}</p>
                </div>
                <Badge className={`text-[10px] ${statusStyle[o.status || 'pending']}`}>{(o.status || 'pending').replace('_', ' ')}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DistributorOrders;
