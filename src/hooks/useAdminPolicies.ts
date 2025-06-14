
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useAdminPolicies = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['admin-policies', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('policies')
        .select(`
          *,
          policy_types (
            name,
            description
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
};

export const useCreateAdminPolicy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (policyData: any) => {
      // Generate policy number
      const { data: policyNumber } = await supabase.rpc('generate_policy_number');

      const { data, error } = await supabase
        .from('policies')
        .insert({
          ...policyData,
          policy_number: policyNumber,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-policies'] });
      queryClient.invalidateQueries({ queryKey: ['policies'] });
    },
  });
};

export const useUpdateAdminPolicy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updateData }: any) => {
      const { data, error } = await supabase
        .from('policies')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-policies'] });
      queryClient.invalidateQueries({ queryKey: ['policies'] });
    },
  });
};

export const useDeleteAdminPolicy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('policies')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-policies'] });
      queryClient.invalidateQueries({ queryKey: ['policies'] });
    },
  });
};
