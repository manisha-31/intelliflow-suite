import React from 'react';
import AppHeader from '@/components/layout/AppHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import { designs } from '@/data/mockData';
import { MessageSquare, Eye } from 'lucide-react';

import designSummerBreeze from '@/assets/design-summer-breeze.jpg';
import designArcticThermals from '@/assets/design-arctic-thermals.jpg';
import designUrbanVest from '@/assets/design-urban-vest.jpg';
import designEcoComfort from '@/assets/design-eco-comfort.jpg';
import designSportSocks from '@/assets/design-sport-socks.jpg';
import designHeritageClassic from '@/assets/design-heritage-classic.jpg';

const DESIGN_IMAGES: Record<string, string> = {
  'DSN-001': designSummerBreeze,
  'DSN-002': designArcticThermals,
  'DSN-003': designUrbanVest,
  'DSN-004': designEcoComfort,
  'DSN-005': designSportSocks,
  'DSN-006': designHeritageClassic,
};

const DesignsPage: React.FC = () => {
  return (
    <>
      <AppHeader title="Design Management" subtitle="Collections & approval workflow" />
      <div className="flex-1 p-6 space-y-4 overflow-auto scrollbar-thin">
        <div className="grid grid-cols-3 gap-4">
          {designs.map(design => (
            <div key={design.id} className="glass-card rounded-xl p-5 hover:border-primary/30 transition-colors group">
              <div className="w-full h-36 rounded-lg bg-secondary/50 mb-4 overflow-hidden">
                <img
                  src={DESIGN_IMAGES[design.id]}
                  alt={design.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="text-sm font-semibold text-foreground">{design.name}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{design.designer} · {design.category}</p>
                </div>
                <StatusBadge status={design.status} />
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                <span className="text-[10px] font-mono-data text-muted-foreground">{design.id}</span>
                <div className="flex items-center gap-2">
                  <button className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                    <MessageSquare className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default DesignsPage;
