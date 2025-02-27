import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://nndfioyukugegxicmrqs.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5uZGZpb3l1a3VnZWd4aWNtcnFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1OTY3MTIsImV4cCI6MjA1NjE3MjcxMn0.VmpwiwN1M0GWNNzVIMWm5H98CE9FTja2bAoFqgI5zsY";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key are required.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
