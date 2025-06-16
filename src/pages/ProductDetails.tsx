
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useItem } from '@/hooks/useItems';
import { useCart } from '@/contexts/CartContext';
import { Car, ArrowLeft, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data: item, isLoading, error } = useItem(id!);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    if (item) {
      addItem({
        id: item.id,
        name: item.name,
        price: item.price,
        discounted_price: item.discounted_price,
        type: item.type,
        image: item.image,
      });
      toast.success(`${item.name} added to cart`);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Car className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">Product not found</h3>
          <p className="text-muted-foreground mb-4">
            The product you're looking for doesn't exist.
          </p>
          <Link to="/products">
            <Button>Back to Products</Button>
          </Link>
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
            <Link to="/" className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-primary">SecureMotor</h1>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link to="/cart">
                <Button variant="outline">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Cart
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Link to="/products" className="inline-flex items-center text-primary hover:underline mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="aspect-square bg-gray-100 rounded-lg">
            {item.image ? (
              <img 
                src={item.image} 
                alt={item.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Car className="h-24 w-24 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold">{item.name}</h1>
                <Badge variant="outline">{item.type}</Badge>
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                {item.discounted_price ? (
                  <>
                    <span className="text-3xl font-bold text-primary">
                      {formatPrice(item.discounted_price)}
                    </span>
                    <span className="text-xl text-gray-500 line-through">
                      {formatPrice(item.price)}
                    </span>
                    <Badge variant="destructive">
                      {Math.round(((item.price - item.discounted_price) / item.price) * 100)}% OFF
                    </Badge>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-primary">
                    {formatPrice(item.price)}
                  </span>
                )}
              </div>
            </div>

            {item.description && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <div className="prose prose-sm max-w-none">
                    {item.description.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-2">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              <Button 
                size="lg" 
                className="w-full" 
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full"
                asChild
              >
                <Link to="/checkout">
                  Buy Now
                </Link>
              </Button>
            </div>

            {/* Additional Information */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">Product Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Type:</span>
                    <p className="font-medium capitalize">{item.type}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Created:</span>
                    <p className="font-medium">
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetails;
