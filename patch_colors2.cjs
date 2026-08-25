const fs = require('fs');

let layoutCode = fs.readFileSync('src/components/layout/DashboardLayout.tsx', 'utf-8');
layoutCode = layoutCode.replace(/text-\[\#d87ba1\]/g, 'text-[#424790]');
fs.writeFileSync('src/components/layout/DashboardLayout.tsx', layoutCode);

let inputCode = fs.readFileSync('src/components/ui/input.tsx', 'utf-8');
inputCode = inputCode.replace(/bg-\[\#F4F6FC\]/g, 'bg-[#C2CDFF]/20');
inputCode = inputCode.replace(/focus-visible:bg-\[\#E9ECF8\]/g, 'focus-visible:bg-[#C2CDFF]/40');
fs.writeFileSync('src/components/ui/input.tsx', inputCode);

