import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// This client must only be used in Astro Endpoints or Server Islands.
// It uses the SERVICE_ROLE_KEY which bypasses RLS.
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
    // If we're on the server but the key isn't provided, we log it for the developer.
    console.warn('SUPABASE_SERVICE_ROLE_KEY is not defined. Student account creation will fail.');
}

export const supabaseAdmin = createClient<Database>(
    supabaseUrl || '',
    supabaseServiceRoleKey || '',
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);
