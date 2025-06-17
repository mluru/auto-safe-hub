
import React from 'react';
import { usePayments } from '@/hooks/usePayments';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CreditCard, Plus, Download, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const PaymentSection = () => {
  const { data: payments, isLoading, error } = usePayments();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method?.toLowerCase()) {
      case 'credit_card':
        return '💳';
      case 'bank_transfer':
        return '🏦';
      case 'mobile_money':
        return '📱';
      default:
        return '💰';
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
        <p className="text-red-600">Error loading payments: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Payment History</h2>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Make Payment
        </Button>
      </div>

      {/* Payment Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <CreditCard className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Paid</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(
                    payments?.reduce((sum, payment) => 
                      payment.status === 'completed' ? sum + Number(payment.amount) : sum, 0
                    ) || 0
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-full">
                <Calendar className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(
                    payments?.reduce((sum, payment) => 
                      payment.status === 'pending' ? sum + Number(payment.amount) : sum, 0
                    ) || 0
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <CreditCard className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Payments</p>
                <p className="text-lg font-semibold">{payments?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment History */}
      {(!payments || payments.length === 0) ? (
        <div className="text-center py-8">
          <CreditCard className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">No Payment History</h3>
          <p className="text-gray-600 mb-4">You haven't made any payments yet.</p>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Make Your First Payment
          </Button>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {payments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">
                      {getPaymentMethodIcon(payment.payment_method)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">
                          {formatCurrency(Number(payment.amount))}
                        </p>
                        <Badge className={getStatusColor(payment.status || 'completed')}>
                          {payment.status || 'Completed'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {payment.plan_type} • {format(new Date(payment.payment_date), 'PPP')}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {payment.payment_method.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Receipt
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PaymentSection;
