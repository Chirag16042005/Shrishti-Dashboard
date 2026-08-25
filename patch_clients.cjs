const fs = require('fs');
let code = fs.readFileSync('src/pages/Clients.tsx', 'utf-8');
code = code.replace(/className="pl-9 bg-white"/g, 'className="pl-9"');
fs.writeFileSync('src/pages/Clients.tsx', code);
