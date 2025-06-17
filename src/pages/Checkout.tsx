
import React, { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateOrder } from '@/hooks/useOrders';
import { useCreateOrderItem } from '@/hooks/useOrderItems';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Trash2, Upload, X } from 'lucide-react';
import PolicyHeader from '@/components/PolicyHeader';

const Checkout = () => {
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const createOrder = useCreateOrder();
  const createOrderItem = useCreateOrderItem();

  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type (images and PDFs)
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload an image (JPEG, PNG) or PDF file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      
      setPaymentProof(file);
    }
  };

  const removePaymentProof = () => {
    setPaymentProof(null);
  };

  const handleSubmitOrder = async () => {
    if (!user) {
      toast.error('Please sign in to place an order');
      navigate('/login');
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (!deliveryAddress.trim()) {
      toast.error('Please enter a delivery address');
      return;
    }

    if (!phoneNumber.trim()) {
      toast.error('Please enter a phone number');
      return;
    }

    if (!paymentProof) {
      toast.error('Please upload proof of payment');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create the order
      const orderData = {
        total: getTotalPrice(),
        delivery_address: deliveryAddress,
        phone_number: phoneNumber,
        status: 'pending',
        proof_of_payment: paymentProof.name // For now, just store the filename
      };

      const order = await createOrder.mutateAsync(orderData);

      // Create order items
      for (const item of items) {
        await createOrderItem.mutateAsync({
          order_id: order.id,
          item_id: item.id,
          rate_premium: (item.discounted_price || item.price) * item.quantity
        });
      }

      // Clear cart and redirect
      clearCart();
      toast.success('Order placed successfully! Awaiting admin approval.');
      navigate('/policies');
      
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PolicyHeader />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              <h2 className="text-xl font-semibold mb-4">Sign In Required</h2>
              <p className="text-gray-600 mb-6">Please sign in to proceed with checkout</p>
              <Button onClick={() => navigate('/login')} className="w-full">
                Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PolicyHeader />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              <h2 className="text-xl font-semibold mb-4">Your Cart is Empty</h2>
              <p className="text-gray-600 mb-6">Add some insurance products to your cart to proceed</p>
              <Button onClick={() => navigate('/products')} className="w-full">
                Browse Products
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PolicyHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Cart Summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="capitalize">
                            {item.type}
                          </Badge>
                          <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          {item.discounted_price ? (
                            <>
                              <span className="font-semibold text-primary">
                                {formatPrice(item.discounted_price)}
                              </span>
                              <span className="text-sm text-gray-500 line-through">
                                {formatPrice(item.price)}
                              </span>
                            </>
                          ) : (
                            <span className="font-semibold">
                              {formatPrice(item.price)}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span>{formatPrice(getTotalPrice())}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Checkout Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Checkout Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="delivery-address">Delivery Address *</Label>
                    <textarea
                      id="delivery-address"
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Enter your full delivery address"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone-number">Phone Number *</Label>
                    <Input
                      id="phone-number"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Proof of Payment *</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      {paymentProof ? (
                        <div className="flex items-center justify-between bg-gray-100 p-3 rounded">
                          <div className="flex items-center gap-2">
                            <Upload className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium">{paymentProof.name}</span>
                            <span className="text-xs text-gray-500">
                              ({(paymentProof.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={removePaymentProof}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600 mb-2">
                            Upload your payment receipt or proof
                          </p>
                          <p className="text-xs text-gray-500 mb-4">
                            Supported: JPEG, PNG, PDF (Max 5MB)
                          </p>
                          <label className="cursor-pointer">
                            <Button variant="outline" type="button">
                              Choose File
                            </Button>
                            <input
                              type="file"
                              className="hidden"
                              accept="image/jpeg,image/png,image/jpg,application/pdf"
                              onChange={handleFileUpload}
                            />
                          </label>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={handleSubmitOrder}
                    className="w-full"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Processing...' : 'Place Order'}
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    Your order will be reviewed by our team. You'll be notified once approved.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
