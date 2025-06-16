
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const TestAdminAccess = () => {
  const { user } = useAuth();

  const grantAdminAccess = async () => {
    if (!user) {
      toast.error('No user logged in');
      return;
    }

    try {
      // Check if user already has a role
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (existingRole) {
        // Update existing role to admin
        const { error } = await supabase
          .from('user_roles')
          .update({ role: 'admin' })
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Insert new admin role
        const { error } = await supabase
          .from('user_roles')
          .insert([{ user_id: user.id, role: 'admin' }]);

        if (error) throw error;
      }

      toast.success('Admin access granted! Please refresh the page.');
    } catch (error) {
      console.error('Error granting admin access:', error);
      toast.error('Failed to grant admin access');
    }
  };

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Testing Admin Access</h3>
      <p className="text-sm text-gray-600 mb-4">
        For testing purposes, you can grant yourself admin access. In production, this would be managed by a super admin.
      </p>
      <Button onClick={grantAdminAccess} variant="outline">
        Grant Admin Access
      </Button>
    </div>
  );
};
