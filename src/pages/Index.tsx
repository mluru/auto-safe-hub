
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Car, FileText, CreditCard, Shield, Plus, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { usePolicies } from "@/hooks/usePolicies";
import { useClaims } from "@/hooks/useClaims";
import { usePayments } from "@/hooks/usePayments";

const Index = () => {
  const { data: policies } = usePolicies();
  const { data: claims } = useClaims();
  const { data: payments } = usePayments();

  const activePolicies = policies?.filter(p => p.status === 'active').length || 0;
  const pendingClaims = claims?.filter(c => c.status === 'submitted' || c.status === 'under_review').length || 0;
  const totalPremium = policies?.reduce((sum, p) => sum + Number(p.premium), 0) || 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Welcome to SecureMotor</h1>
          <p className="text-xl text-muted-foreground">
            Your comprehensive motor insurance management platform
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Policies</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activePolicies}</div>
              <p className="text-xs text-muted-foreground">
                Insurance coverage active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Claims</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingClaims}</div>
              <p className="text-xs text-muted-foreground">
                Claims being processed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Premium</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalPremium.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Annual coverage value
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Payment</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$0.00</div>
              <p className="text-xs text-muted-foreground">
                No upcoming payments
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link to="/claims">
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  File New Claim
                </Button>
              </Link>
              <Link to="/policies">
                <Button className="w-full justify-start" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Policy
                </Button>
              </Link>
              <Link to="/payments">
                <Button className="w-full justify-start" variant="outline">
                  <CreditCard className="h-4 w-4 mr-2" />
                  View Payment History
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates on your policies and claims</CardDescription>
            </CardHeader>
            <CardContent>
              {claims?.length === 0 && policies?.length === 0 ? (
                <div className="text-center py-8">
                  <Car className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No recent activity</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Start by adding your first policy or filing a claim
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {claims?.slice(0, 3).map((claim) => (
                    <div key={claim.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-4 w-4 text-primary" />
                        <div>
                          <p className="font-medium text-sm">Claim {claim.claim_number}</p>
                          <p className="text-xs text-muted-foreground">{claim.description}</p>
                        </div>
                      </div>
                      <Badge variant="outline">{claim.status}</Badge>
                    </div>
                  ))}
                  
                  {policies?.slice(0, 2).map((policy) => (
                    <div key={policy.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Shield className="h-4 w-4 text-green-600" />
                        <div>
                          <p className="font-medium text-sm">Policy {policy.policy_number}</p>
                          <p className="text-xs text-muted-foreground">
                            {policy.vehicle_make} {policy.vehicle_model}
                          </p>
                        </div>
                      </div>
                      <Badge 
                        variant={policy.status === 'active' ? 'default' : 'secondary'}
                      >
                        {policy.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
