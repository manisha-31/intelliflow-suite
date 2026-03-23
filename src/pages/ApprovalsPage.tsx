import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, XCircle, Clock, Eye, ThumbsUp, ThumbsDown, Loader2, MessageSquare } from 'lucide-react';
import { useApprovalDesigns, useApproveDesign, useRejectDesign } from '@/hooks/useApprovals';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { demoDesigns } from '@/data/demoData';

const ApprovalsPage: React.FC = () => {
  const { profile } = useAuth();
  const { data: dbPending = [], isLoading: lp } = useApprovalDesigns('pending');
  const { data: dbApproved = [] } = useApprovalDesigns('approved');
  const { data: dbRejected = [] } = useApprovalDesigns('rejected');
  const approveMut = useApproveDesign();
  const rejectMut = useRejectDesign();
  const [rejectDialog, setRejectDialog] = useState<{ open: boolean; designId: string }>({ open: false, designId: '' });
  const [reason, setReason] = useState('');
  const [commentDialog, setCommentDialog] = useState<{ open: boolean; designId: string }>({ open: false, designId: '' });
  const [comment, setComment] = useState('');

  const isDemo = dbPending.length === 0 && dbApproved.length === 0 && dbRejected.length === 0;
  const pending = isDemo ? demoDesigns.filter(d => d.approval_status === 'in_review') : dbPending;
  const approved = isDemo ? demoDesigns.filter(d => d.approval_status === 'approved') : dbApproved;
  const rejected = isDemo ? demoDesigns.filter(d => d.approval_status === 'rejected') : dbRejected;

  const handleApprove = async (designId: string) => {
    if (!profile) return;
    if (isDemo) return toast({ title: 'Demo mode — create real designs to use approvals' });
    try {
      await approveMut.mutateAsync({ designId, reviewerId: profile.id, comments: comment || undefined });
      toast({ title: 'Design approved!' });
      setCommentDialog({ open: false, designId: '' });
      setComment('');
    } catch (e: any) { toast({ title: 'Error', description: e.message, variant: 'destructive' }); }
  };

  const handleReject = async () => {
    if (!profile || !reason.trim()) return toast({ title: 'Reason required', variant: 'destructive' });
    if (isDemo) return toast({ title: 'Demo mode — create real designs to use approvals' });
    try {
      await rejectMut.mutateAsync({ designId: rejectDialog.designId, reviewerId: profile.id, reason });
      setRejectDialog({ open: false, designId: '' });
      setReason('');
      toast({ title: 'Design rejected' });
    } catch (e: any) { toast({ title: 'Error', description: e.message, variant: 'destructive' }); }
  };

  if (lp) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Clock, label: 'Pending Review', value: pending.length.toString(), color: 'text-warning' },
          { icon: CheckCircle, label: 'Approved', value: approved.length.toString(), color: 'text-success' },
          { icon: XCircle, label: 'Rejected', value: rejected.length.toString(), color: 'text-destructive' },
          { icon: Eye, label: 'Total Designs', value: (pending.length + approved.length + rejected.length).toString(), color: 'text-info' },
        ].map(k => (
          <Card key={k.label}>
            <CardContent className="pt-5 pb-4">
              <p className="text-xs text-muted-foreground font-body uppercase tracking-wider">{k.label}</p>
              <p className={`text-2xl font-bold font-heading mt-1 ${k.color}`}>{k.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approved.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejected.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4 space-y-3">
          {pending.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No designs pending review.</p>}
          {pending.map((d: any) => (
            <Card key={d.id} className="hover:border-primary/40 transition-colors">
              <CardContent className="pt-4 pb-4 flex items-center gap-4">
                {d.thumbnail_url && <img src={d.thumbnail_url} alt={d.title} className="w-16 h-16 rounded-lg object-cover shrink-0" />}
                {!d.thumbnail_url && <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center shrink-0 text-xs text-muted-foreground">No img</div>}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground font-body">{d.title}</p>
                    <Badge variant="outline" className="text-[10px]">v{d.version_number}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground font-body mt-0.5">{d.profiles?.full_name || 'Unknown'} · {d.collections?.name || 'No collection'} · {d.category || 'Uncategorized'}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={() => { setCommentDialog({ open: true, designId: d.id }); }}><MessageSquare className="w-3 h-3" /> Comment</Button>
                  <Button size="sm" variant="destructive" className="gap-1 text-xs" onClick={() => setRejectDialog({ open: true, designId: d.id })} disabled={rejectMut.isPending}><ThumbsDown className="w-3 h-3" /> Reject</Button>
                  <Button size="sm" className="gap-1 text-xs" onClick={() => handleApprove(d.id)} disabled={approveMut.isPending}><ThumbsUp className="w-3 h-3" /> Approve</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="approved" className="mt-4 space-y-3">
          {approved.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No approved designs yet.</p>}
          {approved.map((d: any) => (
            <Card key={d.id}>
              <CardContent className="pt-4 pb-4 flex items-center gap-4">
                {d.thumbnail_url ? <img src={d.thumbnail_url} alt={d.title} className="w-16 h-16 rounded-lg object-cover shrink-0" /> : <div className="w-16 h-16 rounded-lg bg-muted shrink-0" />}
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground font-body">{d.title}</p>
                  <p className="text-xs text-muted-foreground font-body">{d.profiles?.full_name} · {d.collections?.name}</p>
                </div>
                <Badge className="bg-success text-success-foreground text-[10px]">Approved</Badge>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="rejected" className="mt-4 space-y-3">
          {rejected.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No rejected designs.</p>}
          {rejected.map((d: any) => (
            <Card key={d.id} className="border-destructive/30">
              <CardContent className="pt-4 pb-4 flex items-center gap-4">
                {d.thumbnail_url ? <img src={d.thumbnail_url} alt={d.title} className="w-16 h-16 rounded-lg object-cover shrink-0" /> : <div className="w-16 h-16 rounded-lg bg-muted shrink-0" />}
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground font-body">{d.title}</p>
                  <p className="text-xs text-muted-foreground font-body">{d.profiles?.full_name} · {d.collections?.name}</p>
                  {d.rejection_reason && <p className="text-xs text-destructive font-body mt-1">Reason: {d.rejection_reason}</p>}
                </div>
                <Badge className="bg-destructive text-destructive-foreground text-[10px]">Rejected</Badge>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Reject Dialog */}
      <Dialog open={rejectDialog.open} onOpenChange={o => setRejectDialog({ open: o, designId: rejectDialog.designId })}>
        <DialogContent>
          <DialogHeader><DialogTitle>Reject Design</DialogTitle></DialogHeader>
          <Textarea placeholder="Provide reason for rejection..." value={reason} onChange={e => setReason(e.target.value)} />
          <Button variant="destructive" onClick={handleReject} disabled={rejectMut.isPending}>{rejectMut.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Rejection'}</Button>
        </DialogContent>
      </Dialog>

      {/* Comment + Approve Dialog */}
      <Dialog open={commentDialog.open} onOpenChange={o => setCommentDialog({ open: o, designId: commentDialog.designId })}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Comment & Approve</DialogTitle></DialogHeader>
          <Textarea placeholder="Optional comment..." value={comment} onChange={e => setComment(e.target.value)} />
          <Button onClick={() => handleApprove(commentDialog.designId)} disabled={approveMut.isPending}>{approveMut.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Approve with Comment'}</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApprovalsPage;
