import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package, Factory } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: string;
}

const ICON_MAP: Record<string, React.ElementType> = {
  revenue: DollarSign,
  orders: ShoppingCart,
  inventory: Package,
  production: Factory,
};

const KPICard: React.FC<KPICardProps> = ({ label, value, change, trend, icon }) => {
  const Icon = ICON_MAP[icon] || Package;
  const isUp = trend === 'up';

  return (
    <div className="glass-card rounded-xl p-5 animate-slide-in">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium font-mono-data ${isUp ? 'text-success' : 'text-destructive'}`}>
          {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {change}
        </div>
      </div>
      <p className="text-2xl font-bold text-foreground font-mono-data">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  );
};

export default KPICard;
