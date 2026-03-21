import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export const useDistributorOrders = () => useQuery({
  queryKey: ['distributor_orders'],
  queryFn: async () => {
    const { data, error } = await supabase.from('distributor_orders').select('*, designs(title)').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
});

export const useCreateDistributorOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (o: TablesInsert<'distributor_orders'>) => {
      const { data, error } = await supabase.from('distributor_orders').insert(o).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['distributor_orders'] }),
  });
};

export const useUpdateDistributorOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<'distributor_orders'> & { id: string }) => {
      const { data, error } = await supabase.from('distributor_orders').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['distributor_orders'] }),
  });
};
