const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export async function submitPilotRequest(payload) {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase is not configured.");
  }

  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const { error } = await supabase.from("pilot_requests").insert(payload);

  if (error) {
    throw error;
  }

  const { error: notificationError } = await supabase.functions.invoke("pilot-request-notify", {
    body: payload,
  });

  if (notificationError) {
    console.info("[pilot notification skipped]", notificationError.message);
  }
}
