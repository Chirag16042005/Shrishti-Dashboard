const fs = require('fs');
let code = fs.readFileSync('src/pages/Projects.tsx', 'utf-8');

code = code.replace(/const \[formData, setFormData\] = useState\(\{[\s\S]*?\}\);/, '');
code = code.replace(/const handleSubmit = async \(e: React.FormEvent\) => \{[\s\S]*?fetchData\(\);\n  \};\n\n  const resetForm = \(\) => \{[\s\S]*?\}\);\n  \};/, '');
code = code.replace(/setFormData\(\{[\s\S]*?\}\);/g, '');

const jsxToReplace = `<Dialog open={isDialogOpen} onOpenChange={val => { setIsDialogOpen(val); if (!val) resetForm(); }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" /> Add Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingProject ? 'Edit Project' : 'Add New Project'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Client *</Label>
                    <select 
                      required
                      className="flex h-11 w-full rounded-xl border border-input bg-transparent px-4 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      value={formData.client_id}
                      onChange={e => setFormData({...formData, client_id: e.target.value})}
                    >
                      <option value="">Select Client</option>
                      {clients.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Brand Name</Label>
                    <Input value={formData.brand_name} onChange={e => setFormData({...formData, brand_name: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Service *</Label>
                    <Input required value={formData.service} onChange={e => setFormData({...formData, service: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <select 
                      className="flex h-11 w-full rounded-xl border border-input bg-transparent px-4 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      value={formData.status}
                      onChange={e => setFormData({...formData, status: e.target.value})}
                    >
                      <option value="Planning">Planning</option>
                      <option value="Active">Active</option>
                      <option value="Completed">Completed</option>
                      <option value="On Hold">On Hold</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input type="date" value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input type="date" value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Project Value (₹)</Label>
                    <Input type="number" required min="0" value={formData.project_value} onChange={e => setFormData({...formData, project_value: parseFloat(e.target.value) || 0})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Amount Received (₹)</Label>
                    <Input type="number" required min="0" value={formData.amount_received} onChange={e => setFormData({...formData, amount_received: parseFloat(e.target.value) || 0})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <select 
                      className="flex h-11 w-full rounded-xl border border-input bg-transparent px-4 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      value={formData.priority}
                      onChange={e => setFormData({...formData, priority: e.target.value})}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Input value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button type="submit">{editingProject ? 'Save Changes' : 'Add Project'}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>`;

code = code.replace(jsxToReplace, `<AddProjectDialog 
            open={isDialogOpen} 
            onOpenChange={(val: boolean) => { setIsDialogOpen(val); if (!val) setEditingProject(null); }} 
            onSuccess={fetchData}
            editingProject={editingProject}
            trigger={
              <Button>
                <Plus className="w-4 h-4 mr-2" /> Add Project
              </Button>
            }
          />`);

fs.writeFileSync('src/pages/Projects.tsx', code);
