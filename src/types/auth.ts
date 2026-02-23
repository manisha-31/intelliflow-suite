export type AppRole = 'admin' | 'marketing_manager' | 'designer' | 'factory' | 'distributor';

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  department: string | null;
  avatar_url: string | null;
  phone: string | null;
  is_active: boolean;
  created_at: string;
  role: AppRole;
}

export const ROLE_LABELS: Record<AppRole, string> = {
  admin: 'Admin',
  marketing_manager: 'Marketing Manager',
  designer: 'Designer',
  factory: 'Factory Unit',
  distributor: 'Distributor',
};

export const ROLE_COLORS: Record<AppRole, string> = {
  admin: 'bg-primary text-primary-foreground',
  marketing_manager: 'bg-accent text-accent-foreground',
  designer: 'bg-info text-info-foreground',
  factory: 'bg-success text-success-foreground',
  distributor: 'bg-warning text-warning-foreground',
};

export const ROLE_DEFAULT_ROUTE: Record<AppRole, string> = {
  admin: '/admin/dashboard',
  marketing_manager: '/marketing/dashboard',
  designer: '/designer/workspace',
  factory: '/factory/production',
  distributor: '/distributor/orders',
};

export interface NavItem {
  to: string;
  label: string;
  icon: string; // lucide icon name
}

export const ROLE_NAV_ITEMS: Record<AppRole, NavItem[]> = {
  admin: [
    { to: '/admin/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { to: '/collections', label: 'Collections', icon: 'FolderOpen' },
    { to: '/approvals', label: 'Approvals', icon: 'CheckCircle' },
    { to: '/production', label: 'Production', icon: 'Factory' },
    { to: '/marketing/campaigns', label: 'Campaigns', icon: 'Megaphone' },
    { to: '/admin/users', label: 'Users', icon: 'Users' },
    { to: '/admin/analytics', label: 'Analytics', icon: 'BarChart3' },
    { to: '/ai-insights', label: 'AI Insights', icon: 'Brain' },
  ],
  marketing_manager: [
    { to: '/marketing/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { to: '/collections', label: 'Collections', icon: 'FolderOpen' },
    { to: '/approvals', label: 'Approvals', icon: 'CheckCircle' },
    { to: '/marketing/campaigns', label: 'Campaigns', icon: 'Megaphone' },
    { to: '/ai-insights', label: 'AI Insights', icon: 'Brain' },
  ],
  designer: [
    { to: '/designer/workspace', label: 'My Designs', icon: 'Palette' },
    { to: '/collections', label: 'Collections', icon: 'FolderOpen' },
  ],
  factory: [
    { to: '/factory/production', label: 'Production', icon: 'Factory' },
    { to: '/collections', label: 'Collections', icon: 'FolderOpen' },
  ],
  distributor: [
    { to: '/distributor/orders', label: 'My Orders', icon: 'ShoppingCart' },
    { to: '/collections', label: 'Collections', icon: 'FolderOpen' },
  ],
};