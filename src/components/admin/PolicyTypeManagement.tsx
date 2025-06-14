
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PolicyTypeForm } from './PolicyTypeForm';
import { useAllPolicyTypes, useCreatePolicyType, useUpdatePolicyType, useDeletePolicyType } from '@/hooks/usePolicyTypes';
import { useToast } from '@/hooks/use-toast';
import { Edit, Trash2, Plus } from 'lucide-react';

export const PolicyTypeManagement = () => {
  const { toast } = useToast();
  const [showPolicyTypeForm, setShowPolicyTypeForm] = useState(false);
  const [editingPolicyType, setEditingPolicyType] = useState(null);

  const { data: policyTypes, isLoading: policyTypesLoading } = useAllPolicyTypes();
  const createPolicyTypeMutation = useCreatePolicyType();
  const updatePolicyTypeMutation = useUpdatePolicyType();
  const deletePolicyTypeMutation = useDeletePolicyType();

  const handleCreatePolicyType = async (data: any) => {
    try {
      await createPolicyTypeMutation.mutateAsync(data);
      toast({ title: 'Success', description: 'Policy type created successfully' });
      setShowPolicyTypeForm(false);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to create policy type', variant: 'destructive' });
    }
  };

  const handleUpdatePolicyType = async (data: any) => {
    try {
      await updatePolicyTypeMutation.mutateAsync({ id: editingPolicyType.id, ...data });
      toast({ title: 'Success', description: 'Policy type updated successfully' });
      setEditingPolicyType(null);
      setShowPolicyTypeForm(false);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update policy type', variant: 'destructive' });
    }
  };

  const handleDeletePolicyType = async (id: string) => {
    if (confirm('Are you sure you want to delete this policy type?')) {
      try {
        await deletePolicyTypeMutation.mutateAsync(id);
        toast({ title: 'Success', description: 'Policy type deleted successfully' });
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to delete policy type', variant: 'destructive' });
      }
    }
  };

  if (showPolicyTypeForm) {
    return (
      <PolicyTypeForm
        policyType={editingPolicyType}
        onSubmit={editingPolicyType ? handleUpdatePolicyType : handleCreatePolicyType}
        onCancel={() => {
          setShowPolicyTypeForm(false);
          setEditingPolicyType(null);
        }}
        isLoading={createPolicyTypeMutation.isPending || updatePolicyTypeMutation.isPending}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Policy Type Management</h2>
          <p className="text-gray-600 mt-1">Create and manage policy types</p>
        </div>
        <Button onClick={() => setShowPolicyTypeForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Policy Type
        </Button>
      </div>

      {policyTypesLoading ? (
        <div className="text-center py-8">Loading policy types...</div>
      ) : (
        <div className="grid gap-4">
          {policyTypes?.map((policyType) => (
            <Card key={policyType.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <h3 className="text-lg font-semibold">{policyType.name}</h3>
                      <Badge variant={policyType.active ? 'default' : 'secondary'}>
                        {policyType.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <p className="text-gray-600">{policyType.description}</p>
                    <div className="text-sm text-gray-600">
                      <strong>Base Premium:</strong> ${policyType.base_premium || 'N/A'}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingPolicyType(policyType);
                        setShowPolicyTypeForm(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeletePolicyType(policyType.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {policyTypes?.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No policy types found. Create your first policy type to get started.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
