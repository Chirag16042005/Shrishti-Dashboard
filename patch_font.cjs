const fs = require('fs');
let code = fs.readFileSync('src/components/AddProjectDialog.tsx', 'utf-8');
code = code.replace(/fontFamily: '"Calimore", "Pacifico", cursive'/g, 'fontFamily: "\\"Montserrat\\", sans-serif"');
fs.writeFileSync('src/components/AddProjectDialog.tsx', code);
