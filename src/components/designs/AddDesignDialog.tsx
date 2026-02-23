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
import { useAuth } from '@/contexts/AuthContext';

export interface NewDesign {
  id: string;
  name: string;
  designer: string;
  status: string;
  category: string;
  date: string;
}

interface AddDesignDialogProps {
  onAdd: (design: NewDesign) => void;
  designCount: number;
}

const CATEGORIES = ['Briefs', 'Vests', 'Thermals', 'Socks'];

const AddDesignDialog: React.FC<AddDesignDialogProps> = ({ onAdd, designCount }) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Briefs');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const id = `DSN-${String(designCount + 1).padStart(3, '0')}`;
    const today = new Date().toISOString().split('T')[0];

    onAdd({
      id,
      name: name.trim(),
      designer: user?.name || 'Unknown',
      status: 'draft',
      category,
      date: today,
    });

    setName('');
    setCategory('Briefs');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 gap-1.5 text-xs">
          <Plus className="w-3.5 h-3.5" />
          New Design
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Design</DialogTitle>
          <DialogDescription>Add a new design to the collection.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="designName">Design Name</Label>
            <Input id="designName" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Summer Comfort Range" required />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Designer</Label>
            <Input value={user?.name || 'Unknown'} disabled className="bg-secondary/50" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">Create Design</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDesignDialog;
