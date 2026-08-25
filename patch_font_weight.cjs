const fs = require('fs');
let code = fs.readFileSync('src/components/AddProjectDialog.tsx', 'utf-8');
code = code.replace(/className="text-\[#424790\] text-xl tracking-wide"/g, 'className="text-[#424790] text-xl font-bold tracking-wide"');
fs.writeFileSync('src/components/AddProjectDialog.tsx', code);
