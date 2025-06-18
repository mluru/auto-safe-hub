
import { Car } from 'lucide-react';
import { Link } from 'react-router-dom';
import UserNavDropdown from './UserNavDropdown';

interface UniversalHeaderProps {
  showNav?: boolean;
}

const UniversalHeader = ({ showNav = true }: UniversalHeaderProps) => {
  return (
    <header className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Car className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">SecureMotor</h1>
          </Link>
          
          {showNav && (
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                to="/products"
                className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground"
              >
                Insurance
              </Link>
              <Link
                to="/about"
                className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground"
              >
                Contact
              </Link>
            </nav>
          )}

          <div className="flex items-center">
            <UserNavDropdown />
          </div>
        </div>
      </div>
    </header>
  );
};

export default UniversalHeader;
