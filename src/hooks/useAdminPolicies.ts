
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Fetch all policies for admin
export const useAdminPolicies = () => {
  return useQuery({
    queryKey: ['admin-policies'],
    queryFn: async () => {
      console.log('Fetching all policies for admin');
      
      const { data, error } = await supabase
        .from('policies')
        .select(`
          *,
          policy_types (
            name,
            description
          ),
          profiles (
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching admin policies:', error);
        throw error;
      }

      console.log('Admin policies fetched:', data?.length);
      return data || [];
    },
  });
};

// Create new policy
export const useCreateAdminPolicy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (policyData: any) => {
      console.log('Creating policy:', policyData);
      
      // Generate policy number
      const { data: policyNumber } = await supabase.rpc('generate_policy_number');
      
      const { data, error } = await supabase
        .from('policies')
        .insert([{ ...policyData, policy_number: policyNumber }])
        .select()
        .single();

      if (error) {
        console.error('Error creating policy:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-policies'] });
    },
  });
};

// Update policy
export const useUpdateAdminPolicy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...policyData }: any) => {
      console.log('Updating policy:', id, policyData);
      
      const { data, error } = await supabase
        .from('policies')
        .update(policyData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating policy:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-policies'] });
    },
  });
};

// Delete policy
export const useDeleteAdminPolicy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting policy:', id);
      
      const { error } = await supabase
        .from('policies')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting policy:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-policies'] });
    },
  });
};
