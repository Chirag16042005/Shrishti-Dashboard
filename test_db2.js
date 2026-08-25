import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';
if (!supabaseUrl) {
  console.log("No url");
  process.exit(0);
}
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const { data: clients } = await supabase.from('clients').select('*');
  const { data: projects } = await supabase.from('projects').select('*');
  console.log({ clients, projects });
}
run();
