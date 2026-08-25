import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export default function Payments() {
  const [payments, setPayments] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    project_id: '',
    amount: 0,
    payment_date: new Date().toISOString().split('T')[0],
    status: 'Paid',
    notes: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [paymentsRes, projectsRes] = await Promise.all([
      supabase.from('payments').select('*, projects(brand_name, service, clients(name))').order('payment_date', { ascending: false }),
      supabase.from('projects').select('id, brand_name, service, clients(name)')
    ]);
    
    if (paymentsRes.data) setPayments(paymentsRes.data);
    if (projectsRes.data) setProjects(projectsRes.data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    const payload = {
      ...formData,
      payment_date: formData.payment_date || new Date().toISOString(),
    };
    
    if (editingPayment) {
      await supabase.from('payments').update(payload).eq('id', editingPayment.id);
    } else {
      await supabase.from('payments').insert([payload]);
    }
    
    setIsDialogOpen(false);
    resetForm();
    fetchData();
  };

  const resetForm = () => {
    setEditingPayment(null);
    setFormData({
      project_id: '', amount: 0, payment_date: new Date().toISOString().split('T')[0], status: 'Paid', notes: ''
    });
  };

  const handleEdit = (payment: any) => {
    setEditingPayment(payment);
    setFormData({
      project_id: payment.project_id || '',
      amount: payment.amount || 0,
      payment_date: payment.payment_date ? payment.payment_date.split('T')[0] : '',
      status: payment.status || 'Paid',
      notes: payment.notes || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this payment record?')) {
      await supabase.from('payments').delete().eq('id', id);
      fetchData();
    }
  };

  const filteredPayments = payments.filter(p => 
    p.projects?.brand_name?.toLowerCase().includes(search.toLowerCase()) || 
    p.projects?.clients?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-secondary">Payments</h2>
        
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/50" />
            <Input 
              placeholder="Search payments..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white"
            />
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={val => { setIsDialogOpen(val); if (!val) resetForm(); }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" /> Record Payment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingPayment ? 'Edit Payment' : 'Record New Payment'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Project *</Label>
                  <select 
                    required
                    className="flex h-11 w-full rounded-xl border border-input bg-transparent px-4 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={formData.project_id}
                    onChange={e => setFormData({...formData, project_id: e.target.value})}
                  >
                    <option value="">Select Project</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.clients?.name} - {p.brand_name || p.service}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Amount (₹) *</Label>
                    <Input type="number" required min="0" value={formData.amount} onChange={e => setFormData({...formData, amount: parseFloat(e.target.value) || 0})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Date *</Label>
                    <Input type="date" required value={formData.payment_date} onChange={e => setFormData({...formData, payment_date: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <select 
                    className="flex h-11 w-full rounded-xl border border-input bg-transparent px-4 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                    <option value="Overdue">Overdue</option>
                    <option value="Partially Paid">Partially Paid</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Input value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button type="submit">{editingPayment ? 'Save Changes' : 'Record Payment'}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="rounded-[2rem] overflow-hidden border-secondary/10">
        <div className="">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-secondary/60 uppercase bg-secondary/5 border-b border-secondary/10">
              <tr>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Client</th>
                <th className="px-6 py-4 font-semibold">Project</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Amount (₹)</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-secondary/40">Loading...</td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-secondary/50">No payments found.</td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-secondary/5 transition-colors">
                    <td className="px-6 py-4 text-secondary/80">
                      {payment.payment_date ? format(new Date(payment.payment_date), 'dd MMM yyyy') : '-'}
                    </td>
                    <td className="px-6 py-4 font-medium text-secondary">{payment.projects?.clients?.name || 'Unknown Client'}</td>
                    <td className="px-6 py-4 text-secondary/80">
                      {payment.projects?.brand_name || payment.projects?.service || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[11px] font-bold text-[#424790] min-w-[100px] ${
                        (payment.status === 'Paid' || payment.status === 'Fully Paid') ? 'bg-[#31ff6b]/20' :
                        payment.status === 'Pending' ? 'bg-[#ff0000]/20' :
                        payment.status === 'Partially Paid' ? 'bg-[#b1ff29]/20' :
                        'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-secondary">
                      ₹{payment.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(payment)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(payment.id)}>
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
