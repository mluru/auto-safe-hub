
import { Routes, Route } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { PolicyManagement } from '@/components/admin/PolicyManagement';
import { PolicyTypeManagement } from '@/components/admin/PolicyTypeManagement';
import { AssignPolicy } from '@/components/admin/AssignPolicy';

const Admin = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="policies" element={<PolicyManagement />} />
        <Route path="policy-types" element={<PolicyTypeManagement />} />
        <Route path="assign" element={<AssignPolicy />} />
      </Routes>
    </AdminLayout>
  );
};

export default Admin;
