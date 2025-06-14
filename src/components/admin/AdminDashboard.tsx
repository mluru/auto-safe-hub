
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminPolicies } from '@/hooks/useAdminPolicies';
import { useAllPolicyTypes } from '@/hooks/usePolicyTypes';
import { Car, FileText, TrendingUp, Users } from 'lucide-react';

export const AdminDashboard = () => {
  const { data: policies } = useAdminPolicies();
  const { data: policyTypes } = useAllPolicyTypes();

  const activePolicies = policies?.filter(p => p.status === 'active').length || 0;
  const expiredPolicies = policies?.filter(p => p.status === 'expired').length || 0;
  const totalPremium = policies?.reduce((sum, p) => sum + (p.premium || 0), 0) || 0;
  const activePolicyTypes = policyTypes?.filter(pt => pt.active).length || 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-600 mt-1">Manage your insurance platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Policies</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{policies?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              {activePolicies} active, {expiredPolicies} expired
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Policy Types</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{policyTypes?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              {activePolicyTypes} active types
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Premium</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPremium.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              From all active policies
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Policies</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activePolicies}</div>
            <p className="text-xs text-muted-foreground">
              Currently active
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Policies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {policies?.slice(0, 5).map((policy) => (
                <div key={policy.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{policy.policy_number}</p>
                    <p className="text-sm text-gray-600">{policy.vehicle_make} {policy.vehicle_model}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${policy.premium}</p>
                    <p className="text-sm text-gray-600 capitalize">{policy.status}</p>
                  </div>
                </div>
              )) || (
                <p className="text-gray-500 text-center py-4">No policies found</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Policy Types Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {policyTypes?.slice(0, 5).map((type) => (
                <div key={type.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{type.name}</p>
                    <p className="text-sm text-gray-600">{type.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${type.base_premium || 'N/A'}</p>
                    <p className="text-sm text-gray-600">{type.active ? 'Active' : 'Inactive'}</p>
                  </div>
                </div>
              )) || (
                <p className="text-gray-500 text-center py-4">No policy types found</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
