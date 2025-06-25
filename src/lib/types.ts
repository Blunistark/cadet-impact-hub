export interface Problem {
  id: string;
  title: string;
  description: string;
  location: string;
  tags: string[];
  status: 'pending' | 'approved' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  level: 'level1' | 'level2' | 'level3';
  postedBy?: string;
  posted_by?: string; // For backward compatibility
  approvedBy?: string;
  approvalFeedback?: string;
  createdAt?: string;
  created_at?: string; // For backward compatibility
  updatedAt?: string;
  postedByProfile?: {
    id: string;
    fullName: string;
    role: string;
  };
}

export interface Profile {
  id: string;
  email: string;
  fullName: string;
  role: 'cadet' | 'ano' | 'co';
  unitCode?: string;
  directorate?: string;
  wing?: string;
  regimentalNumber?: string;
  rank?: string;
  institute?: string;
  createdAt?: string;
  updatedAt?: string;
}