import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hjiijtdugdfxducnraut.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqaWlqdGR1Z2RmeGR1Y25yYXV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkyMjA4NzgsImV4cCI6MjEwNDc5Njg3OH0.or0MyKMFmIEJLMC1WslzZwCir3SdKFQek6Oxj5VWT3I';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project-id.supabase.co'
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});
