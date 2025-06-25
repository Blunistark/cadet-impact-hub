
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Problem {
  id: string;
  title: string;
  description: string;
  location: string;
  tags: string[];
  status: 'pending' | 'approved' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  posted_by: string;
  approved_by?: string;
  approval_feedback?: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string;
    rank?: string;
  };
}

export const useProblems = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();

  const fetchProblems = async () => {
    let query = supabase
      .from('problems')
      .select(`
        *,
        profiles:posted_by (
          full_name,
          rank
        )
      `)
      .order('created_at', { ascending: false });

    // If user is not ANO, only show approved problems and own problems
    if (profile?.role !== 'ano') {
      query = query.or(`status.eq.approved,posted_by.eq.${profile?.id}`);
    }

    const { data, error } = await query;

    if (!error && data) {
      setProblems(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (profile) {
      fetchProblems();

      // Set up real-time subscription
      const channel = supabase
        .channel('problems-changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'problems'
        }, () => {
          fetchProblems();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [profile]);

  const createProblem = async (problemData: Omit<Problem, 'id' | 'created_at' | 'updated_at' | 'posted_by' | 'status' | 'priority'>) => {
    if (!profile) return { error: new Error('Not authenticated') };

    const { data, error } = await supabase
      .from('problems')
      .insert({
        ...problemData,
        posted_by: profile.id
      })
      .select()
      .single();

    return { data, error };
  };

  const updateProblemStatus = async (problemId: string, status: 'approved' | 'rejected', feedback?: string) => {
    if (!profile || profile.role !== 'ano') {
      return { error: new Error('Unauthorized') };
    }

    const { data, error } = await supabase
      .from('problems')
      .update({
        status,
        approved_by: profile.id,
        approval_feedback: feedback,
        updated_at: new Date().toISOString()
      })
      .eq('id', problemId)
      .select()
      .single();

    return { data, error };
  };

  return {
    problems,
    loading,
    createProblem,
    updateProblemStatus,
    refreshProblems: fetchProblems
  };
};
