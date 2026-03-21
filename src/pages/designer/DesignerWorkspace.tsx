import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Palette, Clock, CheckCircle, FileUp, Loader2, Plus, Sparkles, Download, Send } from 'lucide-react';
import { useDesigns, useCreateDesign, useUploadDesignFile, useUpdateDesign } from '@/hooks/useDesigns';
import { useCollections } from '@/hooks/useCollections';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const statusColor: Record<string, string> = {
  approved: 'bg-success text-success-foreground',
  in_review: 'bg-info text-info-foreground',
  rejected: 'bg-destructive text-destructive-foreground',
  draft: 'bg-muted text-muted-foreground',
};

const DesignerWorkspace: React.FC = () => {
  const { profile, user } = useAuth();
  const { data: designs = [], isLoading } = useDesigns({ designer_id: profile?.id });
  const { data: collections = [] } = useCollections();
  const createMut = useCreateDesign();
  const uploadMut = useUploadDesignFile();
  const updateMut = useUpdateDesign();
  const fileRef = useRef<HTMLInputElement>(null);

  // Upload form
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uForm, setUForm] = useState({ title: '', category: '', collection_id: '', description: '' });
  const [file, setFile] = useState<File | null>(null);

  // AI Generate
  const [aiOpen, setAiOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<{ imageUrl: string; description: string } | null>(null);

  const handleUpload = async () => {
    if (!uForm.title.trim() || !file || !user) return toast({ title: 'Title and file required', variant: 'destructive' });
    try {
      const url = await uploadMut.mutateAsync({ file, userId: user.id });
      await createMut.mutateAsync({
        title: uForm.title,
        category: uForm.category || null,
        collection_id: uForm.collection_id || null,
        description: uForm.description || null,
        designer_id: profile?.id,
        file_url: url,
        thumbnail_url: url,
        approval_status: 'draft',
      });
      setUploadOpen(false);
      setUForm({ title: '', category: '', collection_id: '', description: '' });
      setFile(null);
      toast({ title: 'Design uploaded!' });
    } catch (e: any) { toast({ title: 'Error', description: e.message, variant: 'destructive' }); }
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    setAiResult(null);
    try {
      const { data, error } = await supabase.functions.invoke('generate-design', { body: { prompt: aiPrompt } });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      setAiResult(data);
      toast({ title: 'Design generated!' });
    } catch (e: any) {
      toast({ title: 'Generation failed', description: e.message, variant: 'destructive' });
    } finally { setAiLoading(false); }
  };

  const handleSaveAiDesign = async () => {
    if (!aiResult || !profile) return;
    try {
      await createMut.mutateAsync({
        title: `AI: ${aiPrompt.slice(0, 50)}`,
        designer_id: profile.id,
        thumbnail_url: aiResult.imageUrl,
        file_url: aiResult.imageUrl,
        description: aiResult.description,
        approval_status: 'draft',
        // ai_prompt and is_ai_generated are custom columns added via migration
      });
      setAiOpen(false);
      setAiPrompt('');
      setAiResult(null);
      toast({ title: 'AI design saved!' });
    } catch (e: any) { toast({ title: 'Error', description: e.message, variant: 'destructive' }); }
  };

  const handleSubmitForReview = async (designId: string) => {
    try {
      await updateMut.mutateAsync({ id: designId, approval_status: 'in_review' });
      toast({ title: 'Submitted for review!' });
    } catch (e: any) { toast({ title: 'Error', description: e.message, variant: 'destructive' }); }
  };

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  const approved = designs.filter((d: any) => d.approval_status === 'approved').length;
  const pending = designs.filter((d: any) => d.approval_status === 'in_review').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Palette, label: 'My Designs', value: designs.length.toString(), sub: 'Total submissions' },
          { icon: CheckCircle, label: 'Approved', value: approved.toString(), sub: 'Ready for production' },
          { icon: Clock, label: 'Pending Review', value: pending.toString(), sub: 'Awaiting feedback' },
          { icon: FileUp, label: 'Drafts', value: designs.filter((d: any) => d.approval_status === 'draft').length.toString(), sub: 'Not yet submitted' },
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

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
          <DialogTrigger asChild><Button size="sm" className="gap-1.5"><FileUp className="w-4 h-4" /> Upload Design</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Upload Design</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Title *</Label><Input value={uForm.title} onChange={e => setUForm(f => ({ ...f, title: e.target.value }))} placeholder="Arctic Thermals Pro V3" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Category</Label><Input value={uForm.category} onChange={e => setUForm(f => ({ ...f, category: e.target.value }))} placeholder="Innerwear" /></div>
                <div><Label>Collection</Label>
                  <Select value={uForm.collection_id} onValueChange={v => setUForm(f => ({ ...f, collection_id: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{collections.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div><Label>Description</Label><Textarea value={uForm.description} onChange={e => setUForm(f => ({ ...f, description: e.target.value }))} /></div>
              <div>
                <Label>Design File *</Label>
                <Input ref={fileRef} type="file" accept="image/*,.pdf,.ai,.psd" onChange={e => setFile(e.target.files?.[0] || null)} />
              </div>
              <Button onClick={handleUpload} disabled={uploadMut.isPending || createMut.isPending} className="w-full">
                {(uploadMut.isPending || createMut.isPending) ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Upload & Save'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={aiOpen} onOpenChange={setAiOpen}>
          <DialogTrigger asChild><Button size="sm" variant="outline" className="gap-1.5"><Sparkles className="w-4 h-4" /> AI Generate Design</Button></DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary" /> AI Design Generator</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Describe your design</Label>
                <Textarea value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} placeholder='e.g. "red lace bra with floral pattern, modern style"' className="min-h-[80px]" />
              </div>
              <Button onClick={handleAiGenerate} disabled={aiLoading || !aiPrompt.trim()} className="w-full gap-2">
                {aiLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <><Sparkles className="w-4 h-4" /> Generate Design</>}
              </Button>
              {aiResult && (
                <div className="space-y-3">
                  <div className="rounded-lg overflow-hidden border border-border">
                    <img src={aiResult.imageUrl} alt="AI Generated Design" className="w-full max-h-80 object-contain bg-white" />
                  </div>
                  {aiResult.description && <p className="text-xs text-muted-foreground font-body">{aiResult.description}</p>}
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="gap-1" onClick={() => { const a = document.createElement('a'); a.href = aiResult.imageUrl; a.download = 'ai-design.png'; a.click(); }}><Download className="w-3 h-3" /> Download</Button>
                    <Button size="sm" className="gap-1" onClick={handleSaveAiDesign} disabled={createMut.isPending}><Send className="w-3 h-3" /> Save as Draft</Button>
                    <Button size="sm" variant="outline" onClick={handleAiGenerate} disabled={aiLoading}>Regenerate</Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Design Grid */}
      <div>
        <h3 className="text-sm font-heading text-foreground mb-4">My Designs</h3>
        {designs.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No designs yet. Upload or generate your first design!</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {designs.map((d: any) => (
            <Card key={d.id} className="overflow-hidden group cursor-pointer hover:border-primary/50 transition-colors">
              <div className="aspect-[4/3] relative overflow-hidden bg-muted">
                {d.thumbnail_url ? (
                  <img src={d.thumbnail_url} alt={d.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No image</div>
                )}
                <Badge className={`absolute top-2 right-2 text-[10px] ${statusColor[d.approval_status || 'draft']}`}>
                  {(d.approval_status || 'draft').replace('_', ' ')}
                </Badge>
              </div>
              <CardContent className="pt-3 pb-3">
                <p className="text-sm font-semibold text-foreground font-body">{d.title}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-muted-foreground font-body">{d.collections?.name || 'No collection'}</p>
                  <span className="text-xs text-muted-foreground font-mono-data">v{d.version_number}</span>
                </div>
                {d.approval_status === 'draft' && (
                  <Button size="sm" variant="outline" className="mt-2 w-full text-xs gap-1" onClick={() => handleSubmitForReview(d.id)}>
                    <Send className="w-3 h-3" /> Submit for Review
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DesignerWorkspace;
