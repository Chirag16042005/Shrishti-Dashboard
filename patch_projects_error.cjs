const fs = require('fs');
let code = fs.readFileSync('src/components/AddProjectDialog.tsx', 'utf-8');
code = code.replace(
  /await supabase\.from\('projects'\)\.insert\(\[payload\]\);/,
  `const { error } = await supabase.from('projects').insert([payload]);\n      if (error) console.error("Error inserting project:", error);`
);
fs.writeFileSync('src/components/AddProjectDialog.tsx', code);
