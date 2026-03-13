const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://pwpkajfnieedmmcfjwsr.supabase.co";
const supabaseKey = "sb_publishable_F9eBZhRSHuPvgSeyTAXifw_hmGyeMAq";

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false }
});

async function run() {
    const { data, error } = await supabase.from('users').select('*').limit(1);
    console.log("Data:", data);
    console.log("Error:", error);
}

run();
