import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useUsers = () => useQuery({
  queryKey: ['users'],
  queryFn: async () => {
    const { data: profiles, error: e1 } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (e1) throw e1;
    const { data: roles, error: e2 } = await supabase.from('user_roles').select('*');
    if (e2) throw e2;
    return (profiles || []).map(p => ({
      ...p,
      role: roles?.find(r => r.user_id === p.user_id)?.role || 'designer',
    }));
  },
});
