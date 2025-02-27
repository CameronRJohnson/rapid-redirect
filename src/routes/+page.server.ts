import { supabase } from "$lib/supabaseClient";

export async function load() {
  const { data: users, error } = await supabase.from("users").select();

  if (error) {
    console.error("Supabase error:", error);
  }

  return { users: users ?? [] };
}
