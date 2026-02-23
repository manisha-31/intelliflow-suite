import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Megaphone, Plus, Calendar, Target, IndianRupee, TrendingUp, Globe, Mail, Smartphone } from 'lucide-react';

const campaigns = [
  { title: 'Spring Launch 2026', collection: 'Summer Breeze Collection', type: 'Product Launch', status: 'Active', channels: ['Social Media', 'Email', 'Print'], budget: '₹5.2L', spent: '₹3.8L', spentPct: 73, start: 'Feb 01', end: 'Mar 15', impressions: '2.4M', ctr: '4.2%' },
  { title: 'Heritage Brand Story', collection: 'Heritage Classics', type: 'Brand Awareness', status: 'Active', channels: ['Social Media', 'TV'], budget: '₹8.0L', spent: '₹4.1L', spentPct: 51, start: 'Jan 15', end: 'Apr 30', impressions: '5.1M', ctr: '3.8%' },
  { title: 'Thermal Winter Push', collection: 'Winter Thermals 2026', type: 'Seasonal', status: 'Completed', channels: ['Social Media', 'Email', 'Retail POS'], budget: '₹6.5L', spent: '₹6.3L', spentPct: 97, start: 'Oct 01', end: 'Jan 31', impressions: '8.2M', ctr: '5.1%' },
  { title: 'Back to School', collection: 'Kids Comfort Range', type: 'Seasonal', status: 'Planning', channels: ['Social Media', 'Print'], budget: '₹3.0L', spent: '₹0', spentPct: 0, start: 'Apr 01', end: 'May 15', impressions: '—', ctr: '—' },
  { title: 'Eco Promise Campaign', collection: 'Eco Conscious Range', type: 'CSR / Sustainability', status: 'Planning', channels: ['Social Media', 'PR'], budget: '₹4.0L', spent: '₹0', spentPct: 0, start: 'May 01', end: 'Jul 31', impressions: '—', ctr: '—' },
  { title: 'Festive Gifting 2025', collection: 'Festive Luxe 2025', type: 'Seasonal', status: 'Completed', channels: ['Email', 'Retail POS', 'Social Media'], budget: '₹7.0L', spent: '₹6.8L', spentPct: 97, start: 'Sep 15', end: 'Nov 30', impressions: '6.5M', ctr: '5.8%' },
];

const statusColor: Record<string, string> = {
  Active: 'bg-success text-success-foreground',
  Planning: 'bg-warning text-warning-foreground',
  Completed: 'bg-muted text-muted-foreground',
};

const channelIcon: Record<string, React.ReactNode> = {
  'Social Media': <Smartphone className="w-3 h-3" />,
  Email: <Mail className="w-3 h-3" />,
  Print: <Globe className="w-3 h-3" />,
  'Retail POS': <Target className="w-3 h-3" />,
  TV: <Globe className="w-3 h-3" />,
  PR: <Megaphone className="w-3 h-3" />,
};

const CampaignsPage: React.FC = () => {
  const [tab, setTab] = useState('all');
  const filtered = tab === 'all' ? campaigns : campaigns.filter(c => c.status.toLowerCase() === tab);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-lg font-heading text-foreground">Campaigns</h3>
          <p className="text-xs text-muted-foreground font-body">{campaigns.length} campaigns managed</p>
        </div>
        <Button size="sm" className="gap-1.5"><Plus className="w-4 h-4" /> New Campaign</Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Megaphone, label: 'Active', value: '2' },
          { icon: IndianRupee, label: 'Total Budget', value: '₹33.7L' },
          { icon: TrendingUp, label: 'Total Impressions', value: '22.2M' },
          { icon: Target, label: 'Avg. CTR', value: '4.7%' },
        ].map(k => (
          <Card key={k.label}>
            <CardContent className="pt-4 pb-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <k.icon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-body">{k.label}</p>
                <p className="text-lg font-bold font-heading text-foreground">{k.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="all">All ({campaigns.length})</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="planning">Planning</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-4 space-y-3">
          {filtered.map(c => (
            <Card key={c.title} className="hover:border-primary/40 transition-colors cursor-pointer">
              <CardContent className="pt-4 pb-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-foreground font-body">{c.title}</h4>
                      <Badge className={`text-[10px] ${statusColor[c.status]}`}>{c.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground font-body mt-0.5">{c.collection} · {c.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold font-mono-data text-foreground">{c.impressions}</p>
                    <p className="text-xs text-muted-foreground font-body">impressions</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground font-body">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {c.start} — {c.end}</span>
                  <span>CTR: <span className="text-foreground font-semibold">{c.ctr}</span></span>
                  <div className="flex items-center gap-1 ml-auto">
                    {c.channels.map(ch => (
                      <span key={ch} className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-muted text-muted-foreground text-[10px]">
                        {channelIcon[ch]} {ch}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground font-body">Budget: {c.spent} / {c.budget}</span>
                  <div className="flex-1"><Progress value={c.spentPct} className="h-1.5" /></div>
                  <span className="text-xs font-mono-data text-foreground">{c.spentPct}%</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CampaignsPage;