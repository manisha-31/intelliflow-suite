import { describe, it, expect } from 'vitest';
import {
  ROLE_LABELS,
  ROLE_COLORS,
  ROLE_DEFAULT_ROUTE,
  ROLE_NAV_ITEMS,
  type AppRole,
} from '@/types/auth';

const ALL_ROLES: AppRole[] = ['admin', 'marketing_manager', 'designer', 'factory', 'distributor'];

describe('Auth Types & Constants', () => {
  describe('ROLE_LABELS', () => {
    it('has a label for every role', () => {
      ALL_ROLES.forEach((role) => {
        expect(ROLE_LABELS[role]).toBeDefined();
        expect(typeof ROLE_LABELS[role]).toBe('string');
        expect(ROLE_LABELS[role].length).toBeGreaterThan(0);
      });
    });

    it('maps correct human-readable labels', () => {
      expect(ROLE_LABELS.admin).toBe('Admin');
      expect(ROLE_LABELS.marketing_manager).toBe('Marketing Manager');
      expect(ROLE_LABELS.designer).toBe('Designer');
      expect(ROLE_LABELS.factory).toBe('Factory Unit');
      expect(ROLE_LABELS.distributor).toBe('Distributor');
    });
  });

  describe('ROLE_COLORS', () => {
    it('has a color class for every role', () => {
      ALL_ROLES.forEach((role) => {
        expect(ROLE_COLORS[role]).toBeDefined();
        expect(ROLE_COLORS[role]).toContain('bg-');
        expect(ROLE_COLORS[role]).toContain('text-');
      });
    });
  });

  describe('ROLE_DEFAULT_ROUTE', () => {
    it('has a default route for every role', () => {
      ALL_ROLES.forEach((role) => {
        expect(ROLE_DEFAULT_ROUTE[role]).toBeDefined();
        expect(ROLE_DEFAULT_ROUTE[role]).toMatch(/^\//);
      });
    });

    it('routes to correct dashboards', () => {
      expect(ROLE_DEFAULT_ROUTE.admin).toBe('/admin/dashboard');
      expect(ROLE_DEFAULT_ROUTE.marketing_manager).toBe('/marketing/dashboard');
      expect(ROLE_DEFAULT_ROUTE.designer).toBe('/designer/workspace');
      expect(ROLE_DEFAULT_ROUTE.factory).toBe('/factory/production');
      expect(ROLE_DEFAULT_ROUTE.distributor).toBe('/distributor/orders');
    });
  });

  describe('ROLE_NAV_ITEMS', () => {
    it('has navigation items for every role', () => {
      ALL_ROLES.forEach((role) => {
        expect(ROLE_NAV_ITEMS[role]).toBeDefined();
        expect(Array.isArray(ROLE_NAV_ITEMS[role])).toBe(true);
        expect(ROLE_NAV_ITEMS[role].length).toBeGreaterThan(0);
      });
    });

    it('admin has the most nav items', () => {
      const adminCount = ROLE_NAV_ITEMS.admin.length;
      ALL_ROLES.filter((r) => r !== 'admin').forEach((role) => {
        expect(ROLE_NAV_ITEMS[role].length).toBeLessThanOrEqual(adminCount);
      });
    });

    it('every nav item has required fields', () => {
      ALL_ROLES.forEach((role) => {
        ROLE_NAV_ITEMS[role].forEach((item) => {
          expect(item.to).toMatch(/^\//);
          expect(item.label.length).toBeGreaterThan(0);
          expect(item.icon.length).toBeGreaterThan(0);
        });
      });
    });

    it('all roles have access to Collections', () => {
      ALL_ROLES.forEach((role) => {
        const hasCollections = ROLE_NAV_ITEMS[role].some((item) => item.to === '/collections');
        expect(hasCollections).toBe(true);
      });
    });

    it('only admin and marketing have AI Insights', () => {
      const rolesWithAI = ALL_ROLES.filter((role) =>
        ROLE_NAV_ITEMS[role].some((item) => item.to === '/ai-insights')
      );
      expect(rolesWithAI).toEqual(['admin', 'marketing_manager']);
    });
  });
});
