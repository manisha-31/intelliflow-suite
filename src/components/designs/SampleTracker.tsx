import React from 'react';
import { Package, CheckCircle2, ThumbsUp, ThumbsDown, Send, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export type SampleStatus = 'not_sent' | 'sent' | 'received' | 'approved' | 'rejected';

interface SampleTrackerProps {
  status: SampleStatus;
  onAdvance: (newStatus: SampleStatus) => void;
}

const STEPS: { key: SampleStatus; label: string; icon: React.ElementType }[] = [
  { key: 'sent', label: 'Sent', icon: Send },
  { key: 'received', label: 'Received', icon: Package },
  { key: 'approved', label: 'Approved', icon: ThumbsUp },
];

const statusIndex = (s: SampleStatus): number => {
  if (s === 'not_sent') return -1;
  if (s === 'rejected') return 2; // same visual position as approved
  return STEPS.findIndex(st => st.key === s);
};

const SampleTracker: React.FC<SampleTrackerProps> = ({ status, onAdvance }) => {
  const currentIdx = statusIndex(status);
  const isRejected = status === 'rejected';
  const isApproved = status === 'approved';
  const isTerminal = isRejected || isApproved;

  return (
    <div className="mt-3 pt-3 border-t border-border/50 space-y-2.5">
      {/* Step indicators */}
      <div className="flex items-center gap-1">
        {STEPS.map((step, i) => {
          const StepIcon = step.icon;
          const reached = i <= currentIdx && !isRejected;
          const isRejectStep = i === 2 && isRejected;

          let dotClass = 'bg-secondary text-muted-foreground';
          if (reached) dotClass = 'bg-primary/20 text-primary';
          if (isRejectStep) dotClass = 'bg-destructive/20 text-destructive';
          if (i === currentIdx && !isTerminal) dotClass += ' ring-1 ring-primary/40';

          return (
            <React.Fragment key={step.key}>
              {i > 0 && (
                <div className={`flex-1 h-px ${reached || isRejectStep ? (isRejectStep ? 'bg-destructive/30' : 'bg-primary/30') : 'bg-border/50'}`} />
              )}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={`flex items-center justify-center w-6 h-6 rounded-full transition-colors ${dotClass}`}>
                    {isRejectStep ? (
                      <ThumbsDown className="w-3 h-3" />
                    ) : (
                      <StepIcon className="w-3 h-3" />
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  {isRejectStep ? 'Rejected' : step.label}
                </TooltipContent>
              </Tooltip>
            </React.Fragment>
          );
        })}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-1.5">
        {status === 'not_sent' && (
          <Button
            size="sm"
            variant="outline"
            className="h-6 text-[10px] px-2 gap-1"
            onClick={() => onAdvance('sent')}
          >
            <Send className="w-3 h-3" />
            Mark Sent
          </Button>
        )}
        {status === 'sent' && (
          <Button
            size="sm"
            variant="outline"
            className="h-6 text-[10px] px-2 gap-1"
            onClick={() => onAdvance('received')}
          >
            <Package className="w-3 h-3" />
            Confirm Receipt
          </Button>
        )}
        {status === 'received' && (
          <>
            <Button
              size="sm"
              className="h-6 text-[10px] px-2 gap-1 bg-success/10 text-success hover:bg-success/20 border-0"
              onClick={() => onAdvance('approved')}
            >
              <ThumbsUp className="w-3 h-3" />
              Approve
            </Button>
            <Button
              size="sm"
              className="h-6 text-[10px] px-2 gap-1 bg-destructive/10 text-destructive hover:bg-destructive/20 border-0"
              onClick={() => onAdvance('rejected')}
            >
              <ThumbsDown className="w-3 h-3" />
              Reject
            </Button>
          </>
        )}
        {isTerminal && (
          <span className={`inline-flex items-center gap-1 text-[10px] font-medium ${isApproved ? 'text-success' : 'text-destructive'}`}>
            {isApproved ? <CheckCircle2 className="w-3 h-3" /> : <ThumbsDown className="w-3 h-3" />}
            Sample {isApproved ? 'Approved' : 'Rejected'}
          </span>
        )}
        {!isTerminal && status !== 'not_sent' && (
          <span className="ml-auto text-[9px] text-muted-foreground flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" />
            Awaiting {status === 'sent' ? 'receipt' : 'review'}
          </span>
        )}
      </div>
    </div>
  );
};

export default SampleTracker;
