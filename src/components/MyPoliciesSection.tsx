
import React from 'react';
import { usePolicies } from '@/hooks/usePolicies';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Car, Calendar, CreditCard, FileText } from 'lucide-react';
import { format } from 'date-fns';

const MyPoliciesSection = () => {
  const { data: policies, isLoading, error } = usePolicies();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
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
        <p className="text-red-600">Error loading policies: {error.message}</p>
      </div>
    );
  }

  if (!policies || policies.length === 0) {
    return (
      <div className="text-center py-8">
        <Car className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium mb-2">No Policies Found</h3>
        <p className="text-gray-600 mb-4">You haven't purchased any insurance policies yet.</p>
        <Button>Browse Insurance Products</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Insurance Policies</h2>
        <Badge variant="outline" className="text-sm">
          {policies.length} {policies.length === 1 ? 'Policy' : 'Policies'}
        </Badge>
      </div>

      <div className="grid gap-6">
        {policies.map((policy) => (
          <Card key={policy.id} className="overflow-hidden">
            <CardHeader className="bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Policy #{policy.policy_number}
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    {policy.policy_type || 'Motor Insurance'}
                  </p>
                </div>
                <Badge className={getStatusColor(policy.status || 'active')}>
                  {policy.status || 'Active'}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Vehicle Information */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Car className="h-4 w-4" />
                    Vehicle Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Make & Model:</span>
                      <p className="font-medium">{policy.vehicle_make} {policy.vehicle_model}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Year:</span>
                      <p className="font-medium">{policy.vehicle_year}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Registration:</span>
                      <p className="font-medium">{policy.vehicle_reg_number}</p>
                    </div>
                    {policy.seating_capacity && (
                      <div>
                        <span className="text-gray-600">Seating:</span>
                        <p className="font-medium">{policy.seating_capacity} seats</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Policy Period */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Policy Period
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Start Date:</span>
                      <p className="font-medium">
                        {format(new Date(policy.start_date), 'PPP')}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">End Date:</span>
                      <p className="font-medium">
                        {format(new Date(policy.expiry_date), 'PPP')}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Duration:</span>
                      <p className="font-medium">
                        {Math.ceil((new Date(policy.expiry_date).getTime() - new Date(policy.start_date).getTime()) / (1000 * 3600 * 24))} days
                      </p>
                    </div>
                  </div>
                </div>

                {/* Premium Information */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Premium Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Premium Amount:</span>
                      <p className="font-medium text-lg text-primary">
                        {formatCurrency(Number(policy.premium))}
                      </p>
                    </div>
                    {policy.renewable && (
                      <div>
                        <span className="text-green-600 text-xs">✓ Renewable</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Owner Information */}
              {(policy.owner_name || policy.owner_email) && (
                <>
                  <Separator className="my-4" />
                  <div>
                    <h4 className="font-semibold mb-2">Policy Holder</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {policy.owner_name && (
                        <div>
                          <span className="text-gray-600">Name:</span>
                          <p className="font-medium">{policy.owner_name}</p>
                        </div>
                      )}
                      {policy.owner_email && (
                        <div>
                          <span className="text-gray-600">Email:</span>
                          <p className="font-medium">{policy.owner_email}</p>
                        </div>
                      )}
                      {policy.owner_phone && (
                        <div>
                          <span className="text-gray-600">Phone:</span>
                          <p className="font-medium">{policy.owner_phone}</p>
                        </div>
                      )}
                      {policy.owner_address && (
                        <div>
                          <span className="text-gray-600">Address:</span>
                          <p className="font-medium">{policy.owner_address}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              <Separator className="my-4" />
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  View Details
                </Button>
                <Button variant="outline" size="sm">
                  Download Policy
                </Button>
                {policy.renewable && (
                  <Button size="sm">
                    Renew Policy
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MyPoliciesSection;
