import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CollectionsPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold font-heading">All Collections</h3>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-base font-heading">Collections</CardTitle></CardHeader>
        <CardContent><p className="text-muted-foreground text-sm font-body">Product collections will be listed here.</p></CardContent>
      </Card>
    </div>
  );
};

export default CollectionsPage;