import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const UnauthorizedPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 text-center">
      <h1 className="text-4xl font-bold font-heading text-foreground mb-2">Access Denied</h1>
      <p className="text-muted-foreground font-body mb-6">You don't have permission to view this page.</p>
      <Link to="/login">
        <Button>Back to Login</Button>
      </Link>
    </div>
  );
};

export default UnauthorizedPage;