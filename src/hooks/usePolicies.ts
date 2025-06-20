
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const usePolicies = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['policies', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('policies')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching policies:', error);
        throw error;
      }
      return data || [];
    },
    enabled: !!user,
  });
};

export const useCreatePolicy = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (policyData: any) => {
      if (!user) throw new Error('User not authenticated');

      console.log('Creating policy with data:', policyData);
      console.log('User ID:', user.id);

      // Generate policy number
      const { data: policyNumber, error: rpcError } = await supabase.rpc('generate_policy_number');
      
      if (rpcError) {
        console.error('Error generating policy number:', rpcError);
        throw rpcError;
      }

      console.log('Generated policy number:', policyNumber);

      const { data, error } = await supabase
        .from('policies')
        .insert({
          ...policyData,
          user_id: user.id,
          policy_number: policyNumber,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating policy:', error);
        throw error;
      }
      
      console.log('Policy created successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policies'] });
    },
    onError: (error) => {
      console.error('Policy creation failed:', error);
    },
  });
};
