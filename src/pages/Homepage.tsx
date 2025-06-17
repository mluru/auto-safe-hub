
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useItems } from '@/hooks/useItems';
import { Link } from 'react-router-dom';
import { Car, Shield, Clock, CheckCircle, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const Homepage = () => {
  const { data: items, isLoading } = useItems();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Filter featured products (latest 5 products)
  const featuredProducts = items?.slice(0, 5) || [];

  useEffect(() => {
    if (featuredProducts.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [featuredProducts.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
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
              <Link to="/products">
                <Button variant="outline">Browse Products</Button>
              </Link>
              <Link to="/login">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Slider */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Protect Your Journey with 
                <span className="text-primary"> Confidence</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Comprehensive motor insurance coverage designed for modern drivers. 
                Get instant quotes, manage policies online, and file claims with ease.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/products">
                  <Button size="lg" className="text-lg px-8 py-3">
                    Get Quote Now
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/policies">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                    Manage Policies
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center space-x-6 pt-6">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium">100% Secure</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium">24/7 Support</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium">Instant Claims</span>
                </div>
              </div>
            </div>

            {/* Featured Product Slider */}
            <div className="relative">
              {!isLoading && featuredProducts.length > 0 && (
                <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
                  <div className="p-8">
                    <Badge className="mb-4">Featured Product</Badge>
                    <h3 className="text-2xl font-bold mb-3">
                      {featuredProducts[currentSlide]?.name}
                    </h3>
                    <p className="text-gray-600 mb-6 line-clamp-3">
                      {featuredProducts[currentSlide]?.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        {featuredProducts[currentSlide]?.discounted_price ? (
                          <>
                            <span className="text-3xl font-bold text-primary">
                              {formatPrice(featuredProducts[currentSlide].discounted_price)}
                            </span>
                            <span className="text-lg text-gray-500 line-through">
                              {formatPrice(featuredProducts[currentSlide].price)}
                            </span>
                          </>
                        ) : (
                          <span className="text-3xl font-bold text-primary">
                            {formatPrice(featuredProducts[currentSlide]?.price)}
                          </span>
                        )}
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {featuredProducts[currentSlide]?.type}
                      </Badge>
                    </div>

                    <Link to={`/products/${featuredProducts[currentSlide]?.id}`}>
                      <Button className="w-full" size="lg">
                        Learn More
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>

                  {/* Slider Controls */}
                  {featuredProducts.length > 1 && (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                        onClick={prevSlide}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                        onClick={nextSlide}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>

                      {/* Dots Indicator */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                        {featuredProducts.map((_, index) => (
                          <button
                            key={index}
                            className={`w-2 h-2 rounded-full transition-all ${
                              index === currentSlide ? 'bg-primary w-6' : 'bg-gray-300'
                            }`}
                            onClick={() => setCurrentSlide(index)}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {isLoading && (
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                  <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-8 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-12 bg-gray-200 rounded w-full mt-6"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose SecureMotor?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of motor insurance with our digital-first approach
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Comprehensive Coverage</h3>
                <p className="text-gray-600">
                  Full protection for your vehicle with customizable coverage options
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Fast Claims Processing</h3>
                <p className="text-gray-600">
                  Submit and track claims online with our streamlined digital process
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">24/7 Support</h3>
                <p className="text-gray-600">
                  Round-the-clock customer support whenever you need assistance
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Protected?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of satisfied customers who trust SecureMotor
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                Browse Products
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-primary">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Car className="h-6 w-6" />
                <span className="text-xl font-bold">SecureMotor</span>
              </div>
              <p className="text-gray-400">
                Your trusted partner for comprehensive motor insurance coverage.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Products</h4>
              <div className="space-y-2 text-gray-400">
                <Link to="/products" className="block hover:text-white">Motor Insurance</Link>
                <Link to="/products" className="block hover:text-white">Commercial Vehicle</Link>
                <Link to="/products" className="block hover:text-white">Motorcycle</Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2 text-gray-400">
                <Link to="/claims" className="block hover:text-white">File a Claim</Link>
                <Link to="/policies" className="block hover:text-white">Manage Policies</Link>
                <a href="#" className="block hover:text-white">Contact Us</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Account</h4>
              <div className="space-y-2 text-gray-400">
                <Link to="/login" className="block hover:text-white">Login</Link>
                <Link to="/signup" className="block hover:text-white">Register</Link>
                <Link to="/policies" className="block hover:text-white">My Policies</Link>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SecureMotor. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
