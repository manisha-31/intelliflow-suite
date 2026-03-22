import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FolderOpen, Search, Plus, Calendar, Palette, Package, TrendingUp, Loader2, Trash2 } from 'lucide-react';
import { useCollections, useCreateCollection, useDeleteCollection } from '@/hooks/useCollections';
import { useDesigns } from '@/hooks/useDesigns';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { demoCollections, demoDesigns } from '@/data/demoData';

const statusColor: Record<string, string> = {
  launched: 'bg-success text-success-foreground',
  in_production: 'bg-info text-info-foreground',
  design_phase: 'bg-warning text-warning-foreground',
  planning: 'bg-muted text-muted-foreground',
};
const statusLabel: Record<string, string> = {
  launched: 'Launched', in_production: 'In Production', design_phase: 'Design Phase', planning: 'Planning',
};

const CollectionsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', season: '', year: new Date().getFullYear(), description: '', status: 'planning', target_launch_date: '' });
  const { profile } = useAuth();
  const { data: dbCollections = [], isLoading } = useCollections();
  const { data: dbDesigns = [] } = useDesigns();
  const createMut = useCreateCollection();
  const deleteMut = useDeleteCollection();

  const isDemo = dbCollections.length === 0;
  const collections = isDemo ? demoCollections : dbCollections;
  const designs = isDemo ? demoDesigns : dbDesigns;

  const filtered = collections.filter((c: any) => c.name.toLowerCase().includes(search.toLowerCase()));

  const designCounts = (collId: string) => {
    if (isDemo) {
      const dc = demoCollections.find(c => c.id === collId);
      return { total: dc?.designs || 0, approved: dc?.approved || 0 };
    }
    const d = designs.filter((x: any) => x.collection_id === collId);
    return { total: d.length, approved: d.filter((x: any) => x.approval_status === 'approved').length };
  };

  const handleCreate = async () => {
    if (!form.name.trim()) return toast({ title: 'Name required', variant: 'destructive' });
    try {
      await createMut.mutateAsync({ ...form, year: form.year, created_by: profile?.id });
      setOpen(false);
      setForm({ name: '', season: '', year: new Date().getFullYear(), description: '', status: 'planning', target_launch_date: '' });
      toast({ title: 'Collection created!' });
    } catch (e: any) { toast({ title: 'Error', description: e.message, variant: 'destructive' }); }
  };

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  const totalDesigns = isDemo ? demoCollections.reduce((s, c) => s + c.designs, 0) : designs.length;

  return (
    <div className="space-y-6 animate-fade-in">
      {isDemo && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg px-4 py-2.5 text-xs text-muted-foreground font-body">
          📊 Showing demo data. Create your first collection to see real data.
        </div>
      )}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-lg font-heading text-foreground">Collections</h3>
          <p className="text-xs text-muted-foreground font-body">{collections.length} collections across all seasons</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-muted-foreground" />
            <Input placeholder="Search collections..." className="pl-8 h-9 w-52 text-sm" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          {(profile?.role === 'admin' || profile?.role === 'marketing_manager') && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild><Button size="sm" className="gap-1.5"><Plus className="w-4 h-4" /> New Collection</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Create Collection</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  <div><Label>Name *</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Winter Thermals 2026" /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label>Season</Label>
                      <Select value={form.season} onValueChange={v => setForm(f => ({ ...f, season: v }))}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          {['Winter', 'Summer', 'Monsoon', 'All Season'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div><Label>Year</Label><Input type="number" value={form.year} onChange={e => setForm(f => ({ ...f, year: +e.target.value }))} /></div>
                  </div>
                  <div><Label>Description</Label><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief description..." /></div>
                  <div><Label>Target Launch Date</Label><Input type="date" value={form.target_launch_date} onChange={e => setForm(f => ({ ...f, target_launch_date: e.target.value }))} /></div>
                  <Button onClick={handleCreate} disabled={createMut.isPending} className="w-full">{createMut.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Collection'}</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: FolderOpen, label: 'Total Collections', value: collections.length.toString() },
          { icon: Palette, label: 'Total Designs', value: totalDesigns.toString() },
          { icon: Package, label: 'In Production', value: collections.filter((c: any) => c.status === 'in_production').length.toString() },
          { icon: TrendingUp, label: 'Launched', value: collections.filter((c: any) => c.status === 'launched').length.toString() },
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.length === 0 && <p className="text-sm text-muted-foreground font-body col-span-2 text-center py-8">No collections found.</p>}
        {filtered.map((c: any) => {
          const dc = designCounts(c.id);
          const progress = dc.total > 0 ? Math.round((dc.approved / dc.total) * 100) : 0;
          return (
            <Card key={c.id} className="hover:border-primary/40 transition-colors cursor-pointer">
              <CardContent className="pt-5 pb-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground font-body">{c.name}</h4>
                    <p className="text-xs text-muted-foreground font-body mt-0.5">{c.description || 'No description'}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge className={`text-[10px] shrink-0 ${statusColor[c.status || 'planning']}`}>{statusLabel[c.status || 'planning']}</Badge>
                    {!isDemo && profile?.role === 'admin' && (
                      <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => { deleteMut.mutate(c.id); toast({ title: 'Deleted' }); }}><Trash2 className="w-3 h-3 text-destructive" /></Button>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground font-body">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {c.target_launch_date || 'No date'}</span>
                  <span>{c.season} {c.year}</span>
                </div>
                <div className="flex items-center gap-4 text-xs font-body">
                  <span className="text-muted-foreground">{dc.approved}/{dc.total} designs approved</span>
                  <span className="ml-auto font-mono-data text-foreground">{progress}%</span>
                </div>
                <Progress value={progress} className="h-1.5" />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CollectionsPage;
