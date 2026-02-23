import React, { useState } from 'react';
import AppHeader from '@/components/layout/AppHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import { designs as mockDesigns } from '@/data/mockData';
import { MessageSquare, Eye } from 'lucide-react';
import DesignChatPanel from '@/components/designs/DesignChatPanel';
import SampleTracker, { type SampleStatus } from '@/components/designs/SampleTracker';
import AddDesignDialog from '@/components/designs/AddDesignDialog';
import { useAuth } from '@/contexts/AuthContext';

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
  const { user } = useAuth();
  const [designList, setDesignList] = useState(mockDesigns);
  const [activeChat, setActiveChat] = useState<{ id: string; name: string } | null>(null);
  const [sampleStatuses, setSampleStatuses] = useState<Record<string, SampleStatus>>({
    'DSN-001': 'approved',
    'DSN-002': 'sent',
    'DSN-003': 'received',
    'DSN-004': 'not_sent',
    'DSN-005': 'rejected',
    'DSN-006': 'approved',
  });

  const canAddDesign = user?.role === 'designer' || user?.role === 'factory_admin';

  const handleSampleAdvance = (designId: string, newStatus: SampleStatus) => {
    setSampleStatuses(prev => ({ ...prev, [designId]: newStatus }));
  };

  const handleAddDesign = (design: typeof designList[0]) => {
    setDesignList(prev => [design, ...prev]);
    setSampleStatuses(prev => ({ ...prev, [design.id]: 'not_sent' }));
  };

  return (
    <>
      <AppHeader title="Design Management" subtitle="Collections & approval workflow" />
      <div className="flex-1 flex overflow-hidden">
        {/* Design grid */}
        <div className={`flex-1 p-6 space-y-4 overflow-auto scrollbar-thin ${activeChat ? 'pr-0' : ''}`}>
          {/* Toolbar */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">{designList.length} designs</h3>
            {canAddDesign && (
              <AddDesignDialog onAdd={handleAddDesign} designCount={designList.length} />
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            {designList.map(design => (
              <div key={design.id} className={`glass-card rounded-xl p-5 hover:border-primary/30 transition-colors group ${activeChat?.id === design.id ? 'border-primary/40 ring-1 ring-primary/20' : ''}`}>
                <div className="w-full h-36 rounded-lg bg-secondary/50 mb-4 overflow-hidden">
                  {DESIGN_IMAGES[design.id] ? (
                    <img
                      src={DESIGN_IMAGES[design.id]}
                      alt={design.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                      No image
                    </div>
                  )}
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
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setActiveChat(activeChat?.id === design.id ? null : { id: design.id, name: design.name })}
                      className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium transition-colors ${
                        activeChat?.id === design.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary/70 text-muted-foreground hover:text-foreground hover:bg-secondary'
                      }`}
                      title="Open chat"
                    >
                      <MessageSquare className="w-3 h-3" />
                      Chat
                    </button>
                    <button className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <SampleTracker
                  status={sampleStatuses[design.id] || 'not_sent'}
                  onAdvance={(newStatus) => handleSampleAdvance(design.id, newStatus)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Chat panel */}
        {activeChat && (
          <div className="w-[360px] shrink-0 h-full">
            <DesignChatPanel
              designId={activeChat.id}
              designName={activeChat.name}
              onClose={() => setActiveChat(null)}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default DesignsPage;
