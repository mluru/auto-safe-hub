
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Search, Eye, Trash2, Check, X, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface PolicyWithUser {
  id: string;
  policy_number: string;
  policy_type: string;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_reg_number: string;
  start_date: string;
  expiry_date: string;
  status: string;
  premium: number;
  created_at: string;
  owner_name: string;
  owner_email: string;
  owner_phone: string;
  profiles: {
    full_name: string;
  } | null;
}

const PolicyManagementSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyWithUser | null>(null);
  const queryClient = useQueryClient();

  // Fetch policies with user information
  const { data: policies, isLoading, error } = useQuery({
    queryKey: ['admin-policies'],
    queryFn: async () => {
      console.log('Fetching policies for admin...');
      const { data, error } = await supabase
        .from('policies')
        .select(`
          id,
          policy_number,
          policy_type,
          vehicle_make,
          vehicle_model,
          vehicle_reg_number,
          start_date,
          expiry_date,
          status,
          premium,
          created_at,
          owner_name,
          owner_email,
          owner_phone,
          profiles (
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching policies:', error);
        throw error;
      }

      console.log('Fetched policies:', data);
      return data as PolicyWithUser[];
    },
  });

  // Update policy status mutation
  const updatePolicyStatusMutation = useMutation({
    mutationFn: async ({ policyId, newStatus }: { policyId: string; newStatus: string }) => {
      console.log('Updating policy status:', policyId, newStatus);
      
      const { error } = await supabase
        .from('policies')
        .update({ status: newStatus })
        .eq('id', policyId);

      if (error) {
        console.error('Error updating policy status:', error);
        throw error;
      }

      return { policyId, newStatus };
    },
    onSuccess: () => {
      toast.success('Policy status updated successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-policies'] });
    },
    onError: (error) => {
      console.error('Failed to update policy status:', error);
      toast.error('Failed to update policy status');
    },
  });

  // Delete policy mutation
  const deletePolicyMutation = useMutation({
    mutationFn: async (policyId: string) => {
      console.log('Deleting policy:', policyId);
      
      const { error } = await supabase
        .from('policies')
        .delete()
        .eq('id', policyId);

      if (error) {
        console.error('Error deleting policy:', error);
        throw error;
      }

      return policyId;
    },
    onSuccess: () => {
      toast.success('Policy deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-policies'] });
    },
    onError: (error) => {
      console.error('Failed to delete policy:', error);
      toast.error('Failed to delete policy');
    },
  });

  const filteredPolicies = policies?.filter(policy => {
    const matchesSearch = 
      policy.policy_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.owner_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.vehicle_make?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.vehicle_model?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || policy.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) || [];

  const getStatusBadgeColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'to be approved':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading policies: {error.message}</p>
      </div>
    );
  }

  const statusCounts = policies?.reduce((acc, policy) => {
    const status = policy.status || 'unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Policy Management</h2>
        <div className="flex items-center gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="to be approved">To Be Approved</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search policies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
      </div>

      {/* Status Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {Object.entries(statusCounts).map(([status, count]) => (
          <Card key={status}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 capitalize">
                    {status.replace('_', ' ')}
                  </p>
                  <p className="text-2xl font-bold">{count}</p>
                </div>
                <Badge className={getStatusBadgeColor(status)}>
                  {status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Policies ({filteredPolicies.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Policy Number</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Premium</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date Requested</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPolicies.map((policy) => (
                <TableRow key={policy.id}>
                  <TableCell className="font-medium">
                    {policy.policy_number || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {policy.owner_name || policy.profiles?.full_name || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600">{policy.owner_email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {policy.vehicle_make} {policy.vehicle_model}
                      </p>
                      <p className="text-sm text-gray-600">{policy.vehicle_reg_number}</p>
                    </div>
                  </TableCell>
                  <TableCell>{policy.policy_type || 'N/A'}</TableCell>
                  <TableCell>{formatCurrency(policy.premium)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeColor(policy.status || 'pending')}>
                      {policy.status || 'Pending'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(policy.created_at), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedPolicy(policy)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {policy.status === 'pending' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600"
                            onClick={() => 
                              updatePolicyStatusMutation.mutate({ 
                                policyId: policy.id, 
                                newStatus: 'active' 
                              })
                            }
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600"
                            onClick={() => 
                              updatePolicyStatusMutation.mutate({ 
                                policyId: policy.id, 
                                newStatus: 'rejected' 
                              })
                            }
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}

                      <Select
                        value={policy.status || 'pending'}
                        onValueChange={(newStatus) => 
                          updatePolicyStatusMutation.mutate({ 
                            policyId: policy.id, 
                            newStatus 
                          })
                        }
                      >
                        <SelectTrigger className="w-8 h-8 p-0">
                          <Clock className="h-4 w-4" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="to be approved">To Be Approved</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                          <SelectItem value="expired">Expired</SelectItem>
                        </SelectContent>
                      </Select>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Policy</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete policy {policy.policy_number}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deletePolicyMutation.mutate(policy.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredPolicies.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No policies found
            </div>
          )}
        </CardContent>
      </Card>

      {/* Policy Details Modal */}
      {selectedPolicy && (
        <Card className="fixed inset-0 z-50 m-8 max-w-4xl mx-auto bg-white shadow-xl overflow-y-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Policy Details - {selectedPolicy.policy_number}</CardTitle>
              <Button variant="outline" onClick={() => setSelectedPolicy(null)}>
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Customer Information</h3>
                <div className="space-y-2">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Name</label>
                    <p className="font-medium">
                      {selectedPolicy.owner_name || selectedPolicy.profiles?.full_name || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="font-medium">{selectedPolicy.owner_email || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="font-medium">{selectedPolicy.owner_phone || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Vehicle Information</h3>
                <div className="space-y-2">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Make & Model</label>
                    <p className="font-medium">
                      {selectedPolicy.vehicle_make} {selectedPolicy.vehicle_model}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Registration Number</label>
                    <p className="font-medium">{selectedPolicy.vehicle_reg_number}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Policy Information</h3>
                <div className="space-y-2">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Policy Type</label>
                    <p className="font-medium">{selectedPolicy.policy_type || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Premium</label>
                    <p className="font-medium">{formatCurrency(selectedPolicy.premium)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Period</label>
                    <p className="font-medium">
                      {format(new Date(selectedPolicy.start_date), 'PPP')} - {format(new Date(selectedPolicy.expiry_date), 'PPP')}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <div>
                      <Badge className={getStatusBadgeColor(selectedPolicy.status || 'pending')}>
                        {selectedPolicy.status || 'Pending'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PolicyManagementSection;
