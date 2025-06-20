
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
      console.log('🔥 useCreatePolicy mutation started');
      console.log('🔎 User in mutation:', user);
      console.log('🔎 Policy data received in mutation:', policyData);
      
      if (!user) {
        console.error('❌ User not authenticated in mutation');
        throw new Error('User not authenticated');
      }

      console.log('🔎 Generating policy number...');
      // Generate policy number
      const { data: policyNumber, error: rpcError } = await supabase.rpc('generate_policy_number');
      
      if (rpcError) {
        console.error('❌ Error generating policy number:', rpcError);
        throw rpcError;
      }

      console.log('✅ Generated policy number:', policyNumber);

      // Prepare final data for insert
      const finalData = {
        ...policyData,
        user_id: user.id,
        policy_number: policyNumber,
      };

      console.log('🔎 Final data being inserted to Supabase:', finalData);
      console.log('🔎 About to call supabase.from("policies").insert()...');

      const { data, error } = await supabase
        .from('policies')
        .insert(finalData)
        .select()
        .single();

      console.log('🔎 Supabase insert response - data:', data);
      console.log('🔎 Supabase insert response - error:', error);

      if (error) {
        console.error('❌ Supabase insert error:', error);
        console.error('❌ Error code:', error.code);
        console.error('❌ Error message:', error.message);
        console.error('❌ Error details:', error.details);
        console.error('❌ Error hint:', error.hint);
        throw error;
      }
      
      console.log('✅ Policy created successfully in Supabase:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('✅ Mutation onSuccess triggered with data:', data);
      queryClient.invalidateQueries({ queryKey: ['policies'] });
    },
    onError: (error) => {
      console.error('❌ Mutation onError triggered:', error);
    },
  });
};
