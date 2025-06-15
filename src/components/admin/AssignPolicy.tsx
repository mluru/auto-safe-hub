
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PolicyForm } from './PolicyForm';
import { useCreateAdminPolicy } from '@/hooks/useAdminPolicies';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Plus, User } from 'lucide-react';

export const AssignPolicy = () => {
  const { toast } = useToast();
  const [selectedUserId, setSelectedUserId] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [userPolicies, setUserPolicies] = useState<any[]>([]);
  const [showPolicyForm, setShowPolicyForm] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingPolicies, setLoadingPolicies] = useState(false);

  const createPolicyMutation = useCreateAdminPolicy();

  console.log('AssignPolicy - selectedUserId:', selectedUserId, 'users:', users.length, 'userPolicies:', userPolicies.length);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      fetchUserPolicies(selectedUserId);
    } else {
      setUserPolicies([]);
    }
  }, [selectedUserId]);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .order('full_name');
      
      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
      
      console.log('Fetched users:', data);
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({ title: 'Error', description: 'Failed to fetch users', variant: 'destructive' });
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchUserPolicies = async (userId: string) => {
    try {
      setLoadingPolicies(true);
      const { data, error } = await supabase
        .from('policies')
        .select(`
          *,
          policy_types (
            name,
            description
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching user policies:', error);
        throw error;
      }
      
      console.log('Fetched user policies:', data);
      setUserPolicies(data || []);
    } catch (error) {
      console.error('Error fetching user policies:', error);
      toast({ title: 'Error', description: 'Failed to fetch user policies', variant: 'destructive' });
    } finally {
      setLoadingPolicies(false);
    }
  };

  const handleAssignPolicy = async (data: any) => {
    console.log('Assigning policy to user:', selectedUserId, 'with data:', data);
    try {
      await createPolicyMutation.mutateAsync({
        ...data,
        user_id: selectedUserId,
      });
      toast({ title: 'Success', description: 'Policy assigned successfully' });
      setShowPolicyForm(false);
      // Refresh user policies
      fetchUserPolicies(selectedUserId);
    } catch (error) {
      console.error('Policy assignment error:', error);
      toast({ title: 'Error', description: 'Failed to assign policy', variant: 'destructive' });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      expired: 'destructive',
      cancelled: 'secondary',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  if (showPolicyForm) {
    return (
      <div className="space-y-4">
        <Button
          variant="outline"
          onClick={() => setShowPolicyForm(false)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Assign Policy
        </Button>
        <PolicyForm
          onSubmit={handleAssignPolicy}
          onCancel={() => setShowPolicyForm(false)}
          isLoading={createPolicyMutation.isPending}
          prefilledUserId={selectedUserId}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Assign Policy to User</h2>
        <p className="text-gray-600 mt-1">Select a user and assign a new policy</p>
      </div>

      {/* User Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Select User
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loadingUsers ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                <p>Loading users...</p>
              </div>
            ) : (
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a user to assign policy" />
                </SelectTrigger>
                <SelectContent>
                  {users.map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            {selectedUserId && (
              <Button onClick={() => setShowPolicyForm(true)} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Assign New Policy
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Current User Policies */}
      {selectedUserId && (
        <Card>
          <CardHeader>
            <CardTitle>Current Policies for Selected User</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingPolicies ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                <p>Loading policies...</p>
              </div>
            ) : userPolicies.length > 0 ? (
              <div className="space-y-4">
                {userPolicies.map((policy) => (
                  <div key={policy.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold">{policy.policy_number}</h4>
                          {getStatusBadge(policy.status)}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                          <div><strong>Vehicle:</strong> {policy.vehicle_make} {policy.vehicle_model}</div>
                          <div><strong>Premium:</strong> ${policy.premium}</div>
                          <div><strong>Start Date:</strong> {policy.start_date}</div>
                          <div><strong>Expiry Date:</strong> {policy.expiry_date}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No existing policies for this user</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
