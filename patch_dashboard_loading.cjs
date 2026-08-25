const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf-8');

const slowFetch = `    try {
      const { count: clientsCount } = await supabase.from('clients').select('*', { count: 'exact', head: true });
      const { data: projects, count: projectsCount } = await supabase.from('projects').select('*, clients(name)').order('created_at', { ascending: false }).limit(5);
      const { data: payments } = await supabase.from('payments').select('*');`;

const fastFetch = `    try {
      const [
        { count: clientsCount },
        { data: projects, count: projectsCount },
        { data: payments }
      ] = await Promise.all([
        supabase.from('clients').select('*', { count: 'exact', head: true }),
        supabase.from('projects').select('*, clients(name)').order('created_at', { ascending: false }).limit(5),
        supabase.from('payments').select('*')
      ]);`;

if (code.includes(slowFetch)) {
  code = code.replace(slowFetch, fastFetch);
} else {
  // If we can't find the exact slowFetch string, try with regex or string splitting
  console.log('Exact slow fetch block not found. Using fallback regex.');
  const regex = /const \{ count: clientsCount \} = await supabase.*?const \{ data: payments \} = await supabase.*?;/s;
  if (regex.test(code)) {
    code = code.replace(regex, fastFetch);
  }
}

// Remove delay if it exists (but likely it doesn't)
code = code.replace(/await new Promise\(r => setTimeout\(r, \d+\)\);/g, '');

fs.writeFileSync('src/pages/Dashboard.tsx', code);
