
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Car, FileText, CreditCard, Bell, User, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const [user] = useState({
    name: "John Doe",
    email: "john.doe@email.com",
    id: "demo-user"
  });

  const policies = [
    {
      id: "POL-001",
      policyNumber: "MI-2024-001234",
      vehicle: "Toyota Camry 2022",
      premium: 1200,
      status: "active",
      expiryDate: "2024-12-15",
      renewalDue: true
    },
    {
      id: "POL-002", 
      policyNumber: "MI-2024-005678",
      vehicle: "Honda Civic 2021",
      premium: 950,
      status: "active",
      expiryDate: "2025-03-20",
      renewalDue: false
    }
  ];

  const recentClaims = [
    {
      id: "CLM-001",
      policyId: "POL-001",
      description: "Minor fender bender",
      status: "under_review",
      submittedDate: "2024-06-01",
      estimatedAmount: 2500
    },
    {
      id: "CLM-002",
      policyId: "POL-002", 
      description: "Windshield replacement",
      status: "approved",
      submittedDate: "2024-05-15",
      estimatedAmount: 450
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "expired": return "bg-red-100 text-red-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "under_review": return "bg-blue-100 text-blue-800";
      case "approved": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Car className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold text-primary">SecureMotor</h1>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-foreground hover:text-primary transition-colors">Dashboard</Link>
              <Link to="/policies" className="text-muted-foreground hover:text-primary transition-colors">Policies</Link>
              <Link to="/claims" className="text-muted-foreground hover:text-primary transition-colors">Claims</Link>
              <Link to="/payments" className="text-muted-foreground hover:text-primary transition-colors">Payments</Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">{user.name}</span>
              </div>
              <Button variant="ghost" size="sm">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Welcome back, {user.name}</h2>
          <p className="text-muted-foreground">Manage your motor insurance policies and claims in one place.</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Link to="/claims/new">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="font-medium">File New Claim</span>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/policies">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Car className="h-5 w-5 text-primary" />
                  <span className="font-medium">View Policies</span>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/payments">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <span className="font-medium">Payment Plans</span>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="font-medium">Renewal Center</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Active Policies */}
          <Card>
            <CardHeader>
              <CardTitle>Active Policies</CardTitle>
              <CardDescription>Your current motor insurance policies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {policies.map((policy) => (
                  <div key={policy.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{policy.vehicle}</h4>
                      <Badge className={getStatusColor(policy.status)}>
                        {policy.status.replace("_", " ")}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">Policy: {policy.policyNumber}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Premium: ${policy.premium}/year</span>
                      <span className="text-sm">Expires: {policy.expiryDate}</span>
                    </div>
                    {policy.renewalDue && (
                      <div className="mt-2">
                        <Button size="sm" variant="outline" className="w-full">
                          Renew Policy
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Claims */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Claims</CardTitle>
              <CardDescription>Track your submitted claims</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentClaims.map((claim) => (
                  <div key={claim.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{claim.description}</h4>
                      <Badge className={getStatusColor(claim.status)}>
                        {claim.status.replace("_", " ")}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">Claim: {claim.id}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Amount: ${claim.estimatedAmount}</span>
                      <span className="text-sm">Submitted: {claim.submittedDate}</span>
                    </div>
                  </div>
                ))}
                
                <Link to="/claims">
                  <Button variant="outline" className="w-full">
                    View All Claims
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
