import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const FactoryProduction: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader><CardTitle className="text-base font-heading">Production Orders</CardTitle></CardHeader>
        <CardContent><p className="text-muted-foreground text-sm font-body">Your assigned production orders will appear here.</p></CardContent>
      </Card>
    </div>
  );
};

export default FactoryProduction;