/**
 * Supabase Database Types
 * Auto-generated type definitions for frontend integration
 */

export type Tables = {
  users: {
    Row: {
      id: string;
      github_username: string;
      email: string | null;
      credits_available: number;
      credits_used: number;
      last_credit_reset: string;
      total_generations: number;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      github_username: string;
      email?: string | null;
      credits_available?: number;
      credits_used?: number;
      last_credit_reset?: string;
      total_generations?: number;
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      github_username?: string;
      email?: string | null;
      credits_available?: number;
      credits_used?: number;
      last_credit_reset?: string;
      total_generations?: number;
      updated_at?: string;
    };
  };
  
  generations: {
    Row: {
      id: string;
      user_id: string;
      github_username: string;
      profile_template: string;
      input_data: Record<string, any>;
      generated_readme: string;
      credits_used: number;
      ai_provider: string;
      ai_model: string;
      generation_time_ms: number | null;
      status: string;
      error_message: string | null;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      user_id: string;
      github_username: string;
      profile_template: string;
      input_data: Record<string, any>;
      generated_readme: string;
      credits_used?: number;
      ai_provider: string;
      ai_model: string;
      generation_time_ms?: number | null;
      status?: string;
      error_message?: string | null;
    };
    Update: {
      status?: string;
      error_message?: string | null;
      generated_readme?: string;
    };
  };
  
  credits_history: {
    Row: {
      id: string;
      user_id: string;
      action: string;
      credits_amount: number;
      balance_after: number;
      generation_id: string | null;
      reason: string | null;
      created_at: string;
    };
    Insert: {
      user_id: string;
      action: string;
      credits_amount: number;
      balance_after: number;
      generation_id?: string | null;
      reason?: string | null;
    };
  };
  
  saved_profiles: {
    Row: {
      id: string;
      user_id: string;
      generation_id: string;
      title: string | null;
      notes: string | null;
      is_favorite: boolean;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      user_id: string;
      generation_id: string;
      title?: string | null;
      notes?: string | null;
      is_favorite?: boolean;
    };
    Update: {
      title?: string | null;
      notes?: string | null;
      is_favorite?: boolean;
    };
  };
};

export interface User {
  id: string;
  github_username: string;
  email?: string;
  credits_available: number;
  credits_used: number;
  total_generations: number;
  created_at: string;
  updated_at: string;
}

export interface Generation {
  id: string;
  user_id: string;
  github_username: string;
  profile_template: 'professional' | 'casual' | 'minimal';
  input_data: {
    name: string;
    role: string;
    bio?: string;
    skills?: string[];
    experience?: string[];
    achievements?: string[];
  };
  generated_readme: string;
  credits_used: number;
  ai_provider: string;
  ai_model: string;
  generation_time_ms?: number;
  status: 'completed' | 'failed' | 'pending';
  error_message?: string;
  created_at: string;
  updated_at: string;
}

export interface SavedProfile {
  id: string;
  user_id: string;
  generation_id: string;
  title?: string;
  notes?: string;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreditTransaction {
  id: string;
  user_id: string;
  action: 'deduction' | 'bonus' | 'refund' | 'reset';
  credits_amount: number;
  balance_after: number;
  generation_id?: string;
  reason?: string;
  created_at: string;
}
