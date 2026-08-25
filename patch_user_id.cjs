const fs = require('fs');

// Patch Clients.tsx
let clientsCode = fs.readFileSync('src/pages/Clients.tsx', 'utf-8');
clientsCode = clientsCode.replace(
  /const \{ error \} = await supabase\.from\('clients'\)\.insert\(\[formData\]\);/,
  `const { data: { user } } = await supabase.auth.getUser();
      const payload = { ...formData, user_id: user?.id };
      const { error } = await supabase.from('clients').insert([payload]);`
);
// Also patch the old line in case my previous regex missed something or we want to be safe:
clientsCode = clientsCode.replace(
  /await supabase\.from\('clients'\)\.insert\(\[formData\]\);/g,
  `const { data: { user } } = await supabase.auth.getUser();
      const payload = { ...formData, user_id: user?.id };
      await supabase.from('clients').insert([payload]);`
);
fs.writeFileSync('src/pages/Clients.tsx', clientsCode);

// Patch AddProjectDialog.tsx
let dialogCode = fs.readFileSync('src/components/AddProjectDialog.tsx', 'utf-8');

// For creating client if doesn't exist
dialogCode = dialogCode.replace(
  /await supabase\.from\('clients'\)\.insert\(\[\{ name: formData\.client_name \}\]\)/,
  `await supabase.from('clients').insert([{ name: formData.client_name, user_id: (await supabase.auth.getUser()).data.user?.id }])`
);

// For creating project
dialogCode = dialogCode.replace(
  /await supabase\.from\('projects'\)\.insert\(\[payload\]\);/,
  `payload.user_id = (await supabase.auth.getUser()).data.user?.id;
      await supabase.from('projects').insert([payload]);`
);

fs.writeFileSync('src/components/AddProjectDialog.tsx', dialogCode);
