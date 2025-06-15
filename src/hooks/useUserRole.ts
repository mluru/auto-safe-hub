
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useUserRole = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-role', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      console.log('Fetching role for user:', user.id);
      
      // First try to get role from user_roles table
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (!roleError && roleData) {
        console.log('Found role in user_roles:', roleData.role);
        return roleData.role;
      }

      // If not found in user_roles, check if user is admin based on email or other criteria
      // For now, return 'user' as default
      console.log('No role found, defaulting to user');
      return 'user';
    },
    enabled: !!user,
  });
};
