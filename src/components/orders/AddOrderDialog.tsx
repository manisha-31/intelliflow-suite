import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

interface NewOrder {
  id: string;
  customer: string;
  items: number;
  total: string;
  status: string;
  date: string;
  priority: string;
}

interface AddOrderDialogProps {
  onAdd: (order: NewOrder) => void;
  orderCount: number;
}

const AddOrderDialog: React.FC<AddOrderDialogProps> = ({ onAdd, orderCount }) => {
  const [open, setOpen] = useState(false);
  const [customer, setCustomer] = useState('');
  const [items, setItems] = useState('');
  const [total, setTotal] = useState('');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('pending');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.trim() || !items || !total) return;

    const id = `ORD-2024-${String(orderCount + 1).padStart(3, '0')}`;
    const today = new Date().toISOString().split('T')[0];

    onAdd({
      id,
      customer: customer.trim(),
      items: Number(items),
      total: `₹${Number(total).toLocaleString('en-IN')}`,
      priority,
      status,
      date: today,
    });

    setCustomer('');
    setItems('');
    setTotal('');
    setPriority('medium');
    setStatus('pending');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 gap-1.5 text-xs">
          <Plus className="w-3.5 h-3.5" />
          New Order
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Order</DialogTitle>
          <DialogDescription>Fill in the order details below.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customer">Customer Name</Label>
            <Input id="customer" value={customer} onChange={e => setCustomer(e.target.value)} placeholder="e.g. Metro Distributors" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="items">Items (qty)</Label>
              <Input id="items" type="number" min="1" value={items} onChange={e => setItems(e.target.value)} placeholder="5000" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="total">Total (₹)</Label>
              <Input id="total" type="number" min="1" value={total} onChange={e => setTotal(e.target.value)} placeholder="450000" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">Create Order</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddOrderDialog;
