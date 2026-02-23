import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DistributorOrders: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader><CardTitle className="text-base font-heading">My Orders</CardTitle></CardHeader>
        <CardContent><p className="text-muted-foreground text-sm font-body">Your orders and delivery tracking will appear here.</p></CardContent>
      </Card>
    </div>
  );
};

export default DistributorOrders;