import { supabase } from "$lib/supabaseClient";
import { redirect, error } from "@sveltejs/kit";

export async function load({ params }) {
    const { slug } = params;

    // Find the user by the redirect URL slug
    const { data: user, error: dbError } = await supabase
        .from("users")
        .select("*")
        .eq("redirect", `https://rapidreboot.com/${slug}`)
        .single();

    if (dbError || !user) {
        throw error(404, "Redirect not found");
    }

    // Increment times_visited
    await supabase
        .from("users")
        .update({ times_visited: user.times_visited + 1 })
        .eq("id", user.id);

    // Redirect to the stored URL
    throw redirect(302, user.redirect);
}
