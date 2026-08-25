import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  Users, Briefcase, Wallet, Clock, Flower2, 
  CalendarDays, User, Tag, Sparkles, ClipboardList, 
  IndianRupee, ArrowDownToLine, Hourglass, CreditCard, FileText,
  Plus
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { AddProjectDialog } from '../components/AddProjectDialog';

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

  const navigate = useNavigate();

  
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [
        { count: clientsCount },
        { data: projects, count: projectsCount },
        { data: payments }
      ] = await Promise.all([
        supabase.from('clients').select('*', { count: 'exact', head: true }),
        supabase.from('projects').select('*, clients(name)').order('created_at', { ascending: false }).limit(5),
        supabase.from('payments').select('*')
      ]);
      
      const totalValue = projects?.reduce((sum, p) => sum + Number(p.project_value || 0), 0) || 0;
      const pendingPayments = payments?.filter(p => p.status === 'Pending').length || 0;
      const current = projects?.filter(p => p.status === 'Active' || p.status === 'Planning').length || 0;
      
      setStats({
        clients: clientsCount || 0,
        projects: projectsCount || 0,
        value: totalValue || 0,
        pending: pendingPayments || 0,
        currentProjects: current || 0,
        awaitingPayment: pendingPayments || 0,
      });
      
      // If no projects exist, add some dummy ones to match the design visually if it's completely empty.
      // But we will use actual data if available. Let's just use what's fetched.
      setRecentProjects(projects || []);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'TOTAL CLIENTS', value: stats.clients, icon: User, circleBg: 'bg-[#F4F6FC] border border-[#C2CDFF]', iconColor: 'text-[#424790]' },
    { label: 'TOTAL PROJECTS', value: stats.projects, icon: Briefcase, circleBg: 'bg-[#FFF0FC] border border-[#F1A8C6]', iconColor: 'text-[#424790]' },
    { label: 'TOTAL PROJECTS VALUE', value: stats.value, icon: Wallet, circleBg: 'bg-[#FFF0EB] border border-[#ff9161]/40', iconColor: 'text-[#424790]' },
    { label: 'PENDING PAYMENTS', value: stats.pending, icon: Clock, circleBg: 'bg-[#F4F6FC] border border-[#C2CDFF]', iconColor: 'text-[#424790]' },
  ];

  return (
    <div className="space-y-8 flex-1 flex flex-col">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-2">
        {statCards.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="bg-white rounded-[2rem] border border-secondary/10 shadow-sm hover:shadow-md transition-all duration-300 p-6 flex items-center justify-center gap-6 h-full">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${stat.circleBg}`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} strokeWidth={1.5} />
              </div>
              <div className="flex flex-col items-center justify-center flex-1">
                <p className="text-[10px] font-semibold text-secondary/60 tracking-wider mb-2 uppercase text-center">{stat.label}</p>
                <h3 className="text-3xl font-bold text-[#424790] text-center">{loading ? '-' : stat.value}</h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Status Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-3 px-8 rounded-[2.5rem] bg-white border border-secondary/10 shadow-sm mx-2">
        <div className="flex items-center gap-2 text-secondary font-bold text-lg w-full md:w-1/4 justify-center md:justify-start">
          <img src="/flower.png" alt="Flower" className="w-5 h-5 object-contain" onError={(e) => {
            e.currentTarget.style.display = 'none';
            (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'block';
          }} />
          <Flower2 className="w-5 h-5 text-[#EB5200] hidden" />
          <span style={{ fontFamily: '"Calimore", "Pacifico", cursive', color: '#424790' }} className="text-[28px] tracking-wide">Quick Status</span>
        </div>
        
        <div className="flex items-center gap-6 text-[11px] font-semibold text-secondary/70 border-x border-secondary/10 px-8 w-full md:w-1/2 justify-center border-y md:border-y-0 md:border-x py-4 md:py-0">
          <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#F4F6FC] text-[#424790]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></svg>
            <span>{stats.currentProjects} Current Projects</span>
          </div>
          <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#FFF0EB] text-[#EB5200]">
            <Clock className="w-3.5 h-3.5" />
            <span>{stats.awaitingPayment} Projects Awaiting Payment</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 text-[#424790]/60 italic text-sm w-full md:w-1/4 justify-center md:justify-end">
          Stay Organized, Stay Creative 
          <img src="/flower.png" alt="Flower" className="w-4 h-4 object-contain ml-1" onError={(e) => {
            e.currentTarget.style.display = 'none';
            (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'block';
          }} />
          <Flower2 className="w-4 h-4 text-[#F1A8C6] hidden ml-1" />
        </div>
      </div>

      {/* Project Tracker Table */}
      <div className="flex-1 flex flex-col space-y-4 mx-2">
        <div className="flex items-center gap-2 text-[#424790]/60 font-bold text-[11px] tracking-[0.2em] uppercase ml-2">
          <img src="/flower.png" alt="Flower" className="w-4 h-4 object-contain" onError={(e) => {
            e.currentTarget.style.display = 'none';
            (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'block';
          }} />
          <Flower2 className="w-4 h-4 text-[#F1A8C6] hidden" />
          Project Tracker
        </div>
        
        <div className="bg-white rounded-[2rem] border border-secondary/10 shadow-sm flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-[11px] text-left">
              <thead className="text-[#424790]/60 border-b border-secondary/10 bg-[#FFFAFA]">
                <tr className="divide-x divide-secondary/10">
                  <th className="px-4 py-4 font-semibold"><div className="flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5"/> Start Date</div></th>
                  <th className="px-4 py-4 font-semibold"><div className="flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5"/> End Date</div></th>
                  <th className="px-4 py-4 font-semibold"><div className="flex items-center gap-1.5"><User className="w-3.5 h-3.5"/> Client Name</div></th>
                  <th className="px-4 py-4 font-semibold"><div className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5"/> Brand Name</div></th>
                  <th className="px-4 py-4 font-semibold"><div className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5"/> Service</div></th>
                  <th className="px-4 py-4 font-semibold"><div className="flex items-center gap-1.5"><ClipboardList className="w-3.5 h-3.5"/> Project Status</div></th>
                  <th className="px-4 py-4 font-semibold"><div className="flex items-center gap-1.5 text-center justify-center"><IndianRupee className="w-3.5 h-3.5"/> Project<br/>Value (₹)</div></th>
                  <th className="px-4 py-4 font-semibold"><div className="flex items-center gap-1.5 text-center justify-center"><ArrowDownToLine className="w-3.5 h-3.5"/> Amount<br/>Received (₹)</div></th>
                  <th className="px-4 py-4 font-semibold"><div className="flex items-center gap-1.5 text-center justify-center"><Hourglass className="w-3.5 h-3.5"/> Remaining<br/>Amount (₹)</div></th>
                  <th className="px-4 py-4 font-semibold text-center"><div className="flex items-center justify-center gap-1.5"><CreditCard className="w-3.5 h-3.5"/> Payment Status</div></th>
                  <th className="px-4 py-4 font-semibold"><div className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5"/> Notes</div></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary/10">
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={11} className="px-4 py-6">
                        <div className="h-4 bg-secondary/10 rounded-full w-full"></div>
                      </td>
                    </tr>
                  ))
                ) : recentProjects.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="px-4 py-12 text-center text-secondary/50">
                      No projects found. Add one below.
                    </td>
                  </tr>
                ) : (
                  recentProjects.map((project) => {
                    const remaining = project.project_value - project.amount_received;
                    return (
                      <tr key={project.id} className="hover:bg-secondary/5 transition-colors divide-x divide-secondary/10">
                        <td className="px-4 py-4 text-secondary font-medium">
                          {project.start_date ? format(new Date(project.start_date), 'dd MMM yyyy') : '-'}
                        </td>
                        <td className="px-4 py-4 text-secondary font-medium">
                          {project.end_date ? format(new Date(project.end_date), 'dd MMM yyyy') : '-'}
                        </td>
                        <td className="px-4 py-4 font-bold text-secondary">{project.clients?.name || '-'}</td>
                        <td className="px-4 py-4 text-secondary/80 font-medium">{project.brand_name || '-'}</td>
                        <td className="px-4 py-4 text-secondary/80">{project.service}</td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[11px] font-bold text-[#424790] min-w-[80px] ${
                            project.status === 'Inquiry' ? 'bg-[#e371ff]/20' :
                            project.status === 'Designing' ? 'bg-[#92c6ff]/30' :
                            project.status === 'Revisions' ? 'bg-[#ff9161]/20' :
                            project.status === 'Approved' ? 'bg-[#b1ff29]/20' :
                            project.status === 'Completed' ? 'bg-[#31ff6b]/20' :
                            project.status === 'On Hold' ? 'bg-[#5b2d19]/20' :
                            project.status === 'Pending' ? 'bg-[#ff0000]/20' :
                            project.status === 'Active' ? 'bg-[#b1ff29]/20' :
                            'bg-gray-100'
                          }`}>
                            {project.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 font-bold text-[#EB5200] text-center">
                          ₹{project.project_value.toLocaleString()}
                        </td>
                        <td className="px-4 py-4 font-bold text-[#424790] text-center">
                          ₹{project.amount_received.toLocaleString()}
                        </td>
                        <td className="px-4 py-4 font-bold text-[#424790] text-center">
                          ₹{remaining.toLocaleString()}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[11px] font-bold text-[#424790] min-w-[100px] ${
                            remaining <= 0 && project.project_value > 0 ? 'bg-[#31ff6b]/20' :
                            project.amount_received > 0 ? 'bg-[#b1ff29]/20' :
                            'bg-[#ff0000]/20'
                          }`}>
                            {remaining <= 0 && project.project_value > 0 ? 'Fully Paid' : project.amount_received > 0 ? 'Partially Paid' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-secondary/60 text-[10px] min-w-[150px]">
                          {project.notes || 'No notes available'}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          
          {/* Add Project Button Area at Bottom of Table */}
          <div className="bg-[#FFFAFA] p-4 border-t border-secondary/10">
            <AddProjectDialog 
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
            />
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 text-secondary/60 italic text-sm justify-start pl-6 pt-2 pb-6">
          <img src="/flower.png" alt="Flower" className="w-4 h-4 object-contain" onError={(e) => {
            e.currentTarget.style.display = 'none';
            (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'block';
          }} />
          <Flower2 className="w-4 h-4 text-[#F1A8C6] hidden" />
          Let's Keep Creating Beautiful Things!
      </div>
    </div>
  );
}
