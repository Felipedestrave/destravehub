import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://yluvsxfckordpaparjax.supabase.co";
const supabaseServiceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsdXZzeGZja29yZHBhcGFyamF4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTUwMTAwMywiZXhwIjoyMDg3MDc3MDAzfQ.HBEHX-TNQw3P0RYV2CNIqPZa2E7BpwvN_PR23pdzzdY";
const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export { supabaseAdmin as s };
