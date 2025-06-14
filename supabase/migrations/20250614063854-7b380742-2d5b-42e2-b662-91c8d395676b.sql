
-- Add new columns to the policies table for comprehensive vehicle and policy information
ALTER TABLE public.policies 
ADD COLUMN policy_type TEXT,
ADD COLUMN owner_name TEXT,
ADD COLUMN owner_address TEXT,
ADD COLUMN owner_email TEXT,
ADD COLUMN owner_phone TEXT,
ADD COLUMN chassis_number TEXT,
ADD COLUMN engine_number TEXT,
ADD COLUMN engine_model TEXT,
ADD COLUMN seating_capacity INTEGER,
ADD COLUMN tonnage DECIMAL(8,2),
ADD COLUMN energy_type TEXT CHECK (energy_type IN ('petrol', 'diesel', 'electric', 'hybrid', 'cng', 'lpg')),
ADD COLUMN vehicle_category TEXT CHECK (vehicle_category IN ('private_car', 'commercial', 'motorcycle', 'truck', 'bus', 'taxi'));

-- Create policy types table for better management
CREATE TABLE public.policy_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  base_premium DECIMAL(10,2),
  coverage_details JSONB,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on policy_types
ALTER TABLE public.policy_types ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for policy_types (admins only)
CREATE POLICY "Admins can manage policy types" ON public.policy_types FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');
CREATE POLICY "Users can view active policy types" ON public.policy_types FOR SELECT USING (active = true);

-- Insert some default policy types
INSERT INTO public.policy_types (name, description, base_premium, coverage_details) VALUES
('Comprehensive', 'Full coverage including theft, fire, and third-party liability', 1200.00, '{"liability": 100000, "collision": 50000, "comprehensive": 25000}'),
('Third Party', 'Basic third-party liability coverage only', 600.00, '{"liability": 50000}'),
('Third Party Fire & Theft', 'Third-party plus fire and theft coverage', 800.00, '{"liability": 50000, "fire_theft": 15000}');

-- Add foreign key relationship to policy_types
ALTER TABLE public.policies ADD COLUMN policy_type_id UUID REFERENCES public.policy_types(id);

-- Allow admins to insert policies for any user
CREATE POLICY "Admins can create policies for users" ON public.policies FOR INSERT WITH CHECK (public.get_user_role(auth.uid()) = 'admin');
