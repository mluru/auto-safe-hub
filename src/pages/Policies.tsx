
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Car, Calendar, DollarSign, FileText, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { usePolicies } from "@/hooks/usePolicies";

const Policies = () => {
  const { data: policies, isLoading, error } = usePolicies();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "expired": return "bg-red-100 text-red-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const isRenewalDue = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading your policies...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Car className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">Error loading policies</h3>
          <p className="text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <Car className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold text-primary">SecureMotor</h1>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild>
                <Link to="/products">
                  <FileText className="h-4 w-4 mr-2" />
                  Browse Insurance
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">My Policies</h2>
          <p className="text-muted-foreground">View and manage your motor insurance policies.</p>
        </div>

        <div className="space-y-6">
          {policies?.map((policy) => {
            // Safely cast JSONB fields
            const vehicleInfo = policy.vehicle_info as { chassis_number?: string } | null;
            const ownerInfo = policy.owner_info as { name?: string; email?: string; phone?: string } | null;

            return (
              <Card key={policy.id} className="border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Car className="h-5 w-5" />
                        {policy.vehicle_year} {policy.vehicle_make} {policy.vehicle_model}
                      </CardTitle>
                      <CardDescription>
                        Policy Number: {policy.policy_number}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(policy.status)}>
                        {policy.status.toUpperCase()}
                      </Badge>
                      {isRenewalDue(policy.expiry_date) && (
                        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                          Renewal Due
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Vehicle Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Vehicle Information</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Registration:</span>
                          <p className="font-medium">{policy.vehicle_reg_number}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Make & Model:</span>
                          <p className="font-medium">{policy.vehicle_make} {policy.vehicle_model}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Year:</span>
                          <p className="font-medium">{policy.vehicle_year}</p>
                        </div>
                        {vehicleInfo?.chassis_number && (
                          <div>
                            <span className="text-muted-foreground">Chassis:</span>
                            <p className="font-medium font-mono text-xs">{vehicleInfo.chassis_number}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Policy Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Policy Details</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Start Date:</span>
                          <p className="font-medium">{policy.start_date}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Expiry Date:</span>
                          <p className="font-medium">{policy.expiry_date}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Premium:</span>
                          <p className="font-medium text-lg">{formatCurrency(policy.premium)}</p>
                        </div>
                        {policy.renewable && (
                          <div>
                            <span className="text-muted-foreground">Renewable:</span>
                            <p className="font-medium text-green-600">Yes</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Owner Information */}
                  {ownerInfo && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-4">Owner Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        {ownerInfo.name && (
                          <div>
                            <span className="text-muted-foreground">Name:</span>
                            <p className="font-medium">{ownerInfo.name}</p>
                          </div>
                        )}
                        {ownerInfo.email && (
                          <div>
                            <span className="text-muted-foreground">Email:</span>
                            <p className="font-medium">{ownerInfo.email}</p>
                          </div>
                        )}
                        {ownerInfo.phone && (
                          <div>
                            <span className="text-muted-foreground">Phone:</span>
                            <p className="font-medium">{ownerInfo.phone}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button>
                      <FileText className="h-4 w-4 mr-2" />
                      Download Policy
                    </Button>
                    
                    {(isRenewalDue(policy.expiry_date) || policy.status === 'expired') && policy.renewable ? (
                      <Button variant="outline" className="bg-orange-50 border-orange-200 text-orange-700">
                        <Calendar className="h-4 w-4 mr-2" />
                        Renew Policy
                      </Button>
                    ) : (
                      <Button variant="outline">
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Renewal
                      </Button>
                    )}
                    
                    <Button variant="outline" asChild>
                      <Link to="/my/claims">
                        <DollarSign className="h-4 w-4 mr-2" />
                        File Claim
                      </Link>
                    </Button>
                    
                    <Button variant="outline">
                      Update Information
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {policies?.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="p-8 text-center">
              <Car className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No policies found</h3>
              <p className="text-muted-foreground mb-4">
                You don't have any insurance policies yet. Browse our products to get started.
              </p>
              <Button asChild>
                <Link to="/products">
                  <FileText className="h-4 w-4 mr-2" />
                  Browse Insurance Products
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Add New Policy */}
        {policies && policies.length > 0 && (
          <Card className="mt-8 border-dashed">
            <CardContent className="p-8 text-center">
              <Car className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Need coverage for another vehicle?</h3>
              <p className="text-muted-foreground mb-4">
                Get a quote for additional motor insurance coverage.
              </p>
              <Button asChild>
                <Link to="/products">
                  <FileText className="h-4 w-4 mr-2" />
                  Browse Products
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Policies;
