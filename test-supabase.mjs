import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://pwpkajfnieedmmcfjwsr.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3cGthamZuaWVlZG1tY2Zqd3NyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDk2Nzk5MSwiZXhwIjoyMDgwNTQzOTkxfQ.wHdYmUZMV88kkdFJ44pRw7ZmFCRH4RxLQUHayO5S8sM";

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false }
});

async function run() {
    const { data, error } = await supabase.from('users').select('*').limit(1);
    console.log("Data:", data);
    console.log("Error:", error);
}

run();
