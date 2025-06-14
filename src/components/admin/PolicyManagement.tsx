
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PolicyForm } from './PolicyForm';
import { useAdminPolicies, useCreateAdminPolicy, useUpdateAdminPolicy, useDeleteAdminPolicy } from '@/hooks/useAdminPolicies';
import { useToast } from '@/hooks/use-toast';
import { Edit, Trash2, Plus } from 'lucide-react';

export const PolicyManagement = () => {
  const { toast } = useToast();
  const [showPolicyForm, setShowPolicyForm] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState(null);

  const { data: policies, isLoading: policiesLoading } = useAdminPolicies();
  const createPolicyMutation = useCreateAdminPolicy();
  const updatePolicyMutation = useUpdateAdminPolicy();
  const deletePolicyMutation = useDeleteAdminPolicy();

  const handleCreatePolicy = async (data: any) => {
    try {
      await createPolicyMutation.mutateAsync(data);
      toast({ title: 'Success', description: 'Policy created successfully' });
      setShowPolicyForm(false);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to create policy', variant: 'destructive' });
    }
  };

  const handleUpdatePolicy = async (data: any) => {
    try {
      await updatePolicyMutation.mutateAsync({ id: editingPolicy.id, ...data });
      toast({ title: 'Success', description: 'Policy updated successfully' });
      setEditingPolicy(null);
      setShowPolicyForm(false);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update policy', variant: 'destructive' });
    }
  };

  const handleDeletePolicy = async (id: string) => {
    if (confirm('Are you sure you want to delete this policy?')) {
      try {
        await deletePolicyMutation.mutateAsync(id);
        toast({ title: 'Success', description: 'Policy deleted successfully' });
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to delete policy', variant: 'destructive' });
      }
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
      <PolicyForm
        policy={editingPolicy}
        onSubmit={editingPolicy ? handleUpdatePolicy : handleCreatePolicy}
        onCancel={() => {
          setShowPolicyForm(false);
          setEditingPolicy(null);
        }}
        isLoading={createPolicyMutation.isPending || updatePolicyMutation.isPending}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Policy Management</h2>
          <p className="text-gray-600 mt-1">Create and manage insurance policies</p>
        </div>
        <Button onClick={() => setShowPolicyForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Policy
        </Button>
      </div>

      {policiesLoading ? (
        <div className="text-center py-8">Loading policies...</div>
      ) : (
        <div className="grid gap-4">
          {policies?.map((policy) => (
            <Card key={policy.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <h3 className="text-lg font-semibold">
                        {policy.policy_number}
                      </h3>
                      {getStatusBadge(policy.status)}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <strong>Vehicle:</strong> {policy.vehicle_make} {policy.vehicle_model} ({policy.vehicle_year})
                      </div>
                      <div>
                        <strong>Registration:</strong> {policy.vehicle_reg_number}
                      </div>
                      <div>
                        <strong>Premium:</strong> ${policy.premium}
                      </div>
                      <div>
                        <strong>Owner:</strong> {policy.owner_name || 'N/A'}
                      </div>
                      <div>
                        <strong>Policy Type:</strong> {policy.policy_types?.name || 'N/A'}
                      </div>
                      <div>
                        <strong>Period:</strong> {policy.start_date} to {policy.expiry_date}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingPolicy(policy);
                        setShowPolicyForm(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeletePolicy(policy.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {policies?.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No policies found. Create your first policy to get started.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
