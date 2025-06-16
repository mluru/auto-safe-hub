
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PolicyTypeFormProps {
  policyType?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const PolicyTypeForm = ({ policyType, onSubmit, onCancel, isLoading }: PolicyTypeFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    base_premium: '',
    active: true,
  });

  useEffect(() => {
    if (policyType) {
      setFormData({
        name: policyType.name || '',
        description: policyType.description || '',
        base_premium: policyType.base_premium?.toString() || '',
        active: policyType.active ?? true,
      });
    }
  }, [policyType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      base_premium: formData.base_premium ? parseFloat(formData.base_premium) : null,
    };

    console.log('PolicyTypeForm submitting:', submitData);
    onSubmit(submitData);
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{policyType ? 'Edit Policy Type' : 'Create New Policy Type'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Policy Type Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g., Comprehensive, Third Party"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe the coverage and features of this policy type"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="base_premium">Base Premium (Optional)</Label>
            <Input
              id="base_premium"
              type="number"
              step="0.01"
              value={formData.base_premium}
              onChange={(e) => handleChange('base_premium', e.target.value)}
              placeholder="e.g., 500.00"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={formData.active}
              onCheckedChange={(checked) => handleChange('active', checked)}
            />
            <Label htmlFor="active">Active (available for new policies)</Label>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : policyType ? 'Update Policy Type' : 'Create Policy Type'}
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
