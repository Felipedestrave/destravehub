import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://yluvsxfckordpaparjax.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsdXZzeGZja29yZHBhcGFyamF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MDEwMDMsImV4cCI6MjA4NzA3NzAwM30.Zxa3ksB4eZjvs-BCNqoSgup0IZL1tuOQHU9IUFC8dt8";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export { supabase as s };
