import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { CustomDropdown } from './CustomDropdown';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

export function AddProjectDialog({ open, onOpenChange, onSuccess, trigger, editingProject }: any) {
  const [formData, setFormData] = useState({
    client_name: '',
    brand_name: '',
    service: '',
    description: '',
    status: 'Planning',
    start_date: '',
    end_date: '',
    project_value: 0,
    amount_received: 0,
    priority: 'Medium',
    notes: '',
    payment_status_selection: 'Pending',
  });

  useEffect(() => {
    if (editingProject) {
      setFormData({
        client_name: editingProject.clients?.name || '',
        brand_name: editingProject.brand_name || '',
        service: editingProject.service || '',
        description: editingProject.description || '',
        status: editingProject.status || 'Planning',
        start_date: editingProject.start_date ? editingProject.start_date.split('T')[0] : '',
        end_date: editingProject.end_date ? editingProject.end_date.split('T')[0] : '',
        project_value: editingProject.project_value || 0,
        amount_received: editingProject.amount_received || 0,
        priority: editingProject.priority || 'Medium',
        payment_status_selection: editingProject.amount_received >= (editingProject.project_value || 0) && (editingProject.project_value || 0) > 0 ? 'Fully Paid' : editingProject.amount_received > 0 ? 'Partially Paid' : 'Pending',
        notes: editingProject.notes || '',
      });
    } else {
      resetForm();
    }
  }, [editingProject, open]);

  const resetForm = () => {
    setFormData({
      client_name: '', brand_name: '', service: '', description: '', 
      status: 'Planning', start_date: '', end_date: '', 
      project_value: 0, amount_received: 0, priority: 'Medium', notes: '', payment_status_selection: 'Pending'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let resolvedClientId = editingProject?.client_id || null;
    
    if (formData.client_name) {
      const { data: existingClients } = await supabase.from('clients').select('id, name').ilike('name', formData.client_name);
      if (existingClients && existingClients.length > 0) {
        resolvedClientId = existingClients[0].id;
      } else {
        const { data: newClient } = await supabase.from('clients').insert([{ name: formData.client_name }]).select('id').single();
        if (newClient) {
          resolvedClientId = newClient.id;
        }
      }
    }

    const payload = {
      client_id: resolvedClientId,
      brand_name: formData.brand_name,
      service: formData.service,
      description: formData.description,
      status: formData.status,
      start_date: formData.start_date || null,
      end_date: formData.end_date || null,
      project_value: formData.project_value,
      amount_received: formData.amount_received,
      priority: formData.priority,
      notes: formData.notes
    };

    if (editingProject) {
      await supabase.from('projects').update(payload).eq('id', editingProject.id);
    } else {
      await supabase.from('projects').insert([payload]);
    }
    
    onOpenChange(false);
    resetForm();
    if (onSuccess) onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={val => { onOpenChange(val); if (!val) resetForm(); }}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#424790] text-xl font-bold tracking-wide" style={{ fontFamily: "\"Montserrat\", sans-serif" }}>
            {editingProject ? 'Edit Project' : 'Add New Project'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[#424790]">Client Name *</Label>
              <Input required placeholder="Enter client name" value={formData.client_name} onChange={e => setFormData({...formData, client_name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label className="text-[#424790]">Brand Name</Label>
              <Input placeholder="Enter brand name" value={formData.brand_name} onChange={e => setFormData({...formData, brand_name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label className="text-[#424790]">Service *</Label>
              <Input required placeholder="Enter service type" value={formData.service} onChange={e => setFormData({...formData, service: e.target.value})} />
            </div>
            <div className="space-y-2">
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
            </div>
            <div className="space-y-2">
              <Label className="text-[#424790]">Start Date</Label>
              <Input type="date" value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label className="text-[#424790]">End Date</Label>
              <Input type="date" value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label className="text-[#424790]">Project Value (₹)</Label>
              <Input type="number" required min="0" value={formData.project_value} onChange={e => setFormData({...formData, project_value: parseFloat(e.target.value) || 0})} />
            </div>
            <div className="space-y-2">
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
            )}
            <div className="space-y-2">
              <Label className="text-[#424790]">Priority</Label>
              <Input placeholder="e.g. Low, Medium, High" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})} />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-[#424790]">Description</Label>
            <Input placeholder="Project description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label className="text-[#424790]">Notes</Label>
            <Input placeholder="Additional notes" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" className="bg-[#EB5200] hover:bg-[#EB5200]/90 text-white">{editingProject ? 'Save Changes' : 'Add Project'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
