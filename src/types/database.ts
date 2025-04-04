export type ProjectStatus = 'Pending' | 'Approved' | 'Rejected';

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  metric: string | null;
  budget: string | null;
  status: ProjectStatus;
  nft_minted: boolean;
  funded: boolean;
  created_at: string;
  users?: {
    email: string;
  };
}

export interface Verifier {
  user_id: string;
  is_verifier: boolean;
}

export type Database = {
  public: {
    Tables: {
      projects: {
        Row: Project;
        Insert: Omit<Project, 'id' | 'created_at'>;
        Update: Partial<Omit<Project, 'id' | 'created_at'>>;
      };
      verifiers: {
        Row: Verifier;
        Insert: Verifier;
        Update: Partial<Verifier>;
      };
    };
  };
};
