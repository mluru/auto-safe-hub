
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const usePolicyTypes = () => {
  return useQuery({
    queryKey: ['policy-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('policy_types')
        .select('*')
        .eq('active', true)
        .order('name');

      if (error) throw error;
      return data || [];
    },
  });
};

export const useAllPolicyTypes = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['all-policy-types', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('policy_types')
        .select('*')
        .order('name');

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
};

export const useCreatePolicyType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (policyTypeData: any) => {
      const { data, error } = await supabase
        .from('policy_types')
        .insert(policyTypeData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policy-types'] });
      queryClient.invalidateQueries({ queryKey: ['all-policy-types'] });
    },
  });
};

export const useUpdatePolicyType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updateData }: any) => {
      const { data, error } = await supabase
        .from('policy_types')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policy-types'] });
      queryClient.invalidateQueries({ queryKey: ['all-policy-types'] });
    },
  });
};

export const useDeletePolicyType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('policy_types')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policy-types'] });
      queryClient.invalidateQueries({ queryKey: ['all-policy-types'] });
    },
  });
};
