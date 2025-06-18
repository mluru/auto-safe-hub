
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
import { Search, Eye, Trash2, UserCog } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface UserWithRole {
  id: string;
  full_name: string;
  phone: string | null;
  created_at: string;
  user_roles: {
    role: string;
  }[];
  // We'll get email from auth metadata if needed
}

const UserManagementSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserWithRole | null>(null);
  const queryClient = useQueryClient();

  // Fetch users with their roles
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      console.log('Fetching users for admin...');
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          phone,
          created_at,
          user_roles (
            role
          )
        `);

      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }

      console.log('Fetched users:', data);
      return data as UserWithRole[];
    },
  });

  // Update user role mutation
  const updateUserRoleMutation = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: string }) => {
      console.log('Updating user role:', userId, newRole);
      
      // First, delete existing role
      const { error: deleteError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (deleteError) {
        console.error('Error deleting old role:', deleteError);
        throw deleteError;
      }

      // Then insert new role
      const { error: insertError } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role: newRole });

      if (insertError) {
        console.error('Error inserting new role:', insertError);
        throw insertError;
      }

      return { userId, newRole };
    },
    onSuccess: () => {
      toast.success('User role updated successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (error) => {
      console.error('Failed to update user role:', error);
      toast.error('Failed to update user role');
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      console.log('Deleting user:', userId);
      
      // Delete user roles first
      const { error: roleError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (roleError) {
        console.error('Error deleting user roles:', roleError);
        throw roleError;
      }

      // Delete profile
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (profileError) {
        console.error('Error deleting profile:', profileError);
        throw profileError;
      }

      return userId;
    },
    onSuccess: () => {
      toast.success('User deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (error) => {
      console.error('Failed to delete user:', error);
      toast.error('Failed to delete user');
    },
  });

  const filteredUsers = users?.filter(user =>
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getUserRole = (user: UserWithRole) => {
    return user.user_roles?.[0]?.role || 'user';
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'moderator':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
        <p className="text-red-600">Error loading users: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">User Management</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.full_name || 'N/A'}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {user.id.slice(0, 8)}...
                  </TableCell>
                  <TableCell>{user.phone || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeColor(getUserRole(user))}>
                      {getUserRole(user)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(user.created_at), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedUser(user)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      <Select
                        value={getUserRole(user)}
                        onValueChange={(newRole) => 
                          updateUserRoleMutation.mutate({ userId: user.id, newRole })
                        }
                      >
                        <SelectTrigger className="w-24 h-8">
                          <UserCog className="h-4 w-4" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
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
                            <AlertDialogTitle>Delete User</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete {user.full_name}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteUserMutation.mutate(user.id)}
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

          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No users found
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Details Modal */}
      {selectedUser && (
        <Card className="fixed inset-0 z-50 m-8 max-w-2xl mx-auto bg-white shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>User Details</CardTitle>
              <Button variant="outline" onClick={() => setSelectedUser(null)}>
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Full Name</label>
                <p className="font-medium">{selectedUser.full_name || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">User ID</label>
                <p className="font-mono text-sm">{selectedUser.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <p className="font-medium">{selectedUser.phone || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Role</label>
                <div>
                  <Badge className={getRoleBadgeColor(getUserRole(selectedUser))}>
                    {getUserRole(selectedUser)}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Registration Date</label>
                <p className="font-medium">
                  {format(new Date(selectedUser.created_at), 'PPP')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserManagementSection;
