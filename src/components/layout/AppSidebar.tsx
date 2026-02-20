import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ROLE_LABELS } from '@/types/auth';
import {
  LayoutDashboard, ShoppingCart, Palette, Package, Factory,
  BarChart3, Brain, Bell, LogOut, Cpu, Settings, FileText
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/designs', label: 'Designs', icon: Palette },
  { to: '/inventory', label: 'Inventory', icon: Package },
  { to: '/production', label: 'Production', icon: Factory },
  { to: '/reports', label: 'Reports', icon: FileText },
  { to: '/ai-analytics', label: 'AI Analytics', icon: Brain },
];

const AppSidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <aside className="w-64 min-h-screen bg-sidebar flex flex-col border-r border-sidebar-border shrink-0">
      {/* Brand */}
      <div className="p-5 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center glow-primary">
            <Cpu className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-foreground tracking-tight">NEXT-GEN</h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Business Platform</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin">
        {NAV_ITEMS.map(item => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary/10 text-primary glow-primary'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
              {item.label === 'AI Analytics' && (
                <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full gradient-accent text-accent-foreground font-bold uppercase">AI</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-sidebar-border">
        <div className="flex items-center gap-3 p-2">
          <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-sm font-bold text-foreground">
            {user?.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
            <p className="text-[10px] text-muted-foreground">{user ? ROLE_LABELS[user.role] : ''}</p>
          </div>
          <button onClick={logout} className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
