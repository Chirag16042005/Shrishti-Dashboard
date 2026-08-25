const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf-8');

code = code.replace(/text-lg w-1\/4"/g, 'text-lg w-full md:w-1/4 justify-center md:justify-start"');
code = code.replace(/px-8 w-1\/2 justify-center"/g, 'px-8 w-full md:w-1/2 justify-center border-y md:border-y-0 md:border-x py-4 md:py-0"');
code = code.replace(/text-sm w-1\/4"/g, 'text-sm w-full md:w-1/4 justify-center md:justify-end"');

fs.writeFileSync('src/pages/Dashboard.tsx', code);
