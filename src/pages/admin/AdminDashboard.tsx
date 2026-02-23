import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Collections', value: '—', color: 'text-primary' },
          { label: 'Pending Approvals', value: '—', color: 'text-warning' },
          { label: 'Active Production', value: '—', color: 'text-success' },
          { label: 'Registered Users', value: '—', color: 'text-info' },
        ].map(kpi => (
          <Card key={kpi.label}>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground font-body">{kpi.label}</p>
              <p className={`text-3xl font-bold font-heading mt-1 ${kpi.color}`}>{kpi.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base font-heading">Collections by Status</CardTitle></CardHeader>
          <CardContent><p className="text-muted-foreground text-sm font-body">Chart will populate with data</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base font-heading">Recent Activity</CardTitle></CardHeader>
          <CardContent><p className="text-muted-foreground text-sm font-body">Activity feed will appear here</p></CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;