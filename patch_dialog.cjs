const fs = require('fs');
let code = fs.readFileSync('src/components/AddProjectDialog.tsx', 'utf-8');

const importStatement = `import { CustomDropdown } from './CustomDropdown';\n`;
if (!code.includes('CustomDropdown')) {
  code = code.replace("import { Label } from './ui/label';", "import { Label } from './ui/label';\n" + importStatement);
}

// Add state for payment status
if (!code.includes('payment_status_selection')) {
  code = code.replace(/notes: '',\n  \}\);/, `notes: '',\n    payment_status_selection: 'Pending',\n  });`);
  
  code = code.replace(/priority: editingProject\.priority \|\| 'Medium',/, `priority: editingProject.priority || 'Medium',\n        payment_status_selection: editingProject.amount_received >= (editingProject.project_value || 0) && (editingProject.project_value || 0) > 0 ? 'Fully Paid' : editingProject.amount_received > 0 ? 'Partially Paid' : 'Pending',`);
  
  code = code.replace(/project_value: 0, amount_received: 0, priority: 'Medium', notes: ''/, `project_value: 0, amount_received: 0, priority: 'Medium', notes: '', payment_status_selection: 'Pending'`);
}

code = code.replace(/<div className="space-y-2">\s*<Label className="text-\[#424790\]">Status<\/Label>[\s\S]*?<\/div>/, `<div className="space-y-2">
              <Label className="text-[#424790]">Project Status</Label>
              <CustomDropdown 
                value={formData.status} 
                onChange={(val: string) => setFormData({...formData, status: val})}
                options={[
                  { label: 'Inquiry', value: 'Inquiry', color: 'bg-[#e371ff]/20' },
                  { label: 'Designing', value: 'Designing', color: 'bg-[#92c6ff]/30' },
                  { label: 'Revisions', value: 'Revisions', color: 'bg-[#ff9161]/20' },
                  { label: 'Approved', value: 'Approved', color: 'bg-[#b1ff29]/20' },
                  { label: 'Completed', value: 'Completed', color: 'bg-[#31ff6b]/20' },
                  { label: 'On Hold', value: 'On Hold', color: 'bg-[#5b2d19]/20' },
                  { label: 'Pending', value: 'Pending', color: 'bg-[#ff0000]/20' },
                ]}
              />
            </div>`);

const paymentStatusReplacement = `<div className="space-y-2">
              <Label className="text-[#424790]">Payment Status</Label>
              <CustomDropdown 
                value={formData.payment_status_selection} 
                onChange={(val: string) => {
                  let newAmount = formData.amount_received;
                  if (val === 'Fully Paid') newAmount = formData.project_value;
                  if (val === 'Pending') newAmount = 0;
                  setFormData({...formData, payment_status_selection: val, amount_received: newAmount});
                }}
                options={[
                  { label: 'Pending', value: 'Pending', color: 'bg-[#ff0000]/20' },
                  { label: 'Partially Paid', value: 'Partially Paid', color: 'bg-[#b1ff29]/20' },
                  { label: 'Fully Paid', value: 'Fully Paid', color: 'bg-[#31ff6b]/20' },
                ]}
              />
            </div>
            {formData.payment_status_selection === 'Partially Paid' && (
              <div className="space-y-2">
                <Label className="text-[#424790]">Amount Received (₹)</Label>
                <Input type="number" required min="0" value={formData.amount_received} onChange={e => setFormData({...formData, amount_received: parseFloat(e.target.value) || 0})} />
              </div>
            )}`;

code = code.replace(/<div className="space-y-2">\s*<Label className="text-\[#424790\]">Amount Received \(₹\)<\/Label>[\s\S]*?<\/div>/, paymentStatusReplacement);

fs.writeFileSync('src/components/AddProjectDialog.tsx', code);
