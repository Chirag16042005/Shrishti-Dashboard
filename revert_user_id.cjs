const fs = require('fs');

let clientsCode = fs.readFileSync('src/pages/Clients.tsx', 'utf-8');
clientsCode = clientsCode.replace(
  /const \{ data: \{ user \} \} = await supabase\.auth\.getUser\(\);\s*const payload = \{ \.\.\.formData, user_id: user\?\.id \};\s*const \{ error \} = await supabase\.from\('clients'\)\.insert\(\[payload\]\);\s*if \(error\) console\.error\("Insert error:", error\);/g,
  `await supabase.from('clients').insert([formData]);`
);
clientsCode = clientsCode.replace(
  /const \{ data: \{ user \} \} = await supabase\.auth\.getUser\(\);\s*const payload = \{ \.\.\.formData, user_id: user\?\.id \};\s*await supabase\.from\('clients'\)\.insert\(\[payload\]\);/g,
  `await supabase.from('clients').insert([formData]);`
);
fs.writeFileSync('src/pages/Clients.tsx', clientsCode);

let dialogCode = fs.readFileSync('src/components/AddProjectDialog.tsx', 'utf-8');
dialogCode = dialogCode.replace(
  /await supabase\.from\('clients'\)\.insert\(\[\{ name: formData\.client_name, user_id: \(await supabase\.auth\.getUser\(\)\)\.data\.user\?\.id \}\]\)/g,
  `await supabase.from('clients').insert([{ name: formData.client_name }])`
);

dialogCode = dialogCode.replace(
  /payload\.user_id = \(await supabase\.auth\.getUser\(\)\)\.data\.user\?\.id;\s*const \{ error \} = await supabase\.from\('projects'\)\.insert\(\[payload\]\);\s*if \(error\) console\.error\("Error inserting project:", error\);/g,
  `await supabase.from('projects').insert([payload]);`
);

// If the error checking one wasn't there
dialogCode = dialogCode.replace(
  /payload\.user_id = \(await supabase\.auth\.getUser\(\)\)\.data\.user\?\.id;\s*await supabase\.from\('projects'\)\.insert\(\[payload\]\);/g,
  `await supabase.from('projects').insert([payload]);`
);

fs.writeFileSync('src/components/AddProjectDialog.tsx', dialogCode);
