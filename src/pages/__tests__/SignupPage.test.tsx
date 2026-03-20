import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

const mockSignup = vi.fn();
const mockNavigate = vi.fn();
const mockToast = vi.fn();

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    signup: mockSignup,
    isAuthenticated: false,
    profile: null,
  }),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

vi.mock('@/assets/modenik-logo.png', () => ({ default: 'mock-logo.png' }));

import SignupPage from '@/pages/SignupPage';

const renderSignup = () =>
  render(
    <MemoryRouter>
      <SignupPage />
    </MemoryRouter>
  );

describe('SignupPage', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders all required form fields', () => {
    renderSignup();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByText(/role/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('has a link to login page', () => {
    renderSignup();
    expect(screen.getByText(/sign in/i)).toHaveAttribute('href', '/login');
  });

  it('calls signup on form submit', async () => {
    mockSignup.mockResolvedValue({ error: null });
    renderSignup();

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@test.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'pass123' } });
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    expect(mockSignup).toHaveBeenCalled();
  });

  it('shows success toast and navigates to login on success', async () => {
    mockSignup.mockResolvedValue({ error: null });
    renderSignup();

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'pass123' } });
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await vi.waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({ title: 'Account created!' }));
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('shows error toast on signup failure', async () => {
    mockSignup.mockResolvedValue({ error: 'Email taken' });
    renderSignup();

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'pass123' } });
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await vi.waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Signup failed', variant: 'destructive' })
      );
    });
  });
});
