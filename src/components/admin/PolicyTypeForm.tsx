
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

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
    coverage_details: {
      liability: '',
      collision: '',
      comprehensive: '',
      fire_theft: '',
    },
  });

  useEffect(() => {
    if (policyType) {
      setFormData({
        name: policyType.name || '',
        description: policyType.description || '',
        base_premium: policyType.base_premium?.toString() || '',
        active: policyType.active !== false,
        coverage_details: {
          liability: policyType.coverage_details?.liability?.toString() || '',
          collision: policyType.coverage_details?.collision?.toString() || '',
          comprehensive: policyType.coverage_details?.comprehensive?.toString() || '',
          fire_theft: policyType.coverage_details?.fire_theft?.toString() || '',
        },
      });
    }
  }, [policyType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const coverage_details: any = {};
    if (formData.coverage_details.liability) coverage_details.liability = parseFloat(formData.coverage_details.liability);
    if (formData.coverage_details.collision) coverage_details.collision = parseFloat(formData.coverage_details.collision);
    if (formData.coverage_details.comprehensive) coverage_details.comprehensive = parseFloat(formData.coverage_details.comprehensive);
    if (formData.coverage_details.fire_theft) coverage_details.fire_theft = parseFloat(formData.coverage_details.fire_theft);

    const submitData = {
      name: formData.name,
      description: formData.description,
      base_premium: formData.base_premium ? parseFloat(formData.base_premium) : null,
      active: formData.active,
      coverage_details: Object.keys(coverage_details).length > 0 ? coverage_details : null,
    };

    onSubmit(submitData);
  };

  const handleChange = (field: string, value: string | boolean) => {
    if (field.startsWith('coverage_details.')) {
      const coverageField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        coverage_details: {
          ...prev.coverage_details,
          [coverageField]: value as string,
        },
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{policyType ? 'Edit Policy Type' : 'Create New Policy Type'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="base_premium">Base Premium</Label>
            <Input
              id="base_premium"
              type="number"
              step="0.01"
              value={formData.base_premium}
              onChange={(e) => handleChange('base_premium', e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <Label>Coverage Details</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="liability">Liability Coverage</Label>
                <Input
                  id="liability"
                  type="number"
                  step="0.01"
                  value={formData.coverage_details.liability}
                  onChange={(e) => handleChange('coverage_details.liability', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="collision">Collision Coverage</Label>
                <Input
                  id="collision"
                  type="number"
                  step="0.01"
                  value={formData.coverage_details.collision}
                  onChange={(e) => handleChange('coverage_details.collision', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="comprehensive">Comprehensive Coverage</Label>
                <Input
                  id="comprehensive"
                  type="number"
                  step="0.01"
                  value={formData.coverage_details.comprehensive}
                  onChange={(e) => handleChange('coverage_details.comprehensive', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fire_theft">Fire & Theft Coverage</Label>
                <Input
                  id="fire_theft"
                  type="number"
                  step="0.01"
                  value={formData.coverage_details.fire_theft}
                  onChange={(e) => handleChange('coverage_details.fire_theft', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={formData.active}
              onCheckedChange={(checked) => handleChange('active', checked)}
            />
            <Label htmlFor="active">Active</Label>
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
