
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useClaims = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['claims', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('claims')
        .select(`
          *,
          policies (
            policy_number,
            vehicle_make,
            vehicle_model,
            vehicle_year
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
};

export const useCreateClaim = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (claimData: any) => {
      if (!user) throw new Error('User not authenticated');

      // Generate claim number
      const { data: claimNumber } = await supabase.rpc('generate_claim_number');

      const { data, error } = await supabase
        .from('claims')
        .insert({
          ...claimData,
          user_id: user.id,
          claim_number: claimNumber,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['claims'] });
    },
  });
};
