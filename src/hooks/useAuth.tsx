import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient'; // Import Supabase client
import { Profile } from '@/lib/types'; // Assuming Profile type is still relevant
import type { AuthError, Session, User as SupabaseUser } from '@supabase/supabase-js';

interface AuthContextType {
  session: Session | null;
  user: SupabaseUser | null; // Supabase user object
  profile: Profile | null; // Application-specific profile
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  register: (userData: RegisterData) => Promise<{ error: AuthError | null; user: SupabaseUser | null }>;
  logout: () => Promise<{ error: AuthError | null }>;
}

export interface RegisterData { // Exporting for use in components
  email: string;
  password: string;
  fullName: string;
  role?: 'cadet' | 'ano' | 'co';
  unitCode?: string;
  directorate?: string;
  wing?: string;
  regimentalNumber?: string;
  rank?: string;
  institute?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessionAndProfile = async () => {
      setLoading(true);
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.error('Error getting session:', sessionError);
        setLoading(false);
        return;
      }

      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        await fetchUserProfile(session.user.id);
      }
      setLoading(false);
    };

    fetchSessionAndProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setProfile(null); // Clear profile on logout
      }
      // setLoading(false) // Already handled by initial fetch or if event triggers loading
    });

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        setProfile(null);
        return;
      }
      setProfile(data as Profile);
    } catch (e) {
      console.error('Exception fetching user profile:', e);
      setProfile(null);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error && data.user) {
      await fetchUserProfile(data.user.id);
    }
    setLoading(false);
    return { error };
  };

  const register = async (userData: RegisterData) => {
    setLoading(true);
    const { email, password, fullName, role, unitCode, directorate, wing, regimentalNumber, rank, institute } = userData;

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Supabase Auth itself doesn't store these in the auth.users table directly,
        // they go into the 'profiles' table.
        // We can pass some data here if needed for email templates or initial metadata
        // but the full profile is created in the 'profiles' table separately.
      }
    });

    if (authError) {
      setLoading(false);
      return { error: authError, user: null };
    }

    if (authData.user) {
      // Now create the profile in the 'profiles' table
      // The user ID from Supabase Auth (authData.user.id) is the foreign key for our profiles table.
      const profileToInsert = {
        id: authData.user.id, // This is crucial
        email: authData.user.email!,
        full_name: fullName,
        role: role || (email.includes('ano') || email.includes('officer') ? 'ano' : 'cadet'), // Default role logic
        unit_code: unitCode,
        directorate,
        wing,
        regimental_number: regimentalNumber,
        rank,
        institute,
        // password_hash is handled by Supabase Auth, not stored here directly
      };

      const { error: profileError } = await supabase
        .from('profiles')
        .insert(profileToInsert);

      if (profileError) {
        console.error('Error creating user profile:', profileError);
        // Potentially roll back Supabase user or notify, for now just log
        // For a robust system, if profile creation fails, you might want to delete the Supabase auth user
        // or have a retry mechanism.
        setLoading(false);
        return { error: profileError as unknown as AuthError, user: authData.user }; // Cast for now
      }
      await fetchUserProfile(authData.user.id); // Fetch the newly created profile
    }
    setLoading(false);
    return { error: null, user: authData.user };
  };

  const logout = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    setProfile(null); // Clear profile on logout
    setLoading(false);
    return { error };
  };

  return (
    <AuthContext.Provider value={{
      session,
      user,
      profile,
      loading,
      login,
      register,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};