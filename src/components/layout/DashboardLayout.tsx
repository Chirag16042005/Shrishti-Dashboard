import { Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/button';
import { LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardLayout() {
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen bg-[#C2CDFF] p-4 md:p-8 font-sans text-secondary selection:bg-primary/20">
      <div className="max-w-[1400px] mx-auto bg-[#FFFAFA] rounded-[3rem] shadow-xl relative min-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Sign Out Button (Hidden in reference, but needed for functionality, keeping it minimal in corner) */}
        <div className="absolute right-6 top-6">
          <Button variant="ghost" size="sm" onClick={signOut} className="text-secondary/40 hover:text-secondary hover:bg-secondary/5 rounded-full">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 w-full px-8 py-10 md:px-12 md:py-12 flex flex-col">
          {/* Header Section */}
          <header className="flex flex-col items-center mb-8">
            <div className="text-center mb-4 flex flex-col items-center w-full">
              {/* Logo Placeholder - Upload your logo.png to the public folder */}
              <img src="/logo.png" alt="Shrish Creative Studio" className="w-[60%] max-w-[280px] h-auto object-contain mb-6 mx-auto" onError={(e) => {
                // Fallback to text if image is not yet uploaded
                e.currentTarget.style.display = 'none';
                const fallback = document.getElementById('logo-fallback');
                if (fallback) fallback.style.display = 'block';
              }} />
              <div id="logo-fallback" style={{ display: 'none' }} className="mb-4">
                <h1 className="text-6xl font-bold text-primary tracking-tight" style={{ fontFamily: '"Calimore", "Pacifico", cursive' }}>Shrish</h1>
                <p className="text-secondary text-[10px] font-bold tracking-[0.4em] mt-2">CREATIVE STUDIO</p>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F1A8C6]/10 text-[#d87ba1] text-[11px] font-bold tracking-widest uppercase mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-[#F1A8C6]" />
              FREELANCE DASHBOARD
            </div>

            <div className="w-full border-b-[1.5px] border-dashed border-[#F1A8C6]/40 mb-2"></div>
          </header>

          {/* Render Dashboard/Pages */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex-1 flex flex-col"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}

