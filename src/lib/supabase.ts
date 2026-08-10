import { createClient } from '@supabase/supabase-js';

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(
  rawUrl &&
  rawKey &&
  !rawUrl.includes("dummy-url") &&
  rawUrl.startsWith("http")
);

const supabaseUrl = isSupabaseConfigured ? rawUrl : "https://dummy-url-for-build.supabase.co";
const supabaseKey = isSupabaseConfigured ? rawKey : "dummy-key-for-build";

export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    }
});
