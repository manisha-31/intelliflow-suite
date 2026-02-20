export type UserRole = 'factory_admin' | 'designer' | 'marketing' | 'distributor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  factory_admin: 'Factory Admin',
  designer: 'Designer',
  marketing: 'Marketing Team',
  distributor: 'Distributor',
};

export const ROLE_COLORS: Record<UserRole, string> = {
  factory_admin: 'bg-primary text-primary-foreground',
  designer: 'bg-accent text-accent-foreground',
  marketing: 'bg-warning text-warning-foreground',
  distributor: 'bg-info text-info-foreground',
};

export const MOCK_USERS: User[] = [
  { id: '1', name: 'Rajesh Kumar', email: 'rajesh@nexgen.com', role: 'factory_admin' },
  { id: '2', name: 'Priya Sharma', email: 'priya@nexgen.com', role: 'designer' },
  { id: '3', name: 'Amit Patel', email: 'amit@nexgen.com', role: 'marketing' },
  { id: '4', name: 'Suresh Mehta', email: 'suresh@nexgen.com', role: 'distributor' },
];

/** Which nav routes each role can access */
export const ROLE_NAV_ACCESS: Record<UserRole, string[]> = {
  factory_admin: ['/dashboard', '/orders', '/designs', '/inventory', '/production', '/reports', '/ai-analytics'],
  designer: ['/designs'],
  marketing: ['/dashboard', '/orders', '/reports', '/ai-analytics'],
  distributor: ['/orders', '/inventory'],
};
