import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import React from 'react';

// Mock useAuth
const mockUseAuth = vi.fn();
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

import ProtectedRoute from '@/components/auth/ProtectedRoute';

const renderWithRouter = (ui: React.ReactElement, initialRoute = '/protected') =>
  render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/login" element={<div data-testid="login-page">Login</div>} />
        <Route path="/admin/dashboard" element={<div data-testid="admin-dash">Admin Dashboard</div>} />
        <Route path="/designer/workspace" element={<div data-testid="designer-ws">Designer Workspace</div>} />
        <Route path="/protected" element={ui} />
      </Routes>
    </MemoryRouter>
  );

describe('ProtectedRoute', () => {
  it('shows loader while auth is loading', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false, isLoading: true, profile: null });
    renderWithRouter(
      <ProtectedRoute><div>Content</div></ProtectedRoute>
    );
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('redirects to /login when not authenticated', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false, isLoading: false, profile: null });
    renderWithRouter(
      <ProtectedRoute><div>Content</div></ProtectedRoute>
    );
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  it('renders children when authenticated with no role restriction', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      profile: { role: 'admin' },
    });
    renderWithRouter(
      <ProtectedRoute><div>Protected Content</div></ProtectedRoute>
    );
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('renders children when user has allowed role', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      profile: { role: 'admin' },
    });
    renderWithRouter(
      <ProtectedRoute allowedRoles={['admin', 'designer']}>
        <div>Admin Content</div>
      </ProtectedRoute>
    );
    expect(screen.getByText('Admin Content')).toBeInTheDocument();
  });

  it('redirects to role default route when user lacks allowed role', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      profile: { role: 'designer' },
    });
    renderWithRouter(
      <ProtectedRoute allowedRoles={['admin']}>
        <div>Admin Only</div>
      </ProtectedRoute>
    );
    expect(screen.getByTestId('designer-ws')).toBeInTheDocument();
  });

  it('shows loader when authenticated but profile not yet loaded', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true, isLoading: false, profile: null });
    renderWithRouter(
      <ProtectedRoute><div>Content</div></ProtectedRoute>
    );
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });
});
