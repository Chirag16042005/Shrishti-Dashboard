const fs = require('fs');
let code = fs.readFileSync('src/pages/Clients.tsx', 'utf-8');

code = code.replace(
  /await supabase\.from\('clients'\)\.insert\(\[formData\]\);/,
  `const { error } = await supabase.from('clients').insert([formData]);
      if (error) console.error("Insert error:", error);`
);

fs.writeFileSync('src/pages/Clients.tsx', code);
