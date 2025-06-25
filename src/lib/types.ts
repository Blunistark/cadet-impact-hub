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