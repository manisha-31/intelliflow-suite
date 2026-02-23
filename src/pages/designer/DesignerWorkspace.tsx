import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Palette, Clock, CheckCircle, XCircle, FileUp, Eye } from 'lucide-react';
import designArctic from '@/assets/design-arctic-thermals.jpg';
import designEco from '@/assets/design-eco-comfort.jpg';
import designHeritage from '@/assets/design-heritage-classic.jpg';
import designSport from '@/assets/design-sport-socks.jpg';
import designSummer from '@/assets/design-summer-breeze.jpg';
import designUrban from '@/assets/design-urban-vest.jpg';

const myDesigns = [
  { title: 'Arctic Thermals Pro V3', collection: 'Winter 2026', status: 'Approved', version: 3, img: designArctic, date: 'Feb 18' },
  { title: 'Eco Comfort Brief', collection: 'Essentials', status: 'In Review', version: 2, img: designEco, date: 'Feb 20' },
  { title: 'Heritage Classic Vest', collection: 'Heritage Line', status: 'Approved', version: 1, img: designHeritage, date: 'Feb 12' },
  { title: 'Sport Flex Ankle Socks', collection: 'Active Sport', status: 'Revision Needed', version: 4, img: designSport, date: 'Feb 21' },
  { title: 'Summer Breeze Camisole', collection: 'Summer 2026', status: 'Draft', version: 1, img: designSummer, date: 'Feb 22' },
  { title: 'Urban Street Vest', collection: 'Urban Edge', status: 'In Review', version: 2, img: designUrban, date: 'Feb 19' },
];

const sampleTracking = [
  { design: 'Arctic Thermals Pro V3', stage: 'Approved', progress: 100 },
  { design: 'Eco Comfort Brief', stage: 'Received by QC', progress: 60 },
  { design: 'Sport Flex Ankle Socks', stage: 'Sent to Factory', progress: 30 },
  { design: 'Heritage Classic Vest', stage: 'Approved', progress: 100 },
];

const statusColor: Record<string, string> = {
  Approved: 'bg-success text-success-foreground',
  'In Review': 'bg-info text-info-foreground',
  'Revision Needed': 'bg-warning text-warning-foreground',
  Draft: 'bg-muted text-muted-foreground',
};

const DesignerWorkspace: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Palette, label: 'My Designs', value: '24', sub: 'Total submissions' },
          { icon: CheckCircle, label: 'Approved', value: '14', sub: 'Ready for production' },
          { icon: Clock, label: 'Pending Review', value: '6', sub: 'Awaiting feedback' },
          { icon: FileUp, label: 'This Month', value: '5', sub: 'New uploads' },
        ].map(kpi => (
          <Card key={kpi.label}>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-body uppercase tracking-wider">{kpi.label}</p>
                  <p className="text-2xl font-bold font-heading text-foreground mt-1">{kpi.value}</p>
                  <p className="text-xs text-muted-foreground font-body">{kpi.sub}</p>
                </div>
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <kpi.icon className="w-4 h-4 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Design Grid */}
      <div>
        <h3 className="text-sm font-heading text-foreground mb-4">My Designs</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {myDesigns.map(d => (
            <Card key={d.title} className="overflow-hidden group cursor-pointer hover:border-primary/50 transition-colors">
              <div className="aspect-[4/3] relative overflow-hidden">
                <img src={d.img} alt={d.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <Badge className={`absolute top-2 right-2 text-[10px] ${statusColor[d.status]}`}>
                  {d.status}
                </Badge>
              </div>
              <CardContent className="pt-3 pb-3">
                <p className="text-sm font-semibold text-foreground font-body">{d.title}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-muted-foreground font-body">{d.collection}</p>
                  <span className="text-xs text-muted-foreground font-mono-data">v{d.version} · {d.date}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Sample Tracking */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-heading">Sample Tracking</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {sampleTracking.map(s => (
            <div key={s.design} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-body">
                <span className="text-foreground font-medium">{s.design}</span>
                <span className="text-muted-foreground">{s.stage}</span>
              </div>
              <Progress value={s.progress} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default DesignerWorkspace;