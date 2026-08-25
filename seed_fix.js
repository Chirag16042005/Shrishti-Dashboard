import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'placeholder_anon_key';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const { error } = await supabase.from('projects').insert([{
    client_id: (await supabase.from('clients').select('id').limit(1)).data[0].id,
    service: 'Service Test'
  }]);
  console.log(error);
}
// run();
