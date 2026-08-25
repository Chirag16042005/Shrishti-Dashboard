const fs = require('fs');

let dialogCode = fs.readFileSync('src/components/AddProjectDialog.tsx', 'utf-8');
dialogCode = dialogCode.replace(/variant="outline"/g, 'variant="ghost"');
fs.writeFileSync('src/components/AddProjectDialog.tsx', dialogCode);

let clientsCode = fs.readFileSync('src/pages/Clients.tsx', 'utf-8');
clientsCode = clientsCode.replace(/variant="outline"/g, 'variant="ghost"');
fs.writeFileSync('src/pages/Clients.tsx', clientsCode);

