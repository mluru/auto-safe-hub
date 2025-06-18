import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
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
import { toast } from 'sonner';
import { Search, Filter, Eye, CheckCircle, XCircle, Trash2, FileText } from 'lucide-react';

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
  user_id: string;
  customer_name?: string;
}

const PolicyManagementSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyWithUser | null>(null);
  const queryClient = useQueryClient();

  // Fetch all policies with user information
  const { data: policies = [], isLoading, error } = useQuery({
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
          user_id
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching policies:', error);
        throw error;
      }

      // Transform the data to include customer name from owner_name
      const transformedData: PolicyWithUser[] = (data || []).map(policy => ({
        ...policy,
        customer_name: policy.owner_name
      }));

      console.log('Fetched policies:', transformedData);
      return transformedData;
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

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-policies'] });
      toast.success('Policy status updated successfully');
    },
    onError: (error) => {
      console.error('Error updating policy status:', error);
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

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-policies'] });
      toast.success('Policy deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting policy:', error);
      toast.error('Failed to delete policy');
    },
  });

  const handleStatusUpdate = (policyId: string, newStatus: string) => {
    updatePolicyStatusMutation.mutate({ policyId, newStatus });
  };

  const handleDeletePolicy = (policyId: string) => {
    deletePolicyMutation.mutate(policyId);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'secondary';
      case 'active':
      case 'approved':
        return 'default';
      case 'rejected':
        return 'destructive';
      case 'expired':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getStatusCounts = () => {
    const counts = {
      total: policies.length,
      pending: policies.filter(p => p.status.toLowerCase() === 'pending').length,
      active: policies.filter(p => p.status.toLowerCase() === 'active').length,
      rejected: policies.filter(p => p.status.toLowerCase() === 'rejected').length,
      expired: policies.filter(p => p.status.toLowerCase() === 'expired').length,
    };
    return counts;
  };

  // Filter policies based on search and status
  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = 
      policy.policy_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.owner_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.policy_type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || policy.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const statusCounts = getStatusCounts();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600">Error loading policies: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Policies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{statusCounts.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{statusCounts.rejected}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{statusCounts.expired}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by policy number, customer name, or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Policies Table */}
      <Card>
        <CardHeader>
          <CardTitle>Policy Management ({filteredPolicies.length} policies)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Policy Number</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Premium</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPolicies.map((policy) => (
                  <TableRow key={policy.id}>
                    <TableCell className="font-medium">{policy.policy_number}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{policy.customer_name}</div>
                        <div className="text-sm text-muted-foreground">{policy.owner_email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{policy.policy_type}</TableCell>
                    <TableCell>
                      {policy.vehicle_make} {policy.vehicle_model}
                      <div className="text-sm text-muted-foreground">{policy.vehicle_reg_number}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(policy.status)}>
                        {policy.status}
                      </Badge>
                    </TableCell>
                    <TableCell>${policy.premium.toLocaleString()}</TableCell>
                    <TableCell>{new Date(policy.start_date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedPolicy(policy)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        {policy.status.toLowerCase() === 'pending' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusUpdate(policy.id, 'active')}
                              className="text-green-600 hover:text-green-700"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusUpdate(policy.id, 'rejected')}
                              className="text-red-600 hover:text-red-700"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                            >
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
                                onClick={() => handleDeletePolicy(policy.id)}
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
          </div>
          
          {filteredPolicies.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No policies found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No policies have been submitted yet.'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Policy Details Modal */}
      {selectedPolicy && (
        <AlertDialog open={!!selectedPolicy} onOpenChange={() => setSelectedPolicy(null)}>
          <AlertDialogContent className="max-w-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Policy Details - {selectedPolicy.policy_number}</AlertDialogTitle>
            </AlertDialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div>
                <h4 className="font-semibold mb-2">Customer Information</h4>
                <p><strong>Name:</strong> {selectedPolicy.customer_name}</p>
                <p><strong>Email:</strong> {selectedPolicy.owner_email}</p>
                <p><strong>Phone:</strong> {selectedPolicy.owner_phone}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Policy Information</h4>
                <p><strong>Type:</strong> {selectedPolicy.policy_type}</p>
                <p><strong>Premium:</strong> ${selectedPolicy.premium.toLocaleString()}</p>
                <p><strong>Start Date:</strong> {new Date(selectedPolicy.start_date).toLocaleDateString()}</p>
                <p><strong>End Date:</strong> {new Date(selectedPolicy.expiry_date).toLocaleDateString()}</p>
              </div>
              <div className="col-span-2">
                <h4 className="font-semibold mb-2">Vehicle Information</h4>
                <p><strong>Make & Model:</strong> {selectedPolicy.vehicle_make} {selectedPolicy.vehicle_model}</p>
                <p><strong>Registration:</strong> {selectedPolicy.vehicle_reg_number}</p>
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Close</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default PolicyManagementSection;
