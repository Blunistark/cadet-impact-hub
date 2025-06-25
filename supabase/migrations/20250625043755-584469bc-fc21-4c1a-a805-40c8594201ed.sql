
-- First, let's check if the user_role type exists and create it if it doesn't
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('cadet', 'ano');
    END IF;
END $$;

-- Also ensure other types exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'problem_status') THEN
        CREATE TYPE problem_status AS ENUM ('pending', 'approved', 'rejected');
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'problem_priority') THEN
        CREATE TYPE problem_priority AS ENUM ('low', 'medium', 'high');
    END IF;
END $$;

-- Fix the infinite recursion in RLS policies by creating a security definer function
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS user_role
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Drop existing problematic policies
DROP POLICY IF EXISTS "ANOs can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "ANOs can view all problems" ON public.problems;
DROP POLICY IF EXISTS "ANOs can update all problems" ON public.problems;

-- Recreate policies using the security definer function
CREATE POLICY "ANOs can view all profiles" ON public.profiles
  FOR SELECT USING (public.get_current_user_role() = 'ano');

CREATE POLICY "ANOs can view all problems" ON public.problems
  FOR SELECT USING (public.get_current_user_role() = 'ano');

CREATE POLICY "ANOs can update all problems" ON public.problems
  FOR UPDATE USING (public.get_current_user_role() = 'ano');

-- Update the handle_new_user function to be more robust
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    email, 
    full_name, 
    role,
    unit_code,
    directorate,
    rank,
    institute
  ) VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    CASE 
      WHEN NEW.email LIKE '%.ano@%' OR NEW.email LIKE '%ano.%' OR LOWER(NEW.email) LIKE '%officer%' THEN 'ano'::user_role
      ELSE 'cadet'::user_role
    END,
    NEW.raw_user_meta_data->>'unit_code',
    NEW.raw_user_meta_data->>'directorate',
    NEW.raw_user_meta_data->>'rank',
    NEW.raw_user_meta_data->>'institute'
  );
  RETURN NEW;
END;
$$;
