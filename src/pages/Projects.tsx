import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { AddProjectDialog } from '../components/AddProjectDialog';

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  
  

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [projectsRes, clientsRes] = await Promise.all([
      supabase.from('projects').select('*, clients(name)').order('created_at', { ascending: false }),
      supabase.from('clients').select('id, name')
    ]);
    
    if (projectsRes.data) setProjects(projectsRes.data);
    if (clientsRes.data) setClients(clientsRes.data);
    setLoading(false);
  };

  

  const handleEdit = (project: any) => {
    setEditingProject(project);
    
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await supabase.from('projects').delete().eq('id', id);
      fetchData();
    }
  };

  const filteredProjects = projects.filter(p => 
    p.brand_name?.toLowerCase().includes(search.toLowerCase()) || 
    p.service?.toLowerCase().includes(search.toLowerCase()) ||
    p.clients?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-secondary">Projects</h2>
        
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/50" />
            <Input 
              placeholder="Search projects..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <AddProjectDialog 
            open={isDialogOpen} 
            onOpenChange={(val: boolean) => { setIsDialogOpen(val); if (!val) setEditingProject(null); }} 
            onSuccess={fetchData}
            editingProject={editingProject}
            trigger={
              <Button>
                <Plus className="w-4 h-4 mr-2" /> Add Project
              </Button>
            }
          />
        </div>
      </div>

      <Card className="rounded-[2rem] overflow-hidden border-secondary/10">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-secondary/60 uppercase bg-secondary/5 border-b border-secondary/10">
              <tr>
                <th className="px-6 py-4 font-semibold">Client / Brand</th>
                <th className="px-6 py-4 font-semibold">Service</th>
                <th className="px-6 py-4 font-semibold">Timeline</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Value (₹)</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary/5">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-6 py-6">
                      <div className="h-4 bg-secondary/10 rounded-full w-full"></div>
                    </td>
                  </tr>
                ))
              ) : filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-secondary/50">No projects found.</td>
                </tr>
              ) : (
                filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-secondary/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-secondary">{project.clients?.name || 'Unknown Client'}</div>
                      <div className="text-xs text-secondary/60">{project.brand_name || ''}</div>
                    </td>
                    <td className="px-6 py-4 text-secondary/80">{project.service}</td>
                    <td className="px-6 py-4 text-secondary/80">
                      {project.start_date ? format(new Date(project.start_date), 'dd MMM yy') : '-'} 
                      {' → '} 
                      {project.end_date ? format(new Date(project.end_date), 'dd MMM yy') : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[11px] font-bold text-[#424790] min-w-[80px] ${
                        project.status === 'Inquiry' ? 'bg-[#C2CDFF]/30' :
                        project.status === 'Designing' ? 'bg-[#C2CDFF]/30' :
                        project.status === 'Revisions' ? 'bg-[#C2CDFF]/30' :
                        project.status === 'Approved' ? 'bg-[#C2CDFF]/30' :
                        project.status === 'Completed' ? 'bg-[#C2CDFF]/30' :
                        project.status === 'On Hold' ? 'bg-[#C2CDFF]/30' :
                        project.status === 'Pending' ? 'bg-[#C2CDFF]/30' :
                        project.status === 'Active' ? 'bg-[#C2CDFF]/30' :
                        'bg-[#C2CDFF]/20'
                      }`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-secondary">
                      ₹{project.project_value.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(project)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(project.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
