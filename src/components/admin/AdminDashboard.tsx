
import { useAdminPolicies } from '@/hooks/useAdminPolicies';
import { useAllPolicyTypes } from '@/hooks/usePolicyTypes';
import { StatCard } from './StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, FileText, TrendingUp, Users, AlertTriangle, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const AdminDashboard = () => {
  const { data: policies, isLoading: policiesLoading } = useAdminPolicies();
  const { data: policyTypes } = useAllPolicyTypes();
  const [totalUsers, setTotalUsers] = useState(0);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    fetchTotalUsers();
  }, []);

  const fetchTotalUsers = async () => {
    try {
      setLoadingUsers(true);
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.error('Error fetching total users:', error);
        throw error;
      }
      console.log('Total users count:', count);
      setTotalUsers(count || 0);
    } catch (error) {
      console.error('Error fetching total users:', error);
      setTotalUsers(0);
    } finally {
      setLoadingUsers(false);
    }
  };

  const activePolicies = policies?.filter(p => p.status === 'active').length || 0;
  const expiredPolicies = policies?.filter(p => p.status === 'expired').length || 0;
  const totalPremium = policies?.reduce((sum, p) => sum + (p.premium || 0), 0) || 0;
  const activePolicyTypes = policyTypes?.filter(pt => pt.active).length || 0;

  console.log('Dashboard data:', {
    totalUsers,
    totalPolicies: policies?.length,
    activePolicies,
    expiredPolicies,
    totalPremium,
    activePolicyTypes
  });

  if (policiesLoading || loadingUsers) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">Loading dashboard data...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-6 rounded-lg border animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">Monitor your insurance platform performance</p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          count={totalUsers}
          icon={Users}
          description="Registered customers"
        />
        
        <StatCard
          title="Total Policies"
          count={policies?.length || 0}
          icon={Car}
          description={`${activePolicies} active, ${expiredPolicies} expired`}
        />

        <StatCard
          title="Policy Types"
          count={policyTypes?.length || 0}
          icon={FileText}
          description={`${activePolicyTypes} active types`}
        />

        <StatCard
          title="Total Premium"
          count={Math.round(totalPremium)}
          icon={TrendingUp}
          description="From all policies"
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Policies</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activePolicies}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired Policies</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{expiredPolicies}</div>
            <p className="text-xs text-muted-foreground">Need renewal</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Premium</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ${policies?.length ? Math.round(totalPremium / policies.length) : 0}
            </div>
            <p className="text-xs text-muted-foreground">Per policy</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Policies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {policies && policies.length > 0 ? (
                policies.slice(0, 5).map((policy) => (
                  <div key={policy.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{policy.policy_number}</p>
                      <p className="text-sm text-gray-600">{policy.vehicle_make} {policy.vehicle_model}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${policy.premium}</p>
                      <p className="text-sm text-gray-600 capitalize">{policy.status}</p>
                    </div>
                  </div>
                ))
              ) : (
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
              {policyTypes && policyTypes.length > 0 ? (
                policyTypes.slice(0, 5).map((type) => (
                  <div key={type.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{type.name}</p>
                      <p className="text-sm text-gray-600">{type.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${type.base_premium || 'N/A'}</p>
                      <p className="text-sm text-gray-600">{type.active ? 'Active' : 'Inactive'}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No policy types found</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
