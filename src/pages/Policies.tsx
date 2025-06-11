
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Car, Calendar, DollarSign, FileText, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Policies = () => {
  const policies = [
    {
      id: "POL-001",
      policyNumber: "MI-2024-001234",
      vehicle: {
        make: "Toyota",
        model: "Camry",
        year: 2022,
        license: "ABC-123",
        vin: "1HGBH41JXMN109186"
      },
      premium: 1200,
      status: "active",
      issueDate: "2023-12-15",
      expiryDate: "2024-12-15",
      renewalDue: true,
      coverage: {
        liability: 100000,
        collision: 50000,
        comprehensive: 25000,
        deductible: 500
      }
    },
    {
      id: "POL-002", 
      policyNumber: "MI-2024-005678",
      vehicle: {
        make: "Honda",
        model: "Civic",
        year: 2021,
        license: "XYZ-789",
        vin: "2HGFC2F59MH123456"
      },
      premium: 950,
      status: "active",
      issueDate: "2024-03-20",
      expiryDate: "2025-03-20",
      renewalDue: false,
      coverage: {
        liability: 75000,
        collision: 40000,
        comprehensive: 20000,
        deductible: 750
      }
    }
  ];

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
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Request Quote
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Policy Management</h2>
          <p className="text-muted-foreground">View and manage your motor insurance policies.</p>
        </div>

        <div className="space-y-6">
          {policies.map((policy) => (
            <Card key={policy.id} className="border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Car className="h-5 w-5" />
                      {policy.vehicle.year} {policy.vehicle.make} {policy.vehicle.model}
                    </CardTitle>
                    <CardDescription>
                      Policy Number: {policy.policyNumber}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(policy.status)}>
                      {policy.status.toUpperCase()}
                    </Badge>
                    {policy.renewalDue && (
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
                        <span className="text-muted-foreground">License Plate:</span>
                        <p className="font-medium">{policy.vehicle.license}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">VIN:</span>
                        <p className="font-medium font-mono text-xs">{policy.vehicle.vin}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Make & Model:</span>
                        <p className="font-medium">{policy.vehicle.make} {policy.vehicle.model}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Year:</span>
                        <p className="font-medium">{policy.vehicle.year}</p>
                      </div>
                    </div>
                  </div>

                  {/* Policy Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Policy Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Issue Date:</span>
                        <p className="font-medium">{policy.issueDate}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Expiry Date:</span>
                        <p className="font-medium">{policy.expiryDate}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Annual Premium:</span>
                        <p className="font-medium text-lg">{formatCurrency(policy.premium)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Deductible:</span>
                        <p className="font-medium">{formatCurrency(policy.coverage.deductible)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Coverage Information */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Coverage Limits</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4 bg-blue-50">
                      <div className="text-center">
                        <DollarSign className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                        <h4 className="font-medium text-blue-900">Liability</h4>
                        <p className="text-xl font-bold text-blue-900">
                          {formatCurrency(policy.coverage.liability)}
                        </p>
                      </div>
                    </Card>
                    
                    <Card className="p-4 bg-green-50">
                      <div className="text-center">
                        <Car className="h-6 w-6 mx-auto mb-2 text-green-600" />
                        <h4 className="font-medium text-green-900">Collision</h4>
                        <p className="text-xl font-bold text-green-900">
                          {formatCurrency(policy.coverage.collision)}
                        </p>
                      </div>
                    </Card>
                    
                    <Card className="p-4 bg-purple-50">
                      <div className="text-center">
                        <FileText className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                        <h4 className="font-medium text-purple-900">Comprehensive</h4>
                        <p className="text-xl font-bold text-purple-900">
                          {formatCurrency(policy.coverage.comprehensive)}
                        </p>
                      </div>
                    </Card>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button>
                    <FileText className="h-4 w-4 mr-2" />
                    Download Policy
                  </Button>
                  
                  {policy.renewalDue ? (
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
                  
                  <Button variant="outline">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Payment History
                  </Button>
                  
                  <Button variant="outline">
                    Update Information
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add New Policy */}
        <Card className="mt-8 border-dashed">
          <CardContent className="p-8 text-center">
            <Car className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Need coverage for another vehicle?</h3>
            <p className="text-muted-foreground mb-4">
              Get a quote for additional motor insurance coverage.
            </p>
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              Get New Quote
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Policies;
