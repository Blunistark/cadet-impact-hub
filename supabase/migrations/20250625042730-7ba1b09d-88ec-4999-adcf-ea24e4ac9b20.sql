
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('cadet', 'ano');
CREATE TYPE problem_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE problem_priority AS ENUM ('low', 'medium', 'high');

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'cadet',
  unit_code TEXT,
  directorate TEXT,
  rank TEXT,
  institute TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create problems table
CREATE TABLE public.problems (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  status problem_status DEFAULT 'pending',
  priority problem_priority DEFAULT 'medium',
  posted_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  approved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  approval_feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    CASE 
      WHEN NEW.email LIKE '%.ano@%' OR NEW.email LIKE '%ano.%' OR LOWER(NEW.email) LIKE '%officer%' THEN 'ano'::user_role
      ELSE 'cadet'::user_role
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "ANOs can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'ano'
    )
  );

-- RLS Policies for problems
CREATE POLICY "Anyone can view approved problems" ON public.problems
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Users can view their own problems" ON public.problems
  FOR SELECT USING (posted_by = auth.uid());

CREATE POLICY "ANOs can view all problems" ON public.problems
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'ano'
    )
  );

CREATE POLICY "Authenticated users can create problems" ON public.problems
  FOR INSERT WITH CHECK (auth.uid() = posted_by);

CREATE POLICY "Users can update their own problems" ON public.problems
  FOR UPDATE USING (posted_by = auth.uid());

CREATE POLICY "ANOs can update all problems" ON public.problems
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'ano'
    )
  );

-- Enable real-time subscriptions
ALTER TABLE public.problems REPLICA IDENTITY FULL;
ALTER TABLE public.profiles REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.problems;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;

-- Insert sample data for testing
INSERT INTO public.problems (title, description, location, tags, status, posted_by) VALUES
('Street Light Repair Needed', 'Several street lights are not working on MG Road, creating safety concerns for evening commuters.', 'MG Road, Bangalore', ARRAY['Infrastructure', 'Safety', 'Urgent'], 'pending', (SELECT id FROM public.profiles WHERE role = 'cadet' LIMIT 1)),
('Community Garden Initiative', 'Creating a community garden in the vacant lot near our college to promote environmental awareness.', 'Christ University, Bangalore', ARRAY['Environment', 'Community', 'Green'], 'approved', (SELECT id FROM public.profiles WHERE role = 'cadet' LIMIT 1)),
('Digital Literacy for Elderly', 'Teaching basic smartphone and internet skills to elderly residents in our neighborhood.', 'Jayanagar, Bangalore', ARRAY['Education', 'Digital', 'Community'], 'pending', (SELECT id FROM public.profiles WHERE role = 'cadet' LIMIT 1));
