const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf-8');

if (!code.includes('import { AddProjectDialog }')) {
  code = code.replace(/import { format } from 'date-fns';/, "import { format } from 'date-fns';\nimport { AddProjectDialog } from '../components/AddProjectDialog';");
}

if (!code.includes('isAddProjectOpen')) {
  code = code.replace(/const \[loading, setLoading\] = useState\(true\);/, "const [loading, setLoading] = useState(true);\n  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);");
}

code = code.replace(/<button[\s\S]*?onClick=\{\(\) => navigate\('\/projects'\)\}[\s\S]*?<\/button>/, `<AddProjectDialog 
              open={isAddProjectOpen} 
              onOpenChange={setIsAddProjectOpen} 
              onSuccess={fetchDashboardData}
              trigger={
                <button 
                  className="flex items-center gap-2 text-[#EB5200] font-bold text-sm hover:opacity-80 transition-opacity px-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" strokeWidth={3} /> Add project
                </button>
              }
            />`);

fs.writeFileSync('src/pages/Dashboard.tsx', code);
