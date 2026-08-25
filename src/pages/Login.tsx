import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { motion } from 'framer-motion';

export default function Login() {
  const { isAuthenticated, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Slight delay for UX
    setTimeout(() => {
      const success = login(email, password);
      if (!success) {
        setError('Invalid email or password.');
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#C2CDFF]/50 p-4 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[420px] z-10 px-4 sm:px-0"
      >
        <Card className="border-0 shadow-2xl bg-[#FFFAFA] rounded-[2rem] p-6 sm:p-10 pb-6 sm:pb-8 flex flex-col items-center">
          <div className="text-center mb-8 flex flex-col items-center w-full">
            <img src="/logo.png" alt="Shrish Creative Studio" className="w-[60%] sm:w-[55%] max-w-[180px] h-auto object-contain mb-4 mx-auto" onError={(e) => {
              e.currentTarget.style.display = 'none';
              const fallback = document.getElementById('login-logo-fallback');
              if (fallback) fallback.style.display = 'block';
            }} />
            <div id="login-logo-fallback" style={{ display: 'none' }} className="mb-4">
              <h1 className="text-5xl font-bold text-[#EB5200] tracking-tight" style={{ fontFamily: '"Calimore", "Pacifico", cursive' }}>Shrish</h1>
              <p className="text-[#424790] text-[10px] font-bold tracking-[0.4em] mt-2">CREATIVE STUDIO</p>
            </div>
            <p className="text-[#F1A8C6] text-[11px] font-bold tracking-widest uppercase">Freelance Dashboard Login</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-3 w-full">
            <div className="space-y-1">
              <Input 
                id="email" 
                type="email" 
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-[#FFFAFA] border-[#C2CDFF] rounded-xl h-12 px-4 focus-visible:ring-[#C2CDFF]"
              />
            </div>
            <div className="space-y-1">
              <Input 
                id="password" 
                type="password" 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-[#FFFAFA] border-[#C2CDFF] rounded-xl h-12 px-4 focus-visible:ring-[#C2CDFF]"
              />
            </div>
            
            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg">
                {error}
              </div>
            )}
            
            <div className="pt-3 flex flex-col gap-3 pb-5 border-b border-[#C2CDFF]/30">
              <Button type="submit" disabled={loading} className="w-full text-base font-bold h-12 bg-[#EB5200] hover:bg-[#EB5200]/90 text-[#FFFAFA] rounded-xl shadow-md shadow-[#EB5200]/20">
                {loading ? 'Logging in...' : 'Log In'}
              </Button>
            </div>
            
            <div className="pt-1 text-center">
              <p className="text-[10px] text-[#424790]/60 leading-relaxed px-2">
                This is a simple client-side lock for personal use — it is not secure encryption. Don't store sensitive financial or ID data here.
              </p>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
