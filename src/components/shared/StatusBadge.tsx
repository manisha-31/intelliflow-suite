import React from 'react';

interface StatusBadgeProps {
  status: string;
}

const STATUS_STYLES: Record<string, string> = {
  confirmed: 'bg-primary/10 text-primary',
  processing: 'bg-warning/10 text-warning',
  shipped: 'bg-info/10 text-info',
  delivered: 'bg-success/10 text-success',
  pending: 'bg-muted text-muted-foreground',
  cancelled: 'bg-destructive/10 text-destructive',
  approved: 'bg-success/10 text-success',
  in_review: 'bg-warning/10 text-warning',
  draft: 'bg-muted text-muted-foreground',
  revision: 'bg-destructive/10 text-destructive',
  in_progress: 'bg-primary/10 text-primary',
  completed: 'bg-success/10 text-success',
  queued: 'bg-muted text-muted-foreground',
  healthy: 'bg-success/10 text-success',
  low: 'bg-warning/10 text-warning',
  critical: 'bg-destructive/10 text-destructive',
  high: 'bg-destructive/10 text-destructive',
  medium: 'bg-warning/10 text-warning',
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const style = STATUS_STYLES[status] || 'bg-muted text-muted-foreground';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium capitalize ${style}`}>
      {status.replace('_', ' ')}
    </span>
  );
};

export default StatusBadge;
