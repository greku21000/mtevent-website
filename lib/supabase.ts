import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Inquiry = {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  event_type: string;
  event_date?: string;
  guest_count?: number;
  venue?: string;
  message?: string;
  created_at?: string;
};
