const fs = require('fs');

const FILES = [
  'src/components/layout/DashboardLayout.tsx',
  'src/pages/Dashboard.tsx',
  'src/pages/Projects.tsx',
  'src/pages/Payments.tsx',
  'src/pages/Clients.tsx',
  'src/pages/Settings.tsx',
  'src/pages/Login.tsx',
  'src/components/AddProjectDialog.tsx',
  'src/components/CustomDropdown.tsx'
];

FILES.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf-8');

  // Replace main backgrounds
  content = content.replace(/bg-\[\#C2CDFF\] /g, 'bg-[#C2CDFF]/50 ');
  
  // Replace stray whites/lights with #FFFAFA or allowed hexes
  content = content.replace(/bg-white/g, 'bg-[#FFFAFA]');
  content = content.replace(/bg-\[\#F4F6FC\]/g, 'bg-[#FFFAFA]');
  content = content.replace(/bg-\[\#FFF0FC\]/g, 'bg-[#FFFAFA]');
  content = content.replace(/bg-\[\#FFF0EB\]/g, 'bg-[#FFFAFA]');
  
  // Status pill backgrounds (removing all the other random colors)
  // Let's replace the whole span of status pills in Dashboard
  content = content.replace(/bg-\[\#[a-f0-9]+\]\/\d+/gi, (match) => {
    // If it's one of our approved colors, keep it, else change to an approved one
    const lower = match.toLowerCase();
    if (lower.includes('f1a8c6') || lower.includes('eb5200') || lower.includes('c2cdff') || lower.includes('424790') || lower.includes('fffafa')) {
      return match;
    }
    // Default replacement for stray color opacities
    return 'bg-[#C2CDFF]/30'; 
  });
  
  // Border colors
  content = content.replace(/border-\[\#ff9161\]\/40/g, 'border-[#EB5200]/20');
  
  fs.writeFileSync(file, content);
});
console.log("Colors patched.");
