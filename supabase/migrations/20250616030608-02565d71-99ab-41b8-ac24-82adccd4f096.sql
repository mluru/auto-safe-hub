
-- Create items table for insurance product catalog
CREATE TABLE public.items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  discounted_price NUMERIC,
  type TEXT NOT NULL DEFAULT 'service', -- 'service' | 'product'
  image TEXT, -- URL to Supabase storage
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table for e-commerce workflow
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES auth.users NOT NULL,
  total NUMERIC NOT NULL,
  delivery_address TEXT,
  phone_number TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'cancelled'
  proof_of_payment TEXT, -- file URL
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order_items table for cart functionality
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  item_id UUID REFERENCES public.items(id) NOT NULL,
  rate_premium NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Update policies table to include new fields
ALTER TABLE public.policies ADD COLUMN IF NOT EXISTS order_id UUID REFERENCES public.orders(id);
ALTER TABLE public.policies ADD COLUMN IF NOT EXISTS vehicle_info JSONB;
ALTER TABLE public.policies ADD COLUMN IF NOT EXISTS owner_info JSONB;
ALTER TABLE public.policies ADD COLUMN IF NOT EXISTS risk_location TEXT;
ALTER TABLE public.policies ADD COLUMN IF NOT EXISTS property_details TEXT;
ALTER TABLE public.policies ADD COLUMN IF NOT EXISTS renewable BOOLEAN DEFAULT true;

-- Update claims table to include uploads
ALTER TABLE public.claims ADD COLUMN IF NOT EXISTS uploads JSONB; -- contains URLs of police report, ID, license, photos

-- Enable RLS on new tables
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for items (public read, admin write)
CREATE POLICY "Anyone can view items" ON public.items
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage items" ON public.items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create RLS policies for orders (users see own orders, admins see all)
CREATE POLICY "Users can view their own orders" ON public.orders
  FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Users can create their own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Users can update their own orders" ON public.orders
  FOR UPDATE USING (auth.uid() = customer_id);

CREATE POLICY "Admins can view all orders" ON public.orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all orders" ON public.orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create RLS policies for order_items (inherit from orders)
CREATE POLICY "Users can view their own order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id AND orders.customer_id = auth.uid()
    )
  );

CREATE POLICY "Users can create order items for their orders" ON public.order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id AND orders.customer_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all order items" ON public.order_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create function to generate order numbers
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN 'ORD-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD((FLOOR(RANDOM() * 999999) + 1)::TEXT, 6, '0');
END;
$$;

-- Add order_number column to orders table
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS order_number TEXT;

-- Create trigger to auto-generate order numbers
CREATE OR REPLACE FUNCTION public.set_order_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := public.generate_order_number();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_order_number_trigger
  BEFORE INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_order_number();
