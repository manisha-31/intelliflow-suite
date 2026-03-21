import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export const useDesigns = (filters?: { designer_id?: string; approval_status?: string }) => useQuery({
  queryKey: ['designs', filters],
  queryFn: async () => {
    let q = supabase.from('designs').select('*, collections(name), profiles!designs_designer_id_fkey(full_name)').order('created_at', { ascending: false });
    if (filters?.designer_id) q = q.eq('designer_id', filters.designer_id);
    if (filters?.approval_status) q = q.eq('approval_status', filters.approval_status);
    const { data, error } = await q;
    if (error) throw error;
    return data;
  },
});

export const useCreateDesign = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (d: TablesInsert<'designs'>) => {
      const { data, error } = await supabase.from('designs').insert(d).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['designs'] }),
  });
};

export const useUpdateDesign = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<'designs'> & { id: string }) => {
      const { data, error } = await supabase.from('designs').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['designs'] }),
  });
};

export const useUploadDesignFile = () => {
  return useMutation({
    mutationFn: async ({ file, userId }: { file: File; userId: string }) => {
      const ext = file.name.split('.').pop();
      const path = `${userId}/${Date.now()}.${ext}`;
      const { data, error } = await supabase.storage.from('design-assets').upload(path, file);
      if (error) throw error;
      const { data: urlData } = supabase.storage.from('design-assets').getPublicUrl(data.path);
      return urlData.publicUrl;
    },
  });
};
