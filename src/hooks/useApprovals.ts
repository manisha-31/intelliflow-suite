import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { TablesInsert } from '@/integrations/supabase/types';

export const useApprovalDesigns = (status?: string) => useQuery({
  queryKey: ['approval_designs', status],
  queryFn: async () => {
    let q = supabase.from('designs').select('*, collections(name), profiles!designs_designer_id_fkey(full_name)').order('created_at', { ascending: false });
    if (status === 'pending') q = q.eq('approval_status', 'in_review');
    else if (status === 'approved') q = q.eq('approval_status', 'approved');
    else if (status === 'rejected') q = q.eq('approval_status', 'rejected');
    const { data, error } = await q;
    if (error) throw error;
    return data;
  },
});

export const useApproveDesign = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ designId, reviewerId, comments }: { designId: string; reviewerId: string; comments?: string }) => {
      // Update design status
      const { error: e1 } = await supabase.from('designs').update({ approval_status: 'approved', approved_at: new Date().toISOString() }).eq('id', designId);
      if (e1) throw e1;
      // Create approval stage record
      const { error: e2 } = await supabase.from('approval_stages').insert({ design_id: designId, reviewer_id: reviewerId, decision: 'approved', stage_name: 'Final Review', comments: comments || 'Approved', reviewed_at: new Date().toISOString() });
      if (e2) throw e2;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['approval_designs'] });
      qc.invalidateQueries({ queryKey: ['designs'] });
    },
  });
};

export const useRejectDesign = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ designId, reviewerId, reason }: { designId: string; reviewerId: string; reason: string }) => {
      const { error: e1 } = await supabase.from('designs').update({ approval_status: 'rejected', rejection_reason: reason }).eq('id', designId);
      if (e1) throw e1;
      const { error: e2 } = await supabase.from('approval_stages').insert({ design_id: designId, reviewer_id: reviewerId, decision: 'rejected', stage_name: 'Final Review', comments: reason, reviewed_at: new Date().toISOString() });
      if (e2) throw e2;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['approval_designs'] });
      qc.invalidateQueries({ queryKey: ['designs'] });
    },
  });
};
