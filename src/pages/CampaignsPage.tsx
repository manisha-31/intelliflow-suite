import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Megaphone, Plus, Calendar, Target, IndianRupee, TrendingUp, Loader2 } from 'lucide-react';
import { useCampaigns, useCreateCampaign, useDeleteCampaign } from '@/hooks/useCampaigns';
import { useCollections } from '@/hooks/useCollections';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const statusColor: Record<string, string> = {
  active: 'bg-success text-success-foreground',
  planning: 'bg-warning text-warning-foreground',
  completed: 'bg-muted text-muted-foreground',
  draft: 'bg-muted text-muted-foreground',
};

const CampaignsPage: React.FC = () => {
  const [tab, setTab] = useState('all');
  const [open, setOpen] = useState(false);
  const { profile } = useAuth();
  const { data: campaigns = [], isLoading } = useCampaigns();
  const { data: collections = [] } = useCollections();
  const createMut = useCreateCampaign();
  const deleteMut = useDeleteCampaign();
  const [form, setForm] = useState({ title: '', campaign_type: '', collection_id: '', budget: '', start_date: '', end_date: '', description: '' });

  const filtered = tab === 'all' ? campaigns : campaigns.filter((c: any) => c.status === tab);

  const handleCreate = async () => {
    if (!form.title.trim()) return toast({ title: 'Title required', variant: 'destructive' });
    try {
      await createMut.mutateAsync({
        title: form.title,
        campaign_type: form.campaign_type || null,
        collection_id: form.collection_id || null,
        budget: form.budget ? parseFloat(form.budget) : null,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
        description: form.description || null,
        status: 'planning',
        created_by: profile?.id,
      });
      setOpen(false);
      setForm({ title: '', campaign_type: '', collection_id: '', budget: '', start_date: '', end_date: '', description: '' });
      toast({ title: 'Campaign created!' });
    } catch (e: any) { toast({ title: 'Error', description: e.message, variant: 'destructive' }); }
  };

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  const totalBudget = campaigns.reduce((s: number, c: any) => s + (c.budget || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-lg font-heading text-foreground">Campaigns</h3>
          <p className="text-xs text-muted-foreground font-body">{campaigns.length} campaigns managed</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button size="sm" className="gap-1.5"><Plus className="w-4 h-4" /> New Campaign</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Campaign</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Title *</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Type</Label>
                  <Select value={form.campaign_type} onValueChange={v => setForm(f => ({ ...f, campaign_type: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {['Product Launch', 'Brand Awareness', 'Seasonal', 'CSR / Sustainability'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Collection</Label>
                  <Select value={form.collection_id} onValueChange={v => setForm(f => ({ ...f, collection_id: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{collections.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div><Label>Budget (₹)</Label><Input type="number" value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Start Date</Label><Input type="date" value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} /></div>
                <div><Label>End Date</Label><Input type="date" value={form.end_date} onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))} /></div>
              </div>
              <div><Label>Description</Label><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
              <Button onClick={handleCreate} disabled={createMut.isPending} className="w-full">{createMut.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Campaign'}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Megaphone, label: 'Active', value: campaigns.filter((c: any) => c.status === 'active').length.toString() },
          { icon: IndianRupee, label: 'Total Budget', value: `₹${(totalBudget / 100000).toFixed(1)}L` },
          { icon: TrendingUp, label: 'Completed', value: campaigns.filter((c: any) => c.status === 'completed').length.toString() },
          { icon: Target, label: 'Planning', value: campaigns.filter((c: any) => c.status === 'planning').length.toString() },
        ].map(k => (
          <Card key={k.label}>
            <CardContent className="pt-4 pb-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center"><k.icon className="w-4 h-4 text-primary" /></div>
              <div>
                <p className="text-xs text-muted-foreground font-body">{k.label}</p>
                <p className="text-lg font-bold font-heading text-foreground">{k.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="all">All ({campaigns.length})</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="planning">Planning</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value={tab} className="mt-4 space-y-3">
          {filtered.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No campaigns found.</p>}
          {filtered.map((c: any) => (
            <Card key={c.id} className="hover:border-primary/40 transition-colors">
              <CardContent className="pt-4 pb-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-foreground font-body">{c.title}</h4>
                      <Badge className={`text-[10px] ${statusColor[c.status || 'draft']}`}>{c.status || 'draft'}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground font-body mt-0.5">{c.collections?.name || 'No collection'} · {c.campaign_type || 'General'}</p>
                  </div>
                  {c.budget && <p className="text-sm font-semibold font-mono-data text-foreground">₹{(c.budget / 100000).toFixed(1)}L</p>}
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground font-body">
                  {c.start_date && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {c.start_date} — {c.end_date || '?'}</span>}
                  {c.description && <span className="truncate max-w-xs">{c.description}</span>}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CampaignsPage;
