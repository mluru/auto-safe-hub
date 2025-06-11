
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Calendar, DollarSign, Car, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const Payments = () => {
  const paymentHistory = [
    {
      id: "PAY-001",
      policyNumber: "MI-2024-001234",
      vehicle: "Toyota Camry 2022",
      amount: 300,
      date: "2024-06-01",
      method: "Credit Card",
      status: "completed",
      planType: "quarterly"
    },
    {
      id: "PAY-002",
      policyNumber: "MI-2024-005678",
      vehicle: "Honda Civic 2021",
      amount: 158.33,
      date: "2024-05-15",
      method: "Bank Transfer",
      status: "completed",
      planType: "monthly"
    },
    {
      id: "PAY-003",
      policyNumber: "MI-2024-001234",
      vehicle: "Toyota Camry 2022",
      amount: 300,
      date: "2024-09-01",
      method: "Credit Card",
      status: "pending",
      planType: "quarterly"
    }
  ];

  const paymentPlans = [
    {
      id: "monthly",
      name: "Monthly Plan",
      description: "Pay your premium in 12 monthly installments",
      processingFee: 5,
      benefits: ["Lower monthly payments", "Flexible cash flow", "Easy budgeting"],
      popular: true
    },
    {
      id: "quarterly",
      name: "Quarterly Plan", 
      description: "Pay your premium in 4 quarterly payments",
      processingFee: 10,
      benefits: ["Moderate payment frequency", "Lower processing fees", "Better cash management"]
    },
    {
      id: "annual",
      name: "Annual Plan",
      description: "Pay your full premium upfront",
      processingFee: 0,
      benefits: ["No processing fees", "Maximum savings", "One-time payment convenience"]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "failed": return "bg-red-100 text-red-800";
      case "overdue": return "bg-red-100 text-red-800";
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
              <Button>
                <CreditCard className="h-4 w-4 mr-2" />
                Make Payment
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Payment Management</h2>
          <p className="text-muted-foreground">Manage your payments and choose flexible payment plans.</p>
        </div>

        {/* Payment Plans */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-4">Available Payment Plans</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {paymentPlans.map((plan) => (
              <Card key={plan.id} className={`relative ${plan.popular ? 'border-primary shadow-md' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    {plan.name}
                  </CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <span className="text-2xl font-bold text-primary">
                        {plan.processingFee === 0 ? 'No Fee' : formatCurrency(plan.processingFee)}
                      </span>
                      <p className="text-sm text-muted-foreground">Processing fee per payment</p>
                    </div>
                    
                    <ul className="space-y-2">
                      {plan.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      className="w-full" 
                      variant={plan.popular ? "default" : "outline"}
                    >
                      Select Plan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Credit Request */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Request Payment Extension
            </CardTitle>
            <CardDescription>
              Need more time to pay? Request a payment extension or installment plan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Payment Extension</h4>
                <p className="text-sm text-muted-foreground">
                  Request up to 30 days extension on your payment due date.
                </p>
                <Button variant="outline" className="w-full">
                  Request Extension
                </Button>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Installment Plan</h4>
                <p className="text-sm text-muted-foreground">
                  Break down your payment into smaller, manageable installments.
                </p>
                <Button variant="outline" className="w-full">
                  Apply for Installments
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment History */}
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>Track all your premium payments and transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentHistory.map((payment) => (
                <Card key={payment.id} className="border">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-medium">{payment.vehicle}</h4>
                        <p className="text-sm text-muted-foreground">
                          Payment ID: {payment.id} • Policy: {payment.policyNumber}
                        </p>
                      </div>
                      <Badge className={getStatusColor(payment.status)}>
                        {payment.status.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Amount:</span>
                        <p className="font-medium text-lg">{formatCurrency(payment.amount)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Payment Date:</span>
                        <p className="font-medium">{payment.date}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Method:</span>
                        <p className="font-medium">{payment.method}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Plan Type:</span>
                        <p className="font-medium capitalize">{payment.planType}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" size="sm">
                        View Receipt
                      </Button>
                      {payment.status === "pending" && (
                        <Button size="sm">
                          Complete Payment
                        </Button>
                      )}
                      {payment.status === "failed" && (
                        <Button size="sm" variant="destructive">
                          Retry Payment
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Payments;
