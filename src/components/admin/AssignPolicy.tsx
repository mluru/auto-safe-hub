
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { PolicyForm } from './PolicyForm';
import { supabase } from '@/integrations/supabase/client';
import { useCreateAdminPolicy } from '@/hooks/useAdminPolicies';
import { useToast } from '@/hooks/use-toast';
import { Plus, User, ArrowLeft } from 'lucide-react';

export const AssignPolicy = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [userPolicies, setUserPolicies] = useState<any[]>([]);
  const [showPolicyForm, setShowPolicyForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(true);

  const createPolicyMutation = useCreateAdminPolicy();

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
      setUsersLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .order('full_name');
      
      if (error) throw error;
      console.log('Fetched users:', data);
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch users',
        variant: 'destructive'
      });
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchUserPolicies = async (userId: string) => {
    setLoading(true);
    try {
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
      
      if (error) throw error;
      console.log('Fetched user policies:', data);
      setUserPolicies(data || []);
    } catch (error) {
      console.error('Error fetching user policies:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch user policies',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePolicy = async (data: any) => {
    try {
      await createPolicyMutation.mutateAsync({
        ...data,
        user_id: selectedUserId
      });
      toast({ title: 'Success', description: 'Policy assigned successfully' });
      setShowPolicyForm(false);
      fetchUserPolicies(selectedUserId);
    } catch (error) {
      console.error('Error creating policy:', error);
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

  const selectedUser = users.find(user => user.id === selectedUserId);

  if (showPolicyForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowPolicyForm(false)}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <div>
              <h2 className="text-2xl font-semibold">Assign New Policy</h2>
              {selectedUser && (
                <p className="text-gray-600">For: {selectedUser.full_name}</p>
              )}
            </div>
          </div>
        </div>
        <PolicyForm
          onSubmit={handleCreatePolicy}
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
        <p className="text-gray-600 mt-1">Select a user and assign them a new insurance policy</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Select User
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label htmlFor="user-select" className="block text-sm font-medium mb-2">
                Choose User
              </label>
              {usersLoading ? (
                <div className="flex items-center justify-center p-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  <span className="ml-2">Loading users...</span>
                </div>
              ) : (
                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a user to assign policy" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.full_name || 'Unnamed User'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {selectedUserId && (
              <Button onClick={() => setShowPolicyForm(true)} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Create New Policy for {selectedUser?.full_name || 'Selected User'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedUserId && (
        <Card>
          <CardHeader>
            <CardTitle>Current Policies for {selectedUser?.full_name}</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                Loading policies...
              </div>
            ) : userPolicies.length > 0 ? (
              <div className="space-y-3">
                {userPolicies.map((policy) => (
                  <div key={policy.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{policy.policy_number}</p>
                      <p className="text-sm text-gray-600">
                        {policy.vehicle_make} {policy.vehicle_model} ({policy.vehicle_year})
                      </p>
                      <p className="text-sm text-gray-600">
                        {policy.policy_types?.name || 'N/A'} - ${policy.premium}
                      </p>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(policy.status)}
                      <p className="text-sm text-gray-600 mt-1">
                        {policy.start_date} to {policy.expiry_date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No policies found for this user
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
