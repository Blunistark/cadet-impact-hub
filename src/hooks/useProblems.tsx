
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
        profiles!posted_by (
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
    console.log('Problems query result:', { data, error });

    if (!error && data) {
      // Transform the data to match our Problem interface
      const transformedProblems: Problem[] = data.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        location: item.location,
        tags: item.tags || [],
        status: item.status,
        priority: item.priority,
        posted_by: item.posted_by,
        approved_by: item.approved_by,
        approval_feedback: item.approval_feedback,
        created_at: item.created_at,
        updated_at: item.updated_at,
        profiles: item.profiles ? {
          full_name: item.profiles.full_name || 'Unknown User',
          rank: item.profiles.rank
        } : undefined
      }));
      
      setProblems(transformedProblems);
    } else if (error) {
      console.error('Error fetching problems:', error);
      setProblems([]);
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
          console.log('Problems table changed, refetching...');
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

    if (error) {
      console.error('Error creating problem:', error);
    }

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

    if (error) {
      console.error('Error updating problem status:', error);
    }

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
