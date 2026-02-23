import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import { Bell, Search } from 'lucide-react';
import { ROLE_LABELS } from '@/types/auth';

const ROUTE_TITLES: Record<string, { title: string; subtitle?: string }> = {
  '/admin/dashboard': { title: 'Admin Dashboard', subtitle: 'Overview of all operations' },
  '/marketing/dashboard': { title: 'Marketing Dashboard', subtitle: 'Campaign & collection insights' },
  '/designer/workspace': { title: 'Design Workspace', subtitle: 'Manage your designs' },
  '/factory/production': { title: 'Production Tracker', subtitle: 'Monitor manufacturing progress' },
  '/distributor/orders': { title: 'My Orders', subtitle: 'Track your orders & inventory' },
  '/collections': { title: 'Collections', subtitle: 'Browse all product collections' },
  '/approvals': { title: 'Design Approvals', subtitle: 'Review and approve designs' },
  '/production': { title: 'Production Overview', subtitle: 'All production orders' },
  '/marketing/campaigns': { title: 'Campaigns', subtitle: 'Marketing campaigns management' },
  '/admin/users': { title: 'User Management', subtitle: 'Manage team members' },
  '/admin/analytics': { title: 'Analytics', subtitle: 'Business intelligence & reports' },
  '/ai-insights': { title: 'AI Insights', subtitle: 'AI-powered forecasting & trends' },
};

const AppHeader: React.FC = () => {
  const { profile } = useAuth();
  const location = useLocation();
  const routeInfo = ROUTE_TITLES[location.pathname] || { title: 'IntelliFlow Suite' };

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-6 shrink-0">
      <div>
        <h2 className="text-lg font-semibold text-foreground font-heading">{routeInfo.title}</h2>
        {routeInfo.subtitle && <p className="text-xs text-muted-foreground font-body">{routeInfo.subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            placeholder="Search..."
            className="pl-9 pr-4 py-2 text-sm bg-muted/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary w-56 font-body"
          />
        </div>
        <button className="relative p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
        </button>
      </div>
    </header>
  );
};

export default AppHeader;