
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Navbar } from '@/components/Navbar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { PolicyManagement } from '@/components/admin/PolicyManagement';
import { PolicyTypeManagement } from '@/components/admin/PolicyTypeManagement';
import { LayoutDashboard, Car, FileText } from 'lucide-react';

const Admin = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <AdminHeader />
      
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="policies" className="flex items-center gap-2">
              <Car className="h-4 w-4" />
              Policies
            </TabsTrigger>
            <TabsTrigger value="policy-types" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Policy Types
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <AdminDashboard />
          </TabsContent>

          <TabsContent value="policies">
            <PolicyManagement />
          </TabsContent>

          <TabsContent value="policy-types">
            <PolicyTypeManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
