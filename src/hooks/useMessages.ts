import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

export const useMessages = (collectionId?: string) => {
  const qc = useQueryClient();

  useEffect(() => {
    if (!collectionId) return;
    const channel = supabase
      .channel(`messages-${collectionId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `collection_id=eq.${collectionId}` }, () => {
        qc.invalidateQueries({ queryKey: ['messages', collectionId] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [collectionId, qc]);

  return useQuery({
    queryKey: ['messages', collectionId],
    enabled: !!collectionId,
    queryFn: async () => {
      const { data, error } = await supabase.from('messages').select('*, profiles!messages_sender_id_fkey(full_name)').eq('collection_id', collectionId!).order('created_at', { ascending: true });
      if (error) throw error;
      return data;
    },
  });
};

export const useSendMessage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ content, collectionId, senderId }: { content: string; collectionId: string; senderId: string }) => {
      const { error } = await supabase.from('messages').insert({ content, collection_id: collectionId, sender_id: senderId });
      if (error) throw error;
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ['messages', vars.collectionId] }),
  });
};
