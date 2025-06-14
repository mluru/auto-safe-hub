
import { Button } from '@/components/ui/button';
import { Car, LogOut, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const Navbar = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
  };

  if (!user) return null;

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Car className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">SecureMotor</h1>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/policies"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/policies') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Policies
            </Link>
            <Link
              to="/claims"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/claims') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Claims
            </Link>
            <Link
              to="/payments"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/payments') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Payments
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm">
              <User className="h-4 w-4" />
              <span>{user.email}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
