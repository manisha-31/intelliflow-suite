import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, Clock, Eye, MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';
import designArctic from '@/assets/design-arctic-thermals.jpg';
import designEco from '@/assets/design-eco-comfort.jpg';
import designSport from '@/assets/design-sport-socks.jpg';
import designSummer from '@/assets/design-summer-breeze.jpg';
import designUrban from '@/assets/design-urban-vest.jpg';

const pendingDesigns = [
  { id: 'D-1042', title: 'Eco Comfort Brief V2', designer: 'Priya Sharma', collection: 'Essentials', submitted: 'Feb 20', version: 2, img: designEco, category: 'Innerwear' },
  { id: 'D-1045', title: 'Urban Street Vest V2', designer: 'Rohan Kapoor', collection: 'Urban Edge', submitted: 'Feb 19', version: 2, img: designUrban, category: 'Vests' },
  { id: 'D-1048', title: 'Summer Breeze Camisole', designer: 'Anita Desai', collection: 'Summer 2026', submitted: 'Feb 22', version: 1, img: designSummer, category: 'Camisoles' },
  { id: 'D-1050', title: 'Sport Flex Ankle Socks V4', designer: 'Vikram Singh', collection: 'Active Sport', submitted: 'Feb 21', version: 4, img: designSport, category: 'Socks' },
];

const approvedDesigns = [
  { id: 'D-1038', title: 'Arctic Thermals Pro V3', designer: 'Priya Sharma', collection: 'Winter 2026', approvedOn: 'Feb 18', reviewer: 'Rahul Mehta', img: designArctic },
  { id: 'D-1035', title: 'Heritage Classic Vest', designer: 'Rohan Kapoor', collection: 'Heritage Line', approvedOn: 'Feb 12', reviewer: 'Rahul Mehta', img: designEco },
];

const rejectedDesigns = [
  { id: 'D-1040', title: 'Sport Flex Socks V3', designer: 'Vikram Singh', collection: 'Active Sport', rejectedOn: 'Feb 15', reason: 'Color palette doesn\'t match brand guidelines. Please revise with approved Pantone references.', reviewer: 'Anita Desai', img: designSport },
];

const ApprovalsPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Clock, label: 'Pending Review', value: '4', color: 'text-warning' },
          { icon: CheckCircle, label: 'Approved (This Month)', value: '12', color: 'text-success' },
          { icon: XCircle, label: 'Rejected', value: '1', color: 'text-destructive' },
          { icon: Eye, label: 'Avg. Review Time', value: '1.8 days', color: 'text-info' },
        ].map(k => (
          <Card key={k.label}>
            <CardContent className="pt-5 pb-4">
              <p className="text-xs text-muted-foreground font-body uppercase tracking-wider">{k.label}</p>
              <p className={`text-2xl font-bold font-heading mt-1 ${k.color}`}>{k.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pendingDesigns.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approvedDesigns.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejectedDesigns.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4 space-y-3">
          {pendingDesigns.map(d => (
            <Card key={d.id} className="hover:border-primary/40 transition-colors">
              <CardContent className="pt-4 pb-4 flex items-center gap-4">
                <img src={d.img} alt={d.title} className="w-16 h-16 rounded-lg object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground font-body">{d.title}</p>
                    <Badge variant="outline" className="text-[10px]">v{d.version}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground font-body mt-0.5">{d.designer} · {d.collection} · {d.category}</p>
                  <p className="text-xs text-muted-foreground font-body">Submitted {d.submitted}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button size="sm" variant="outline" className="gap-1 text-xs"><MessageSquare className="w-3 h-3" /> Comment</Button>
                  <Button size="sm" variant="destructive" className="gap-1 text-xs"><ThumbsDown className="w-3 h-3" /> Reject</Button>
                  <Button size="sm" className="gap-1 text-xs"><ThumbsUp className="w-3 h-3" /> Approve</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="approved" className="mt-4 space-y-3">
          {approvedDesigns.map(d => (
            <Card key={d.id}>
              <CardContent className="pt-4 pb-4 flex items-center gap-4">
                <img src={d.img} alt={d.title} className="w-16 h-16 rounded-lg object-cover shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground font-body">{d.title}</p>
                  <p className="text-xs text-muted-foreground font-body">{d.designer} · {d.collection}</p>
                </div>
                <div className="text-right">
                  <Badge className="bg-success text-success-foreground text-[10px]">Approved</Badge>
                  <p className="text-xs text-muted-foreground font-body mt-1">by {d.reviewer} · {d.approvedOn}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="rejected" className="mt-4 space-y-3">
          {rejectedDesigns.map(d => (
            <Card key={d.id} className="border-destructive/30">
              <CardContent className="pt-4 pb-4 flex items-center gap-4">
                <img src={d.img} alt={d.title} className="w-16 h-16 rounded-lg object-cover shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground font-body">{d.title}</p>
                  <p className="text-xs text-muted-foreground font-body">{d.designer} · {d.collection}</p>
                  <p className="text-xs text-destructive font-body mt-1">Reason: {d.reason}</p>
                </div>
                <div className="text-right shrink-0">
                  <Badge className="bg-destructive text-destructive-foreground text-[10px]">Rejected</Badge>
                  <p className="text-xs text-muted-foreground font-body mt-1">by {d.reviewer} · {d.rejectedOn}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApprovalsPage;