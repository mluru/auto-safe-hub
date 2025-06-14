
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePolicyTypes } from '@/hooks/usePolicyTypes';
import { supabase } from '@/integrations/supabase/client';

interface PolicyFormProps {
  policy?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const PolicyForm = ({ policy, onSubmit, onCancel, isLoading }: PolicyFormProps) => {
  const { data: policyTypes } = usePolicyTypes();
  const [users, setUsers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    user_id: '',
    policy_type_id: '',
    vehicle_make: '',
    vehicle_model: '',
    vehicle_year: new Date().getFullYear(),
    vehicle_reg_number: '',
    chassis_number: '',
    engine_number: '',
    engine_model: '',
    seating_capacity: '',
    tonnage: '',
    energy_type: '',
    vehicle_category: '',
    owner_name: '',
    owner_address: '',
    owner_email: '',
    owner_phone: '',
    premium: '',
    start_date: '',
    expiry_date: '',
    status: 'active',
  });

  useEffect(() => {
    // Fetch users for selection
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name');
      
      if (!error && data) {
        setUsers(data);
      }
    };
    
    fetchUsers();
  }, []);

  useEffect(() => {
    if (policy) {
      setFormData({
        user_id: policy.user_id || '',
        policy_type_id: policy.policy_type_id || '',
        vehicle_make: policy.vehicle_make || '',
        vehicle_model: policy.vehicle_model || '',
        vehicle_year: policy.vehicle_year || new Date().getFullYear(),
        vehicle_reg_number: policy.vehicle_reg_number || '',
        chassis_number: policy.chassis_number || '',
        engine_number: policy.engine_number || '',
        engine_model: policy.engine_model || '',
        seating_capacity: policy.seating_capacity?.toString() || '',
        tonnage: policy.tonnage?.toString() || '',
        energy_type: policy.energy_type || '',
        vehicle_category: policy.vehicle_category || '',
        owner_name: policy.owner_name || '',
        owner_address: policy.owner_address || '',
        owner_email: policy.owner_email || '',
        owner_phone: policy.owner_phone || '',
        premium: policy.premium?.toString() || '',
        start_date: policy.start_date || '',
        expiry_date: policy.expiry_date || '',
        status: policy.status || 'active',
      });
    }
  }, [policy]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      vehicle_year: parseInt(formData.vehicle_year.toString()),
      seating_capacity: formData.seating_capacity ? parseInt(formData.seating_capacity) : null,
      tonnage: formData.tonnage ? parseFloat(formData.tonnage) : null,
      premium: parseFloat(formData.premium),
    };

    onSubmit(submitData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{policy ? 'Edit Policy' : 'Create New Policy'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Selection */}
          <div className="space-y-2">
            <Label htmlFor="user_id">Policy Holder</Label>
            <Select value={formData.user_id} onValueChange={(value) => handleChange('user_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select policy holder" />
              </SelectTrigger>
              <SelectContent>
                {users.map(user => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Policy Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="policy_type_id">Policy Type</Label>
            <Select value={formData.policy_type_id} onValueChange={(value) => handleChange('policy_type_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select policy type" />
              </SelectTrigger>
              <SelectContent>
                {policyTypes?.map(type => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Vehicle Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vehicle_make">Vehicle Make</Label>
              <Input
                id="vehicle_make"
                value={formData.vehicle_make}
                onChange={(e) => handleChange('vehicle_make', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicle_model">Vehicle Model</Label>
              <Input
                id="vehicle_model"
                value={formData.vehicle_model}
                onChange={(e) => handleChange('vehicle_model', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicle_year">Vehicle Year</Label>
              <Input
                id="vehicle_year"
                type="number"
                value={formData.vehicle_year}
                onChange={(e) => handleChange('vehicle_year', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicle_reg_number">Registration Number</Label>
              <Input
                id="vehicle_reg_number"
                value={formData.vehicle_reg_number}
                onChange={(e) => handleChange('vehicle_reg_number', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="chassis_number">Chassis Number</Label>
              <Input
                id="chassis_number"
                value={formData.chassis_number}
                onChange={(e) => handleChange('chassis_number', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="engine_number">Engine Number</Label>
              <Input
                id="engine_number"
                value={formData.engine_number}
                onChange={(e) => handleChange('engine_number', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="engine_model">Engine Model</Label>
              <Input
                id="engine_model"
                value={formData.engine_model}
                onChange={(e) => handleChange('engine_model', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seating_capacity">Seating Capacity</Label>
              <Input
                id="seating_capacity"
                type="number"
                value={formData.seating_capacity}
                onChange={(e) => handleChange('seating_capacity', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tonnage">Tonnage</Label>
              <Input
                id="tonnage"
                type="number"
                step="0.01"
                value={formData.tonnage}
                onChange={(e) => handleChange('tonnage', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="energy_type">Energy Type</Label>
              <Select value={formData.energy_type} onValueChange={(value) => handleChange('energy_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select energy type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="petrol">Petrol</SelectItem>
                  <SelectItem value="diesel">Diesel</SelectItem>
                  <SelectItem value="electric">Electric</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="cng">CNG</SelectItem>
                  <SelectItem value="lpg">LPG</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicle_category">Vehicle Category</Label>
              <Select value={formData.vehicle_category} onValueChange={(value) => handleChange('vehicle_category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private_car">Private Car</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="motorcycle">Motorcycle</SelectItem>
                  <SelectItem value="truck">Truck</SelectItem>
                  <SelectItem value="bus">Bus</SelectItem>
                  <SelectItem value="taxi">Taxi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Owner Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Owner Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="owner_name">Owner Name</Label>
                <Input
                  id="owner_name"
                  value={formData.owner_name}
                  onChange={(e) => handleChange('owner_name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="owner_email">Owner Email</Label>
                <Input
                  id="owner_email"
                  type="email"
                  value={formData.owner_email}
                  onChange={(e) => handleChange('owner_email', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="owner_phone">Owner Phone</Label>
                <Input
                  id="owner_phone"
                  value={formData.owner_phone}
                  onChange={(e) => handleChange('owner_phone', e.target.value)}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="owner_address">Owner Address</Label>
                <Textarea
                  id="owner_address"
                  value={formData.owner_address}
                  onChange={(e) => handleChange('owner_address', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Policy Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="premium">Premium Amount</Label>
              <Input
                id="premium"
                type="number"
                step="0.01"
                value={formData.premium}
                onChange={(e) => handleChange('premium', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => handleChange('start_date', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiry_date">Expiry Date</Label>
              <Input
                id="expiry_date"
                type="date"
                value={formData.expiry_date}
                onChange={(e) => handleChange('expiry_date', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : policy ? 'Update Policy' : 'Create Policy'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
