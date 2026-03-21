import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Search, Shield, UserCheck, Loader2 } from 'lucide-react';
import { useUsers } from '@/hooks/useUsers';

const roleColor: Record<string, string> = {
  admin: 'bg-primary text-primary-foreground',
  marketing_manager: 'bg-info text-info-foreground',
  designer: 'bg-warning text-warning-foreground',
  factory: 'bg-success text-success-foreground',
  distributor: 'bg-muted text-muted-foreground',
};
const roleLabel: Record<string, string> = { admin: 'Admin', marketing_manager: 'Marketing Manager', designer: 'Designer', factory: 'Factory', distributor: 'Distributor' };

const UsersPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const { data: users = [], isLoading } = useUsers();
  const filtered = users.filter(u => u.full_name.toLowerCase().includes(search.toLowerCase()) || (u.role || '').toLowerCase().includes(search.toLowerCase()));
  const activeCount = users.filter(u => u.is_active).length;

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-lg font-heading text-foreground">User Management</h3>
          <p className="text-xs text-muted-foreground font-body">{users.length} registered users</p>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-muted-foreground" />
          <Input placeholder="Search users..." className="pl-8 h-9 w-52 text-sm" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users, label: 'Total Users', value: users.length.toString() },
          { icon: UserCheck, label: 'Active', value: activeCount.toString() },
          { icon: Shield, label: 'Admins', value: users.filter(u => u.role === 'admin').length.toString() },
          { icon: Users, label: 'Designers', value: users.filter(u => u.role === 'designer').length.toString() },
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

      <Card>
        <CardContent className="pt-4">
          {filtered.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No users found.</p>}
          <div className="space-y-2">
            {filtered.map((u: any) => (
              <div key={u.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors">
                <Avatar className="w-9 h-9">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">{u.full_name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground font-body">{u.full_name}</p>
                  <p className="text-xs text-muted-foreground font-body">{u.department || 'No department'}</p>
                </div>
                <Badge className={`text-[10px] ${roleColor[u.role] || 'bg-muted text-muted-foreground'}`}>{roleLabel[u.role] || u.role}</Badge>
                <Badge variant={u.is_active ? 'default' : 'secondary'} className="text-[10px]">{u.is_active ? 'Active' : 'Inactive'}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersPage;
