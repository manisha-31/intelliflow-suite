import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Search, Plus, Shield, UserCheck, UserX } from 'lucide-react';

const users = [
  { name: 'Rahul Mehta', email: 'rahul@modenik.com', role: 'Admin', department: 'Management', status: 'Active', joined: 'Jan 05, 2025' },
  { name: 'Priya Sharma', email: 'priya@modenik.com', role: 'Designer', department: 'Design Studio', status: 'Active', joined: 'Mar 12, 2025' },
  { name: 'Anita Desai', email: 'anita@modenik.com', role: 'Marketing Manager', department: 'Marketing', status: 'Active', joined: 'Feb 20, 2025' },
  { name: 'Vikram Singh', email: 'vikram@modenik.com', role: 'Designer', department: 'Design Studio', status: 'Active', joined: 'Apr 01, 2025' },
  { name: 'Rohan Kapoor', email: 'rohan@modenik.com', role: 'Designer', department: 'Design Studio', status: 'Active', joined: 'May 15, 2025' },
  { name: 'Factory Unit A', email: 'factoryA@modenik.com', role: 'Factory', department: 'Tirupur Unit', status: 'Active', joined: 'Jan 10, 2025' },
  { name: 'Factory Unit B', email: 'factoryB@modenik.com', role: 'Factory', department: 'Bengaluru Unit', status: 'Active', joined: 'Jan 10, 2025' },
  { name: 'Factory Unit C', email: 'factoryC@modenik.com', role: 'Factory', department: 'Ludhiana Unit', status: 'Active', joined: 'Feb 01, 2025' },
  { name: 'Factory Unit D', email: 'factoryD@modenik.com', role: 'Factory', department: 'Kolkata Unit', status: 'Inactive', joined: 'Feb 01, 2025' },
  { name: 'Metro Dist. Co.', email: 'metro@distributor.com', role: 'Distributor', department: 'North Zone', status: 'Active', joined: 'Mar 01, 2025' },
  { name: 'Southern Traders', email: 'southern@distributor.com', role: 'Distributor', department: 'South Zone', status: 'Active', joined: 'Mar 15, 2025' },
  { name: 'Eastern Wholesale', email: 'eastern@distributor.com', role: 'Distributor', department: 'East Zone', status: 'Inactive', joined: 'Apr 10, 2025' },
];

const roleColor: Record<string, string> = {
  Admin: 'bg-primary text-primary-foreground',
  'Marketing Manager': 'bg-info text-info-foreground',
  Designer: 'bg-warning text-warning-foreground',
  Factory: 'bg-success text-success-foreground',
  Distributor: 'bg-muted text-muted-foreground',
};

const UsersPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.role.toLowerCase().includes(search.toLowerCase()));

  const roleCount = (r: string) => users.filter(u => u.role === r).length;
  const activeCount = users.filter(u => u.status === 'Active').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-lg font-heading text-foreground">User Management</h3>
          <p className="text-xs text-muted-foreground font-body">{users.length} registered users</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-muted-foreground" />
            <Input placeholder="Search users..." className="pl-8 h-9 w-52 text-sm" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Button size="sm" className="gap-1.5"><Plus className="w-4 h-4" /> Invite User</Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { icon: Users, label: 'Total Users', value: users.length.toString() },
          { icon: UserCheck, label: 'Active', value: activeCount.toString() },
          { icon: Shield, label: 'Admins', value: roleCount('Admin').toString() },
          { icon: Users, label: 'Designers', value: roleCount('Designer').toString() },
          { icon: Users, label: 'Factories', value: roleCount('Factory').toString() },
        ].map(k => (
          <Card key={k.label}>
            <CardContent className="pt-4 pb-3 flex items-center gap-2">
              <k.icon className="w-4 h-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground font-body">{k.label}</p>
                <p className="text-lg font-bold font-heading text-foreground">{k.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* User List */}
      <Card>
        <CardContent className="pt-4">
          <div className="space-y-2">
            {filtered.map(u => (
              <div key={u.email} className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors">
                <Avatar className="w-9 h-9">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">{u.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground font-body">{u.name}</p>
                  <p className="text-xs text-muted-foreground font-body">{u.email} · {u.department}</p>
                </div>
                <Badge className={`text-[10px] ${roleColor[u.role]}`}>{u.role}</Badge>
                <Badge variant={u.status === 'Active' ? 'default' : 'secondary'} className="text-[10px]">
                  {u.status}
                </Badge>
                <span className="text-xs text-muted-foreground font-body hidden lg:block w-24">{u.joined}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersPage;