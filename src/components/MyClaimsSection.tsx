
import React from 'react';
import { useClaims } from '@/hooks/useClaims';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ClipboardList, Plus, Eye, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const MyClaimsSection = () => {
  const { data: claims, isLoading, error } = useClaims();

  const formatCurrency = (amount: number | null) => {
    if (!amount) return 'Not specified';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'under review':
        return 'bg-blue-100 text-blue-800';
      case 'submitted':
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
        <p className="text-red-600">Error loading claims: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Insurance Claims</h2>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Submit New Claim
        </Button>
      </div>

      {(!claims || claims.length === 0) ? (
        <div className="text-center py-8">
          <ClipboardList className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">No Claims Submitted</h3>
          <p className="text-gray-600 mb-4">You haven't submitted any insurance claims yet.</p>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Submit Your First Claim
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {claims.map((claim) => (
            <Card key={claim.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      Claim #{claim.claim_number}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      Submitted on {format(new Date(claim.created_at), 'PPP')}
                    </p>
                  </div>
                  <Badge className={getStatusColor(claim.status || 'submitted')}>
                    {claim.status || 'Submitted'}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Accident Details</h4>
                    <div className="space-y-1 text-sm">
                      <div>
                        <span className="text-gray-600">Date:</span>
                        <p className="font-medium">
                          {format(new Date(claim.accident_date), 'PPP')}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Description:</span>
                        <p className="font-medium">{claim.description}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Claim Amount</h4>
                    <div className="space-y-1 text-sm">
                      <div>
                        <span className="text-gray-600">Estimated:</span>
                        <p className="font-medium">
                          {formatCurrency(claim.estimated_amount)}
                        </p>
                      </div>
                      {claim.approved_amount && (
                        <div>
                          <span className="text-gray-600">Approved:</span>
                          <p className="font-medium text-green-600">
                            {formatCurrency(claim.approved_amount)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Status</h4>
                    <div className="space-y-2">
                      <Badge className={getStatusColor(claim.status || 'submitted')}>
                        {claim.status || 'Submitted'}
                      </Badge>
                      {claim.admin_notes && (
                        <div className="text-sm">
                          <span className="text-gray-600">Admin Notes:</span>
                          <p className="text-sm bg-gray-50 p-2 rounded mt-1">
                            {claim.admin_notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    Download Documents
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyClaimsSection;
