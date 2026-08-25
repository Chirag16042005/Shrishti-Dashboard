import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getProjectsData, getClientsData, deleteProjectData } from '../lib/dataService';
import { 
  Users, Briefcase, Wallet, Clock, 
  CalendarDays, User, Tag, Sparkles, ClipboardList, 
  IndianRupee, ArrowDownToLine, Hourglass, CreditCard, FileText,
  Plus, Folder, Edit2, Trash2, Settings2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { AddProjectDialog } from '../components/AddProjectDialog';
import { getProjectStatusBadgeClass, getPaymentStatusBadgeClass } from '../lib/statusStyles';

function FlowerIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <img 
      src="/flower.png" 
      alt="Flower" 
      className={`object-contain inline-block shrink-0 ${className}`} 
    />
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    clients: 0,
    projects: 0,
    value: 0,
    pending: 0,
    currentProjects: 0,
    awaitingPayment: 0,
  });
  
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleEdit = (project: any) => {
    setEditingProject(project);
    setIsAddProjectOpen(true);
  };

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    await deleteProjectData(id);
    setConfirmDeleteId(null);
    fetchDashboardData();
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [clients, projects] = await Promise.all([
        getClientsData(),
        getProjectsData()
      ]);
      
      const totalVal = projects.reduce((sum: number, p: any) => sum + Number(p.project_value || 0), 0);
      const awaitingPaymentCount = projects.filter((p: any) => {
        const remaining = Number(p.project_value || 0) - Number(p.amount_received || 0);
        return remaining > 0;
      }).length;
      const currentCount = projects.filter((p: any) => p.status !== 'Completed').length;
      
      setStats({
        clients: clients.length,
        projects: projects.length,
        value: totalVal,
        pending: awaitingPaymentCount,
        currentProjects: currentCount,
        awaitingPayment: awaitingPaymentCount,
      });
      
      setRecentProjects(projects);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { 
      label: 'TOTAL CLIENTS', 
      value: stats.clients, 
      icon: User, 
      circleBg: 'bg-[#C2CDFF]/30 border border-[#C2CDFF]/50', 
      iconColor: 'text-[#424790]' 
    },
    { 
      label: 'TOTAL PROJECTS', 
      value: stats.projects, 
      icon: Briefcase, 
      circleBg: 'bg-[#F1A8C6]/30 border border-[#F1A8C6]/50', 
      iconColor: 'text-[#424790]' 
    },
    { 
      label: 'TOTAL PROJECTS VALUE', 
      value: `₹${stats.value.toLocaleString()}`, 
      icon: Wallet, 
      circleBg: 'bg-[#EB5200]/15 border border-[#EB5200]/30', 
      iconColor: 'text-[#424790]' 
    },
    { 
      label: 'PENDING PAYMENTS', 
      value: stats.pending, 
      icon: Clock, 
      circleBg: 'bg-[#C2CDFF]/30 border border-[#C2CDFF]/50', 
      iconColor: 'text-[#424790]' 
    },
  ];

  return (
    <div className="space-y-6 flex-1 flex flex-col">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 px-0.5">
        {statCards.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <div className="bg-[#FFFAFA] rounded-[1.8rem] border border-[#C2CDFF]/40 shadow-xs hover:shadow-md transition-all duration-300 p-5 sm:p-6 flex items-center justify-between gap-4 h-full">
              <div className={`w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shrink-0 ${stat.circleBg}`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} strokeWidth={1.5} />
              </div>
              <div className="flex flex-col items-center justify-center flex-1">
                <p className="text-[10px] font-semibold text-[#424790]/70 tracking-wider mb-1 uppercase text-center leading-tight">{stat.label}</p>
                <h3 className="text-3xl sm:text-3.5xl font-bold text-[#424790] text-center">{loading ? '-' : stat.value}</h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Status Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4 px-6 sm:px-8 rounded-[2.5rem] bg-[#FFFAFA] border border-[#C2CDFF]/40 shadow-xs mx-0.5 mt-3 sm:mt-5">
        <div className="flex items-center gap-2.5 text-[#424790] font-medium text-lg w-full md:w-auto justify-center md:justify-start">
          <FlowerIcon className="w-5 h-5" />
          <span style={{ fontFamily: '"Calimore Sans", "Calimore", sans-serif', color: '#424790', fontWeight: 500 }} className="text-[26px] leading-none tracking-wide pt-0.5 font-medium">Quick Status</span>
        </div>
        
        <div className="flex items-center gap-4 sm:gap-6 text-[11px] font-semibold text-[#424790] border-y md:border-y-0 md:border-x border-[#C2CDFF]/40 px-6 sm:px-8 w-full md:w-auto justify-center py-3 md:py-0">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C2CDFF]/30 border border-[#C2CDFF]/40 text-[#424790] whitespace-nowrap shadow-2xs">
            <Folder className="w-3.5 h-3.5" />
            <span>{stats.currentProjects} Current Projects</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EB5200]/15 border border-[#EB5200]/20 text-[#EB5200] whitespace-nowrap shadow-2xs">
            <Clock className="w-3.5 h-3.5" />
            <span>{stats.awaitingPayment} Projects Awaiting Payment</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 text-[#424790]/70 italic text-sm w-full md:w-auto justify-center md:justify-end">
          <span>Stay Organized, Stay Creative</span>
          <FlowerIcon className="w-4 h-4 ml-0.5" />
        </div>
      </div>

      {/* Project Tracker Section */}
      <div className="flex-1 flex flex-col space-y-3.5 mx-0.5 mt-4 sm:mt-6">
        <div className="flex items-center gap-2 text-[#424790] font-bold text-[11px] tracking-[0.2em] uppercase ml-2 pt-1">
          <FlowerIcon className="w-4 h-4" />
          <span>PROJECT TRACKER</span>
        </div>
        
        <div className="bg-[#FFFAFA] rounded-[2rem] border border-[#C2CDFF]/40 shadow-xs flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-[11px] text-left border-collapse min-w-[1320px]">
              <thead className="text-[#424790] border-b border-[#C2CDFF]/40 bg-[#C2CDFF]/25">
                <tr className="divide-x divide-[#C2CDFF]/40">
                  <th className="px-4 py-3.5 font-semibold whitespace-nowrap align-middle"><div className="flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5"/> Start Date</div></th>
                  <th className="px-4 py-3.5 font-semibold whitespace-nowrap align-middle"><div className="flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5"/> End Date</div></th>
                  <th className="px-4 py-3.5 font-semibold whitespace-nowrap align-middle"><div className="flex items-center gap-1.5"><User className="w-3.5 h-3.5"/> Client Name</div></th>
                  <th className="px-4 py-3.5 font-semibold whitespace-nowrap align-middle"><div className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5"/> Brand Name</div></th>
                  <th className="px-4 py-3.5 font-semibold whitespace-nowrap align-middle"><div className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5"/> Service</div></th>
                  <th className="px-4 py-3.5 font-semibold text-center whitespace-nowrap align-middle"><div className="flex items-center justify-center gap-1.5"><ClipboardList className="w-3.5 h-3.5"/> Project Status</div></th>
                  <th className="px-4 py-3.5 font-semibold text-center whitespace-nowrap align-middle"><div className="flex items-center gap-1.5 justify-center"><IndianRupee className="w-3.5 h-3.5"/> Project Value (₹)</div></th>
                  <th className="px-4 py-3.5 font-semibold text-center whitespace-nowrap align-middle"><div className="flex items-center gap-1.5 justify-center"><ArrowDownToLine className="w-3.5 h-3.5"/> Amount Received (₹)</div></th>
                  <th className="px-4 py-3.5 font-semibold text-center whitespace-nowrap align-middle"><div className="flex items-center gap-1.5 justify-center"><Hourglass className="w-3.5 h-3.5"/> Remaining Amount (₹)</div></th>
                  <th className="px-4 py-3.5 font-semibold text-center whitespace-nowrap align-middle"><div className="flex items-center justify-center gap-1.5"><CreditCard className="w-3.5 h-3.5"/> Payment Status</div></th>
                  <th className="px-5 py-3.5 font-semibold whitespace-nowrap min-w-[280px] align-middle"><div className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5"/> Notes</div></th>
                  <th className="px-4 py-3.5 font-semibold text-center whitespace-nowrap align-middle"><div className="flex items-center justify-center gap-1.5"><Settings2 className="w-3.5 h-3.5"/> Actions</div></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#C2CDFF]/30 text-[#424790]">
                {recentProjects.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="px-6 py-12 text-center text-[#424790]/70 italic font-medium">
                      No projects added yet. Click <span className="font-bold text-[#EB5200]">+ Add project</span> below to create your first project!
                    </td>
                  </tr>
                ) : (
                  recentProjects.map((project) => {
                    const remaining = (project.project_value || 0) - (project.amount_received || 0);
                    
                    const formattedStartDate = project.start_date ? format(new Date(project.start_date), 'dd MMM yyyy') : '-';
                    const formattedEndDate = project.end_date ? format(new Date(project.end_date), 'dd MMM yyyy') : '-';

                    return (
                      <tr key={project.id} className="hover:bg-[#C2CDFF]/10 transition-colors divide-x divide-[#C2CDFF]/30">
                        <td className="px-4 py-3.5 text-[#424790] font-bold whitespace-nowrap align-middle">
                          {formattedStartDate}
                        </td>
                        <td className="px-4 py-3.5 text-[#424790] font-bold whitespace-nowrap align-middle">
                          {formattedEndDate}
                        </td>
                        <td className="px-4 py-3.5 font-bold text-[#424790] whitespace-nowrap align-middle">{project.clients?.name || '-'}</td>
                        <td className="px-4 py-3.5 text-[#424790] font-medium whitespace-nowrap align-middle">{project.brand_name || '-'}</td>
                        <td className="px-4 py-3.5 text-[#424790] whitespace-nowrap align-middle">{project.service || '-'}</td>
                        <td className="px-4 py-3.5 text-center whitespace-nowrap align-middle">
                          <span className={`inline-flex items-center justify-center px-4 py-1 rounded-full text-[11px] font-bold ${getProjectStatusBadgeClass(project.status)}`}>
                            {project.status}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 font-bold text-[#EB5200] text-center whitespace-nowrap align-middle">
                          ₹{(project.project_value || 0).toLocaleString()}
                        </td>
                        <td className="px-4 py-3.5 font-bold text-[#424790] text-center whitespace-nowrap align-middle">
                          ₹{(project.amount_received || 0).toLocaleString()}
                        </td>
                        <td className="px-4 py-3.5 font-bold text-[#424790] text-center whitespace-nowrap align-middle">
                          ₹{remaining.toLocaleString()}
                        </td>
                        <td className="px-4 py-3.5 text-center whitespace-nowrap align-middle">
                          {(() => {
                            const paymentStatus = project.payment_status || (remaining <= 0 && project.project_value > 0 ? 'Fully Paid' : project.amount_received > 0 ? 'Partially Paid' : 'Pending');
                            return (
                              <span className={`inline-flex items-center justify-center px-4 py-1 rounded-full text-[11px] font-bold ${getPaymentStatusBadgeClass(paymentStatus)}`}>
                                {paymentStatus}
                              </span>
                            );
                          })()}
                        </td>
                        <td className="px-5 py-3.5 text-[#424790]/80 text-[11px] leading-relaxed min-w-[280px] align-middle">
                          {project.notes || '-'}
                        </td>
                        <td className="px-4 py-3.5 text-center whitespace-nowrap align-middle">
                          {confirmDeleteId === project.id ? (
                            <div className="flex items-center justify-center gap-1.5 animate-fadeIn">
                              <span className="text-[10px] font-bold text-[#EB5200]">Delete?</span>
                              <button
                                onClick={() => handleDelete(project.id)}
                                className="px-2 py-0.5 rounded bg-[#EB5200] text-white text-[10px] font-bold hover:bg-[#EB5200]/90 transition-colors cursor-pointer"
                              >
                                Yes
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-2 py-0.5 rounded bg-[#C2CDFF]/30 text-[#424790] text-[10px] font-bold hover:bg-[#C2CDFF]/50 transition-colors cursor-pointer"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-2">
                              <button 
                                onClick={() => handleEdit(project)}
                                title="Edit Project"
                                className="p-1.5 rounded-lg text-[#424790]/80 hover:text-[#424790] hover:bg-[#C2CDFF]/30 transition-colors cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => setConfirmDeleteId(project.id)}
                                title="Delete Project"
                                className="p-1.5 rounded-lg text-[#EB5200]/80 hover:text-[#EB5200] hover:bg-[#EB5200]/10 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}

                {/* Empty Grid Rows to preserve layout height */}
                {Array(Math.max(0, 5 - recentProjects.length)).fill(0).map((_, i) => (
                  <tr key={`empty-${i}`} className="h-11 divide-x divide-[#C2CDFF]/30">
                    <td className="px-4 py-3.5">&nbsp;</td>
                    <td className="px-4 py-3.5">&nbsp;</td>
                    <td className="px-4 py-3.5">&nbsp;</td>
                    <td className="px-4 py-3.5">&nbsp;</td>
                    <td className="px-4 py-3.5">&nbsp;</td>
                    <td className="px-4 py-3.5">&nbsp;</td>
                    <td className="px-4 py-3.5">&nbsp;</td>
                    <td className="px-4 py-3.5">&nbsp;</td>
                    <td className="px-4 py-3.5">&nbsp;</td>
                    <td className="px-4 py-3.5">&nbsp;</td>
                    <td className="px-5 py-3.5 min-w-[280px]">&nbsp;</td>
                    <td className="px-4 py-3.5">&nbsp;</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Add Project Button Area at Bottom of Table */}
          <div className="bg-[#FFFAFA] p-3.5 sm:p-4 border-t border-[#C2CDFF]/40">
            <AddProjectDialog 
              open={isAddProjectOpen} 
              onOpenChange={(open: boolean) => {
                setIsAddProjectOpen(open);
                if (!open) setEditingProject(null);
              }} 
              editingProject={editingProject}
              onSuccess={fetchDashboardData}
              trigger={
                <button 
                  onClick={() => setEditingProject(null)}
                  className="flex items-center gap-2 text-[#EB5200] font-bold text-sm hover:opacity-80 transition-opacity px-2 py-0.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" strokeWidth={3} /> Add project
                </button>
              }
            />
          </div>
        </div>
      </div>
      
      {/* Bottom Dashed Separator & Footer Slogan */}
      <div className="w-full border-b-[1.5px] border-dashed border-[#F1A8C6]/50 mt-10 mb-4"></div>

      <div className="flex items-center gap-2 text-[#424790]/80 italic text-sm justify-start pl-2 pt-2 pb-6">
        <FlowerIcon className="w-4 h-4" />
        <span>Let's Keep Creating Beautiful Things!</span>
      </div>
    </div>
  );
}

