import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy-url-for-build.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "dummy-key-for-build";

console.log("Supabase URL initialized:", supabaseUrl);
console.log("Supabase Key starts with:", supabaseKey.substring(0, 15) + "...");

// We use the Service Role Key here exclusively for the server-side API endpoints 
// to ensure we can confidently read/write custom authenticated user data.
export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    }
});
