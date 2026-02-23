import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ROLE_LABELS, ROLE_NAV_ITEMS, ROLE_COLORS } from '@/types/auth';
import {
  LayoutDashboard, FolderOpen, CheckCircle, Factory, Megaphone,
  Users, BarChart3, Brain, LogOut, Palette, ShoppingCart,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard, FolderOpen, CheckCircle, Factory, Megaphone,
  Users, BarChart3, Brain, Palette, ShoppingCart,
};

const AppSidebar: React.FC = () => {
  const { profile, logout } = useAuth();
  const location = useLocation();

  if (!profile) return null;

  const navItems = ROLE_NAV_ITEMS[profile.role] || [];

  return (
    <aside className="w-64 min-h-screen bg-sidebar flex flex-col border-r border-sidebar-border shrink-0">
      {/* Brand */}
      <div className="p-5 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center glow-primary">
            <span className="text-lg font-bold text-primary-foreground font-heading">IF</span>
          </div>
          <div>
            <h1 className="text-sm font-bold text-sidebar-accent-foreground tracking-tight font-heading">IntelliFlow</h1>
            <p className="text-[10px] text-sidebar-foreground uppercase tracking-widest font-body">Suite</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map(item => {
          const Icon = ICON_MAP[item.icon] || LayoutDashboard;
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all font-body ${
                isActive
                  ? 'bg-sidebar-primary/15 text-sidebar-primary glow-primary'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
              {item.label === 'AI Insights' && (
                <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full gradient-accent text-accent-foreground font-bold uppercase">AI</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-sidebar-border">
        <div className="flex items-center gap-3 p-2">
          <div className="w-9 h-9 rounded-lg bg-sidebar-accent flex items-center justify-center text-sm font-bold text-sidebar-accent-foreground">
            {profile.full_name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-accent-foreground truncate font-body">{profile.full_name}</p>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${ROLE_COLORS[profile.role]} font-medium`}>
              {ROLE_LABELS[profile.role]}
            </span>
          </div>
          <button onClick={logout} className="p-1.5 rounded-md hover:bg-destructive/10 text-sidebar-foreground hover:text-destructive transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;