import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('⚠️ Missing Supabase environment variables!');
  console.log('VITE_SUPABASE_URL:', supabaseUrl);
  console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'exists' : 'missing');
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Database Types
export interface Database {
  public: {
    Tables: {
      tickets: {
        Row: {
          id: string;
          ticket_number: string;
          status: 'received' | 'in-progress' | 'resolved';
          category: string;
          priority: 'low' | 'medium' | 'high' | 'urgent';
          description: string;
          subject: string | null;
          user_email: string;
          user_name: string;
          company_email: string | null;
          email_sent: boolean;
          email_sent_at: string | null;
          assigned_to: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          ticket_number: string;
          status?: 'received' | 'in-progress' | 'resolved';
          category: string;
          priority: 'low' | 'medium' | 'high' | 'urgent';
          description: string;
          subject?: string | null;
          user_email: string;
          user_name: string;
          company_email?: string | null;
          email_sent?: boolean;
          email_sent_at?: string | null;
          assigned_to?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          ticket_number?: string;
          status?: 'received' | 'in-progress' | 'resolved';
          category?: string;
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          description?: string;
          subject?: string | null;
          user_email?: string;
          user_name?: string;
          company_email?: string | null;
          email_sent?: boolean;
          email_sent_at?: string | null;
          assigned_to?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
