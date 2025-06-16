
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useItems } from '@/hooks/useItems';
import { useCart } from '@/contexts/CartContext';
import { Link } from 'react-router-dom';
import { Car, Search, ShoppingCart, Eye } from 'lucide-react';
import { toast } from 'sonner';

const Products = () => {
  const { data: items, isLoading } = useItems();
  const { addItem } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const filteredItems = items?.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const sortedItems = filteredItems?.sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return (a.discounted_price || a.price) - (b.discounted_price || b.price);
      case 'price-high':
        return (b.discounted_price || b.price) - (a.discounted_price || a.price);
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  const handleAddToCart = (item: any) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      discounted_price: item.discounted_price,
      type: item.type,
      image: item.image,
    });
    toast.success(`${item.name} added to cart`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

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
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Insurance Products</h2>
          <p className="text-muted-foreground">Browse our comprehensive insurance coverage options.</p>
        </div>

        {/* Filters */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="service">Service</SelectItem>
              <SelectItem value="product">Product</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading products...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedItems?.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                {item.image && (
                  <div className="aspect-video bg-gray-100 rounded-t-lg">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  </div>
                )}
                
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <Badge variant="outline">{item.type}</Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-gray-600 mb-4 line-clamp-3">{item.description}</p>
                  
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      {item.discounted_price ? (
                        <>
                          <span className="text-xl font-bold text-primary">
                            {formatPrice(item.discounted_price)}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            {formatPrice(item.price)}
                          </span>
                        </>
                      ) : (
                        <span className="text-xl font-bold text-primary">
                          {formatPrice(item.price)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      className="flex-1"
                      onClick={() => handleAddToCart(item)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                    
                    <Link to={`/products/${item.id}`}>
                      <Button variant="outline" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {sortedItems?.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Car className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No products found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or filters.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Products;
