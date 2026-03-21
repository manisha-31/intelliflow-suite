import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export const useCollections = () => useQuery({
  queryKey: ['collections'],
  queryFn: async () => {
    const { data, error } = await supabase.from('collections').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data as Tables<'collections'>[];
  },
});

export const useCreateCollection = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (c: TablesInsert<'collections'>) => {
      const { data, error } = await supabase.from('collections').insert(c).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['collections'] }),
  });
};

export const useUpdateCollection = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<'collections'> & { id: string }) => {
      const { data, error } = await supabase.from('collections').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['collections'] }),
  });
};

export const useDeleteCollection = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('collections').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['collections'] }),
  });
};
