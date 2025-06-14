
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { PolicyForm } from '@/components/admin/PolicyForm';
import { PolicyTypeForm } from '@/components/admin/PolicyTypeForm';
import { useAdminPolicies, useCreateAdminPolicy, useUpdateAdminPolicy, useDeleteAdminPolicy } from '@/hooks/useAdminPolicies';
import { useAllPolicyTypes, useCreatePolicyType, useUpdatePolicyType, useDeletePolicyType } from '@/hooks/usePolicyTypes';
import { useToast } from '@/hooks/use-toast';
import { Edit, Trash2, Plus, Car, FileText } from 'lucide-react';

const Admin = () => {
  const { toast } = useToast();
  const [showPolicyForm, setShowPolicyForm] = useState(false);
  const [showPolicyTypeForm, setShowPolicyTypeForm] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [editingPolicyType, setEditingPolicyType] = useState(null);

  const { data: policies, isLoading: policiesLoading } = useAdminPolicies();
  const { data: policyTypes, isLoading: policyTypesLoading } = useAllPolicyTypes();

  const createPolicyMutation = useCreateAdminPolicy();
  const updatePolicyMutation = useUpdateAdminPolicy();
  const deletePolicyMutation = useDeleteAdminPolicy();

  const createPolicyTypeMutation = useCreatePolicyType();
  const updatePolicyTypeMutation = useUpdatePolicyType();
  const deletePolicyTypeMutation = useDeletePolicyType();

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
      await updatePolicyMutation.mutateAsync({ id: editingPolicy.i…, ...data });
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

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      expired: 'destructive',
      cancelled: 'secondary',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Portal</h1>
          <p className="text-gray-600 mt-2">Manage insurance policies and policy types</p>
        </div>

        <Tabs defaultValue="policies" className="space-y-6">
          <TabsList>
            <TabsTrigger value="policies" className="flex items-center gap-2">
              <Car className="h-4 w-4" />
              Policies
            </TabsTrigger>
            <TabsTrigger value="policy-types" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Policy Types
            </TabsTrigger>
          </TabsList>

          <TabsContent value="policies">
            {showPolicyForm ? (
              <PolicyForm
                policy={editingPolicy}
                onSubmit={editingPolicy ? handleUpdatePolicy : handleCreatePolicy}
                onCancel={() => {
                  setShowPolicyForm(false);
                  setEditingPolicy(null);
                }}
                isLoading={createPolicyMutation.isPending || updatePolicyMutation.isPending}
              />
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold">Policies Management</h2>
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
            )}
          </TabsContent>

          <TabsContent value="policy-types">
            {showPolicyTypeForm ? (
              <PolicyTypeForm
                policyType={editingPolicyType}
                onSubmit={editingPolicyType ? handleUpdatePolicyType : handleCreatePolicyType}
                onCancel={() => {
                  setShowPolicyTypeForm(false);
                  setEditingPolicyType(null);
                }}
                isLoading={createPolicyTypeMutation.isPending || updatePolicyTypeMutation.isPending}
              />
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold">Policy Types Management</h2>
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
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
