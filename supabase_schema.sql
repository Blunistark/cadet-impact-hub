-- Enum Types
CREATE TYPE user_role AS ENUM ('cadet', 'ano', 'co');
CREATE TYPE problem_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE problem_priority AS ENUM ('low', 'medium', 'high');
CREATE TYPE problem_level AS ENUM ('level1', 'level2', 'level3');

-- Profiles Table
CREATE TABLE profiles (
    id UUID PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'cadet',
    unit_code TEXT,
    directorate TEXT,
    wing TEXT,
    regimental_number TEXT,
    rank TEXT,
    institute TEXT,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Problems Table
CREATE TABLE problems (
    id UUID PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    status problem_status DEFAULT 'pending',
    priority problem_priority DEFAULT 'medium',
    level problem_level DEFAULT 'level1',
    posted_by UUID REFERENCES profiles(id) ON DELETE CASCADE,
    approved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    approval_feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Legacy Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);
