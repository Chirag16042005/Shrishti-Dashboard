const fs = require('fs');
let code = fs.readFileSync('src/components/CustomDropdown.tsx', 'utf-8');
code = code.replace(/className=\{\\`inline-flex(.*?)\\`\}/g, 'className={`inline-flex$1`}');
fs.writeFileSync('src/components/CustomDropdown.tsx', code);
