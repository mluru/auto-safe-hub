
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useUserRole = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-role', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      console.log('Fetching role for user:', user.id, user.email);
      
      // Check user_roles table for role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (!roleError && roleData) {
        console.log('Found role in user_roles:', roleData.role);
        return roleData.role;
      }

      console.log('No role found in user_roles, checking email for admin access');
      
      // For testing: if email contains 'admin', grant admin access
      // Remove this in production and use proper role assignment
      if (user.email?.includes('admin')) {
        console.log('Admin access granted based on email');
        return 'admin';
      }

      console.log('No admin access, defaulting to user role');
      return 'user';
    },
    enabled: !!user,
  });
};
