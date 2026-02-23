import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DesignerWorkspace: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold font-heading">My Designs</h3>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-base font-heading">Designs</CardTitle></CardHeader>
        <CardContent><p className="text-muted-foreground text-sm font-body">Your designs will appear here. Upload your first design to get started.</p></CardContent>
      </Card>
    </div>
  );
};

export default DesignerWorkspace;