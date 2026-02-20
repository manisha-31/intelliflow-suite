import React from 'react';
import { Brain, AlertTriangle, TrendingUp, Info } from 'lucide-react';

interface InsightProps {
  type: 'warning' | 'success' | 'info';
  title: string;
  message: string;
  confidence: number;
}

const TYPE_CONFIG = {
  warning: { icon: AlertTriangle, border: 'border-l-warning', bg: 'bg-warning/5' },
  success: { icon: TrendingUp, border: 'border-l-success', bg: 'bg-success/5' },
  info: { icon: Info, border: 'border-l-info', bg: 'bg-info/5' },
};

const AIInsightCard: React.FC<InsightProps> = ({ type, title, message, confidence }) => {
  const config = TYPE_CONFIG[type];
  const Icon = config.icon;

  return (
    <div className={`${config.bg} border-l-2 ${config.border} rounded-r-lg p-4`}>
      <div className="flex items-start gap-3">
        <Icon className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-foreground">{title}</p>
            <span className="text-[10px] font-mono-data text-muted-foreground shrink-0">{confidence}% conf.</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default AIInsightCard;
