import { Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/button';
import { LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardLayout() {
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen bg-[#C2CDFF]/50 p-3 sm:p-6 md:p-8 font-sans text-[#424790] selection:bg-[#EB5200]/20 flex items-center justify-center">
      <div className="w-full max-w-[1520px] mx-auto bg-[#FFFAFA] rounded-[2.5rem] sm:rounded-[3rem] shadow-xl relative min-h-[90vh] overflow-hidden flex flex-col border border-[#C2CDFF]/40">
        
        {/* Sign Out Button */}
        <div className="absolute right-6 sm:right-8 top-6 sm:top-8 z-10">
          <Button variant="ghost" size="sm" onClick={signOut} className="text-[#424790]/60 hover:text-[#424790] hover:bg-[#C2CDFF]/30 rounded-full px-4 py-1.5 transition-colors">
            <LogOut className="w-4 h-4 mr-1.5" />
            <span className="text-xs font-semibold">Sign Out</span>
          </Button>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 w-full px-5 sm:px-8 md:px-10 py-6 sm:py-8 flex flex-col">
          {/* Header Section */}
          <header className="flex flex-col items-center mb-6">
            <div className="text-center mb-2.5 flex flex-col items-center w-full">
              <img 
                src="/logo.png" 
                alt="Shrish Creative Studio" 
                className="w-[55%] max-w-[250px] h-auto object-contain mb-3 mx-auto" 
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = document.getElementById('logo-fallback');
                  if (fallback) fallback.style.display = 'block';
                }} 
              />
              <div id="logo-fallback" style={{ display: 'none' }} className="mb-3 text-center">
                <h1 className="text-5xl md:text-6xl font-bold text-[#EB5200] tracking-tight" style={{ fontFamily: '"Calimore Sans", "Calimore", sans-serif' }}>Shrish</h1>
                <p className="text-[#424790] text-[10px] font-bold tracking-[0.4em] mt-1">CREATIVE STUDIO</p>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-[#F1A8C6]/20 border border-[#F1A8C6]/30 text-[11px] font-bold tracking-widest uppercase mb-4 shadow-2xs">
              <div className="w-2 h-2 rounded-full bg-[#F1A8C6] animate-pulse" />
              <span className="text-[#424790]">FREELANCE DASHBOARD</span>
            </div>

            <div className="w-full border-b-[1.5px] border-dashed border-[#F1A8C6]/50 mb-2"></div>
          </header>

          {/* Render Dashboard/Pages */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}


