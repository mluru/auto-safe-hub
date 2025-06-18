
import { Badge } from "@/components/ui/badge";
import { Car, FileText, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import UserNavDropdown from "./UserNavDropdown";

const PolicyHeader = () => {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-primary">SecureMotor</h1>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link 
              to="/products"
              className="hidden md:flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <FileText className="h-4 w-4 mr-2" />
              Browse Insurance
            </Link>
            
            <Link 
              to="/cart"
              className="relative flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Cart</span>
              {totalItems > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                >
                  {totalItems}
                </Badge>
              )}
            </Link>

            <UserNavDropdown />
          </div>
        </div>
      </div>
    </header>
  );
};

export default PolicyHeader;
