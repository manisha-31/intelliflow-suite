export type UserRole = 'factory_admin' | 'designer' | 'marketing' | 'distributor' | 'dealer';

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
  dealer: 'Dealer',
};

export const ROLE_COLORS: Record<UserRole, string> = {
  factory_admin: 'bg-primary text-primary-foreground',
  designer: 'bg-accent text-accent-foreground',
  marketing: 'bg-warning text-warning-foreground',
  distributor: 'bg-info text-info-foreground',
  dealer: 'bg-secondary text-secondary-foreground',
};

export const MOCK_USERS: User[] = [
  { id: '1', name: 'Rajesh Kumar', email: 'rajesh@nexgen.com', role: 'factory_admin' },
  { id: '2', name: 'Priya Sharma', email: 'priya@nexgen.com', role: 'designer' },
  { id: '3', name: 'Amit Patel', email: 'amit@nexgen.com', role: 'marketing' },
  { id: '4', name: 'Suresh Mehta', email: 'suresh@nexgen.com', role: 'distributor' },
  { id: '5', name: 'Vikram Singh', email: 'vikram@nexgen.com', role: 'dealer' },
];
