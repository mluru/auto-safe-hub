
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Fetch policy types for user (active only)
export const usePolicyTypes = () => {
  return useQuery({
    queryKey: ['policy-types'],
    queryFn: async () => {
      console.log('Fetching active policy types');
      
      const { data, error } = await supabase
        .from('policy_types')
        .select('*')
        .eq('active', true)
        .order('name');

      if (error) {
        console.error('Error fetching policy types:', error);
        throw error;
      }

      console.log('Policy types fetched:', data?.length);
      return data || [];
    },
  });
};

// Fetch all policy types for admin
export const useAllPolicyTypes = () => {
  return useQuery({
    queryKey: ['all-policy-types'],
    queryFn: async () => {
      console.log('Fetching all policy types for admin');
      
      const { data, error } = await supabase
        .from('policy_types')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching all policy types:', error);
        throw error;
      }

      console.log('All policy types fetched:', data?.length);
      return data || [];
    },
  });
};

// Create policy type
export const useCreatePolicyType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (policyTypeData: any) => {
      console.log('Creating policy type:', policyTypeData);
      
      const { data, error } = await supabase
        .from('policy_types')
        .insert([policyTypeData])
        .select()
        .single();

      if (error) {
        console.error('Error creating policy type:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-policy-types'] });
      queryClient.invalidateQueries({ queryKey: ['policy-types'] });
    },
  });
};

// Update policy type
export const useUpdatePolicyType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...policyTypeData }: any) => {
      console.log('Updating policy type:', id, policyTypeData);
      
      const { data, error } = await supabase
        .from('policy_types')
        .update(policyTypeData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating policy type:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-policy-types'] });
      queryClient.invalidateQueries({ queryKey: ['policy-types'] });
    },
  });
};

// Delete policy type
export const useDeletePolicyType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting policy type:', id);
      
      const { error } = await supabase
        .from('policy_types')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting policy type:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-policy-types'] });
      queryClient.invalidateQueries({ queryKey: ['policy-types'] });
    },
  });
};
