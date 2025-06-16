
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, FileText, CreditCard, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TestAdminAccess } from '@/components/TestAdminAccess';

const Index = () => {
  const { user } = useAuth();
  const { data: role } = useUserRole();

  console.log('Index page - user:', user?.email, 'role:', role);

  const features = [
    {
      title: 'My Policies',
      description: 'View and manage your insurance policies',
      icon: Car,
      link: '/policies',
    },
    {
      title: 'Claims',
      description: 'Submit and track insurance claims',
      icon: FileText,
      link: '/claims',
    },
    {
      title: 'Payments',
      description: 'View payment history and make payments',
      icon: CreditCard,
      link: '/payments',
    },
  ];

  if (role === 'admin') {
    features.push({
      title: 'Admin Portal',
      description: 'Manage users, policies, and system settings',
      icon: Users,
      link: '/admin',
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome to Motor Insurance Portal
          </h1>
          <p className="text-xl text-gray-600">
            Hello, {user?.email}! Your role: {role || 'user'}
          </p>
        </div>

        {/* Test Admin Access Component */}
        {role !== 'admin' && <TestAdminAccess />}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {features.map((feature) => (
            <Card key={feature.title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <feature.icon className="h-5 w-5 text-primary" />
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <Button asChild className="w-full">
                  <Link to={feature.link}>Access {feature.title}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
