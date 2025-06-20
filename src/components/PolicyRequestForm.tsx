
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { useCreatePolicy } from '@/hooks/usePolicies';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CalendarIcon, Upload } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const policyRequestSchema = z.object({
  // Vehicle Information
  vehicleMake: z.string().min(1, 'Vehicle make is required'),
  vehicleModel: z.string().min(1, 'Vehicle model is required'),
  vehicleYear: z.number().min(1900).max(new Date().getFullYear() + 1),
  vehicleRegNumber: z.string().min(1, 'Vehicle registration number is required'),
  engineNumber: z.string().min(1, 'Engine number is required'),
  chassisNumber: z.string().min(1, 'Chassis number is required'),
  engineModel: z.string().optional(),
  seatingCapacity: z.number().min(1).max(50),
  tonnage: z.number().optional(),
  energyType: z.string().min(1, 'Energy type is required'),
  vehicleCategory: z.string().min(1, 'Vehicle category is required'),
  riskLocation: z.string().min(1, 'Risk location is required'),
  
  // Policy Information
  policyType: z.string().min(1, 'Policy type is required'),
  startDate: z.date(),
  endDate: z.date(),
  premium: z.number().min(0, 'Premium must be positive'),
  
  // Customer Information (will be pre-filled)
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(1, 'Phone number is required'),
  address: z.string().min(1, 'Address is required'),
});

type PolicyRequestForm = z.infer<typeof policyRequestSchema>;

const PolicyRequestForm = () => {
  const { user } = useAuth();
  const createPolicy = useCreatePolicy();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    nationalId: null,
    driversLicense: null,
    vehicleRegistration: null,
    additionalDocs: null,
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PolicyRequestForm>({
    resolver: zodResolver(policyRequestSchema),
    defaultValues: {
      fullName: user?.user_metadata?.full_name || '',
      email: user?.email || '',
      phone: '',
      address: '',
    },
  });

  const handleFileChange = (field: string, file: File | null) => {
    setFiles(prev => ({ ...prev, [field]: file }));
  };

  const onSubmit = async (data: PolicyRequestForm) => {
    try {
      console.log('Submitting policy request data:', data);
      console.log('Files:', files);
      
      if (!user) {
        toast.error('You must be logged in to submit a policy request');
        return;
      }

      // Map form data to database format
      const policyData = {
        vehicle_make: data.vehicleMake,
        vehicle_model: data.vehicleModel,
        vehicle_year: data.vehicleYear,
        vehicle_reg_number: data.vehicleRegNumber,
        engine_number: data.engineNumber,
        chassis_number: data.chassisNumber,
        engine_model: data.engineModel || null,
        seating_capacity: data.seatingCapacity,
        tonnage: data.tonnage || null,
        energy_type: data.energyType,
        vehicle_category: data.vehicleCategory,
        risk_location: data.riskLocation,
        policy_type: data.policyType,
        start_date: format(data.startDate, 'yyyy-MM-dd'),
        expiry_date: format(data.endDate, 'yyyy-MM-dd'),
        premium: data.premium,
        owner_name: data.fullName,
        owner_email: data.email,
        owner_phone: data.phone,
        owner_address: data.address,
        status: 'pending'
      };

      console.log('Mapped policy data for Supabase:', policyData);

      await createPolicy.mutateAsync(policyData);
      
      toast.success('Policy request submitted successfully!');
      
      // Reset form
      reset();
      setStartDate(undefined);
      setEndDate(undefined);
      setFiles({
        nationalId: null,
        driversLicense: null,
        vehicleRegistration: null,
        additionalDocs: null,
      });
      
    } catch (error) {
      console.error('Error submitting policy request:', error);
      toast.error('Failed to submit policy request. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              {...register('fullName')}
              className="bg-gray-50"
              readOnly
            />
            {errors.fullName && (
              <p className="text-sm text-red-600 mt-1">{errors.fullName.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              className="bg-gray-50"
              readOnly
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              {...register('phone')}
              placeholder="Enter phone number"
            />
            {errors.phone && (
              <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
            )}
          </div>
          
          <div className="md:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              {...register('address')}
              placeholder="Enter full address"
              rows={3}
            />
            {errors.address && (
              <p className="text-sm text-red-600 mt-1">{errors.address.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Information */}
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="vehicleMake">Vehicle Make</Label>
            <Input
              id="vehicleMake"
              {...register('vehicleMake')}
              placeholder="e.g., Toyota, Honda"
            />
            {errors.vehicleMake && (
              <p className="text-sm text-red-600 mt-1">{errors.vehicleMake.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="vehicleModel">Vehicle Model</Label>
            <Input
              id="vehicleModel"
              {...register('vehicleModel')}
              placeholder="e.g., Camry, Civic"
            />
            {errors.vehicleModel && (
              <p className="text-sm text-red-600 mt-1">{errors.vehicleModel.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="vehicleYear">Year</Label>
            <Input
              id="vehicleYear"
              type="number"
              {...register('vehicleYear', { valueAsNumber: true })}
              placeholder="2020"
            />
            {errors.vehicleYear && (
              <p className="text-sm text-red-600 mt-1">{errors.vehicleYear.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="vehicleRegNumber">Vehicle Registration Number</Label>
            <Input
              id="vehicleRegNumber"
              {...register('vehicleRegNumber')}
              placeholder="ABC-123"
            />
            {errors.vehicleRegNumber && (
              <p className="text-sm text-red-600 mt-1">{errors.vehicleRegNumber.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="engineNumber">Engine Number</Label>
            <Input
              id="engineNumber"
              {...register('engineNumber')}
              placeholder="Engine number"
            />
            {errors.engineNumber && (
              <p className="text-sm text-red-600 mt-1">{errors.engineNumber.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="chassisNumber">Chassis Number</Label>
            <Input
              id="chassisNumber"
              {...register('chassisNumber')}
              placeholder="Chassis number"
            />
            {errors.chassisNumber && (
              <p className="text-sm text-red-600 mt-1">{errors.chassisNumber.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="engineModel">Engine Model</Label>
            <Input
              id="engineModel"
              {...register('engineModel')}
              placeholder="Engine model (optional)"
            />
          </div>
          
          <div>
            <Label htmlFor="seatingCapacity">Seating Capacity</Label>
            <Input
              id="seatingCapacity"
              type="number"
              {...register('seatingCapacity', { valueAsNumber: true })}
              placeholder="5"
            />
            {errors.seatingCapacity && (
              <p className="text-sm text-red-600 mt-1">{errors.seatingCapacity.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="tonnage">Tonnage (Optional)</Label>
            <Input
              id="tonnage"
              type="number"
              step="0.1"
              {...register('tonnage', { valueAsNumber: true })}
              placeholder="1.5"
            />
          </div>
          
          <div>
            <Label htmlFor="energyType">Energy Type</Label>
            <Select onValueChange={(value) => setValue('energyType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select energy type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="petrol">Petrol</SelectItem>
                <SelectItem value="diesel">Diesel</SelectItem>
                <SelectItem value="electric">Electric</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
            {errors.energyType && (
              <p className="text-sm text-red-600 mt-1">{errors.energyType.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="vehicleCategory">Vehicle Category</Label>
            <Select onValueChange={(value) => setValue('vehicleCategory', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
              </SelectContent>
            </Select>
            {errors.vehicleCategory && (
              <p className="text-sm text-red-600 mt-1">{errors.vehicleCategory.message}</p>
            )}
          </div>
          
          <div className="md:col-span-2">
            <Label htmlFor="riskLocation">Risk Location</Label>
            <Input
              id="riskLocation"
              {...register('riskLocation')}
              placeholder="Location where vehicle is primarily used"
            />
            {errors.riskLocation && (
              <p className="text-sm text-red-600 mt-1">{errors.riskLocation.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Policy Information */}
      <Card>
        <CardHeader>
          <CardTitle>Policy Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="policyType">Type of Policy</Label>
            <Select onValueChange={(value) => setValue('policyType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select policy type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="third-party">Third Party</SelectItem>
                <SelectItem value="comprehensive">Comprehensive</SelectItem>
                <SelectItem value="third-party-fire-theft">Third Party, Fire & Theft</SelectItem>
              </SelectContent>
            </Select>
            {errors.policyType && (
              <p className="text-sm text-red-600 mt-1">{errors.policyType.message}</p>
            )}
          </div>
          
          <div>
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : "Pick start date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => {
                    setStartDate(date);
                    if (date) setValue('startDate', date);
                  }}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            {errors.startDate && (
              <p className="text-sm text-red-600 mt-1">{errors.startDate.message}</p>
            )}
          </div>
          
          <div>
            <Label>End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : "Pick end date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={(date) => {
                    setEndDate(date);
                    if (date) setValue('endDate', date);
                  }}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            {errors.endDate && (
              <p className="text-sm text-red-600 mt-1">{errors.endDate.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="premium">Premium Amount</Label>
            <Input
              id="premium"
              type="number"
              step="0.01"
              {...register('premium', { valueAsNumber: true })}
              placeholder="0.00"
            />
            {errors.premium && (
              <p className="text-sm text-red-600 mt-1">{errors.premium.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* File Uploads */}
      <Card>
        <CardHeader>
          <CardTitle>Required Documents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'nationalId', label: 'National ID / Passport', required: true },
            { key: 'driversLicense', label: "Driver's License", required: true },
            { key: 'vehicleRegistration', label: 'Vehicle Registration Document', required: true },
            { key: 'additionalDocs', label: 'Additional Documents (Optional)', required: false },
          ].map((doc) => (
            <div key={doc.key}>
              <Label htmlFor={doc.key}>
                {doc.label} {doc.required && <span className="text-red-500">*</span>}
              </Label>
              <div className="mt-1 flex items-center gap-2">
                <Input
                  id={doc.key}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange(doc.key, e.target.files?.[0] || null)}
                  className="flex-1"
                />
                <Upload className="h-4 w-4 text-gray-400" />
              </div>
              {files[doc.key] && (
                <p className="text-sm text-green-600 mt-1">
                  File selected: {files[doc.key]?.name}
                </p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={isSubmitting || createPolicy.isPending} 
          size="lg"
        >
          {isSubmitting || createPolicy.isPending ? 'Submitting...' : 'Submit Policy Request'}
        </Button>
      </div>
    </form>
  );
};

export default PolicyRequestForm;
