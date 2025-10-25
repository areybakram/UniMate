// supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://stzbxkqqfjtpbfruqaag.supabase.co"; // <- replace
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0emJ4a3FxZmp0cGJmcnVxYWFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzNTEzMDAsImV4cCI6MjA3NjkyNzMwMH0.SYecUUH034viNgHfn0EOvFGdfpC2fGGgw1e5jdRA_Ts"; // <- replace

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
