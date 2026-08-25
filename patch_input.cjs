const fs = require('fs');
let code = fs.readFileSync('src/components/ui/input.tsx', 'utf-8');

code = code.replace(
  '"flex h-11 w-full rounded-xl border border-input bg-transparent px-4 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"',
  '"flex h-11 w-full rounded-xl border-0 bg-[#F4F6FC] px-4 py-2 text-sm shadow-none transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-secondary/40 text-secondary focus-visible:outline-none focus-visible:bg-[#E9ECF8] disabled:cursor-not-allowed disabled:opacity-50"'
);

fs.writeFileSync('src/components/ui/input.tsx', code);
