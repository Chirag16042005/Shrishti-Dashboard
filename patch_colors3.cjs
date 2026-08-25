const fs = require('fs');
const FILES = [
  'src/pages/Dashboard.tsx',
  'src/pages/Projects.tsx',
  'src/pages/Payments.tsx',
  'src/components/AddProjectDialog.tsx',
  'src/components/ui/card.tsx',
  'src/components/ui/dialog.tsx'
];

FILES.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf-8');

  content = content.replace(/bg-gray-100/g, 'bg-[#C2CDFF]/20');
  content = content.replace(/bg-red-50/g, 'bg-[#EB5200]/10');
  content = content.replace(/text-red-700/g, 'text-[#EB5200]');
  content = content.replace(/text-white/g, 'text-[#FFFAFA]');
  content = content.replace(/bg-white\/70/g, 'bg-[#FFFAFA]/70');
  content = content.replace(/bg-white/g, 'bg-[#FFFAFA]');
  content = content.replace(/bg-black\/50/g, 'bg-[#424790]/50');

  fs.writeFileSync(file, content);
});
console.log("Colors patched again.");
