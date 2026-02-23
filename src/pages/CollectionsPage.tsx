import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { FolderOpen, Search, Plus, Calendar, Palette, Package, TrendingUp } from 'lucide-react';

const collections = [
  { name: 'Winter Thermals 2026', season: 'Winter', year: 2026, status: 'In Production', designs: 14, approved: 12, progress: 72, launch: 'Nov 15, 2025', desc: 'Premium thermal innerwear for extreme cold comfort' },
  { name: 'Summer Breeze Collection', season: 'Summer', year: 2026, status: 'Design Phase', designs: 18, approved: 6, progress: 35, launch: 'Apr 01, 2026', desc: 'Lightweight breathable essentials for summer' },
  { name: 'Heritage Classics', season: 'All Season', year: 2026, status: 'Launched', designs: 10, approved: 10, progress: 100, launch: 'Jan 10, 2026', desc: 'Timeless innerwear inspired by 40 years of legacy' },
  { name: 'Monsoon Essentials', season: 'Monsoon', year: 2026, status: 'Planning', designs: 8, approved: 0, progress: 10, launch: 'Jun 01, 2026', desc: 'Quick-dry, antimicrobial range for the rainy season' },
  { name: 'Kids Comfort Range', season: 'All Season', year: 2026, status: 'Design Phase', designs: 12, approved: 3, progress: 25, launch: 'Apr 20, 2026', desc: 'Soft, durable innerwear designed for children' },
  { name: 'Active Sport Line', season: 'All Season', year: 2026, status: 'In Production', designs: 9, approved: 9, progress: 60, launch: 'Mar 15, 2026', desc: 'Performance-driven athletic innerwear & socks' },
  { name: 'Festive Luxe 2025', season: 'Winter', year: 2025, status: 'Launched', designs: 7, approved: 7, progress: 100, launch: 'Oct 01, 2025', desc: 'Premium gift-ready innerwear for the festive season' },
  { name: 'Eco Conscious Range', season: 'All Season', year: 2026, status: 'Planning', designs: 5, approved: 0, progress: 8, launch: 'Jul 15, 2026', desc: 'Sustainable fabrics and responsible production' },
];

const statusColor: Record<string, string> = {
  Launched: 'bg-success text-success-foreground',
  'In Production': 'bg-info text-info-foreground',
  'Design Phase': 'bg-warning text-warning-foreground',
  Planning: 'bg-muted text-muted-foreground',
};

const CollectionsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const filtered = collections.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-lg font-heading text-foreground">Collections</h3>
          <p className="text-xs text-muted-foreground font-body">{collections.length} collections across all seasons</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-muted-foreground" />
            <Input placeholder="Search collections..." className="pl-8 h-9 w-52 text-sm" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Button size="sm" className="gap-1.5"><Plus className="w-4 h-4" /> New Collection</Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: FolderOpen, label: 'Total Collections', value: '8' },
          { icon: Palette, label: 'Total Designs', value: '83' },
          { icon: Package, label: 'In Production', value: '2' },
          { icon: TrendingUp, label: 'Launched', value: '2' },
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

      {/* Collection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(c => (
          <Card key={c.name} className="hover:border-primary/40 transition-colors cursor-pointer">
            <CardContent className="pt-5 pb-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-foreground font-body">{c.name}</h4>
                  <p className="text-xs text-muted-foreground font-body mt-0.5">{c.desc}</p>
                </div>
                <Badge className={`text-[10px] shrink-0 ${statusColor[c.status]}`}>{c.status}</Badge>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground font-body">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {c.launch}</span>
                <span>{c.season} {c.year}</span>
              </div>
              <div className="flex items-center gap-4 text-xs font-body">
                <span className="text-muted-foreground">{c.approved}/{c.designs} designs approved</span>
                <span className="ml-auto font-mono-data text-foreground">{c.progress}%</span>
              </div>
              <Progress value={c.progress} className="h-1.5" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CollectionsPage;