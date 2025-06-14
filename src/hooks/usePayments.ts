
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const usePayments = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['payments', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          policies (
            policy_number,
            vehicle_make,
            vehicle_model
          )
        `)
        .eq('user_id', user.id)
        .order('payment_date', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
};
