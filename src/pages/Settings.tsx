import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

export default function Settings() {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    company_name: 'Shrish Creative Studio',
  });

  useEffect(() => {
    const stored = localStorage.getItem('shrish_company_name');
    if (stored) {
      setProfile({ company_name: stored });
    }
  }, []);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    localStorage.setItem('shrish_company_name', profile.company_name);
    
    setTimeout(() => {
      setLoading(false);
      alert('Profile updated successfully');
    }, 400);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <h2 className="text-2xl font-bold text-secondary mb-6">Settings</h2>
      
      <Card className="rounded-[2rem] border-secondary/10">
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
          <CardDescription>Update your company and personal information.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label>Email (Read Only)</Label>
              <Input value="shrish.studio@gmail.com" disabled className="bg-secondary/5" />
            </div>
            <div className="space-y-2">
              <Label>Company Name</Label>
              <Input 
                value={profile.company_name} 
                onChange={e => setProfile({...profile, company_name: e.target.value})} 
                placeholder="Shrish Creative Studio"
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <Card className="rounded-[2rem] border-secondary/10">
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Manage your password and security preferences.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" disabled>Change Password (Disabled)</Button>
        </CardContent>
      </Card>
    </div>
  );
}
