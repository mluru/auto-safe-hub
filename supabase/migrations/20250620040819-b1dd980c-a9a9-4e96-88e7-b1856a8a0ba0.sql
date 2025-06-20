
-- First, let's check what the current check constraint allows for status
SELECT con.conname, pg_get_constraintdef(con.oid) 
FROM pg_constraint con 
INNER JOIN pg_class rel ON rel.oid = con.conrelid 
INNER JOIN pg_namespace nsp ON nsp.oid = connamespace 
WHERE nsp.nspname = 'public' 
AND rel.relname = 'policies' 
AND con.contype = 'c';

-- Let's also check if there's an enum type for policy status
SELECT t.typname, e.enumlabel 
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid 
WHERE t.typname LIKE '%status%' OR t.typname LIKE '%policy%';

-- If the constraint is too restrictive, let's update it to allow common status values
-- First drop the existing constraint
ALTER TABLE public.policies DROP CONSTRAINT IF EXISTS policies_status_check;

-- Create a new constraint that allows common policy status values
ALTER TABLE public.policies ADD CONSTRAINT policies_status_check 
CHECK (status IN ('pending', 'active', 'expired', 'cancelled', 'draft', 'under_review', 'approved', 'rejected'));
