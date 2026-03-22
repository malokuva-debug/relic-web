import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials are not set in environment variables.');
}

// Ensure you use the Service Role key for backend operations that need to bypass RLS,
// but be careful not to expose it to the client!
export const supabase = createClient(supabaseUrl, supabaseKey);
