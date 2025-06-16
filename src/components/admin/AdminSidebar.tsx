
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Car, 
  FileText, 
  UserPlus, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

export const AdminSidebar = () => {
  const { signOut, user } = useAuth();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  console.log('AdminSidebar current location:', location.pathname);

  const menuItems = [
    { 
      name: 'Dashboard', 
      path: '/admin/dashboard', 
      icon: LayoutDashboard 
    },
    { 
      name: 'Manage Policies', 
      path: '/admin/policies', 
      icon: Car 
    },
    { 
      name: 'Policy Types', 
      path: '/admin/policy-types', 
      icon: FileText 
    },
    { 
      name: 'Assign Policies', 
      path: '/admin/assign', 
      icon: UserPlus 
    }
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    } flex flex-col h-screen sticky top-0`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h1 className="text-xl font-bold text-gray-900">Admin Portal</h1>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span className="font-medium">{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-gray-200">
        {!isCollapsed && (
          <div className="mb-3">
            <p className="text-sm text-gray-600">Logged in as:</p>
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.email}
            </p>
          </div>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="w-full flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );
};
