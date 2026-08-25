import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'placeholder_anon_key';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const { data, error } = await supabase.from('projects').insert([{
    client_id: '00000000-0000-0000-0000-000000000000',
    service: 'Test',
    user_id: '00000000-0000-0000-0000-000000000000'
  }]);
  console.log("Error:", error);
}
run();
