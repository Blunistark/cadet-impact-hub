import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { Problem } from '@/lib/types';

interface CreateProblemData {
  title: string;
  description: string;
  location: string;
  tags?: string[];
  priority?: 'low' | 'medium' | 'high';
  level?: 'level1' | 'level2' | 'level3';
  postedBy: string;
}

interface UpdateProblemData {
  status?: 'pending' | 'approved' | 'rejected';
  approvalFeedback?: string;
  approvedBy?: string;
}

export const useProblems = () => {
  return useQuery({
    queryKey: ['problems'],
    queryFn: async (): Promise<Problem[]> => {
      const response = await fetch('/api/problems');
      if (!response.ok) {
        throw new Error('Failed to fetch problems');
      }
      return response.json();
    },
  });
};

export const useCreateProblem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateProblemData): Promise<Problem> => {
      const response = await fetch('/api/problems', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create problem');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['problems'] });
    },
  });
};

export const useUpdateProblem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateProblemData }): Promise<Problem> => {
      const response = await fetch(`/api/problems/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update problem');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['problems'] });
    },
  });
};