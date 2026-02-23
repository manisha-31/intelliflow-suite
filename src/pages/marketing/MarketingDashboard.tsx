import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MarketingDashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Active Campaigns', value: '—', color: 'text-accent' },
          { label: 'Upcoming Launches', value: '—', color: 'text-primary' },
          { label: 'Collections in Marketing', value: '—', color: 'text-info' },
        ].map(kpi => (
          <Card key={kpi.label}>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground font-body">{kpi.label}</p>
              <p className={`text-3xl font-bold font-heading mt-1 ${kpi.color}`}>{kpi.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader><CardTitle className="text-base font-heading">Campaign Calendar</CardTitle></CardHeader>
        <CardContent><p className="text-muted-foreground text-sm font-body">Campaigns will appear here</p></CardContent>
      </Card>
    </div>
  );
};

export default MarketingDashboard;