import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export const useProductionOrders = (factoryId?: string) => useQuery({
  queryKey: ['production_orders', factoryId],
  queryFn: async () => {
    let q = supabase.from('production_orders').select('*, designs(title), profiles!production_orders_factory_id_fkey(full_name)').order('created_at', { ascending: false });
    if (factoryId) q = q.eq('factory_id', factoryId);
    const { data, error } = await q;
    if (error) throw error;
    return data;
  },
});

export const useUpdateProductionOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<'production_orders'> & { id: string }) => {
      const { data, error } = await supabase.from('production_orders').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['production_orders'] }),
  });
};

export const useBomItems = (orderId?: string) => useQuery({
  queryKey: ['bom_items', orderId],
  enabled: !!orderId,
  queryFn: async () => {
    const { data, error } = await supabase.from('bom_items').select('*').eq('production_order_id', orderId!);
    if (error) throw error;
    return data as Tables<'bom_items'>[];
  },
});
