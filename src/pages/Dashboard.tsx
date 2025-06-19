import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { LayoutDashboard, FileText, BookOpen, ClipboardList, CreditCard, LogOut, Menu, X, Users, FolderOpen } from 'lucide-react';
import PolicyRequestForm from '@/components/PolicyRequestForm';
import MyPoliciesSection from '@/components/MyPoliciesSection';
import MyClaimsSection from '@/components/MyClaimsSection';
import PaymentSection from '@/components/PaymentSection';
import UserManagementSection from '@/components/admin/UserManagementSection';
import PolicyManagementSection from '@/components/admin/PolicyManagementSection';
const Dashboard = () => {
  const {
    user,
    signOut
  } = useAuth();
  const {
    data: userRole
  } = useUserRole();
  const [activeSection, setActiveSection] = useState('request-policy');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isAdmin = userRole === 'admin';
  const menuItems = [{
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    disabled: true
  }, {
    id: 'request-policy',
    label: 'Request New Policy',
    icon: FileText
  }, {
    id: 'my-policies',
    label: 'My Policies',
    icon: BookOpen
  }, {
    id: 'my-claims',
    label: 'My Claims',
    icon: ClipboardList
  }, {
    id: 'payments',
    label: 'Payment Options',
    icon: CreditCard
  }, ...(isAdmin ? [{
    id: 'user-management',
    label: 'User Management',
    icon: Users,
    adminOnly: true
  }, {
    id: 'policy-management',
    label: 'Policy Management',
    icon: FolderOpen,
    adminOnly: true
  }] : [])];
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'request-policy':
        return <PolicyRequestForm />;
      case 'my-policies':
        return <MyPoliciesSection />;
      case 'my-claims':
        return <MyClaimsSection />;
      case 'payments':
        return <PaymentSection />;
      case 'user-management':
        return isAdmin ? <UserManagementSection /> : <PolicyRequestForm />;
      case 'policy-management':
        return isAdmin ? <PolicyManagementSection /> : <PolicyRequestForm />;
      default:
        return <PolicyRequestForm />;
    }
  };
  const handleLogout = async () => {
    await signOut();
  };
  return <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`bg-white shadow-lg transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'}`}>
        <div className="p-4">
          <div className="flex items-center justify-between">
            {sidebarOpen && <h2 className="text-xl font-bold text-primary">SecureMotor</h2>}
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <Separator />

        <nav className="p-4 space-y-2">
          {menuItems.map(item => <Button key={item.id} variant={activeSection === item.id ? "default" : "ghost"} className={`w-full justify-start ${!sidebarOpen && 'px-2'}`} onClick={() => !item.disabled && setActiveSection(item.id)} disabled={item.disabled}>
              <item.icon className={`h-4 w-4 ${sidebarOpen && 'mr-3'}`} />
              {sidebarOpen && <span className="flex items-center gap-2">
                  {item.label}
                  {item.adminOnly && <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                      Admin
                    </span>}
                </span>}
            </Button>)}
        </nav>

        <div className="absolute bottom-4 left-4 right-4 rounded-sm">
          <Separator className="mb-4" />
          {sidebarOpen && user && <div className="mb-3 p-2 bg-gray-50 rounded">
              <p className="text-sm font-medium">{user.email}</p>
              {isAdmin && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded mt-1 inline-block">
                  Administrator
                </span>}
            </div>}
          <Button variant="outline" onClick={handleLogout} className="">
            <LogOut className={`h-4 w-4 ${sidebarOpen && 'mr-3'}`} />
            {sidebarOpen && 'Logout'}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {menuItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderActiveSection()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>;
};
export default Dashboard;