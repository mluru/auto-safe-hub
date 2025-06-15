
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { PolicyManagement } from '@/components/admin/PolicyManagement';
import { PolicyTypeManagement } from '@/components/admin/PolicyTypeManagement';
import { AssignPolicy } from '@/components/admin/AssignPolicy';

const Admin = () => {
  console.log('Admin page rendering');
  
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="policies" element={<PolicyManagement />} />
        <Route path="policy-types" element={<PolicyTypeManagement />} />
        <Route path="assign" element={<AssignPolicy />} />
      </Routes>
    </AdminLayout>
  );
};

export default Admin;
