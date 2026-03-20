import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

const mockLogin = vi.fn();
const mockNavigate = vi.fn();
const mockToast = vi.fn();

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
    profile: null,
    isAuthenticated: false,
  }),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

// Mock the logo import
vi.mock('@/assets/modenik-logo.png', () => ({ default: 'mock-logo.png' }));

import LoginPage from '@/pages/LoginPage';

const renderLogin = () =>
  render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>
  );

describe('LoginPage', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders the login form with email and password fields', () => {
    renderLogin();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('renders the brand name', () => {
    renderLogin();
    expect(screen.getByText('Modenik Lifestyle')).toBeInTheDocument();
  });

  it('has a link to signup page', () => {
    renderLogin();
    expect(screen.getByText(/sign up/i)).toHaveAttribute('href', '/signup');
  });

  it('renders demo account buttons', () => {
    renderLogin();
    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByText('Marketing')).toBeInTheDocument();
    expect(screen.getByText('Designer')).toBeInTheDocument();
    expect(screen.getByText('Factory')).toBeInTheDocument();
    expect(screen.getByText('Distributor')).toBeInTheDocument();
  });

  it('fills credentials when demo account is clicked', () => {
    renderLogin();
    fireEvent.click(screen.getByText('Admin'));
    expect((screen.getByLabelText(/email/i) as HTMLInputElement).value).toBe('admin@modenik.com');
    expect((screen.getByLabelText(/password/i) as HTMLInputElement).value).toBe('test123456');
  });

  it('calls login on form submit', async () => {
    mockLogin.mockResolvedValue({ error: null });
    renderLogin();

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(mockLogin).toHaveBeenCalledWith('test@test.com', 'password');
  });

  it('shows error toast on failed login', async () => {
    mockLogin.mockResolvedValue({ error: 'Invalid credentials' });
    renderLogin();

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'bad@test.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await vi.waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Login failed', variant: 'destructive' })
      );
    });
  });
});
