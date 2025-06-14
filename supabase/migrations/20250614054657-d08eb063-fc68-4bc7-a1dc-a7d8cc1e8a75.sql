
-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user roles enum and table for admin access
CREATE TYPE public.user_role AS ENUM ('user', 'admin');

CREATE TABLE public.user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role user_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Create policies table
CREATE TABLE public.policies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  policy_number TEXT UNIQUE NOT NULL,
  vehicle_make TEXT NOT NULL,
  vehicle_model TEXT NOT NULL,
  vehicle_year INTEGER NOT NULL,
  vehicle_reg_number TEXT NOT NULL,
  premium DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
  start_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create claims table
CREATE TABLE public.claims (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  policy_id UUID REFERENCES public.policies(id) ON DELETE CASCADE NOT NULL,
  claim_number TEXT UNIQUE NOT NULL,
  accident_date DATE NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'approved', 'rejected')),
  estimated_amount DECIMAL(10,2),
  approved_amount DECIMAL(10,2),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create claim files table
CREATE TABLE public.claim_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  claim_id UUID REFERENCES public.claims(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_category TEXT NOT NULL CHECK (file_category IN ('police_report', 'repair_quotation', 'id_card', 'driver_license', 'damage_photo', 'vehicle_photo')),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payments table
CREATE TABLE public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  policy_id UUID REFERENCES public.policies(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_date DATE NOT NULL,
  payment_method TEXT NOT NULL,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('monthly', 'quarterly', 'annual')),
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'overdue')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claim_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT role::TEXT FROM public.user_roles WHERE user_id = user_uuid LIMIT 1;
$$;

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- Create RLS policies for user_roles
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all roles" ON public.user_roles FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- Create RLS policies for policies
CREATE POLICY "Users can view own policies" ON public.policies FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own policies" ON public.policies FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all policies" ON public.policies FOR SELECT USING (public.get_user_role(auth.uid()) = 'admin');
CREATE POLICY "Admins can manage all policies" ON public.policies FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- Create RLS policies for claims
CREATE POLICY "Users can view own claims" ON public.claims FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own claims" ON public.claims FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all claims" ON public.claims FOR SELECT USING (public.get_user_role(auth.uid()) = 'admin');
CREATE POLICY "Admins can update all claims" ON public.claims FOR UPDATE USING (public.get_user_role(auth.uid()) = 'admin');

-- Create RLS policies for claim_files
CREATE POLICY "Users can view own claim files" ON public.claim_files FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.claims WHERE claims.id = claim_files.claim_id AND claims.user_id = auth.uid())
);
CREATE POLICY "Users can insert own claim files" ON public.claim_files FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.claims WHERE claims.id = claim_files.claim_id AND claims.user_id = auth.uid())
);
CREATE POLICY "Admins can view all claim files" ON public.claim_files FOR SELECT USING (public.get_user_role(auth.uid()) = 'admin');

-- Create RLS policies for payments
CREATE POLICY "Users can view own payments" ON public.payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all payments" ON public.payments FOR SELECT USING (public.get_user_role(auth.uid()) = 'admin');
CREATE POLICY "Admins can manage all payments" ON public.payments FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- Create storage bucket for claim files
INSERT INTO storage.buckets (id, name, public) VALUES ('claim-files', 'claim-files', false);

-- Create storage policies (simplified for now - we'll manage file organization in the application layer)
CREATE POLICY "Authenticated users can upload claim files" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'claim-files' AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can view claim files" ON storage.objects FOR SELECT USING (
  bucket_id = 'claim-files' AND auth.role() = 'authenticated'
);

CREATE POLICY "Admins can view all claim files" ON storage.objects FOR SELECT USING (
  bucket_id = 'claim-files' AND public.get_user_role(auth.uid()) = 'admin'
);

-- Create trigger to auto-create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Generate policy numbers function
CREATE OR REPLACE FUNCTION generate_policy_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'MI-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD((FLOOR(RANDOM() * 999999) + 1)::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Generate claim numbers function  
CREATE OR REPLACE FUNCTION generate_claim_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'CLM-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD((FLOOR(RANDOM() * 999999) + 1)::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;
